// src/components/home/CityCardsClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { City, CityMeta } from './cities';

function formatLocalTime(tz: string, now: Date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(now);
  } catch {
    return '';
  }
}

export default function CityCardsClient({ cities }: { cities: City[] }) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update frequently enough that it feels “live”, but still lightweight
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const enriched: CityMeta[] = useMemo(() => {
    return cities.map((city) => ({
      ...city,
      localTime: formatLocalTime(city.tz, now),
    }));
  }, [cities, now]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {enriched.map((city) => (
        <div key={city.slug} className="relative">
          <CityCard city={city} />
          {city.localTime ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] text-zinc-100 backdrop-blur">
              {city.localTime}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
