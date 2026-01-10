// src/components/home/ExploreGrid.tsx
'use client';

import CityCard from './CityCard';
import { CITIES } from './cities';

export default function ExploreGrid() {
  return (
    <section className="relative">
      {/* Section header */}
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
            EXPLORE THE INDEX
          </div>
          <div className="mt-2 h-px w-32 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
          {CITIES.length} cities tracked
        </span>
      </div>

      {/* Grid surface */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.06),transparent_60%)]" />
        </div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
