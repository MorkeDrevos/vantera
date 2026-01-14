// scripts/attom/ingest-miami-city-metrics.ts
import { prisma } from '@/lib/prisma';

// -----------------------------
// Config
// -----------------------------
const ATTOM_BASE = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0';
const CITY_SLUG = 'miami';
const STATE = 'FL';

// Keep this modest for trial + speed. We can scale later.
const SAMPLE_LIMIT = Number(process.env.ATTOM_SAMPLE_LIMIT || 400);

// ATTOM key must be set in env: ATTOM_API_KEY
const API_KEY = process.env.ATTOM_API_KEY || '';

// -----------------------------
// Helpers
// -----------------------------
function monthStartUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function toNumber(v: any): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

function medianInt(values: number[]) {
  if (!values.length) return null;
  const arr = [...values].sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  const m = arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  return Math.round(m);
}

function percentileInt(values: number[], p: number) {
  if (!values.length) return null;
  const arr = [...values].sort((a, b) => a - b);
  const idx = Math.max(0, Math.min(arr.length - 1, Math.round((p / 100) * (arr.length - 1))));
  return Math.round(arr[idx]);
}

async function attomGet(path: string, params: Record<string, string | number | undefined>) {
  if (!API_KEY) {
    throw new Error('Missing ATTOM_API_KEY env var');
  }

  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    usp.set(k, String(v));
  }

  const url = `${ATTOM_BASE}${path}?${usp.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: API_KEY,
      accept: 'application/json',
    },
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg =
      (json && (json.message || json.error || json.status?.msg)) ||
      `${res.status} ${res.statusText}` ||
      'ATTOM request failed';
    throw new Error(`ATTOM ${path} failed: ${msg}`);
  }

  return json;
}

// Try to pull sale amount + building size from common ATTOM shapes.
// We will refine once you paste one real response payload.
function extractSaleAmountUSD(row: any): number | null {
  // Common places seen in ATTOM payloads (varies by endpoint/plan)
  return (
    toNumber(row?.sale?.amount?.saleAmt) ??
    toNumber(row?.sale?.saleAmt) ??
    toNumber(row?.saleamt) ??
    toNumber(row?.saleamount) ??
    toNumber(row?.assessment?.market?.mktttlvalue) ?? // fallback-ish (not a sale)
    null
  );
}

function extractLivingAreaSqft(row: any): number | null {
  return (
    toNumber(row?.building?.size?.livingsize) ??
    toNumber(row?.building?.size?.bldgsize) ??
    toNumber(row?.building?.size?.universalSize) ??
    toNumber(row?.building?.rooms?.bldgsize) ??
    toNumber(row?.lot?.lotsize1) ?? // fallback-ish, not living area
    null
  );
}

function extractLastSaleDate(row: any): Date | null {
  const s =
    row?.sale?.amount?.saleRecDate ||
    row?.sale?.saleRecDate ||
    row?.sale?.saleTransDate ||
    row?.saleRecDate ||
    row?.saleTransDate;
  if (!s || typeof s !== 'string') return null;

  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? d : null;
}

function sqftToSqm(sqft: number) {
  return sqft * 0.092903;
}

// -----------------------------
// Main
// -----------------------------
async function main() {
  console.log(`→ Ingesting Miami CityMetric (sample-based)`);
  console.log(`→ SAMPLE_LIMIT=${SAMPLE_LIMIT}`);

  // Ensure Miami exists (seed should create it via ALL_CITIES)
  const city = await prisma.city.findUnique({ where: { slug: CITY_SLUG } });
  if (!city) {
    throw new Error(
      `City not found for slug="${CITY_SLUG}". Seed first, or add Miami to ALL_CITIES and run: npm run seed`
    );
  }

  const asOf = monthStartUTC(new Date());

  // ATTOM "property/snapshot" is the best lightweight entry point.
  // We keep params simple and stable. We can refine filters later (property type, ZIP, etc.)
  //
  // NOTE: ATTOM response shapes vary. We'll adjust extraction after you paste one real response.
  const json = await attomGet('/property/snapshot', {
    // Common filter params (ATTOM supports combinations; exact names depend on plan)
    // These are usually accepted:
    city: 'Miami',
    state: STATE,
    // Keep results bounded:
    pagesize: Math.min(SAMPLE_LIMIT, 500),
    page: 1,
  });

  const rows: any[] =
    json?.property ??
    json?.properties ??
    json?.response?.property ??
    json?.response?.properties ??
    [];

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(
      `ATTOM returned 0 rows for Miami. This could be a filter issue or plan limitation. Paste the raw response and we’ll adjust params.`
    );
  }

  // Derive metrics from sample:
  // - medianPricePerSqm: median( saleAmountUSD / livingAreaSqm )
  // - primePricePerSqm: 80th percentile of same ratio (a "prime-ish" proxy)
  // - yoyPriceChangePct: if we have sale dates we can do a coarse proxy:
  //     compare medians for last 12 months vs previous 12 months within the sample
  //
  const pricePerSqm: number[] = [];
  const last12: number[] = [];
  const prev12: number[] = [];

  const now = new Date();
  const t12 = new Date(now);
  t12.setUTCFullYear(t12.getUTCFullYear() - 1);
  const t24 = new Date(now);
  t24.setUTCFullYear(t24.getUTCFullYear() - 2);

  for (const r of rows) {
    const amt = extractSaleAmountUSD(r);
    const sqft = extractLivingAreaSqft(r);

    if (!amt || !sqft || sqft <= 0) continue;

    const sqm = sqftToSqm(sqft);
    if (!sqm || sqm <= 0) continue;

    const psm = amt / sqm;
    if (!Number.isFinite(psm) || psm <= 0) continue;

    pricePerSqm.push(psm);

    const d = extractLastSaleDate(r);
    if (d) {
      if (d >= t12) last12.push(psm);
      else if (d >= t24 && d < t12) prev12.push(psm);
    }
  }

  const medianPsm = medianInt(pricePerSqm);
  const primePsm = percentileInt(pricePerSqm, 80);

  let yoy: number | null = null;
  const last12Med = medianInt(last12);
  const prev12Med = medianInt(prev12);
  if (last12Med && prev12Med && prev12Med > 0) {
    yoy = Math.round(((last12Med - prev12Med) / prev12Med) * 1000) / 10; // 1 decimal
  }

  // Confidence: higher with bigger usable sample
  const usable = pricePerSqm.length;
  const confidence = clampInt(Math.round((usable / Math.max(1, rows.length)) * 100), 15, 85);

  // Store values as integers (per your schema).
  // NOTE: This is USD per sqm (Miami). We record that clearly in sourceNote.
  await prisma.cityMetric.upsert({
    where: { cityId_asOf: { cityId: city.id, asOf } },
    update: {
      medianPricePerSqm: medianPsm ?? undefined,
      primePricePerSqm: primePsm ?? undefined,
      yoyPriceChangePct: yoy ?? undefined,
      activeListingCount: rows.length,
      confidenceScore: confidence,
      sourceNote: `ATTOM property/snapshot sample=${rows.length} usable=${usable} (USD per sqm proxy)`,
    },
    create: {
      cityId: city.id,
      asOf,
      medianPricePerSqm: medianPsm ?? undefined,
      primePricePerSqm: primePsm ?? undefined,
      yoyPriceChangePct: yoy ?? undefined,
      activeListingCount: rows.length,
      confidenceScore: confidence,
      sourceNote: `ATTOM property/snapshot sample=${rows.length} usable=${usable} (USD per sqm proxy)`,
    },
  });

  console.log('✅ Miami CityMetric upserted');
  console.log({
    asOf: asOf.toISOString(),
    sampleRows: rows.length,
    usableRows: usable,
    medianPricePerSqm: medianPsm,
    primePricePerSqm: primePsm,
    yoyPriceChangePct: yoy,
    confidenceScore: confidence,
  });
}

main()
  .catch((e) => {
    console.error('❌ Ingest failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
