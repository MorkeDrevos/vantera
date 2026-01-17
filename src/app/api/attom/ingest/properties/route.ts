// src/app/api/attom/ingest/properties/route.ts

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { attomFetchJson } from '@/lib/attom/attom';
import { ingestAttomMediaForListing } from '@/lib/ingest/attomPersistMedia';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Marbella lock:
 * - We may QUERY different geo centroids (Benahavis / Estepona) to pull inventory
 * - But we always ATTACH the listings to City.slug = "marbella"
 * - Preserve origin as Listing.neighborhood (Benahavis / Estepona)
 */
const COSTA_DEL_SOL_LOCK = new Set(['marbella', 'benahavis', 'estepona', 'costa-del-sol']);

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

  // Costa del Sol (queryable centroids)
  marbella: {
    name: 'Marbella (Costa del Sol)',
    slug: 'marbella',
    country: 'Spain',
    region: 'Andalucia',
    tz: 'Europe/Madrid',
    lat: 36.5101,
    lng: -4.8824,
  },
  benahavis: {
    name: 'Benahavís',
    slug: 'benahavis',
    country: 'Spain',
    region: 'Andalucia',
    tz: 'Europe/Madrid',
    // centroid (approx)
    lat: 36.5235,
    lng: -5.0465,
  },
  estepona: {
    name: 'Estepona',
    slug: 'estepona',
    country: 'Spain',
    region: 'Andalucia',
    tz: 'Europe/Madrid',
    // centroid (approx)
    lat: 36.4276,
    lng: -5.1459,
  },
} as const;

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

function isResidentialType(t: string | null) {
  const s = (t || '').toLowerCase();
  if (!s) return true; // don’t block if missing
  // hard excludes
  if (s.includes('commercial')) return false;
  if (s.includes('industrial')) return false;
  if (s.includes('retail')) return false;
  if (s.includes('office')) return false;
  if (s.includes('warehouse')) return false;
  if (s.includes('land')) return false;
  if (s.includes('lot')) return false;
  if (s.includes('farm')) return false;
  if (s.includes('agric')) return false;
  // positives
  if (s.includes('res')) return true;
  if (s.includes('single')) return true;
  if (s.includes('multi')) return true;
  if (s.includes('condo')) return true;
  if (s.includes('town')) return true;
  if (s.includes('villa')) return true;
  if (s.includes('house')) return true;
  if (s.includes('apartment')) return true;
  return true;
}

function normalizeCityKey(input: string) {
  const k = (input || '').toLowerCase().trim();
  return k;
}

