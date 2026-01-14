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
  columns = 'grid-cols-1 sm:grid-cols-2',
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

      const sortScore =
        typeof city.priority === 'number'
          ? 10_000 + city.priority
          : Math.round(r * 10_000);

      return {
        ...city,
        localTime: formatLocalTime(city.tz),
        sortScore,
      };
    });

    return list;
  }, [cities, now]);

  return (
    <section className={cx('w-full', className)}>
      {/* Cleaner wrapper: still premium, but less “box in a box” */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/18 p-3 shadow-[0_34px_120px_rgba(0,0,0,0.55)] sm:p-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_18%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_85%_10%,rgba(120,76,255,0.10),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>

        <div className="relative">
          <div className={cx('grid gap-4 sm:gap-5', columns)}>
            {enriched.map((city) => (
              <div key={city.slug} className="relative">
                {/* Local time badge - only show from md up to avoid ugly stacking */}
                {city.localTime ? (
                  <div className="pointer-events-none absolute right-3 top-3 z-20 hidden md:block">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-zinc-100/90 shadow-[0_16px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                        <span className="text-zinc-300">Local</span>
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-zinc-100">{city.localTime}</span>
                    </div>
                  </div>
                ) : null}

                <CityCard city={city as any} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
