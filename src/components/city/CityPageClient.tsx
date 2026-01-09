// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';

import type { City } from './cities';
import SafeImage from './SafeImage';

function safeAlt(city: City) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

export default function CityCard({ city }: { city: City }) {
  const src = city.image?.src?.trim() ?? '';

  return (
    <Link
      href={`/city/${city.slug}`}
      prefetch
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
    >
      {/* premium “sheen” + edge glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_30%_-10%,rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,215,128,0.10),transparent_45%,rgba(168,85,247,0.10))]" />
      </div>

      <div className="relative h-[175px] w-full sm:h-[200px]">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(city)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            priority={city.slug === 'madrid'}
            fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold tracking-tight text-zinc-50">
              {city.name}
            </div>
            <div className="mt-1 truncate text-xs text-zinc-400">
              {city.country}
              {city.region ? ` · ${city.region}` : ''}
            </div>
          </div>

          <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200 transition group-hover:border-white/20">
            <span>Open</span>
            <span className="translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">→</span>
          </span>
        </div>

        {city.blurb ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-300">
            {city.blurb}
          </p>
        ) : null}

        <div className="mt-4 h-px w-full bg-white/10" />
        <div className="mt-4 text-xs text-zinc-400">
          <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono">
            {`/city/${city.slug}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
