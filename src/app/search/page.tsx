// src/app/search/page.tsx
import SearchResultsPageClient from '@/components/search/SearchResultsPageClient';

export default function SearchPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  return <SearchResultsPageClient searchParams={searchParams ?? {}} />;
}
