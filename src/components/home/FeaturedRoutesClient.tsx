// src/components/home/FeaturedRoutesClient.tsx
'use client';

import type { City } from './cities';
import CityCardsClient from './CityCardsClient';

export default function FeaturedRoutesClient({ cities }: { cities: City[] }) {
  return (
    <CityCardsClient
      cities={cities}
      columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
    />
  );
}
