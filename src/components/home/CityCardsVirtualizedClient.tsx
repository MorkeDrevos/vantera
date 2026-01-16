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
  marbella: {
    src: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=2800&q=85',
    alt: 'Marbella coastline and marina',
  },
  london: {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2800&q=85',
    alt: 'London skyline at dusk',
  },
};

function withFeaturedOverrides(city: City): City {
  const o = FEATURED_IMAGE_OVERRIDES[city.slug];
  if (!o) return city;
  return { ...city, image: { src: o.src, alt: o.alt } };
}

function FeaturedHeader() {
  return (
    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">Featured markets</div>

        <div className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[30px]">
          Six cities to start the marketplace
        </div>

        <div className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--ink-2)]">
          Real signals only. Local time, verified supply when available, and a catalogue-first experience.
        </div>
      </div>
    </div>
  );
}

export default function CityCardsVirtualizedClient({
  cities,
  className,
  columns = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  initial = 18,
  step = 18,

  mode = 'full',
  showFeatured = true,

  statsByCity,
}: {
  cities: City[];
  className?: string;
  columns?: string;
  initial?: number;
  step?: number;

  mode?: 'full' | 'featured';
  showFeatured?: boolean;

  statsByCity?: Record<string, CityListingsStats | undefined>;
}) {
  const sorted = useMemo(() => {
    return [...cities];
  }, [cities]);

  const featured = useMemo(() => {
    if (!showFeatured && mode !== 'featured') return [] as City[];

    const preferred = ['miami', 'new-york', 'monaco', 'dubai', 'marbella', 'london'];
    const map = new Map(sorted.map((c) => [c.slug, c] as const));

    const picked: City[] = [];
    for (const slug of preferred) {
      const c = map.get(slug);
      if (c) picked.push(withFeaturedOverrides(c));
    }

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
  }, [sorted, mode, showFeatured]);

  const featuredSlugs = useMemo(() => new Set(featured.map((c) => c.slug)), [featured]);

  const rest = useMemo(() => {
    if (featured.length === 0) return sorted;
    return sorted.filter((c) => !featuredSlugs.has(c.slug));
  }, [sorted, featuredSlugs, featured.length]);

  // Featured-only mode: no virtualization, no "showing X of Y"
  if (mode === 'featured') {
    return (
      <section className={cx('w-full', className)}>
        <div
          className={cx(
            'relative w-full overflow-hidden rounded-[28px]',
            'bg-white',
            'ring-1 ring-inset ring-[color:var(--hairline)]',
            'shadow-[0_22px_80px_rgba(11,12,16,0.08)]',
          )}
        >
          <div className="relative p-5 sm:p-7">
            <FeaturedHeader />

            <div className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((city) => {
                const stats = statsByCity?.[city.slug];
                return (
                  <div key={city.slug} className="min-w-0">
                    <CityCard city={city} stats={stats} variant="default" showLockedCta={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full mode (virtualized)
  const [count, setCount] = useState(() => Math.min(initial, rest.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(Math.min(initial, rest.length));
  }, [initial, rest.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        setCount((c) => Math.min(c + step, rest.length));
      },
      { root: null, rootMargin: '900px 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rest.length, step]);

  const visible = rest.slice(0, count);
  const done = count >= rest.length;

  return (
    <section className={cx('w-full', className)}>
      {showFeatured && featured.length > 0 ? (
        <div
          className={cx(
            'relative w-full overflow-hidden rounded-[28px]',
            'bg-white',
            'ring-1 ring-inset ring-[color:var(--hairline)]',
            'shadow-[0_22px_80px_rgba(11,12,16,0.08)]',
          )}
        >
          <div className="relative p-5 sm:p-7">
            <FeaturedHeader />

            <div className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((city) => {
                const stats = statsByCity?.[city.slug];
                return (
                  <div key={city.slug} className="min-w-0">
                    <CityCard city={city} stats={stats} variant="default" showLockedCta={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Everything else */}
      <div className={cx(showFeatured && featured.length > 0 ? 'mt-6' : '')}>
        <div className={columns}>
          {visible.map((city) => {
            const stats = statsByCity?.[city.slug];
            return <CityCard key={city.slug} city={city} stats={stats} />;
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[color:var(--ink-3)]">
            Showing <span className="font-semibold text-[color:var(--ink)]">{visible.length}</span> of{' '}
            <span className="font-semibold text-[color:var(--ink)]">{rest.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {!done ? (
              <button
                type="button"
                onClick={() => setCount((c) => Math.min(c + step, rest.length))}
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
      </div>
    </section>
  );
}
