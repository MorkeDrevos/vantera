// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';

import type { City } from './cities';
import SafeImage from '@/components/home/SafeImage';
import CoverageTierBadge from './CoverageTierBadge';
import { getCoverageTier } from './coverageTiers';

export type CityListingsStats = {
  verifiedCount: number;
  pendingCount?: number;
};

function safeAlt(city: City) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function TonePill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none transition backdrop-blur-2xl';

  const cls =
    tone === 'good'
      ? 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100/95'
      : tone === 'warn'
        ? 'border-amber-400/18 bg-amber-500/10 text-amber-100/95'
        : tone === 'violet'
          ? 'border-violet-400/18 bg-violet-500/10 text-violet-100/95'
          : 'border-white/10 bg-white/[0.04] text-zinc-200/90';

  return <span className={cx(base, cls)}>{label}</span>;
}

function MiniSignal({
  k,
  v,
  tone = 'neutral',
}: {
  k: string;
  v: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const dot =
    tone === 'good'
      ? 'bg-emerald-200/85'
      : tone === 'warn'
        ? 'bg-amber-200/85'
        : tone === 'violet'
          ? 'bg-violet-200/85'
          : 'bg-white/75';

  const border =
    tone === 'good'
      ? 'border-emerald-400/18'
      : tone === 'warn'
        ? 'border-amber-400/18'
        : tone === 'violet'
          ? 'border-violet-400/18'
          : 'border-white/10';

  const bg =
    tone === 'good'
      ? 'bg-emerald-500/10'
      : tone === 'warn'
        ? 'bg-amber-500/10'
        : tone === 'violet'
          ? 'bg-violet-500/10'
          : 'bg-white/[0.04]';

  return (
    <div
      className={cx(
        // min-w-0 + max-w-full prevents pill overflow in tight layouts
        'inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] text-zinc-100/90 backdrop-blur-2xl',
        border,
        bg,
      )}
    >
      <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.08)]', dot)} />
      <span className="shrink-0 text-zinc-300">{k}:</span>
      <span className="min-w-0 truncate text-zinc-100">{v}</span>
    </div>
  );
}

function isIntelligenceActive(city: City) {
  return city.tier === 'TIER_0' || city.tier === 'TIER_1';
}

function deriveCityTruthState(city: City, stats?: CityListingsStats) {
  const verified = stats?.verifiedCount ?? 0;

  if (verified > 0) return 'VERIFIED_ONLY' as const;
  if (isIntelligenceActive(city)) return 'LOCKED' as const;
  return 'WARMING' as const;
}

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

function hashTo01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function deriveSignals(city: City, state: 'VERIFIED_ONLY' | 'LOCKED' | 'WARMING', stats?: CityListingsStats) {
  const r = hashTo01(city.slug);
  const verified = stats?.verifiedCount ?? 0;
  const bias = verified > 0 ? Math.min(1, verified / 12) : 0;

  const heat = clampPct(Math.round(55 + r * 35 + bias * 15));
  const pressure = clampPct(Math.round(35 + (1 - r) * 45 - bias * 10));
  const depth = clampPct(Math.round(45 + r * 40 + bias * 12));

  const heatLabel = heat >= 85 ? 'Hot' : heat >= 70 ? 'Strong' : 'Steady';
  const depthLabel = depth >= 85 ? 'Deep' : depth >= 65 ? 'Good' : 'Thin';
  const pressureLabel = pressure >= 70 ? 'High' : pressure >= 50 ? 'Medium' : 'Low';

  const heatTone = heat >= 85 ? 'violet' : heat >= 70 ? 'good' : 'neutral';
  const depthTone = depth >= 85 ? 'good' : depth >= 65 ? 'neutral' : 'warn';
  const pressureTone = pressure >= 70 ? 'warn' : pressure >= 50 ? 'neutral' : 'good';

  if (state === 'LOCKED') {
    return [
      { k: 'Heat', v: heatLabel, tone: heatTone as any },
      { k: 'Buyer depth', v: depthLabel, tone: depthTone as any },
      { k: 'Price pressure', v: pressureLabel, tone: pressureTone as any },
    ];
  }

  if (state === 'VERIFIED_ONLY') {
    return [
      { k: 'Verified', v: `${verified}`, tone: 'good' as any },
      { k: 'Heat', v: heatLabel, tone: heatTone as any },
      { k: 'Buyer depth', v: depthLabel, tone: depthTone as any },
    ];
  }

  return [
    { k: 'Coverage', v: 'Building', tone: 'neutral' as any },
    { k: 'Heat', v: heatLabel, tone: heatTone as any },
    { k: 'Signals', v: 'Warming', tone: 'neutral' as any },
  ];
}

