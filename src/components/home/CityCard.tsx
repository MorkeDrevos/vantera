// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';

import type { City } from './cities';
import SafeImage from '@/components/home/SafeImage';

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
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none transition backdrop-blur-xl';

  const cls =
    tone === 'good'
      ? 'border-emerald-400/18 bg-emerald-500/8 text-emerald-100/95'
      : tone === 'warn'
        ? 'border-white/12 bg-white/[0.04] text-zinc-200/90'
        : tone === 'violet'
          ? 'border-violet-400/18 bg-violet-500/8 text-violet-100/95'
          : 'border-white/10 bg-white/[0.03] text-zinc-200/90';

  return <span className={`${base} ${cls}`}>{label}</span>;
}

export default function CityCard({ city }: { city: City }) {
  const src = city.image?.src?.trim() ?? '';
  const nodeId = `VANTERA:${city.slug.toUpperCase()}`;

  return (
    <Link
      href={`/city/${city.slug}`}
      prefetch
      className={[
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_26px_90px_rgba(0,0,0,0.45)]',
        'transition duration-500 hover:-translate-y-[2px] hover:border-white/18',
        // keyboard focus (premium but obvious)
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
      ].join(' ')}
      aria-label={`Open ${city.name} market node`}
    >
      {/* Premium edge polish + soft aura */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-70" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[185px] w-full sm:h-[215px]">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(city)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={[
              'object-cover opacity-[0.92] transition duration-700',
              'group-hover:opacity-100 group-hover:scale-[1.02]',
              '[filter:contrast(1.06)_saturate(1.04)]',
            ].join(' ')}
            priority={city.slug === 'madrid'}
            fallback={
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            }
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        {/* Cinematic intelligence veil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.86),rgba(0,0,0,0.32),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_30%_0%,rgba(255,255,255,0.08),transparent_55%)]" />

        {/* Header band (premium glass) */}
        <div className="absolute left-4 right-4 top-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.02] to-transparent" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold tracking-tight text-zinc-50">
                  {city.name}
                </div>
                <div className="mt-1 truncate text-xs text-zinc-200/85">
                  {city.country}
                  {city.region ? ` · ${city.region}` : ''}
                </div>
              </div>

              {/* "Enter" jewel - make it feel like a control without being a nested button */}
              <span className="relative mt-0.5 inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] text-zinc-100 shadow-[0_12px_35px_rgba(0,0,0,0.40)] backdrop-blur-xl transition group-hover:border-white/18">
                <span className="pointer-events-none absolute inset-0 opacity-70">
                  <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                </span>
                <span className="relative">Enter</span>
                <span className="relative translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom overlay: credible signals (quiet, premium) */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <TonePill label="Private index" tone="violet" />
          <TonePill label="Signals: warming" />
          <TonePill label="Coverage: expanding" tone="warn" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {city.blurb ? (
          <p className="text-sm leading-relaxed text-zinc-300 line-clamp-2">{city.blurb}</p>
        ) : (
          <p className="text-sm leading-relaxed text-zinc-300">
            A private city surface designed for clarity. Truth layers activate as verified coverage expands.
          </p>
        )}

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* Footer meta: Node ID + path */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-zinc-300/90">
              {nodeId}
            </span>
            <span className="hidden sm:inline text-zinc-500">Private intelligence surface</span>
          </span>

          <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-zinc-400">
            {`/city/${city.slug}`}
          </span>
        </div>
      </div>

      {/* Subtle hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-white/10 transition group-hover:ring-1" />
    </Link>
  );
}
