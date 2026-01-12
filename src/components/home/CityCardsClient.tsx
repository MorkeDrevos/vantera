// src/components/home/CityCardsClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import CityCard from './CityCard';

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

// Runtime city shape (DB-driven). Keep this aligned with what CityCard actually uses.
export type RuntimeCity = {
  slug: string;
  name: string;
  country: string;
  region?: string | null;
  tz: string;

  tier?: string;
  status?: string;
  priority?: number;

  blurb?: string | null;

  // CityCard + search thumbnail compatibility
  image?: { src: string; alt?: string | null } | null;

  // DB fields (optional)
  heroImageSrc?: string | null;
  heroImageAlt?: string | null;

  // extra (computed)
  localTime?: string;
};

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

  const enriched = useMemo(() => {
    // tie memo to `now` so local times update once per minute
    void now;

    return cities.map((city) => ({
      ...city,
      localTime: formatLocalTime(city.tz),
    }));
  }, [cities, now]);

  return (
    <section className={cx('w-full', className)}>
      <div className={cx('grid gap-4 sm:gap-5', columns)}>
        {enriched.map((city) => (
          <div key={city.slug} className="relative">
            {/* Optional: tiny local time badge (does not affect CityCard props) */}
            {city.localTime ? (
              <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-zinc-200/90 backdrop-blur-xl">
                {city.localTime}
              </div>
            ) : null}

            {/* CityCard is structurally typed - RuntimeCity matches the shape */}
            <CityCard city={city as any} />
          </div>
        ))}
      </div>
    </section>
  );
}
