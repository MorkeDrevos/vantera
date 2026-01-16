// src/app/search/page.tsx
import type { Metadata } from 'next';

import SearchResultsPageClient from '@/components/search/SearchResultsPageClient';

export const metadata: Metadata = {
  title: 'Search · Vantera',
};

type SearchParams = Record<string, string | string[] | undefined>;

function asString(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? v[0] ?? '' : v;
}

function asNumber(v: string | string[] | undefined) {
  const s = asString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function asNeeds(v: string | string[] | undefined) {
  const s = asString(v);
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const initial = {
    q: asString(searchParams.q),
    place: asString(searchParams.place),
    kw: asString(searchParams.kw),
    mode: (asString(searchParams.mode) as 'buy' | 'rent' | 'sell') || 'buy',
    max: asNumber(searchParams.max),
    beds: asNumber(searchParams.beds),
    type: asString(searchParams.type),
    needs: asNeeds(searchParams.needs),
  };

  return (
    <main className="min-h-[100dvh] bg-white">
      <SearchResultsPageClient initial={initial} />
    </main>
  );
}
