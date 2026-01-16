// src/app/search/page.tsx
import SearchResultsPageClient, { type SearchParams } from '@/components/search/SearchResultsPageClient';
import { prisma } from '@/lib/prisma';

function firstParam(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v[0];
  return v;
}

function parseIntParam(v: string | string[] | undefined) {
  const s = firstParam(v);
  if (!s) return undefined;
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  return Math.round(n);
}

function parseNeeds(v: string | string[] | undefined) {
  const s = firstParam(v);
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sp = (searchParams ?? {}) as SearchParams;

  const q = (firstParam(sp.q) ?? '').trim();
  const place = (firstParam(sp.place) ?? '').trim();
  const kw = (firstParam(sp.kw) ?? '').trim();
  const type = (firstParam(sp.type) ?? 'any').trim();
  const max = parseIntParam(sp.max);
  const beds = parseIntParam(sp.beds);
  const needs = parseNeeds(sp.needs);

  // Production baseline: strict LIVE + PUBLIC
  // We apply pragmatic text matching until you add structured tags/features.
  const and: any[] = [
    { status: 'LIVE' },
    { visibility: 'PUBLIC' },
  ];

  if (max) and.push({ price: { lte: max } });
  if (beds) and.push({ bedrooms: { gte: beds } });

  if (type && type !== 'any') {
    and.push({
      OR: [
        { propertyType: { contains: type, mode: 'insensitive' } },
        { title: { contains: type, mode: 'insensitive' } },
        { headline: { contains: type, mode: 'insensitive' } },
      ],
    });
  }

  if (place) {
    and.push({
      OR: [
        { neighborhood: { contains: place, mode: 'insensitive' } },
        { city: { name: { contains: place, mode: 'insensitive' } } },
        { city: { slug: { contains: place.toLowerCase(), mode: 'insensitive' } } },
        { city: { country: { contains: place, mode: 'insensitive' } } },
        { address: { contains: place, mode: 'insensitive' } },
      ],
    });
  }

  const textNeedles = [q, kw, ...needs].map((s) => s.trim()).filter(Boolean);

  if (textNeedles.length) {
    and.push({
      AND: textNeedles.map((needle) => ({
        OR: [
          { title: { contains: needle, mode: 'insensitive' } },
          { headline: { contains: needle, mode: 'insensitive' } },
          { description: { contains: needle, mode: 'insensitive' } },
          { neighborhood: { contains: needle, mode: 'insensitive' } },
          { propertyType: { contains: needle, mode: 'insensitive' } },
          { city: { name: { contains: needle, mode: 'insensitive' } } },
        ],
      })),
    });
  }

  const listings = await prisma.listing.findMany({
    where: { AND: and },
    include: {
      city: true,
      coverMedia: true,
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: 60,
  });

  return <SearchResultsPageClient searchParams={sp} listings={listings} />;
}
