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

// Curated “hero-grade” images for the Featured Markets (top 6)
//
// IMPORTANT (design contract):
// - Featured markets MUST use image IDs pinned to a known-good source (no “random photo” surprises).
// - Use source.unsplash.com/<PHOTO_ID>/... so the asset is stable and correct for the city.
// - Any change here must keep city truth (London must be London, Marbella must be Marbella/Puerto Banus).
const FEATURED_IMAGE_OVERRIDES: Record<string, { src: string; alt: string }> = {
  monaco: {
    src: 'https://images.unsplash.com/photo-1595138320174-a64d168e9970?q=80&w=3520&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Monaco harbour at night with yachts and city lights',
  },
  miami: {
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2800&q=85',
    alt: 'Miami skyline across the water',
  },
  'new-york': {
    src: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=2800&q=85',
    alt: 'New York skyline at blue hour',
  },
  dubai: {
    src: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=2800&q=85',
    alt: 'Dubai skyline at dusk',
  },

  // FIX: Marbella must be Marbella / Puerto Banus (yachts/marina), not a generic coast
  marbella: {
    src: 'https://images.unsplash.com/photo-1722600522832-c7ebd5ea1ace?q=80&w=3860&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Puerto Banús marina, Marbella (Costa del Sol), Spain',
  },

  // FIX: London must be London (Thames / cityscape), not a mountain landscape
  london: {
    src: 'https://images.unsplash.com/photo-1483972117325-ce4920ff780b?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'London cityscape and the River Thames',
  },
};

function withFeaturedOverrides(city: City): City {
  const o = FEATURED_IMAGE_OVERRIDES[city.slug];
  if (!o) return city;
  return { ...city, image: { src: o.src, alt: o.alt } };
}

export default function CityCardsVirtualizedClient({
  cities,
  className,
  columns = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  initial = 18,
  step = 18,

  mode = 'full',

  statsByCity,
}: {
  cities: City[];
  className?: string;
  columns?: string;
  initial?: number;
  step?: number;

  mode?: 'full' | 'featured';

  statsByCity?: Record<string, CityListingsStats | undefined>;
}) {
  const sorted = useMemo(() => {
    return [...cities];
  }, [cities]);

  // The six-city “marketfront” selection (no header, no wrapper)
  const six = useMemo(() => {
    const preferred = ['miami', 'new-york', 'monaco', 'dubai', 'marbella', 'london'];
    const map = new Map(sorted.map((c) => [c.slug, c] as const));

    const picked: City[] = [];
    for (const slug of preferred) {
      const c = map.get(slug);
      if (c) picked.push(withFeaturedOverrides(c));
    }

    // Fallback: fill to 6 by priority if some are missing
    if (picked.length < 6) {
      const remaining = sorted
        .filter((c) => !picked.some((p) => p.slug === c.slug))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

      for (const c of remaining) {
        if (picked.length >= 6) break;
        picked.push(withFeaturedOverrides(c));
      }
    }

    return picked.slice(0, 6);
  }, [sorted]);

  // Featured-only mode: render only the six, nothing else
  if (mode === 'featured') {
    return (
      <section className={cx('w-full', className)}>
        <div className={columns}>
          {six.map((city) => {
            const stats = statsByCity?.[city.slug];
            return <CityCard key={city.slug} city={city} stats={stats} />;
          })}
        </div>
      </section>
    );
  }

  // Full mode (virtualized)
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
        setCount((c) => Math.min(c + step, sorted.length));
      },
      { root: null, rootMargin: '900px 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [sorted.length, step]);

  const visible = sorted.slice(0, count);
  const done = count >= sorted.length;

  return (
    <section className={cx('w-full', className)}>
      <div className={columns}>
        {visible.map((city) => {
          const stats = statsByCity?.[city.slug];
          return <CityCard key={city.slug} city={city} stats={stats} />;
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-[color:var(--ink-3)]">
          Showing <span className="font-semibold text-[color:var(--ink)]">{visible.length}</span> of{' '}
          <span className="font-semibold text-[color:var(--ink)]">{sorted.length}</span>
        </div>

        <div className="flex items-center gap-2">
          {!done ? (
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(c + step, sorted.length))}
              className={cx(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition',
                'bg-white/80 backdrop-blur-2xl',
                'text-[color:var(--ink)]',
                'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
                'shadow-[0_18px_60px_rgba(11,12,16,0.10)]',
              )}
            >
              Load more
            </button>
          ) : (
            <div
              className={cx(
                'inline-flex items-center rounded-full px-4 py-2 text-xs',
                'bg-white/70 backdrop-blur-2xl',
                'text-[color:var(--ink-3)]',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
              )}
            >
              All cities loaded
            </div>
          )}
        </div>
      </div>

      <div ref={sentinelRef} className="h-px w-full" />
    </section>
  );
}
