// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';

import type { City } from './cities';
import SafeImage from './SafeImage';

function safeAlt(city: City) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

function TonePill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none transition';

  const cls =
    tone === 'good'
      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
      : tone === 'warn'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : tone === 'violet'
          ? 'border-violet-400/20 bg-violet-500/10 text-violet-100'
          : 'border-white/10 bg-white/5 text-zinc-200';

  return <span className={`${base} ${cls}`}>{label}</span>;
}

export default function CityCard({ city }: { city: City }) {
  const src = city.image?.src?.trim() ?? '';
  const nodeId = `LOCUS:${city.slug.toUpperCase()}`;

  return (
    <Link
      href={`/city/${city.slug}`}
      prefetch
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
      aria-label={`Open ${city.name} market node`}
    >
      {/* Premium “sheen” + edge glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_30%_-10%,rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),transparent_45%,rgba(139,92,246,0.12))]" />
      </div>

      {/* Image */}
      <div className="relative h-[175px] w-full sm:h-[205px]">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(city)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            priority={city.slug === 'madrid'}
            fallback={
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            }
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        {/* Intelligence veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        {/* Top overlay: Market Node identity */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold tracking-tight text-zinc-50">
              {city.name}
            </div>
            <div className="mt-1 truncate text-xs text-zinc-300/90">
              {city.country}
              {city.region ? ` · ${city.region}` : ''}
            </div>
          </div>

          <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200 transition group-hover:border-white/20">
            <span>Enter</span>
            <span className="translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
              →
            </span>
          </span>
        </div>

        {/* Bottom overlay: Signal hint (no fake data) */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <TonePill label="Market node" tone="violet" />
          <TonePill label="Signals: initializing" />
          <TonePill label="Liquidity model: pending" tone="warn" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {city.blurb ? (
          <p className="text-sm leading-relaxed text-zinc-300 line-clamp-2">
            {city.blurb}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-zinc-300">
            A live market surface. Truth layers activate as data coverage expands.
          </p>
        )}

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-white/10" />

        {/* Footer meta: replace route flex with Node ID + path */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono">
              {nodeId}
            </span>
            <span className="hidden sm:inline text-zinc-500">Truth lab surface</span>
          </span>

          <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-zinc-400">
            {`/city/${city.slug}`}
          </span>
        </div>
      </div>

      {/* Subtle hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-white/10 transition group-hover:ring-1" />
    </Link>
  );
}
