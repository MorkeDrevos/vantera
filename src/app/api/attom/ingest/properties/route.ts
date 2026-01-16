// src/app/api/attom/ingest/properties/route.ts

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { attomFetchJson } from '@/lib/attom/attom';
import { ingestAttomMediaForListing } from '@/lib/ingest/attomPersistMedia';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CITY_ALIASES: Record<string, string> = {
  // Costa del Sol lock: all resolve to Marbella
  benahavis: 'marbella',
  estepona: 'marbella',
  'costa-del-sol': 'marbella',
};

const CITY_PRESETS = {
  // US demo
  miami: {
    name: 'Miami',
    slug: 'miami',
    country: 'United States',
    region: 'Florida',
    tz: 'America/New_York',
    lat: 25.7617,
    lng: -80.1918,
  },

  // Costa del Sol canonical (even if ATTOM won't return data here today, the lock is correct and future-proof)
  marbella: {
    name: 'Marbella (Costa del Sol)',
    slug: 'marbella',
    country: 'Spain',
    region: 'Andalucia',
    tz: 'Europe/Madrid',
    lat: 36.5101,
    lng: -4.8824,
  },
} as const;

function canonicalCityKey(input: string) {
  const k = (input || '').toLowerCase().trim();
  return CITY_ALIASES[k] ?? k;
}