function resolveCostaLock(requestedKey: string) {
  // Query centroid (what we search around)
  const queryKey = requestedKey === 'costa-del-sol' ? 'marbella' : requestedKey;

  // Attach city (where we store in DB)
  const attachCitySlug = COSTA_DEL_SOL_LOCK.has(requestedKey) ? 'marbella' : queryKey;

  // Neighborhood override (sub-area labeling)
  const neighborhoodOverride =
    requestedKey === 'benahavis' ? 'Benahavís' : requestedKey === 'estepona' ? 'Estepona' : null;

  return { queryKey, attachCitySlug, neighborhoodOverride };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const requestedKey = normalizeCityKey(url.searchParams.get('city') || 'miami');
  const { queryKey, attachCitySlug, neighborhoodOverride } = resolveCostaLock(requestedKey);

  const radius = Number(url.searchParams.get('radius') || '0.5'); // miles
  const limit = Math.min(Number(url.searchParams.get('limit') || '25'), 100);
  const dryRun = url.searchParams.get('dryRun') === '1';

  // Always enforce minimum 2m (unless you explicitly set a higher one)
  const minAvmRaw = url.searchParams.get('minAvm');
  const minAvm = minAvmRaw ? Number(minAvmRaw) : 2_000_000;

  const minBeds = url.searchParams.get('minBeds') ? Number(url.searchParams.get('minBeds')) : null;

  // residential-only is enforced regardless; this whitelist is optional extra narrowing
  const typeWhitelist = parseCsvUpper(url.searchParams.get('types'));

  if (!process.env.ATTOM_API_KEY) {
    return NextResponse.json(
      { ok: false, error: 'ATTOM_API_KEY missing in this environment (Preview/Development/Production)' },
      { status: 500 },
    );
  }

  const queryPreset = CITY_PRESETS[queryKey as keyof typeof CITY_PRESETS];
  if (!queryPreset) {
    return NextResponse.json(
      { ok: false, error: `Unknown city preset "${queryKey}". Try: miami | marbella | benahavis | estepona.` },
      { status: 400 },
    );
  }

  const attachPreset = CITY_PRESETS[attachCitySlug as keyof typeof CITY_PRESETS];
  if (!attachPreset) {
    return NextResponse.json(
      { ok: false, error: `Attach city preset missing "${attachCitySlug}". This should never happen.` },
      { status: 500 },
    );
  }

  const params = {
    requestedCity: requestedKey,
    queryCity: queryPreset.slug,
    attachCity: attachPreset.slug,
    radius,
    limit,
    dryRun,
    minBeds,
    minAvm,
    types: typeWhitelist,
    costaDelSolLocked: COSTA_DEL_SOL_LOCK.has(requestedKey),
    neighborhoodOverride,
  };

  const run = await prisma.importRun.create({
    data: {
      source: 'attom',
      scope: 'properties',
      region: attachPreset.country === 'Spain' ? 'ES-AN' : 'US-FL',
      market: attachPreset.name,
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
    // Ensure the ATTACH city exists (Marbella for Costa del Sol)
    const attachCity = await prisma.city.upsert({
      where: { slug: attachPreset.slug },
      update: {
        name: attachPreset.name,
        country: attachPreset.country,
        region: attachPreset.region,
        tz: attachPreset.tz,
        lat: attachPreset.lat,
        lng: attachPreset.lng,
      },
      create: {
        name: attachPreset.name,
        slug: attachPreset.slug,
        country: attachPreset.country,
        region: attachPreset.region,
        tz: attachPreset.tz,
        lat: attachPreset.lat,
        lng: attachPreset.lng,
      },
      select: { id: true, slug: true, name: true, country: true, region: true },
    });

    // STEP 1: Radius snapshot search (QUERY centroid can be Benahavis/Estepona, but attach is Marbella)
    let snapshotRes: any;
    try {
      snapshotRes = await attomFetchJson<any>({
        path: '/property/snapshot',
        query: {
          latitude: queryPreset.lat,
          longitude: queryPreset.lng,
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

        // residential-only (early gate)
        if (!isResidentialType(typeSnap)) {
          // If it already exists, hide it
          const bestSourceId = obPropId || attomId || null;
          if (bestSourceId && !dryRun) {
            await prisma.listing.updateMany({
              where: { source: 'attom', sourceId: bestSourceId },
              data: { status: 'ARCHIVED', visibility: 'PRIVATE' },
            });
          }
          skipped += 1;
          continue;
        }

        if (minBeds != null && (bedsSnap == null || bedsSnap < minBeds)) {
          const bestSourceId = obPropId || attomId || null;
          if (bestSourceId && !dryRun) {
            await prisma.listing.updateMany({
              where: { source: 'attom', sourceId: bestSourceId },
              data: { status: 'ARCHIVED', visibility: 'PRIVATE' },
            });
          }
          skipped += 1;
          continue;
        }

        if (typeWhitelist && typeWhitelist.length) {
          const t = (typeSnap || '').toUpperCase();
          const ok = typeWhitelist.some((allowed) => t.includes(allowed));
          if (!ok) {
            const bestSourceId = obPropId || attomId || null;
            if (bestSourceId && !dryRun) {
              await prisma.listing.updateMany({
                where: { source: 'attom', sourceId: bestSourceId },
                data: { status: 'ARCHIVED', visibility: 'PRIVATE' },
              });
            }
            skipped += 1;
            continue;
          }
        }

        const bestSourceId = obPropId || attomId || null;

        const existing = await prisma.listing.findFirst({
          where: bestSourceId
            ? { source: 'attom', sourceId: bestSourceId }
            : { address, city: { is: { id: attachCity.id } } },
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

        // residential-only (final gate on best info)
        if (!isResidentialType(propertyType)) {
          if (bestSourceId && !dryRun) {
            await prisma.listing.updateMany({
              where: { source: 'attom', sourceId: bestSourceId },
              data: { status: 'ARCHIVED', visibility: 'PRIVATE' },
            });
          }
          skipped += 1;
          continue;
        }

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

        // fallback: assessment market value
        if (avmValue == null) {
          const fallback =
            typeof detail?.assessment?.market?.mktTtlValue === 'number' ? detail.assessment.market.mktTtlValue : null;

          avmValue = fallback;
          if (avmValue != null) priceConfidence = 55;
        }

        // HARD gate: minimum 2m
        if (avmValue == null || avmValue < minAvm) {
          if (bestSourceId && !dryRun) {
            await prisma.listing.updateMany({
              where: { source: 'attom', sourceId: bestSourceId },
              data: { status: 'ARCHIVED', visibility: 'PRIVATE' },
            });
          }
          skipped += 1;
          continue;
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

        const neighborhood =
          neighborhoodOverride ||
          pickString(detail?.address?.locality) ||
          pickString(detail?.location?.neighborhood) ||
          null;

        const title = `${attachPreset.name} · ${propertyType ?? 'Property'}`;
        const slug = slugify(`${attachPreset.slug}-${address}-${bestSourceId || 'x'}`);

        if (dryRun) {
          created += 1;
          continue;
        }

        const listing = await prisma.listing.create({
          data: {
            slug,
            source: 'attom',
            sourceId: bestSourceId,
            city: { connect: { id: attachCity.id } },

            status: 'LIVE',
            visibility: 'PUBLIC',
            verification: 'SELF_REPORTED',

            title,
            headline: 'Imported from ATTOM - verification and media layers come next.',
            description: [
              'ATTOM import (trial)',
              `Query: ${queryPreset.name}`,
              `Attach: ${attachPreset.name}`,
              neighborhood ? `Sub-area: ${neighborhood}` : null,
              bestSourceId ? `ATTOM ID: ${bestSourceId}` : null,
              address,
              `Min gate: ${minAvm.toLocaleString()} (AVM currency assumed USD from source)`,
            ]
              .filter(Boolean)
              .join('\n'),

            neighborhood: neighborhood ?? undefined,

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
        status: errors > 0 ? 'FAILED' : 'SUCCEEDED',
        finishedAt: new Date(),
        scanned,
        created,
        skipped,
        errors,
        errorSamples,
        message: errors > 0 ? 'Property ingest finished with errors' : 'Property ingest complete',
      },
    });

    return NextResponse.json({
      ok: errors === 0,
      runId: run.id,
      requestedCity: requestedKey,
      queryCity: queryPreset.slug,
      attachCity: attachPreset.slug,
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
