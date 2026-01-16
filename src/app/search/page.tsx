// src/app/search/page.tsx
import SearchResultsPageClient from '@/components/search/SearchResultsPageClient';
import { prisma } from '@/lib/prisma';

export type SearchParams = Record<string, string | string[] | undefined>;

type SortKey = 'price_high' | 'price_low' | 'beds' | 'sqm' | 'newest';

export type ListingCard = {
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

  cover: {
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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
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
  const place = firstString(sp.place).trim(); // user text (city, region, country)
  const citySlug = firstString(sp.city).trim(); // preferred canonical selector
  const type = firstString(sp.type).trim();
  const beds = toInt(firstString(sp.beds), undefined);
  const max = toInt(firstString(sp.max), undefined);
  const needs = normalizeNeeds(firstString(sp.needs));

  const AND: any[] = [];
  const OR: any[] = [];

  if (q) {
    OR.push({ title: { contains: q, mode: 'insensitive' } });
    OR.push({ headline: { contains: q, mode: 'insensitive' } });
    OR.push({ description: { contains: q, mode: 'insensitive' } });
    OR.push({ neighborhood: { contains: q, mode: 'insensitive' } });
    OR.push({ propertyType: { contains: q, mode: 'insensitive' } });
  }

  // Needs: production-safe text matching against real listing copy until you add structured features.
  if (needs.length) {
    for (const n of needs) {
      const needle = n.replace(/_/g, ' ').trim();
      if (!needle) continue;
      AND.push({
        OR: [
          { title: { contains: needle, mode: 'insensitive' } },
          { headline: { contains: needle, mode: 'insensitive' } },
          { description: { contains: needle, mode: 'insensitive' } },
        ],
      });
    }
  }

  if (citySlug) {
    AND.push({ city: { slug: citySlug } });
  } else if (place) {
    const slugLike = place.toLowerCase().trim().replace(/\s+/g, '-');
    AND.push({
      city: {
        OR: [
          { slug: { equals: slugLike } },
          { slug: { contains: slugLike } },
          { name: { contains: place, mode: 'insensitive' } },
          { region: { contains: place, mode: 'insensitive' } },
          { country: { contains: place, mode: 'insensitive' } },
        ],
      },
    });
  }

  if (type && type !== 'any') {
    AND.push({ propertyType: { contains: type, mode: 'insensitive' } });
  }

  if (typeof beds === 'number' && beds > 0) {
    AND.push({ bedrooms: { gte: beds } });
  }

  if (typeof max === 'number' && max > 0) {
    AND.push({ price: { lte: max } });
  }

  // Always enforce public live inventory
  const where: any = {
    status: 'LIVE',
    visibility: 'PUBLIC',
  };

  if (OR.length) where.OR = OR;
  if (AND.length) where.AND = AND;

  return where;
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

  const page = clamp(toInt(firstString(sp.page), 1) ?? 1, 1, 10_000);
  const take = clamp(toInt(firstString(sp.take), 24) ?? 24, 12, 48);
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

  return (
    <SearchResultsPageClient
      searchParams={sp}
      listings={listings}
      total={total}
      page={page}
      pageCount={pageCount}
      take={take}
    />
  );
}
