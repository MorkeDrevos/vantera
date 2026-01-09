// src/components/home/CityCardsClient.tsx
'use client';

import CityCard from './CityCard';
import type { City } from './cities';
import CityLocalTime from './CityLocalTime';

export default function CityCardsClient({
  cities,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: {
  cities: City[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {cities.map((city) => (
        <div key={city.slug} className="relative">
          <CityCard city={city} />
          <div className="pointer-events-none absolute right-3 top-3">
            <CityLocalTime tz={city.tz} />
          </div>
        </div>
      ))}
    </div>
  );
}
