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
      ? 'border-emerald-300/18 bg-emerald-500/10 text-emerald-50/90'
      : tone === 'warn'
        ? 'border-amber-300/18 bg-amber-500/10 text-amber-50/90'
        : tone === 'violet'
          ? 'border-violet-300/18 bg-violet-500/10 text-violet-50/90'
          : 'border-white/10 bg-white/[0.04] text-zinc-100/85';

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
      ? 'bg-emerald-200/90'
      : tone === 'warn'
        ? 'bg-amber-200/90'
        : tone === 'violet'
          ? 'bg-violet-200/90'
          : 'bg-white/80';

  const border =
    tone === 'good'
      ? 'border-emerald-300/18'
      : tone === 'warn'
        ? 'border-amber-300/18'
        : tone === 'violet'
          ? 'border-violet-300/18'
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
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] text-zinc-50/90 backdrop-blur-2xl',
        border,
        bg,
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.08)]', dot)} />
      <span className="text-zinc-200/80">{k}:</span>
      <span className="text-zinc-50/95">{v}</span>
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

export default function CityCard({ city, stats }: { city: City; stats?: CityListingsStats }) {
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

  return (
    <Link
      href={`/city/${city.slug}`}
      prefetch
      className={cx(
        'group relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_34px_120px_rgba(0,0,0,0.55)]',
        'transition duration-500 hover:-translate-y-[3px] hover:border-white/18',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
      )}
      aria-label={`Open ${city.name} intelligence`}
    >
      {/* Premium edge polish */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-80" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
        </div>
      </div>

      {/* Image (make it the hero) */}
      <div className="relative aspect-[16/10] w-full">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(city)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={cx(
              'object-cover opacity-[0.96] transition duration-700',
              'group-hover:opacity-100 group-hover:scale-[1.03]',
              '[filter:contrast(1.08)_saturate(1.06)]',
            )}
            priority={city.slug === 'madrid'}
            fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        {/* Cinematic veils */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_35%_0%,rgba(255,255,255,0.12),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.30),transparent)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.65)_1px,transparent_0)] [background-size:22px_22px]" />

        {/* Tier badge */}
        <div className="absolute right-4 top-4">
          <CoverageTierBadge tier={tier} />
        </div>

        {/* Signals (small + high, so they don't block the photo) */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 pr-20">
          {signals.slice(0, 2).map((s) => (
            <MiniSignal key={`${city.slug}:${s.k}`} k={s.k} v={s.v} tone={s.tone} />
          ))}
        </div>

        {/* Bottom: cinematic caption (THIS is the luxury feel) */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.03] to-transparent" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            </div>

            <div className="relative flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[16px] font-semibold tracking-tight text-zinc-50 sm:text-[17px]">
                  {city.name}
                </div>
                <div className="mt-1 truncate text-xs text-zinc-200/80">
                  {city.country}
                  {city.region ? ` · ${city.region}` : ''}
                </div>
              </div>

              {/* Enter (subtle, not a buttony prototype) */}
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] text-zinc-100 shadow-[0_14px_40px_rgba(0,0,0,0.42)] transition group-hover:border-white/18">
                <span className="relative">Enter</span>
                <span className="relative translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
                  →
                </span>
              </span>
            </div>

            {/* State pills (kept, but now they sit inside the caption) */}
            <div className="relative mt-3 flex flex-wrap gap-2">{statePills}</div>
          </div>
        </div>
      </div>

      {/* Body (clean, minimal - no “private city intelligence”, no node IDs, no paths) */}
      <div className="p-5">
        <p className="text-sm leading-relaxed text-zinc-300 line-clamp-2">{friendlyBlurb}</p>

        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-400">
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] text-zinc-300">
            Vantera index
          </span>
          <span className="text-zinc-500">Open intelligence →</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-0 ring-white/10 transition group-hover:ring-1" />
    </Link>
  );
}
