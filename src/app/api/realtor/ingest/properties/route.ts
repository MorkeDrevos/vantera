// src/app/api/realtor/ingest/properties/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Realtor.com ingest (via Apify actor).
 *
 * Uses Apify Store actor: logical_vivacity/realtor-property-scraper
 * Input schema supports: searchLocation, listingType, propertyType, limit, priceMin, etc.
 * See actor input docs for exact fields.  [oai_citation:1‡Apify](https://apify.com/logical_vivacity/realtor-property-scraper/input-schema)
 */

const APIFY_API_BASE = 'https://api.apify.com/v2';

// Default actor - can be overridden via env if you want to swap scrapers later.
const DEFAULT_ACTOR_ID = 'logical_vivacity~realtor-property-scraper';

// Luxury gates (default)
const DEFAULT_MIN_PRICE_USD = 2_000_000;

// Conservative residential excludes (backup filter if actor returns odd items)
const BAD_TYPE_HINTS = ['LAND', 'LOT', 'COMM', 'IND', 'OFFICE', 'RETAIL', 'COMMERCIAL'];

function pickString(v: any): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function pickNumber(v: any): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
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

function looksResidential(propertyType: string | null) {
  const t = (propertyType || '').toUpperCase();
  if (!t) return true; // don’t block if missing - actor filters should handle most of it
  return !BAD_TYPE_HINTS.some((x) => t.includes(x));
}

async function apifyRunSyncGetDatasetItems(opts: {
  actorId: string;
  token: string;
  input: any;
}) {
  const { actorId, token, input } = opts;

  // Apify endpoint: run actor and return dataset items in one call (sync)
  // This is a standard Apify API pattern (run-sync-get-dataset-items).
  const url = `${APIFY_API_BASE}/acts/${encodeURIComponent(
    actorId,
  )}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&format=json`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Apify ${res.status} ${res.statusText}\n${text.slice(0, 600)}`);
  }

  return (await res.json()) as any[];
}

function normalizePhotos(item: any): Array<{ url: string; caption?: string | null; width?: number | null; height?: number | null }> {
  const photos =
    item?.photos ||
    item?.media?.photos ||
    item?.property?.photos ||
    item?.property?.media?.photos ||
    [];

  if (!Array.isArray(photos)) return [];
  const out: Array<{ url: string; caption?: string | null; width?: number | null; height?: number | null }> = [];

  for (const p of photos) {
    const url = pickString(p?.url) || pickString(p?.href) || pickString(p?.src) || null;
    if (!url) continue;
    out.push({
      url,
      caption: pickString(p?.caption) ?? pickString(p?.description) ?? null,
      width: pickNumber(p?.width),
      height: pickNumber(p?.height),
    });
  }

  // de-dupe
  const seen = new Set<string>();
  return out.filter((p) => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });
}

function normalizeListingFields(item: any) {
  // These fields vary by scraper/actor output.
  const sourceId =
    pickString(item?.property_id) ||
    pickString(item?.listing_id) ||
    pickString(item?.mls_id) ||
    pickString(item?.id) ||
    pickString(item?.permalink) ||
    null;

  const price =
    pickNumber(item?.list_price) ||
    pickNumber(item?.price) ||
    pickNumber(item?.listPrice) ||
    null;

  const beds = pickNumber(item?.beds) ?? pickNumber(item?.bedrooms);
  const baths = pickNumber(item?.baths) ?? pickNumber(item?.bathrooms);

  const sqft = pickNumber(item?.sqft) ?? pickNumber(item?.building_size) ?? pickNumber(item?.living_area);

  const addressLine =
    pickString(item?.address?.line) ||
    pickString(item?.address?.street_address) ||
    pickString(item?.location?.address) ||
    pickString(item?.address) ||
    null;

  const city = pickString(item?.address?.city) || pickString(item?.location?.city) || null;
  const state = pickString(item?.address?.state) || pickString(item?.location?.state) || null;
  const postal = pickString(item?.address?.postal_code) || pickString(item?.location?.postal_code) || null;

  const address = safeJoin([addressLine, city, state, postal], ', ') || addressLine || null;

  const lat = pickNumber(item?.address?.lat) ?? pickNumber(item?.location?.lat) ?? pickNumber(item?.lat);
  const lng = pickNumber(item?.address?.lon) ?? pickNumber(item?.location?.lon) ?? pickNumber(item?.lng) ?? pickNumber(item?.lon);

  const propertyType =
    pickString(item?.prop_type) ||
    pickString(item?.property_type) ||
    pickString(item?.type) ||
    pickString(item?.description?.type) ||
    null;

  const url =
    pickString(item?.permalink) ||
    pickString(item?.url) ||
    pickString(item?.listing_url) ||
    null;

  const titleBase =
    pickString(item?.title) ||
    pickString(item?.description?.name) ||
    null;

  const title = titleBase || safeJoin([city, state], ' ') || 'Realtor Listing';

  return {
    sourceId,
    price,
    beds: beds != null ? Math.round(beds) : null,
    baths: baths != null ? Number(baths) : null,
    builtSqft: sqft != null ? Math.round(sqft) : null,
    address,
    lat: lat != null ? Number(lat) : null,
    lng: lng != null ? Number(lng) : null,
    propertyType,
    sourceUrl: url,
    title,
    rawCity: city,
    rawState: state,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const searchLocation = pickString(url.searchParams.get('searchLocation'));
  if (!searchLocation) {
    return NextResponse.json(
      { ok: false, error: 'Missing required query param: searchLocation (e.g. Miami, FL)' },
      { status: 400 },
    );
  }

  const dryRun = url.searchParams.get('dryRun') === '1';

  // Default to 200 (Realtor pages can be deep; 25 is just a quick smoke test)
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '200'), 1), 2000);

  // Luxury gate (default $2M unless overridden)
  const priceMin = url.searchParams.get('priceMin') ? Number(url.searchParams.get('priceMin')) : DEFAULT_MIN_PRICE_USD;

  // Optionals
  const bedsMin = url.searchParams.get('bedsMin') ? Number(url.searchParams.get('bedsMin')) : null;
  const bathsMin = url.searchParams.get('bathsMin') ? Number(url.searchParams.get('bathsMin')) : null;

  // listingType supports arrays like ["for_sale"]  [oai_citation:2‡Apify](https://apify.com/logical_vivacity/realtor-property-scraper/input-schema)
  const listingType = (url.searchParams.get('listingType') || 'for_sale')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // propertyType optional - if not passed, we still apply our conservative residential guard.
  const propertyType = url.searchParams.get('propertyType')
    ? url.searchParams
        .get('propertyType')!
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'Missing APIFY_TOKEN env var (set in Vercel env)' },
      { status: 500 },
    );
  }

  const actorId = process.env.APIFY_REALTOR_ACTOR_ID || DEFAULT_ACTOR_ID;

  // Create ImportRun row (same pattern as your ATTOM runs)
  const run = await prisma.importRun.create({
    data: {
      source: 'realtor',
      scope: 'properties',
      region: 'US',
      market: searchLocation,
      params: {
        actorId,
        searchLocation,
        limit,
        priceMin,
        listingType,
        propertyType,
        bedsMin,
        bathsMin,
        dryRun,
      },
      status: 'RUNNING',
      message: 'Starting Realtor ingest (Apify)',
    },
    select: { id: true },
  });

  const errorSamples: Array<{ step: string; message: string }> = [];
  let scanned = 0;
  let created = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // Apify actor input
    const input: any = {
      searchLocation,
      listingType,
      limit,
      priceMin,
      extraPropertyData: true,
      includeContactInfo: false,
      excludePending: true,
      parallel: true,
    };

    if (propertyType && propertyType.length) input.propertyType = propertyType;
    if (bedsMin != null && Number.isFinite(bedsMin)) input.bedsMin = bedsMin;
    if (bathsMin != null && Number.isFinite(bathsMin)) input.bathsMin = bathsMin;

    let items: any[] = [];
    try {
      items = await apifyRunSyncGetDatasetItems({ actorId, token, input });
    } catch (e: any) {
      errors += 1;
      errorSamples.push({ step: 'apify:run-sync-get-dataset-items', message: e?.message || String(e) });

      await prisma.importRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          scanned: 0,
          created: 0,
          skipped: 0,
          errors,
          errorSamples,
          message: 'Apify call failed',
        },
      });

      return NextResponse.json({ ok: false, runId: run.id, error: e?.message || String(e), errorSamples }, { status: 502 });
    }

    scanned = Array.isArray(items) ? items.length : 0;

    // For now: attach everything to Miami city (US-first), unless you pass citySlug explicitly.
    // If you want: later we map state/city -> your City table properly.
    const citySlug = pickString(url.searchParams.get('citySlug')) || 'miami';

    const city = await prisma.city.upsert({
      where: { slug: citySlug },
      update: {},
      create: {
        slug: citySlug,
        name: citySlug === 'miami' ? 'Miami' : citySlug,
        country: 'United States',
        region: null,
        tz: 'America/New_York',
      },
      select: { id: true },
    });

    for (const item of items) {
      try {
        const f = normalizeListingFields(item);

        // Hard gates
        if (!f.price || f.price < priceMin) {
          skipped += 1;
          continue;
        }
        if (bedsMin != null && (f.beds == null || f.beds < bedsMin)) {
          skipped += 1;
          continue;
        }
        if (bathsMin != null && (f.baths == null || f.baths < bathsMin)) {
          skipped += 1;
          continue;
        }
        if (!looksResidential(f.propertyType)) {
          skipped += 1;
          continue;
        }

        // Dedupe
        const where = f.sourceId
          ? { source: 'realtor', sourceId: f.sourceId }
          : f.address
            ? { address: f.address, city: { is: { id: city.id } } }
            : null;

        if (!where) {
          skipped += 1;
          continue;
        }

        const existing = await prisma.listing.findFirst({
          where: where as any,
          select: { id: true },
        });

        if (existing) {
          skipped += 1;
          continue;
        }

        const slug = slugify(`${citySlug}-${f.sourceId || f.address || 'x'}`);

        const dataCompleteness = computeDataCompleteness({
          address: f.address,
          lat: f.lat,
          lng: f.lng,
          propertyType: f.propertyType,
          beds: f.beds,
          baths: f.baths,
          builtSqft: f.builtSqft,
          price: f.price,
        });

        const photos = normalizePhotos(item);

        if (dryRun) {
          created += 1;
          continue;
        }

        const listing = await prisma.listing.create({
          data: {
            slug,
            source: 'realtor',
            sourceId: f.sourceId ?? undefined,
            sourceUrl: f.sourceUrl ?? undefined,

            city: { connect: { id: city.id } },

            status: 'LIVE',
            visibility: 'PUBLIC',
            verification: 'SELF_REPORTED',

            title: f.title,
            headline: 'Imported from Realtor.com (via Apify). Verification and normalization layers come next.',
            description: [
              'Realtor ingest (Apify)',
              f.sourceId ? `Realtor ID: ${f.sourceId}` : null,
              f.sourceUrl ? `URL: ${f.sourceUrl}` : null,
              f.address ? `Address: ${f.address}` : null,
            ]
              .filter(Boolean)
              .join('\n'),

            address: f.address ?? undefined,
            addressHidden: true,

            lat: f.lat ?? undefined,
            lng: f.lng ?? undefined,

            propertyType: f.propertyType ?? undefined,
            bedrooms: f.beds ?? undefined,
            bathrooms: f.baths ?? undefined,

            builtSqft: f.builtSqft ?? undefined,

            price: f.price ?? undefined,
            currency: 'USD',

            priceConfidence: 70,
            dataCompleteness,
          },
          select: { id: true },
        });

        // Media import (photos)
        if (photos.length) {
          await prisma.listingMedia.createMany({
            data: photos.slice(0, 40).map((p, idx) => ({
              listingId: listing.id,
              url: p.url,
              alt: p.caption ?? null,
              width: p.width ?? null,
              height: p.height ?? null,
              sortOrder: idx,
              kind: 'image',
            })),
            skipDuplicates: true,
          });

          // Set cover if not set
          const first = await prisma.listingMedia.findFirst({
            where: { listingId: listing.id },
            orderBy: { sortOrder: 'asc' },
            select: { id: true },
          });

          if (first) {
            await prisma.listing.update({
              where: { id: listing.id },
              data: { coverMediaId: first.id },
            });
          }
        }

        created += 1;
      } catch (e: any) {
        errors += 1;
        if (errorSamples.length < 8) errorSamples.push({ step: 'loop', message: e?.message || String(e) });
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
        message: errors > 0 ? 'Realtor ingest finished with errors' : 'Realtor ingest complete',
      },
    });

    return NextResponse.json({
      ok: errors === 0,
      runId: run.id,
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

    return NextResponse.json({ ok: false, runId: run.id, message: e?.message || String(e), errorSamples }, { status: 500 });
  }
}
