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

// Curated “hero-grade” images for the Featured Markets (top 4 only)
// This avoids relying on whatever is in cities.ts and guarantees premium visuals.
// Non-destructive: only used in this component.
const FEATURED_IMAGE_OVERRIDES: Record<string, { src: string; alt: string }> = {
  // Fix Monaco "for good" by using a local image (no Unsplash 403/optimizer issues)
  monaco: {
    src: '/cities/monaco.jpg',
    alt: 'Monaco harbour with yachts and skyline',
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
};

function withFeaturedOverrides(city: City): City {
  const o = FEATURED_IMAGE_OVERRIDES[city.slug];
  if (!o) return city;
  return {
    ...city,
    image: { src: o.src, alt: o.alt },
  };
}

export default function CityCardsVirtualizedClient({
  cities,
  className,
  columns = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  initial = 18,
  step = 18,

  // NEW
  mode = 'full',
  showFeatured = true,

  // Optional: plug this in once you have real DB/API
  statsByCity,
}: {
  cities: City[];
  className?: string;
  columns?: string;
  initial?: number;
  step?: number;

  // NEW
  mode?: 'full' | 'featured';
  showFeatured?: boolean;

  statsByCity?: Record<string, CityListingsStats | undefined>;
}) {
  const sorted = useMemo(() => {
    // Stable sort: keep input order unless you want tier sorting later
    return [...cities];
  }, [cities]);

  // Featured top 4:
  // - Monaco must be in top 4 (replace Marbella).
  // - We keep it deterministic by selecting from a preferred slug list first.
  const featured = useMemo(() => {
    if (!showFeatured && mode !== 'featured') return [] as City[];

    const preferred = ['miami', 'new-york', 'monaco', 'dubai'];
    const map = new Map(sorted.map((c) => [c.slug, c] as const));

    const picked: City[] = [];
    for (const slug of preferred) {
      const c = map.get(slug);
      if (c) picked.push(withFeaturedOverrides(c));
    }

    // Fallback: if any are missing, fill from highest priority remaining
    if (picked.length < 4) {
      const remaining = sorted
        .filter((c) => !picked.some((p) => p.slug === c.slug))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

      for (const c of remaining) {
        if (picked.length >= 4) break;
        picked.push(withFeaturedOverrides(c));
      }
    }

    return picked.slice(0, 4);
  }, [sorted, mode, showFeatured]);

  const featuredSlugs = useMemo(() => new Set(featured.map((c) => c.slug)), [featured]);

  const rest = useMemo(() => {
    // If featured is visible in this render, keep the full list below clean by excluding it.
    // If featured is hidden, show everything in the grid.
    if (featured.length === 0) return sorted;
    return sorted.filter((c) => !featuredSlugs.has(c.slug));
  }, [sorted, featuredSlugs, featured.length]);

  function FeaturedHeader() {
    return (
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">FEATURED MARKETS</div>

          <div className="mt-2 text-[22px] font-semibold tracking-tight text-zinc-50 sm:text-[26px]">
            Private intelligence, city by city
          </div>

          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Monaco now joins the flagship set. Explore like a luxury portal, but with signal you can trust.
          </div>

          <div className="mt-3 text-[12px] text-zinc-400">
            Tap a market to open its intelligence - pricing reality, liquidity read and risk flags.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] text-zinc-200/90 backdrop-blur-2xl">
            Top 4
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] text-zinc-400 backdrop-blur-2xl">
            Updated weekly
          </span>
        </div>
      </div>
    );
  }

  // Featured-only mode: no virtualization, no "showing X of Y"
  if (mode === 'featured') {
    return (
      <section className={cx('w-full', className)}>
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_48px_150px_rgba(0,0,0,0.62)] sm:p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[rgba(120,76,255,0.16)] blur-3xl" />
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[rgba(231,201,130,0.12)] blur-3xl" />
            <div className="absolute inset-0 opacity-[0.35] [background:radial-gradient(900px_260px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
          </div>

          <div className="relative">
            <FeaturedHeader />

            {/* Go 1-per-row much earlier:
               - 1 column through lg
               - 2 columns only at xl and above */}
            <div className="relative mt-5 grid gap-4 xl:grid-cols-2">
              {featured.map((city) => {
                const stats = statsByCity?.[city.slug];
                return (
                  <div key={city.slug} className="xl:[&>div]:h-full">
                    <CityCard city={city} stats={stats} variant="wall" showLockedCta={false} />
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

        setCount((c) => {
          const next = Math.min(c + step, rest.length);
          return next;
        });
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
      {/* Featured Markets - editorial / premium (optional in full mode) */}
      {showFeatured && featured.length > 0 ? (
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_48px_150px_rgba(0,0,0,0.62)] sm:p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[rgba(120,76,255,0.16)] blur-3xl" />
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[rgba(231,201,130,0.12)] blur-3xl" />
            <div className="absolute inset-0 opacity-[0.35] [background:radial-gradient(900px_260px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
          </div>

          <div className="relative">
            <FeaturedHeader />

            {/* Go 1-per-row much earlier:
               - 1 column through lg
               - 2 columns only at xl and above */}
            <div className="relative mt-5 grid gap-4 xl:grid-cols-2">
              {featured.map((city) => {
                const stats = statsByCity?.[city.slug];
                return (
                  <div key={city.slug} className="xl:[&>div]:h-full">
                    <CityCard city={city} stats={stats} variant="wall" showLockedCta={false} />
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

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Showing <span className="text-zinc-200">{visible.length}</span> of{' '}
            <span className="text-zinc-200">{rest.length}</span>
          </div>

          {!done ? (
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(c + step, rest.length))}
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

        <div ref={sentinelRef} className="h-px w-full" />
      </div>
    </section>
  );
}
