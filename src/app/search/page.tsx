// src/app/search/page.tsx
import SearchResultsPageClient from '@/components/search/SearchResultsPageClient';
import { prisma } from '@/lib/prisma';

export type SearchParams = Record<string, string | string[] | undefined>;

type SortKey = 'price_high' | 'price_low' | 'beds' | 'sqm' | 'newest';

type ListingCard = {
  id: string;
  slug: string;
  title: string;
  headline?: string | null;

  price: number | null;
  currency: string;

  bedrooms: number | null;
  bathrooms: number | null;
  builtM2: number | null;
  plotM2: number | null;

  propertyType: string | null;

  city: {
    name: string;
    slug: string;
    country: string;
    region?: string | null;
  };

  cover?: {
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;

  updatedAtISO: string;
};

function firstString(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? v[0] ?? '' : v;
}

function toInt(v: string, fallback?: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function normalizeNeeds(raw: string) {
  return raw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function buildWhere(sp: SearchParams) {
  const q = firstString(sp.q).trim();
  const city = firstString(sp.city).trim(); // preferred: city slug
  const place = firstString(sp.place).trim(); // fallback: city name/slug-like input
  const type = firstString(sp.type).trim(); // propertyType
  const beds = toInt(firstString(sp.beds), undefined);
  const max = toInt(firstString(sp.max), undefined);
  const needs = normalizeNeeds(firstString(sp.needs));

  // “mode” is not in schema yet. Keep it in URL/UI but don’t filter DB on it.
  // If you later add listing.mode, we wire it in 10 seconds.

  const orText: any[] = [];
  const and: any[] = [];

  if (q) {
    orText.push({ title: { contains: q, mode: 'insensitive' } });
    orText.push({ headline: { contains: q, mode: 'insensitive' } });
    orText.push({ description: { contains: q, mode: 'insensitive' } });
    orText.push({ neighborhood: { contains: q, mode: 'insensitive' } });
    orText.push({ propertyType: { contains: q, mode: 'insensitive' } });
  }

  if (needs.length) {
    // Needs are mapped to text signals until you add structured features.
    // This is production-safe, not mock: it matches real stored listing copy.
    for (const n of needs) {
      const needle = n.replace(/_/g, ' ');
      and.push({
        OR: [
          { title: { contains: needle, mode: 'insensitive' } },
          { headline: { contains: needle, mode: 'insensitive' } },
          { description: { contains: needle, mode: 'insensitive' } },
        ],
      });
    }
  }

  const cityNeedle = city || place;
  if (cityNeedle) {
    const slugLike = cityNeedle.toLowerCase().trim().replace(/\s+/g, '-');
    and.push({
      city: {
        OR: [
          { slug: { equals: slugLike } },
          { slug: { contains: slugLike } },
          { name: { contains: cityNeedle, mode: 'insensitive' } },
          { country: { contains: cityNeedle, mode: 'insensitive' } },
          { region: { contains: cityNeedle, mode: 'insensitive' } },
        ],
      },
    });
  }

  if (type && type !== 'any') {
    and.push({ propertyType: { contains: type, mode: 'insensitive' } });
  }

  if (typeof beds === 'number' && beds > 0) {
    and.push({ bedrooms: { gte: beds } });
  }

  if (typeof max === 'number' && max > 0) {
    and.push({ price: { lte: max } });
  }

  return {
    status: 'LIVE' as const,
    visibility: 'PUBLIC' as const,
    ...(orText.length ? { OR: orText } : {}),
    ...(and.length ? { AND: and } : {}),
  };
}

function buildOrderBy(sort: SortKey) {
  if (sort === 'price_low') return [{ price: 'asc' as const }, { updatedAt: 'desc' as const }];
  if (sort === 'beds') return [{ bedrooms: 'desc' as const }, { price: 'desc' as const }];
  if (sort === 'sqm') return [{ builtM2: 'desc' as const }, { price: 'desc' as const }];
  if (sort === 'newest') return [{ updatedAt: 'desc' as const }];
  return [{ price: 'desc' as const }, { updatedAt: 'desc' as const }];
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = (await searchParams) ?? {};

  const page = Math.max(1, toInt(firstString(sp.page), 1) ?? 1);
  const take = Math.min(48, Math.max(12, toInt(firstString(sp.take), 24) ?? 24));
  const skip = (page - 1) * take;

  const sort = (firstString(sp.sort) as SortKey) || 'price_high';
  const where = buildWhere(sp);
  const orderBy = buildOrderBy(sort);

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        city: true,
        coverMedia: true,
      },
    }),
  ]);

  const listings: ListingCard[] = rows.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    headline: l.headline,

    price: l.price ?? null,
    currency: l.currency ?? 'EUR',

    bedrooms: l.bedrooms ?? null,
    bathrooms: l.bathrooms ?? null,
    builtM2: l.builtM2 ?? null,
    plotM2: l.plotM2 ?? null,

    propertyType: l.propertyType ?? null,

    city: {
      name: l.city.name,
      slug: l.city.slug,
      country: l.city.country,
      region: l.city.region,
    },

    cover: l.coverMedia
      ? {
          url: l.coverMedia.url,
          alt: l.coverMedia.alt,
          width: l.coverMedia.width,
          height: l.coverMedia.height,
        }
      : null,

    updatedAtISO: l.updatedAt.toISOString(),
  }));

  const pageCount = Math.max(1, Math.ceil(total / take));
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <SearchResultsPageClient
      searchParams={sp}
      listings={listings}
      total={total}
      page={page}
      pageCount={pageCount}
      hasPrev={hasPrev}
      hasNext={hasNext}
      take={take}
    />
  );
}
