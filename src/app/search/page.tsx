// src/app/search/page.tsx
import SearchResultsPageClient, {
  type SearchParams,
  type SearchResultListing,
} from '@/components/search/SearchResultsPageClient';

import { prisma } from '@/lib/prisma';

function firstString(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v[0];
  return v;
}

function parseIntSafe(v: string | undefined) {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseNeeds(v: string | undefined) {
  if (!v) return [];
  return v
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeText(s: string) {
  return s.trim();
}

function orTextFields(term: string) {
  const t = normalizeText(term);
  if (!t) return [];
  return [
    { title: { contains: t, mode: 'insensitive' as const } },
    { headline: { contains: t, mode: 'insensitive' as const } },
    { description: { contains: t, mode: 'insensitive' as const } },
    { neighborhood: { contains: t, mode: 'insensitive' as const } },
  ];
}

export default async function SearchPage({
  searchParams,
}: {
  // Next 15: can be async, but works fine as plain object on server in practice
  searchParams?: SearchParams;
}) {
  const sp = searchParams ?? {};

  const q = normalizeText(firstString(sp.q) ?? '');
  const place = normalizeText(firstString(sp.place) ?? '');
  const kw = normalizeText(firstString(sp.kw) ?? '');

  // mode exists in UI but not in schema yet - we keep it for UX, but it does not affect DB query
  const mode = normalizeText(firstString(sp.mode) ?? '');

  const max = parseIntSafe(firstString(sp.max));
  const beds = parseIntSafe(firstString(sp.beds));
  const type = normalizeText(firstString(sp.type) ?? 'any');
  const needs = parseNeeds(firstString(sp.needs));

  const pageSize = 24;
  const page = Math.max(1, parseIntSafe(firstString(sp.p)) ?? 1);
  const skip = (page - 1) * pageSize;

  const textTerms: string[] = [];
  if (q) textTerms.push(q);
  if (kw) textTerms.push(kw);
  for (const n of needs) textTerms.push(n.replace(/_/g, ' '));

  const andClauses: any[] = [
    { status: 'LIVE' },
    { visibility: 'PUBLIC' },
  ];

  // City/place filter (matches city name OR slug)
  if (place) {
    andClauses.push({
      OR: [
        { city: { name: { contains: place, mode: 'insensitive' } } },
        { city: { slug: { contains: place, mode: 'insensitive' } } },
      ],
    });
  }

  // Type filter -> Listing.propertyType (freeform)
  if (type && type !== 'any') {
    andClauses.push({
      propertyType: { contains: type, mode: 'insensitive' },
    });
  }

  // Beds
  if (typeof beds === 'number' && Number.isFinite(beds)) {
    andClauses.push({ bedrooms: { gte: beds } });
  }

  // Max price (currency assumed EUR today; we filter by price numeric)
  if (typeof max === 'number' && Number.isFinite(max)) {
    andClauses.push({ price: { lte: max } });
  }

  // Text terms (q, kw, needs) -> OR over key text fields
  if (textTerms.length) {
    andClauses.push({
      AND: textTerms.map((t) => ({ OR: orTextFields(t) })),
    });
  }

  const where = { AND: andClauses };

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      include: {
        city: true,
        coverMedia: true,
      },
      orderBy: [
        { price: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: pageSize,
      skip,
    }),
  ]);

  const listings: SearchResultListing[] = rows.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    locationLine: `${l.city.name}${l.neighborhood ? ` · ${l.neighborhood}` : ''}`,
    citySlug: l.city.slug,
    cityName: l.city.name,
    country: l.city.country,
    price: l.price ?? null,
    currency: l.currency ?? 'EUR',
    bedrooms: l.bedrooms ?? null,
    bathrooms: l.bathrooms ?? null,
    builtM2: l.builtM2 ?? null,
    propertyType: l.propertyType ?? null,
    coverUrl: l.coverMedia?.url ?? null,
    coverAlt: l.coverMedia?.alt ?? null,
  }));

  return (
    <SearchResultsPageClient
      searchParams={sp}
      listings={listings}
      total={total}
      page={page}
      pageSize={pageSize}
      // mode is UI-only until you add a schema field. We pass it through anyway so it stays in the URL.
      modeHint={mode}
      basePath="/search"
    />
  );
}