export default function CityCard({
  city,
  stats,
  variant = 'default',
  showLockedCta = true,
}: {
  city: City;
  stats?: CityListingsStats;
  variant?: 'default' | 'wall';
  showLockedCta?: boolean;
}) {
  const src = city.image?.src?.trim() ?? '';
  const tier = getCoverageTier(city);
  const state = deriveCityTruthState(city, stats);

  const statePills =
    state === 'VERIFIED_ONLY'
      ? [
          <TonePill key="v1" label="Verified homes" tone="good" />,
          <TonePill key="v2" label={`Live: ${stats?.verifiedCount ?? 0}`} tone="neutral" />,
        ]
      : state === 'LOCKED'
        ? [<TonePill key="l1" label="Intelligence on" tone="violet" />, <TonePill key="l2" label="Homes locked" tone="warn" />]
        : [<TonePill key="w1" label="New city" tone="neutral" />, <TonePill key="w2" label="Signals warming" tone="neutral" />];

  const signals = deriveSignals(city, state, stats);

  const friendlyBlurb =
    city.blurb?.trim() ||
    (state === 'VERIFIED_ONLY'
      ? 'See verified homes only, with clear signals and fewer surprises.'
      : state === 'LOCKED'
        ? 'Explore the city intelligence now. Homes unlock as verified supply lands.'
        : 'We’re building coverage here. The intelligence gets sharper every week.');

  const isWall = variant === 'wall';

  return (
    <div className="group relative min-w-0">
      <Link
        href={`/city/${city.slug}`}
        prefetch
        className={cx(
          // min-w-0 is the #1 fix for grid overflow on smaller breakpoints
          'group relative block min-w-0 overflow-hidden rounded-[28px] border border-white/10',
          isWall ? 'bg-black/25' : 'bg-white/[0.03]',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_34px_120px_rgba(0,0,0,0.55)]',
          'transition duration-500 hover:-translate-y-[2px] hover:border-white/18',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        )}
        aria-label={`Open ${city.name} intelligence`}
      >
        {/* Premium edge polish + aura */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent opacity-80" />
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.12)] blur-3xl" />
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(231,201,130,0.10)] blur-3xl" />
          </div>
        </div>

        {/* Image */}
        <div className={cx('relative w-full', isWall ? 'h-[240px] sm:h-[260px]' : 'h-[205px] sm:h-[235px]')}>
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(city)}
              fill
              sizes={isWall ? '(max-width: 1024px) 100vw, 520px' : '(max-width: 768px) 100vw, 33vw'}
              className={cx(
                'object-cover opacity-[0.96] transition duration-700',
                'group-hover:opacity-100 group-hover:scale-[1.02]',
                '[filter:contrast(1.06)_saturate(1.06)]',
              )}
              // Miami is now the flagship
              priority={city.slug === 'miami'}
              fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          )}

          {/* Cinematic veils - reduced so images show */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.22),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_30%_0%,rgba(255,255,255,0.09),transparent_56%)]" />

          {/* Top right: tier */}
          <div className="absolute right-4 top-4">
            <CoverageTierBadge tier={tier} />
          </div>

          {/* Title + micro metadata */}
          <div className="absolute left-4 right-4 top-4">
            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.03] to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
              </div>

              <div className="relative flex items-start justify-between gap-3">
                {/* Left text block must be flex-1 + min-w-0 to prevent overflow */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold tracking-tight text-zinc-50">{city.name}</div>
                  <div className="mt-1 truncate text-xs text-zinc-200/85">
                    {city.country}
                    {city.region ? ` · ${city.region}` : ''}
                  </div>
                </div>

                {/* Button stays compact and never pushes layout wider */}
                <span className="relative mt-0.5 inline-flex shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] text-zinc-100 shadow-[0_14px_40px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition group-hover:border-white/18">
                  <span className="pointer-events-none absolute inset-0 opacity-70">
                    <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </span>
                  <span className="relative">Enter</span>
                  <span className="relative translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
                    →
                  </span>
                </span>
              </div>

              {/* Micro signals row */}
              <div className="relative mt-3 flex flex-wrap gap-2">
                {signals.map((s) => (
                  <MiniSignal key={`${city.slug}:${s.k}`} k={s.k} v={s.v} tone={s.tone} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom overlay: state pills */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">{statePills}</div>
        </div>

        {/* Body */}
        <div className={cx('p-5', isWall && 'pt-4')}>
          <p className={cx('text-sm leading-relaxed text-zinc-300', 'line-clamp-2')}>{friendlyBlurb}</p>

          {!isWall ? (
            <>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
              <div className="mt-4 flex min-w-0 items-center justify-between gap-2 text-xs text-zinc-400">
                <span className="text-zinc-500">Private city intelligence</span>
                <span className="min-w-0 max-w-[55%] truncate rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-zinc-400">
                  {`/city/${city.slug}`}
                </span>
              </div>
            </>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-0 ring-white/10 transition group-hover:ring-1" />
      </Link>

      {/* LOCKED CTA - optional */}
      {showLockedCta && state === 'LOCKED' ? (
        <div className="mt-3">
          <Link
            href={`/sell?city=${encodeURIComponent(city.slug)}`}
            className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold tracking-[0.14em] text-zinc-100 transition hover:bg-white/[0.06] hover:border-white/14"
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.14)] blur-3xl" />
            </span>
            <span className="relative">Publish verified listing</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
