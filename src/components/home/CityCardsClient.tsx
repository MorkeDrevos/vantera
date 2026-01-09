'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { City } from './cities';

function formatLocalTime(tz: string, d: Date) {
  try {
    // 12h + AM/PM (premium + clear)
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return '';
  }
}

export default function CityCardsClient({ cities }: { cities: City[] }) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Sync to the next minute boundary, then tick every minute
    const tick = () => setNow(new Date());

    const msToNextMinute =
      60_000 - (Date.now() % 60_000) + 10; // small buffer so we don't tick early

    const t0 = setTimeout(() => {
      tick();
      const id = setInterval(tick, 60_000);
      // store interval id on window so we can clear it in cleanup via closure
      (window as any).__locusCityTick = id;
    }, msToNextMinute);

    return () => {
      clearTimeout(t0);
      const id = (window as any).__locusCityTick;
      if (id) clearInterval(id);
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
            <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-100 backdrop-blur">
              <span className="opacity-90">{city.localTime}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
