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
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-2xl';

  const cls =
    tone === 'good'
      ? 'border-emerald-300/22 bg-emerald-500/10 text-emerald-100/95'
      : tone === 'warn'
        ? 'border-amber-300/22 bg-amber-500/10 text-amber-100/95'
        : tone === 'violet'
          ? 'border-violet-300/22 bg-violet-500/12 text-violet-100/95'
          : 'border-white/12 bg-white/[0.05] text-zinc-200/90';

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
      ? 'border-emerald-300/22'
      : tone === 'warn'
        ? 'border-amber-300/22'
        : tone === 'violet'
          ? 'border-violet-300/22'
          : 'border-white/12';

  const bg =
    tone === 'good'
      ? 'bg-emerald-500/10'
      : tone === 'warn'
        ? 'bg-amber-500/10'
        : tone === 'violet'
          ? 'bg-violet-500/12'
          : 'bg-white/[0.05]';

  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] text-zinc-100/90 backdrop-blur-2xl',
        border,
        bg,
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.08)]', dot)} />
      <span className="text-zinc-300">{k}:</span>
      <span className="text-zinc-100">{v}</span>
    </div>
  );
}

function isIntelligenceActive(city: City) {
  // Phase 1 heuristic: Tier 0/1 cities behave as “intelligence active”
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
  // Stable pseudo-random 0..1 from slug (no runtime randomness)
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function deriveSignals(
  city: City,
  state: 'VERIFIED_ONLY' | 'LOCKED' | 'WARMING',
  stats?: CityListingsStats,
) {
  const r = hashTo01(city.slug);

  // Use verified count to bias signals when we have it.
  const verified = stats?.verifiedCount ?? 0;
  const bias = verified > 0 ? Math.min(1, verified / 12) : 0;

  const heat = clampPct(Math.round(55 + r * 35 + bias * 15)); // 55-100
  const pressure = clampPct(Math.round(35 + (1 - r) * 45 - bias * 10)); // 25-80
  const depth = clampPct(Math.round(45 + r * 40 + bias * 12)); // 45-97

  const heatLabel = heat >= 85 ? 'Hot' : heat >= 70 ? 'Strong' : 'Steady';
  const depthLabel = depth >= 85 ? 'Deep' : depth >= 65 ? 'Good' : 'Thin';
  const pressureLabel = pressure >= 70 ? 'High' : pressure >= 50 ? 'Medium' : 'Low';

  // Tone: luxury + readable
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
  const nodeId = `VANTERA:${city.slug.toUpperCase()}`;
  const tier = getCoverageTier(city);

  const state = deriveCityTruthState(city, stats);
  const signals = deriveSignals(city, state, stats);

  const statePills =
    state === 'VERIFIED_ONLY'
      ? [
          <TonePill key="v1" label="Verified homes" tone="good" />,
          <TonePill key="v2" label={`Live: ${stats?.verifiedCount ?? 0}`} tone="neutral" />,
        ]
      : state === 'LOCKED'
        ? [<TonePill key="l1" label="Intelligence on" tone="violet" />, <TonePill key="l2" label="Homes locked" tone="warn" />]
        : [<TonePill key="w1" label="New city" tone="neutral" />, <TonePill key="w2" label="Signals warming" tone="neutral" />];

  const friendlyBlurb =
    city.blurb?.trim() ||
    (state === 'VERIFIED_ONLY'
      ? 'See verified homes only, with clear signals and fewer surprises.'
      : state === 'LOCKED'
        ? 'Explore the city intelligence now. Homes unlock as verified supply lands.'
        : 'We’re building coverage here. The intelligence gets sharper every week.');

  return (
    <div className="group relative">
      <Link
        href={`/city/${city.slug}`}
        prefetch
        className={cx(
          'relative block overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02]',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_34px_120px_rgba(0,0,0,0.60)]',
          'transition duration-500 hover:-translate-y-[3px] hover:border-white/18',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        )}
        aria-label={`Open ${city.name} intelligence`}
      >
        {/* Royal edge + faint aura (no heavy glass slabs over the image) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/25 to-transparent opacity-80" />
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[rgba(120,76,255,0.14)] blur-3xl" />
            <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[rgba(231,201,130,0.10)] blur-3xl" />
          </div>
        </div>

        {/* MEDIA (image-first) */}
        <div className="relative h-[260px] w-full sm:h-[290px]">
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(city)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={cx(
                'object-cover opacity-[0.98] transition duration-700',
                'group-hover:scale-[1.05]',
                '[filter:contrast(1.06)_saturate(1.08)]',
              )}
              priority={city.slug === 'marbella'}
              fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          )}

          {/* Cinematic optics - subtle, not blocking */}
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_420px_at_50%_-10%,rgba(255,255,255,0.16),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.30] [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_62%)]" />
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_520px_at_50%_75%,transparent_35%,rgba(0,0,0,0.55)_85%)]" />

          {/* Top row: tier + small state (kept light) */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <CoverageTierBadge tier={tier} />
            <div className="hidden sm:flex items-center gap-2">
              {state === 'VERIFIED_ONLY' ? <TonePill label="Verified" tone="good" /> : null}
              {state === 'LOCKED' ? <TonePill label="Intelligence" tone="violet" /> : null}
              {state === 'WARMING' ? <TonePill label="Tracking" tone="neutral" /> : null}
            </div>
          </div>

          {/* Bottom scrim: this is the luxury portal move */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="pointer-events-none absolute inset-0 h-[62%] bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="relative px-5 pb-5 pt-10">
              {/* Title row */}
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[18px] font-semibold tracking-tight text-zinc-50 sm:text-[19px]">
                    {city.name}
                  </div>
                  <div className="mt-1 truncate text-[12px] text-zinc-200/85">
                    {city.country}
                    {city.region ? ` · ${city.region}` : ''}
                  </div>
                </div>

                {/* Enter pill (small, premium) */}
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11px] text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition group-hover:border-white/20">
                  <span className="opacity-90">Enter</span>
                  <span className="translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
                    →
                  </span>
                </span>
              </div>

              {/* Signals (kept in scrim, not on the image mid) */}
              <div className="mt-3 flex flex-wrap gap-2">
                {signals.map((s) => (
                  <MiniSignal key={`${city.slug}:${s.k}`} k={s.k} v={s.v} tone={s.tone} />
                ))}
              </div>

              {/* State pills (only here on mobile - clean) */}
              <div className="mt-3 flex flex-wrap gap-2 sm:hidden">{statePills}</div>
            </div>
          </div>
        </div>

        {/* BODY (short, luxury) */}
        <div className="p-5">
          <p className="text-sm leading-relaxed text-zinc-300 line-clamp-2">{friendlyBlurb}</p>

          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-zinc-300/90">
                {nodeId}
              </span>
              <span className="hidden sm:inline text-zinc-500">Private city intelligence</span>
            </span>

            <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-zinc-400">
              {`/city/${city.slug}`}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-0 ring-white/10 transition group-hover:ring-1" />
      </Link>

      {/* Locked CTA (outside Link) - now looks “luxury / verified” */}
      {state === 'LOCKED' ? (
        <div className="mt-3">
          <Link
            href={`/sell?city=${encodeURIComponent(city.slug)}`}
            className={cx(
              'relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10',
              'bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-3',
              'text-xs font-semibold tracking-[0.14em] text-zinc-100 transition',
              'hover:border-white/16 hover:bg-white/[0.06]',
            )}
          >
            <span className="pointer-events-none absolute inset-0 opacity-[0.85]">
              <span className="absolute inset-0 bg-[radial-gradient(700px_220px_at_50%_0%,rgba(231,201,130,0.16),transparent_60%)]" />
              <span className="absolute inset-0 bg-[radial-gradient(700px_220px_at_85%_10%,rgba(120,76,255,0.14),transparent_60%)]" />
            </span>
            <span className="relative">Publish verified listing</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
