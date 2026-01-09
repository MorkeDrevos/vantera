// src/components/home/FeaturedListingsClient.tsx
'use client';

import ListingCard from './ListingCard';
import type { Listing } from './listings';

export default function FeaturedListingsClient({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
