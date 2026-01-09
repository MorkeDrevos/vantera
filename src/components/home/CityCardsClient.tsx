// src/components/home/CityCardsClient.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { City } from './cities';

function formatLocalTime(tz: string, d: Date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // AM/PM
      timeZone: tz,
    }).format(d);
  } catch {
    return '';
  }
}

export default function CityCardsClient({ cities }: { cities: City[] }) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Tick close to the minute boundary so the “live time” feels accurate.
    const kick = () => setNow(new Date());
    kick();

    const msToNextMinute = 60_000 - (Date.now() % 60_000) + 25;
    const t0 = window.setTimeout(() => {
      kick();
      const id = window.setInterval(kick, 60_000);
      (window as any).__locusCityTick = id;
    }, msToNextMinute);

    return () => {
      window.clearTimeout(t0);
      const id = (window as any).__locusCityTick;
      if (id) window.clearInterval(id);
      (window as any).__locusCityTick = null;
    };
  }, []);

  const enriched = useMemo(() => {
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
            <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[11px] text-zinc-200 backdrop-blur">
              {city.localTime}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
