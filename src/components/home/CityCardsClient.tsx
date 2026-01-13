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

      // Stable "curation score" that can later be replaced by real signal ranking.
      // priority (if provided) wins, otherwise a deterministic score from slug.
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

    // Keep current order by default? If you want “index feel”, uncomment this:
    // list.sort((a, b) => (b.sortScore ?? 0) - (a.sortScore ?? 0));

    return list;
  }, [cities, now]);

  return (
    <section className={cx('w-full', className)}>
      {/* Cinematic wrapper so it feels like a premium index wall */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_40px_140px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_18%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_85%_10%,rgba(120,76,255,0.10),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:24px_24px]" />
        </div>

        <div className="relative">
          <div className={cx('grid gap-4 sm:gap-5', columns)}>
            {enriched.map((city, idx) => (
              <div key={city.slug} className="relative">
                {/* “Live” local time badge (premium, minimal) */}
                {city.localTime ? (
                  <div className="pointer-events-none absolute right-4 top-4 z-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-zinc-100/90 shadow-[0_16px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                        <span className="text-zinc-300">Local time</span>
                      </span>
                      <span className="text-zinc-500">·</span>
                      <span className="font-mono text-zinc-100">{city.localTime}</span>
                    </div>
                  </div>
                ) : null}

                {/* Slight staggered “index wall” rhythm on large screens */}
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

          {/* Footer hint: makes it feel curated, not like a directory */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-[12px] text-zinc-300">
            This is a curated index - not a list.
            <span className="text-zinc-500"> Cities expand as verified supply and signals come online.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
