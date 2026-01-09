// src/components/home/CityCardsClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { City } from './cities';

function formatLocalTime(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return '';
  }
}

type Variant = 'default' | 'compact';

function gridClass(variant: Variant) {
  if (variant === 'compact') {
    // Sidebar-friendly:
    // - 1 column on desktop (prevents squeeze)
    // - 2 columns on small screens
    return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-1';
  }

  // Explore grid (unchanged intention)
  return 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
}

export default function CityCardsClient({
  cities,
  variant = 'default',
}: {
  cities: City[];
  variant?: Variant;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const enriched = useMemo(() => {
    return cities.map((city) => ({
      ...city,
      localTime: formatLocalTime(city.tz),
    }));
  }, [cities, now]);

  return (
    <div className={gridClass(variant)}>
      {enriched.map((city) => (
        <div key={city.slug} className="relative">
          <CityCard city={city} />
          {city.localTime ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[11px] text-zinc-200 backdrop-blur">
              {city.localTime}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
