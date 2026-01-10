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
            <div className="pointer-events-none absolute right-3 top-3">
              <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/35 px-2.5 py-1.5 text-[11px] text-zinc-100 shadow-[0_14px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                {/* top highlight + subtle inner polish */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.02] to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* quiet premium glow (not gold-heavy) */}
                <div className="pointer-events-none absolute -inset-10 opacity-60">
                  <div className="absolute left-0 top-0 h-20 w-24 rounded-full bg-[rgba(120,76,255,0.10)] blur-2xl" />
                  <div className="absolute right-0 top-0 h-20 w-24 rounded-full bg-[rgba(255,255,255,0.06)] blur-2xl" />
                </div>

                <div className="relative inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                    <span className="text-zinc-200/90">Local</span>
                  </span>

                  <span className="text-white/20">•</span>

                  <span className="font-semibold tracking-[0.08em] text-zinc-100">
                    {city.localTime}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
