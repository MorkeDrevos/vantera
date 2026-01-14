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
  return parts.filter(Boolean).join(sep);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractAddressItem(item: any) {
  const address1 =
    pickString(item?.address1) ||
    pickString(item?.address?.oneLine) ||
    pickString(item?.address?.line1);

  const address2 =
    pickString(item?.address2) ||
    pickString(item?.address?.line2) ||
    pickString(item?.address?.locality);

  const lat = typeof item?.location?.latitude === 'number' ? item.location.latitude : null;
  const lng = typeof item?.location?.longitude === 'number' ? item.location.longitude : null;

  return { address1, address2, lat, lng };
}

function extractDetail(detail: any) {
  return {
    beds: detail?.building?.rooms?.beds ?? null,
    baths: detail?.building?.rooms?.bathstotal ?? null,
    livingSqft: detail?.building?.size?.universalsize ?? null,
    lotSqft: detail?.lot?.lotsize1 ?? null,
    propertyType: pickString(detail?.summary?.proptype),
    avm: detail?.avm?.amount?.value ?? null,
    attomId: pickString(detail?.identifier?.attomId),
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cityKey = (url.searchParams.get('city') || 'miami').toLowerCase();
  const radius = Number(url.searchParams.get('radius') || '0.5');
  const limit = Math.min(Number(url.searchParams.get('limit') || '25'), 100);
  const dryRun = url.searchParams.get('dryRun') === '1';

  const preset = CITY_PRESETS[cityKey as keyof typeof CITY_PRESETS];
  if (!preset) {
    return NextResponse.json({ ok: false, error: 'Unknown city' }, { status: 400 });
  }

  const city = await prisma.city.upsert({
    where: { slug: preset.slug },
    update: preset,
    create: preset,
  });

  const addressRes = await attomFetchJson<any>({
    path: '/address',
    query: {
      latitude: preset.lat,
      longitude: preset.lng,
      radius,
    },
  });

  const rawItems = addressRes?.property || [];
  const items = rawItems.slice(0, limit);

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const { address1, address2, lat, lng } = extractAddressItem(item);
    if (!address1 || !address2) {
      skipped++;
      continue;
    }

    const address = safeJoin([address1, address2]);
    const existing = await prisma.listing.findFirst({
      where: { cityId: city.id, address },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const detailRes = await attomFetchJson<any>({
      path: '/property/detail',
      query: { address1, address2 },
    });

    const detail = detailRes?.property?.[0];
    const d = extractDetail(detail);

    const title = `${preset.name} · ${d.propertyType ?? 'Property'}`;
    const slug = slugify(`${preset.slug}-${address}-${d.attomId ?? Date.now()}`);

    if (dryRun) {
      created++;
      continue;
    }

    await prisma.listing.create({
      data: {
        slug,
        cityId: city.id,
        status: 'LIVE',
        visibility: 'PUBLIC',
        verification: 'SELF_REPORTED',
        title,
        headline: 'Imported from ATTOM',
        description: `ATTOM import\n${address}`,
        address,
        addressHidden: true,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        propertyType: d.propertyType ?? undefined,
        bedrooms: d.beds ?? undefined,
        bathrooms: d.baths ?? undefined,
        builtM2: d.livingSqft ?? undefined,
        plotM2: d.lotSqft ?? undefined,
        price: d.avm ?? undefined,
        currency: 'USD',
      },
    });

    created++;
  }

  return NextResponse.json({
    ok: true,
    city: preset.slug,
    radius,
    limit,
    dryRun,
    created,
    skipped,
  });
}
