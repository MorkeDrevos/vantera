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
  // ✅ Force 2-per-row on desktop by default (clean + JamesEdition rhythm)
  // If you ever want 3 again, you can pass columns prop explicitly.
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
  className,
  variant = 'default',
  showLocalTime = false,
}: {
  cities: RuntimeCity[];
  columns?: string;
  className?: string;
  variant?: 'default' | 'wall';
  showLocalTime?: boolean;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!showLocalTime) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [showLocalTime]);

  const enriched: EnrichedCity[] = useMemo(() => {
    void now;

    const list = (cities ?? []).map((city) => {
      const r = hashTo01(city.slug);

      const sortScore =
        typeof city.priority === 'number' ? 10_000 + city.priority : Math.round(r * 10_000);

      return {
        ...city,
        localTime: showLocalTime ? formatLocalTime(city.tz) : undefined,
        sortScore,
      };
    });

    return list;
  }, [cities, now, showLocalTime]);

  const isWall = variant === 'wall';

  return (
    <section className={cx('w-full', className)}>
      <div
        className={cx(
          'grid',
          // Clean spacing. 2 columns needs a touch more air.
          isWall ? 'gap-5' : 'gap-5 sm:gap-6 lg:gap-7',
          columns,
        )}
      >
        {enriched.map((city) => (
          <div key={city.slug} className="relative min-w-0">
            {showLocalTime && city.localTime ? (
              <div className="pointer-events-none absolute right-4 top-4 z-30 hidden sm:block">
                <div className="rounded-full border border-white/12 bg-black/35 px-3 py-1.5 text-[11px] text-zinc-100/90 backdrop-blur-2xl">
                  <span className="text-zinc-300">Local</span>
                  <span className="text-zinc-500"> · </span>
                  <span className="font-mono text-zinc-100">{city.localTime}</span>
                </div>
              </div>
            ) : null}

            <CityCard city={city as any} variant={isWall ? 'wall' : 'default'} showLockedCta={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
