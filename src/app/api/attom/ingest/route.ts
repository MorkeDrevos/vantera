// src/app/api/attom/ingest/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { attomFetchJson } from '@/lib/attom/attom';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CITY_PRESETS = {
  miami: {
    name: 'Miami',
    slug: 'miami',
    country: 'United States',
    region: 'Florida',
    tz: 'America/New_York',
    lat: 25.7617,
    lng: -80.1918,
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

function extractAddressItem(item: any) {
  const address1 =
    pickString(item?.address1) ||
    pickString(item?.address?.line1) ||
    pickString(item?.address?.oneLine) ||
    pickString(item?.property?.address1);

  const address2 =
    pickString(item?.address2) ||
    pickString(item?.address?.line2) ||
    pickString(item?.address?.locality) ||
    pickString(item?.property?.address2);

  const lat = typeof item?.location?.latitude === 'number' ? item.location.latitude : null;
  const lng = typeof item?.location?.longitude === 'number' ? item.location.longitude : null;

  return { address1, address2, lat, lng };
}

function extractDetail(detail: any) {
  const beds =
    typeof detail?.building?.rooms?.beds === 'number'
      ? detail.building.rooms.beds
      : typeof detail?.building?.bedrooms === 'number'
        ? detail.building.bedrooms
        : null;

  const baths =
    typeof detail?.building?.rooms?.bathstotal === 'number'
      ? detail.building.rooms.bathstotal
      : typeof detail?.building?.bathrooms === 'number'
        ? detail.building.bathrooms
        : null;

  const livingSqft =
    typeof detail?.building?.size?.universalsize === 'number'
      ? detail.building.size.universalsize
      : typeof detail?.building?.size?.livingsize === 'number'
        ? detail.building.size.livingsize
        : null;

  const lotSqft =
    typeof detail?.lot?.lotsize1 === 'number'
      ? detail.lot.lotsize1
      : typeof detail?.lot?.lotsize2 === 'number'
        ? detail.lot.lotsize2
        : null;

  const propertyType =
    pickString(detail?.summary?.proptype) ||
    pickString(detail?.summary?.propertyType) ||
    pickString(detail?.building?.summary?.proptype) ||
    null;

  const avm =
    typeof detail?.avm?.amount?.value === 'number'
      ? detail.avm.amount.value
      : typeof detail?.assessment?.market?.mktTtlValue === 'number'
        ? detail.assessment.market.mktTtlValue
        : null;

  const attomId =
    pickString(detail?.identifier?.attomId) ||
    pickString(detail?.identifier?.Id) ||
    pickString(detail?.property?.identifier?.attomId) ||
    null;

  return { beds, baths, livingSqft, lotSqft, propertyType, avm, attomId };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const cityKey = (url.searchParams.get('city') || 'miami').toLowerCase();
  const radius = Number(url.searchParams.get('radius') || '0.5'); // miles
  const limit = Math.min(Number(url.searchParams.get('limit') || '25'), 100);
  const dryRun = url.searchParams.get('dryRun') === '1';

  const preset = CITY_PRESETS[cityKey as keyof typeof CITY_PRESETS];
  if (!preset) {
    return NextResponse.json(
      { ok: false, error: `Unknown city preset "${cityKey}". Try: miami.` },
      { status: 400 },
    );
  }

  // Ensure city exists (use explicit field mapping so Prisma types stay happy)
  const city = await prisma.city.upsert({
    where: { slug: preset.slug },
    update: {
      name: preset.name,
      slug: preset.slug,
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

  // 1) Radius search near preset center
  const addressRes = await attomFetchJson<any>({
    path: '/address',
    query: {
      latitude: preset.lat,
      longitude: preset.lng,
      radius,
    },
  });

  const rawItems: any[] =
    addressRes?.property || addressRes?.properties || addressRes?.address || addressRes?.results || [];

  const items = Array.isArray(rawItems) ? rawItems.slice(0, limit) : [];

  let scanned = items.length;
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of items) {
    try {
      const { address1, address2, lat, lng } = extractAddressItem(item);

      if (!address1 || !address2) {
        skipped += 1;
        continue;
      }

      const address = safeJoin([address1, address2], ', ');
      if (!address) {
        skipped += 1;
        continue;
      }

      // Dedupe (Listing model may NOT expose cityId scalar; use relation filter)
      const existing = await prisma.listing.findFirst({
        where: {
          address,
          city: { is: { id: city.id } },
        },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      // 2) Property detail by address
      const detailRes = await attomFetchJson<any>({
        path: '/property/detail',
        query: { address1, address2 },
      });

      const detail = detailRes?.property?.[0] || detailRes?.property || detailRes || null;
      const d = extractDetail(detail);

      // Stable slug: city + address (+ attomId if present)
      const slug = slugify(`${preset.slug}-${address}${d.attomId ? `-${d.attomId}` : ''}`);

      const title = `${preset.name} · ${d.propertyType ?? 'Property'}`;
      const description = [`ATTOM import (trial)`, d.attomId ? `ATTOM ID: ${d.attomId}` : null, address]
        .filter(Boolean)
        .join('\n');

      if (dryRun) {
        created += 1;
        continue;
      }

      await prisma.listing.create({
        data: {
          slug,
          source: 'attom',

          // IMPORTANT: connect relation (avoids TS "never" errors when cityId scalar is not available)
          city: { connect: { id: city.id } },

          status: 'LIVE',
          visibility: 'PUBLIC',
          verification: 'SELF_REPORTED',

          title,
          headline: 'Imported from ATTOM - verification and media layers come next.',
          description,

          address,
          addressHidden: true,

          lat: lat ?? undefined,
          lng: lng ?? undefined,

          propertyType: d.propertyType ?? undefined,
          bedrooms: d.beds ?? undefined,
          bathrooms: d.baths ?? undefined,

          // ATTOM gives sqft; storing into builtM2/plotM2 temporarily until you add sqft fields or convert in UI
          builtM2: d.livingSqft ?? undefined,
          plotM2: d.lotSqft ?? undefined,

          price: d.avm ?? undefined,
          currency: 'USD',
        },
        select: { id: true },
      });

      created += 1;
    } catch {
      errors += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    city,
    radius,
    limit,
    dryRun,
    scanned,
    created,
    skipped,
    errors,
  });
}
