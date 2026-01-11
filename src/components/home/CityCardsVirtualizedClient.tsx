// src/components/home/CityCardsVirtualizedClient.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { City } from './cities';
import CityCard from './CityCard';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type CityListingsStats = {
  verifiedCount: number;
  pendingCount?: number;
};

export default function CityCardsVirtualizedClient({
  cities,
  className,
  columns = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  initial = 18,
  step = 18,

  // Optional: plug this in once you have real DB/API
  statsByCity,
}: {
  cities: City[];
  className?: string;
  columns?: string;
  initial?: number;
  step?: number;
  statsByCity?: Record<string, CityListingsStats | undefined>;
}) {
  const sorted = useMemo(() => {
    // Stable sort: keep input order unless you want tier sorting later
    return [...cities];
  }, [cities]);

  const [count, setCount] = useState(() => Math.min(initial, sorted.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(Math.min(initial, sorted.length));
  }, [initial, sorted.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;

        setCount((c) => {
          const next = Math.min(c + step, sorted.length);
          return next;
        });
      },
      { root: null, rootMargin: '900px 0px', threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [sorted.length, step]);

  const visible = sorted.slice(0, count);
  const done = count >= sorted.length;

  return (
    <div className={cx('w-full', className)}>
      <div className={columns}>
        {visible.map((city) => {
          const stats = statsByCity?.[city.slug];
          return <CityCard key={city.slug} city={city} stats={stats} />;
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-500">
          Showing <span className="text-zinc-200">{visible.length}</span> of{' '}
          <span className="text-zinc-200">{sorted.length}</span>
        </div>

        {!done ? (
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + step, sorted.length))}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.06]"
          >
            Load more
          </button>
        ) : (
          <div className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-400">
            All cities loaded
          </div>
        )}
      </div>

      {/* Scroll trigger */}
      <div ref={sentinelRef} className="h-px w-full" />
    </div>
  );
}
