// src/components/home/CityCardsVirtualizedClient.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function CityCardsVirtualizedClient({
  cities,
  columns,
  className,
  initial = 18,
  step = 18,
}: {
  cities: City[];
  columns?: string;
  className?: string;
  initial?: number;
  step?: number;
}) {
  const [_now, setNow] = useState<Date>(() => new Date());
  const [count, setCount] = useState(() => Math.min(initial, cities.length));
  const sentryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Reset if list changes
  useEffect(() => {
    setCount(Math.min(initial, cities.length));
  }, [cities.length, initial]);

  const enriched = useMemo(() => {
    return cities.slice(0, count).map((city) => ({
      ...city,
      localTime: formatLocalTime(city.tz),
    }));
  }, [cities, count, _now]);

  const gridClass = columns ?? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  // Infinite "load more" when the sentry becomes visible
  useEffect(() => {
    const el = sentryRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e || !e.isIntersecting) return;

        setCount((v) => Math.min(cities.length, v + step));
      },
      { root: null, rootMargin: '900px 0px 900px 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [cities.length, step]);

  return (
    <div className={cx(gridClass, className)}>
      {enriched.map((city) => (
        <div
          key={city.slug}
          className="relative"
          style={{
            // Browser-native virtualization (huge win at scale)
            contentVisibility: 'auto',
            containIntrinsicSize: '420px 540px',
          }}
        >
          <CityCard city={city} />

          {city.localTime ? (
            <div className="pointer-events-none absolute right-3 top-3">
              <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/35 px-2.5 py-1.5 text-[11px] text-zinc-100 shadow-[0_14px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.02] to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                <div className="relative inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                    <span className="text-zinc-200/90">Local</span>
                  </span>

                  <span className="text-white/20">•</span>

                  <span className="font-semibold tracking-[0.08em] text-zinc-100">{city.localTime}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ))}

      {/* Sentry spans full width */}
      <div ref={sentryRef} className="h-1 w-full sm:col-span-2 lg:col-span-3" />
    </div>
  );
}
