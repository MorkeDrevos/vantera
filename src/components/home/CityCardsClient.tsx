// src/components/home/CityCardsClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { City } from './cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function formatLocalTime(tz: string) {
  try {
    // AM/PM for “live” feel (matches your request)
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return '';
  }
}

export default function CityCardsClient({
  cities,
  columns,
  className,
}: {
  cities: City[];
  columns?: string;
  className?: string;
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

  const gridClass = columns ?? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cx(gridClass, className)}>
      {enriched.map((city) => (
        <div key={city.slug} className="relative">
          <CityCard city={city} />
          {city.localTime ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[11px] text-zinc-200 backdrop-blur">
              {city.localTime}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
