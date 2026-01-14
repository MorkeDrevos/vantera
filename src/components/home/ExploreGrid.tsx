// src/components/home/ExploreGrid.tsx
'use client';

import { useMemo } from 'react';

import CityCard from './CityCard';
import { CITIES } from './cities';

const SELECTED_CITY_SLUGS = ['miami', 'dubai', 'london', 'new-york'] as const;

export default function ExploreGrid() {
  const selectedCities = useMemo(() => {
    const bySlug = new Map(CITIES.map((c) => [c.slug, c]));
    const picked = SELECTED_CITY_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean);

    // Fallback: if a slug is missing for any reason, fill from top priority cities
    if (picked.length < 4) {
      const already = new Set(picked.map((c) => c!.slug));
      const fill = [...CITIES]
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
        .filter((c) => !already.has(c.slug))
        .slice(0, 4 - picked.length);

      return [...picked, ...fill] as typeof CITIES;
    }

    return picked as typeof CITIES;
  }, []);

  return (
    <section className="relative">
      {/* Section header */}
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">SELECTED CITIES</div>
          <div className="mt-2 h-px w-32 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
          Private index
        </span>
      </div>

      {/* Grid surface */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.06),transparent_60%)]" />
        </div>

        {/* 
          Responsive behavior:
          - Mobile: 1 column (no overflow)
          - sm+: 2 columns (2x2 for the selected four)
          - lg+: stays 2 columns (prevents awkward 3-col squeeze)
        */}
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {selectedCities.map((city) => (
            <div key={city.slug} className="min-w-0">
              <CityCard city={city} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
