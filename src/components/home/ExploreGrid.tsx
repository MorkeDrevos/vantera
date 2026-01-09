'use client';

import CityCard from './CityCard';
import { CITIES } from './cities';

export default function ExploreGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CITIES.map((city) => (
        <CityCard key={city.slug} city={city} />
      ))}
    </div>
  );
}
