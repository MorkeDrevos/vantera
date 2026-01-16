// src/app/search/page.tsx
import type { Metadata } from 'next';

import SearchResultsPage from '@/components/search/SearchResultsPage';

export const metadata: Metadata = {
  title: 'Search · Vantera',
  description:
    'Search Vantera by place, lifestyle, budget and keywords. Private intelligence, presented in plain language.',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <SearchResultsPage searchParams={searchParams} />;
}
