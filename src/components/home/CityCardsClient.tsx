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
  // Two-up when there is space. One-up when constrained. Never squeezed.
  columns = '[grid-template-columns:repeat(auto-fit,minmax(min(640px,100%),1fr))]',
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
          // calmer rhythm for white editorial
          isWall ? 'gap-6' : 'gap-6 sm:gap-7 lg:gap-8',
          columns,
        )}
      >
        {enriched.map((city) => (
          <div key={city.slug} className="relative min-w-0">
            {/* Optional local time (light system) */}
            {showLocalTime && city.localTime ? (
              <div className="pointer-events-none absolute right-4 top-4 z-30 hidden sm:block">
                <div className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] text-[color:var(--ink-2)] backdrop-blur-2xl ring-1 ring-inset ring-[color:var(--hairline)] shadow-[0_18px_60px_rgba(11,12,16,0.10)]">
                  <span className="text-[color:var(--ink-3)]">Local</span>
                  <span className="text-black/20"> · </span>
                  <span className="font-mono text-[color:var(--ink)]">{city.localTime}</span>
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
