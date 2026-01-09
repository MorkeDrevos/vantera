// src/app/listing/[id]/page.tsx
import { notFound } from 'next/navigation';

import ListingPageClient from '@/components/listing/ListingPageClient';
// import your data source here (mock or real)
// import { LISTINGS } from '@/components/home/listings';

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TEMP example lookup – adjust to your real data source
  // const listing = LISTINGS.find((l) => l.id === id);
  // if (!listing) return notFound();

  return (
    <ListingPageClient
      id={id}
      // listing={listing}
    />
  );
}
