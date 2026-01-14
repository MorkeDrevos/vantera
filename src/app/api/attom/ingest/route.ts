// src/app/api/attom/ingest/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { attomFetchJson } from '@/lib/attom/attom';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CITY_PRESETS: Record<
  string,
  {
    name: string;
    slug: string;
    country: string;
    region: string;
    tz: string;
    lat: number;
    lng: number;
  }
> = {
  miami: {
    name: 'Miami',
    slug: 'miami',
    country: 'United States',
    region: 'Florida',
    tz: 'America/New_York',
    lat: 25.7617,
    lng: -80.1918,
  },
};

function pickString(v: any): string | null {
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
}

function safeJoin(parts: Array<string | null | undefined>, sep = ', ') {
  return parts.filter((p) => typeof p === 'string' && p.trim()).join(sep);
}

// ATTOM responses vary by plan/endpoint. These helpers keep the ingest resilient.
function extractAddressItem(item: any) {
  const address1 =
    pickString(item?.address1) ||
    pickString(item?.address?.oneLine) ||
    pickString(item?.address?.line1) ||
    pickString(item?.property?.address1);

  const address2 =
    pickString(item?.address2) ||
    pickString(item?.address?.line2) ||
    pickString(item?.property?.address2) ||
    pickString(item?.address?.locality);

  const lat = typeof item?.location?.latitude === 'number' ? item.location.latitude : null;
  const lng = typeof item?.location?.longitude === 'number' ? item.location.longitude : null;

  return { address1, address2, lat, lng };
}

function extractDetail(detail: any) {
  // Try common fields. If missing, we keep nulls.
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

  // ATTOM is US-first, so prices may be absent unless you call AVM endpoints.
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

  const preset = CITY_PRESETS[cityKey];
  if (!preset) {
    return NextResponse.json(
      { ok: false, error: `Unknown city preset "${cityKey}". Try: miami.` },
      { status: 400 },
    );
  }

  // Ensure city exists
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

  // 1) Radius search near Miami
  // ATTOM "Address endpoint" example supports latitude/longitude/radius.  [oai_citation:3‡ATTOM Cloud Help](https://cloud-help.attomdata.com/article/598-endpoints?utm_source=chatgpt.com)
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
  const seen = { scanned: items.length, created: 0, skipped: 0, errors: 0 };
  const createdIds: string[] = [];
  const errors: Array<{ step: string; message: string }> = [];

  for (const item of items) {
    try {
      const { address1, address2, lat, lng } = extractAddressItem(item);

      // If we can't form a detail query, skip.
      if (!address1 || !address2) {
        seen.skipped += 1;
        continue;
      }

      const oneLine = safeJoin([address1, address2], ', ');
      if (!oneLine) {
        seen.skipped += 1;
        continue;
      }

      // Dedup by (cityId + address)
      const existing = await prisma.listing.findFirst({
        where: { cityId: city.id, address: oneLine },
        select: { id: true },
      });

      if (existing) {
        seen.skipped += 1;
        continue;
      }

      // 2) Property detail by address1/address2.  [oai_citation:4‡ATTOM Developer Platform](https://api.developer.attomdata.com/documentation?utm_source=chatgpt.com)
      const detailRes = await attomFetchJson<any>({
        path: '/property/detail',
        query: {
          address1,
          address2,
        },
      });

      const detail = detailRes?.property?.[0] || detailRes?.property || detailRes || null;
      const d = extractDetail(detail);

      // Map ATTOM -> your Listing schema (no schema changes needed)
      const titleParts = [
        preset.name,
        d.propertyType ? d.propertyType : null,
        d.beds ? `${d.beds} bd` : null,
        d.baths ? `${d.baths} ba` : null,
      ];
      const title = titleParts.filter(Boolean).join(' · ') || `${preset.name} · Property`;

      const description = [
        'Imported from ATTOM (trial) - protocol normalization in progress.',
        d.attomId ? `ATTOM ID: ${d.attomId}` : null,
        `Address: ${oneLine}`,
      ]
        .filter(Boolean)
        .join('\n');

      if (dryRun) {
        seen.created += 1;
        continue;
      }

      const created = await prisma.listing.create({
        data: {
          cityId: city.id,
          status: 'LIVE',
          visibility: 'PUBLIC',
          verification: 'SELF_REPORTED',

          title,
          headline: 'ATTOM imported record - verification and media layers come next.',
          description,

          address: oneLine,
          addressHidden: true,

          lat: lat ?? undefined,
          lng: lng ?? undefined,

          propertyType: d.propertyType ?? undefined,
          bedrooms: d.beds ?? undefined,
          bathrooms: d.baths ?? undefined,

          // ATTOM is US, so sqft not m2. We keep it but label later in UI.
          builtM2: d.livingSqft ?? undefined,
          plotM2: d.lotSqft ?? undefined,

          // If we got a value, keep it as "price" with USD (temporary)
          price: d.avm ?? undefined,
          currency: d.avm ? 'USD' : 'USD',
        },
        select: { id: true },
      });

      createdIds.push(created.id);
      seen.created += 1;
    } catch (e: any) {
      seen.errors += 1;
      errors.push({ step: 'ingest', message: e?.message || String(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    city,
    dryRun,
    radius,
    limit,
    ...seen,
    createdIds,
    errors: errors.slice(0, 10),
  });
}
