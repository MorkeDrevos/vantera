// src/components/home/CityCardsClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';
import type { RuntimeCity } from './HomePage';

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

type EnrichedCity = RuntimeCity & {
  localTime?: string;
  sortScore?: number;
};

function hashTo01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export default function CityCardsClient({
  cities,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  className,
}: {
  cities: RuntimeCity[];
  columns?: string;
  className?: string;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const enriched: EnrichedCity[] = useMemo(() => {
    void now;

    const list = (cities ?? []).map((city) => {
      const r = hashTo01(city.slug);

      // Stable "curation score" that can later be replaced by real ranking.
      const sortScore =
        typeof city.priority === 'number' ? 10_000 + city.priority : Math.round(r * 10_000);

      return {
        ...city,
        localTime: formatLocalTime(city.tz),
        sortScore,
      };
    });

    // Keep current order by default.
    return list;
  }, [cities, now]);

  return (
    <section className={cx('w-full', className)}>
      <div className={cx('grid gap-4 sm:gap-5', columns)}>
        {enriched.map((city, idx) => (
          <div key={city.slug} className="relative">
            {/* Local time badge (smaller + higher class) */}
            {city.localTime ? (
              <div className="pointer-events-none absolute right-4 top-4 z-30">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1.5 text-[11px] text-zinc-100/90 shadow-[0_16px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                    <span className="text-zinc-300">Local</span>
                  </span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-mono text-zinc-100">{city.localTime}</span>
                </div>
              </div>
            ) : null}

            {/* Subtle “index wall” rhythm on large screens */}
            <div
              className={cx(
                'transition-transform duration-500',
                idx % 3 === 1 && 'lg:translate-y-[6px]',
                idx % 3 === 2 && 'lg:translate-y-[12px]',
              )}
            >
              <CityCard city={city as any} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