function pickString(v: any): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function safeJoin(parts: Array<string | null | undefined>, sep = ', ') {
  return parts.filter((p) => typeof p === 'string' && p.trim()).join(sep);
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function clampInt(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function sqftToM2Int(sqft: number | null) {
  if (sqft == null || !Number.isFinite(sqft)) return null;
  return Math.round(sqft * 0.092903);
}

function parseCsvUpper(v: string | null) {
  if (!v) return null;
  const items = v
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  return items.length ? items : null;
}

function summarizeAttomError(e: any) {
  const msg = e?.message || String(e);
  const status = e?.status || e?.response?.status || e?.cause?.status || null;
  const code = e?.code || null;
  return { message: msg, status, code };
}

function readBedsFromSnapshot(p: any): number | null {
  const v = p?.building?.rooms?.beds ?? p?.building?.rooms?.Beds ?? null;
  return typeof v === 'number' ? v : null;
}

function readBathsFromSnapshot(p: any): number | null {
  const v = p?.building?.rooms?.bathstotal ?? p?.building?.rooms?.bathsTotal ?? null;
  return typeof v === 'number' ? v : null;
}

function readSqftFromSnapshot(p: any): number | null {
  const v = p?.building?.size?.universalsize ?? p?.building?.size?.livingSize ?? null;
  return typeof v === 'number' ? v : null;
}

function readTypeFromSnapshot(p: any): string | null {
  return (
    pickString(p?.summary?.proptype) ||
    pickString(p?.summary?.propsubtype) ||
    pickString(p?.summary?.propclass) ||
    null
  );
}

function readIdentifiers(p: any) {
  const obPropId = p?.identifier?.obPropId ?? p?.identifier?.ObPropId ?? null;
  const attomId = p?.identifier?.attomId ?? p?.identifier?.AttomId ?? null;

  return {
    obPropId: typeof obPropId === 'number' || typeof obPropId === 'string' ? String(obPropId) : null,
    attomId: typeof attomId === 'number' || typeof attomId === 'string' ? String(attomId) : null,
  };
}

function readAddressFromSnapshot(p: any) {
  const address1 =
    pickString(p?.address?.line1) || pickString(p?.address?.oneLine) || pickString(p?.address1) || null;

  const address2 = pickString(p?.address?.line2) || pickString(p?.address2) || null;

  const latRaw = p?.location?.latitude ?? null;
  const lngRaw = p?.location?.longitude ?? null;

  const lat = typeof latRaw === 'number' ? latRaw : typeof latRaw === 'string' ? Number(latRaw) : null;
  const lng = typeof lngRaw === 'number' ? lngRaw : typeof lngRaw === 'string' ? Number(lngRaw) : null;

  return {
    address1,
    address2,
    lat: Number.isFinite(lat as any) ? (lat as number) : null,
    lng: Number.isFinite(lng as any) ? (lng as number) : null,
  };
}

function normalizeLotSqft(raw: any): number | null {
  const lotsize2 = raw?.lot?.lotsize2;
  if (typeof lotsize2 === 'number' && Number.isFinite(lotsize2) && lotsize2 > 0) return Math.round(lotsize2);

  const lotsize1 = raw?.lot?.lotsize1;
  if (typeof lotsize1 !== 'number' || !Number.isFinite(lotsize1) || lotsize1 <= 0) return null;

  if (lotsize1 < 200) return Math.round(lotsize1 * 43560);
  return Math.round(lotsize1);
}

function computeDataCompleteness(input: {
  address: string | null;
  lat: number | null;
  lng: number | null;
  propertyType: string | null;
  beds: number | null;
  baths: number | null;
  builtSqft: number | null;
  price: number | null;
}) {
  let score = 0;
  const w = {
    address: 20,
    geo: 15,
    type: 15,
    beds: 10,
    baths: 10,
    size: 15,
    price: 15,
  };

  if (input.address) score += w.address;
  if (input.lat != null && input.lng != null) score += w.geo;
  if (input.propertyType) score += w.type;
  if (input.beds != null) score += w.beds;
  if (input.baths != null) score += w.baths;
  if (input.builtSqft != null) score += w.size;
  if (input.price != null) score += w.price;

  return clampInt(score, 0, 100);
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const rawCityKey = url.searchParams.get('city') || 'miami';
  const cityKey = canonicalCityKey(rawCityKey);

  const radius = Number(url.searchParams.get('radius') || '0.5'); // miles
  const limit = Math.min(Number(url.searchParams.get('limit') || '25'), 100);
  const dryRun = url.searchParams.get('dryRun') === '1';

  const minBeds = url.searchParams.get('minBeds') ? Number(url.searchParams.get('minBeds')) : null;
  const minAvm = url.searchParams.get('minAvm') ? Number(url.searchParams.get('minAvm')) : null;
  const typeWhitelist = parseCsvUpper(url.searchParams.get('types'));

  if (!process.env.ATTOM_API_KEY) {
    return NextResponse.json(
      { ok: false, error: 'ATTOM_API_KEY missing in this environment (Preview/Development/Production)' },
      { status: 500 },
    );
  }

  const preset = CITY_PRESETS[cityKey as keyof typeof CITY_PRESETS];
  if (!preset) {
    return NextResponse.json(
      { ok: false, error: `Unknown city preset "${cityKey}". Try: miami (or marbella).` },
      { status: 400 },
    );
  }

  const params = {
    city: preset.slug,
    radius,
    limit,
    dryRun,
    minBeds,
    minAvm,
    types: typeWhitelist,
    inputCity: rawCityKey,
    canonicalCity: cityKey,
  };

  const run = await prisma.importRun.create({
    data: {
      source: 'attom',
      scope: 'properties',
      region: preset.country === 'Spain' ? 'ES-AN' : 'US-FL',
      market: preset.name,
      params,
      status: 'RUNNING',
      message: 'Starting property ingest',
    },
    select: { id: true },
  });

  const errorSamples: Array<{ step: string; message: string }> = [];

  let scanned = 0;
  let created = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const city = await prisma.city.upsert({
      where: { slug: preset.slug },
      update: {
        name: preset.name,
        country: preset.country,
        region: preset.region,
        tz: preset.tz,
        lat: preset.lat,
        lng: preset.lng,
      },
      create: {
        name: preset.name,
        slug: preset.slug,
        country: preset.country,
        region: preset.region,
        tz: preset.tz,
        lat: preset.lat,
        lng: preset.lng,
      },
      select: { id: true, slug: true, name: true, country: true, region: true },
    });

    // STEP 1: Radius snapshot search
    let snapshotRes: any;
    try {
      snapshotRes = await attomFetchJson<any>({
        path: '/property/snapshot',
        query: {
          latitude: preset.lat,
          longitude: preset.lng,
          radius,
          pagesize: limit,
        },
      });
    } catch (e: any) {
      const info = summarizeAttomError(e);

      await prisma.importRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          scanned: 0,
          created: 0,
          skipped: 0,
          errors: 1,
          errorSamples: [{ step: 'attom:/property/snapshot', message: info.message }],
          message: 'Snapshot call failed',
        },
      });

      return NextResponse.json(
        { ok: false, runId: run.id, step: 'attom:/property/snapshot', ...info },
        { status: 502 },
      );
    }

    const rawItems: any[] = snapshotRes?.property || [];
    const items = Array.isArray(rawItems) ? rawItems.slice(0, limit) : [];

    scanned = items.length;

    for (const p of items) {
      try {
        const { address1, address2, lat, lng } = readAddressFromSnapshot(p);
        const address = safeJoin([address1, address2], ', ');
        if (!address) {
          skipped += 1;
          continue;
        }

        const { obPropId, attomId } = readIdentifiers(p);
        const bedsSnap = readBedsFromSnapshot(p);
        const bathsSnap = readBathsFromSnapshot(p);
        const builtSqftSnap = readSqftFromSnapshot(p);
        const typeSnap = readTypeFromSnapshot(p);

        if (minBeds != null && (bedsSnap == null || bedsSnap < minBeds)) {
          skipped += 1;
          continue;
        }

        if (typeWhitelist && typeWhitelist.length) {
          const t = (typeSnap || '').toUpperCase();
          const ok = typeWhitelist.some((allowed) => t.includes(allowed));
          if (!ok) {
            skipped += 1;
            continue;
          }
        }

        const bestSourceId = obPropId || attomId || null;

        const existing = await prisma.listing.findFirst({
          where: bestSourceId
            ? { source: 'attom', sourceId: bestSourceId }
            : { address, city: { is: { id: city.id } } },
          select: { id: true },
        });

        if (existing) {
          skipped += 1;
          continue;
        }

        // STEP 2: Detail by ID
        let detail: any = null;
        if (obPropId) {
          try {
            const detailRes = await attomFetchJson<any>({
              path: '/property/detail',
              query: { ID: obPropId },
            });
            detail = detailRes?.property?.[0] || null;
          } catch (e: any) {
            errors += 1;
            if (errorSamples.length < 5) {
              errorSamples.push({ step: 'attom:/property/detail', message: summarizeAttomError(e).message });
            }
            continue;
          }
        }

        const propertyType =
          pickString(detail?.summary?.proptype) ||
          pickString(detail?.summary?.propsubtype) ||
          pickString(detail?.summary?.propclass) ||
          typeSnap ||
          null;

        const beds = typeof detail?.building?.rooms?.beds === 'number' ? detail.building.rooms.beds : bedsSnap;

        const baths =
          typeof detail?.building?.rooms?.bathstotal === 'number'
            ? detail.building.rooms.bathstotal
            : bathsSnap;

        const builtSqft =
          typeof detail?.building?.size?.universalsize === 'number'
            ? detail.building.size.universalsize
            : builtSqftSnap;

        const lotSqft = detail ? normalizeLotSqft(detail) : null;

        // STEP 3: AVM
        let avmValue: number | null = null;
        let priceConfidence: number | null = null;

        const canCallAvm = !!address1 && !!address2;
        if (canCallAvm) {
          try {
            const avmRes = await attomFetchJson<any>({
              path: '/avm/detail',
              query: { address1, address2 },
            });

            const v =
              avmRes?.property?.[0]?.avm?.amount?.value ??
              avmRes?.property?.avm?.amount?.value ??
              avmRes?.avm?.amount?.value ??
              null;

            avmValue = typeof v === 'number' ? v : null;
            if (avmValue != null) priceConfidence = 85;
          } catch {
            avmValue = null;
          }
        }

        if (minAvm != null) {
          if (avmValue == null || avmValue < minAvm) {
            skipped += 1;
            continue;
          }
        }

        if (avmValue == null) {
          const fallback =
            typeof detail?.assessment?.market?.mktTtlValue === 'number'
              ? detail.assessment.market.mktTtlValue
              : null;

          avmValue = fallback;
          if (avmValue != null) priceConfidence = 55;
        }

        const builtM2 = sqftToM2Int(builtSqft);
        const plotM2 = sqftToM2Int(lotSqft);

        const dataCompleteness = computeDataCompleteness({
          address,
          lat,
          lng,
          propertyType,
          beds,
          baths,
          builtSqft,
          price: avmValue,
        });

        const title = `${preset.name} · ${propertyType ?? 'Property'}`;
        const slug = slugify(`${preset.slug}-${address}-${bestSourceId || 'x'}`);

        if (dryRun) {
          created += 1;
          continue;
        }

        const listing = await prisma.listing.create({
          data: {
            slug,
            source: 'attom',
            sourceId: bestSourceId,
            city: { connect: { id: city.id } },

            status: 'LIVE',
            visibility: 'PUBLIC',
            verification: 'SELF_REPORTED',

            title,
            headline: 'Imported from ATTOM - verification and media layers come next.',
            description: ['ATTOM import (trial)', bestSourceId ? `ATTOM ID: ${bestSourceId}` : null, address]
              .filter(Boolean)
              .join('\n'),

            address,
            addressHidden: true,

            lat: lat ?? undefined,
            lng: lng ?? undefined,

            propertyType: propertyType ?? undefined,
            bedrooms: beds ?? undefined,
            bathrooms: baths ?? undefined,

            builtSqft: builtSqft ?? undefined,
            plotSqft: lotSqft ?? undefined,

            builtM2: builtM2 ?? undefined,
            plotM2: plotM2 ?? undefined,

            price: avmValue ?? undefined,
            currency: 'USD',

            priceConfidence: priceConfidence ?? undefined,
            dataCompleteness: dataCompleteness ?? undefined,
          },
        });

        await ingestAttomMediaForListing(listing.id, bestSourceId);

        created += 1;
      } catch (e: any) {
        errors += 1;
        if (errorSamples.length < 5) errorSamples.push({ step: 'loop', message: e?.message || String(e) });
      }
    }

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: 'SUCCEEDED',
        finishedAt: new Date(),
        scanned,
        created,
        skipped,
        errors,
        errorSamples,
        message: 'Property ingest complete',
      },
    });

    return NextResponse.json({
      ok: true,
      runId: run.id,
      city: preset.slug,
      params,
      scanned,
      created,
      skipped,
      errors,
      errorSamples,
    });
  } catch (e: any) {
    errorSamples.push({ step: 'route', message: e?.message || String(e) });

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        scanned,
        created,
        skipped,
        errors: errors + 1,
        errorSamples,
        message: 'Route failed',
      },
    });

    return NextResponse.json(
      { ok: false, runId: run.id, message: e?.message || String(e), errorSamples },
      { status: 500 },
    );
  }
}
