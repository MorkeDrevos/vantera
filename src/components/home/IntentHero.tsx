// src/components/home/IntentHero.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

type RuntimeCityLite = {
  slug: string;
  name: string;
  country: string;
  region?: string | null;
  tz: string;
  tier?: string | null;
  status?: string | null;
  priority?: number | null;
  blurb?: string | null;
  image?: { src: string; alt?: string | null } | null;
};

type IntentId =
  | 'quiet-accumulation'
  | 'low-noise-prime'
  | 'ahead-of-cycle'
  | 'verification-strong'
  | 'liquidity-building';

const TIER_WEIGHT: Record<string, number> = {
  TIER_0: 1.25,
  TIER_1: 1.12,
  TIER_2: 1.04,
  TIER_3: 0.98,
};

const STATUS_WEIGHT: Record<string, number> = {
  LIVE: 1.08,
  TRACKING: 1.03,
  EXPANDING: 1.0,
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function computeBaseScore(c: RuntimeCityLite) {
  const p = c.priority ?? 0;
  const tier = c.tier ?? '';
  const status = c.status ?? '';
  const tw = TIER_WEIGHT[tier] ?? 1.0;
  const sw = STATUS_WEIGHT[status] ?? 1.0;

  // Base: priority drives relevance, tier/status refine confidence
  return p * tw * sw;
}

function intentBonus(id: IntentId, c: RuntimeCityLite) {
  const slug = normalize(c.slug);
  const country = normalize(c.country);
  const region = normalize(c.region ?? '');

  // IMPORTANT: v1 is heuristics based on your current schema (tier/status/priority/region)
  // Later, we swap these bonuses for real signal metrics.
  if (id === 'quiet-accumulation') {
    let b = 0;
    if (slug === 'monaco') b += 18;
    if (slug === 'london') b += 10;
    if (slug === 'new-york') b += 8;
    if (country === 'switzerland') b += 10;
    if (region === 'europe') b += 4;
    return b;
  }

  if (id === 'low-noise-prime') {
    let b = 0;
    if (slug === 'monaco') b += 16;
    if (slug === 'benahavis') b += 12;
    if (slug === 'marbella') b += 10;
    if (country === 'monaco') b += 10;
    if (region === 'europe') b += 5;
    return b;
  }

  if (id === 'ahead-of-cycle') {
    let b = 0;
    if (slug === 'dubai') b += 16;
    if (slug === 'miami') b += 12;
    if (slug === 'london') b += 8;
    if (region === 'middle east') b += 8;
    if (country === 'united arab emirates') b += 8;
    return b;
  }

  if (id === 'verification-strong') {
    let b = 0;
    const tier = c.tier ?? '';
    if (tier === 'TIER_0') b += 14;
    if (tier === 'TIER_1') b += 10;
    if (slug === 'monaco') b += 8;
    if (slug === 'new-york') b += 6;
    if (slug === 'london') b += 6;
    return b;
  }

  // liquidity-building
  {
    let b = 0;
    if (slug === 'miami') b += 18;
    if (slug === 'new-york') b += 14;
    if (slug === 'dubai') b += 10;
    if (region === 'north america') b += 6;
    return b;
  }
}

function pickDistinctTimezones(input: RuntimeCityLite[], max: number) {
  const out: RuntimeCityLite[] = [];
  const used = new Set<string>();
  for (const c of input) {
    const tz = c.tz || '';
    if (!tz) continue;
    if (used.has(tz)) continue;
    used.add(tz);
    out.push(c);
    if (out.length >= max) break;
  }
  return out;
}

function ScoreBar({ score01 }: { score01: number }) {
  const w = clamp(score01, 0, 1) * 100;
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgba(231,201,130,0.85),rgba(255,255,255,0.55),rgba(120,76,255,0.70))]"
        style={{ width: `${w}%` }}
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function IntentChip({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative overflow-hidden rounded-2xl px-4 py-2.5 text-left transition',
        'border backdrop-blur-xl',
        active
          ? 'border-white/18 bg-white/[0.06] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-white/16 hover:bg-white/[0.05]',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_86%_10%,rgba(120,76,255,0.12),transparent_62%)]" />
      </div>

      <div className="relative">
        <div className="text-[12px] leading-none text-zinc-100/95">{label}</div>
        <div className="mt-1 text-[11px] leading-none text-zinc-400">{sub}</div>
      </div>
    </button>
  );
}

function Token({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-200/90">
      {children}
    </span>
  );
}

export default function IntentHero({
  cities,
  defaultTop = 6,
  onKeepScanningId = 'explore-index',
}: {
  cities: RuntimeCityLite[];
  defaultTop?: number;
  onKeepScanningId?: string;
}) {
  const [active, setActive] = useState<IntentId | null>(null);

  const intents = useMemo(
    () => [
      {
        id: 'quiet-accumulation' as const,
        label: 'Quiet accumulation',
        sub: 'low noise, high signal',
      },
      {
        id: 'low-noise-prime' as const,
        label: 'Low-noise prime',
        sub: 'clean demand structure',
      },
      {
        id: 'ahead-of-cycle' as const,
        label: 'Ahead of cycle',
        sub: 'early momentum, disciplined',
      },
      {
        id: 'verification-strong' as const,
        label: 'Verification strong',
        sub: 'truth-first coverage',
      },
      {
        id: 'liquidity-building' as const,
        label: 'Liquidity building',
        sub: 'velocity-led signals',
      },
    ],
    [],
  );

  const ranked = useMemo(() => {
    const id = active ?? 'quiet-accumulation';
    const scored = (cities ?? [])
      .map((c) => {
        const base = computeBaseScore(c);
        const bonus = intentBonus(id, c);
        return { c, score: base + bonus };
      })
      .sort((a, b) => b.score - a.score);

    const top = pickDistinctTimezones(scored.map((x) => x.c), defaultTop);

    const maxScore = scored.length ? scored[0].score : 1;
    const minScore = scored.length ? scored[Math.min(scored.length - 1, 8)].score : 0;

    const to01 = (s: number) => {
      const den = Math.max(1, maxScore - minScore);
      return clamp((s - minScore) / den, 0, 1);
    };

    const topWithScore = top.map((city) => {
      const row = scored.find((x) => x.c.slug === city.slug);
      return { city, score: row?.score ?? 0, score01: to01(row?.score ?? 0) };
    });

    return { id, topWithScore };
  }, [cities, active, defaultTop]);

  const mode: 'idle' | 'response' = active ? 'response' : 'idle';

  return (
    <div className="relative">
      {/* Crown line */}
      <div aria-hidden className="pointer-events-none absolute -top-4 inset-x-0">
        <div className="mx-auto h-px w-[86%] bg-gradient-to-r from-transparent via-[#E7C982]/26 to-transparent" />
        <div className="mx-auto mt-2 h-px w-[72%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Intelligence slab */}
      <div
        className={cx(
          'relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]',
          'shadow-[0_42px_150px_rgba(0,0,0,0.70),inset_0_1px_0_rgba(255,255,255,0.06)]',
        )}
      >
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_18%_-10%,rgba(255,255,255,0.07),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_86%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 opacity-80" />
                <div className="text-[11px] font-semibold tracking-[0.30em] text-zinc-200/70">
                  INTENT
                </div>
              </div>

              {/* colder copy */}
              <div className="mt-2 text-[14px] leading-relaxed text-zinc-300/90">
                Select a mandate. Vantera re-weights markets and surfaces the next
                highest-probability path.
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-2 text-[11px] text-zinc-300 sm:inline-flex">
              Press <span className="font-mono text-zinc-100">/</span> for city search
            </div>
          </div>

          {/* Intent chips - more “console” */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {intents.map((i) => (
              <IntentChip
                key={i.id}
                label={i.label}
                sub={i.sub}
                active={active === i.id}
                onClick={() => setActive(i.id)}
              />
            ))}
          </div>

          {/* System line */}
          <div
            className={cx(
              'mt-5 rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-[12px] text-zinc-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition',
              mode === 'response' ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            aria-hidden={mode !== 'response'}
          >
            Re-weighting coverage against selected mandate. Output is signal-first and evidence-scored.
          </div>

          {/* Results tiles */}
          <div
            className={cx(
              'mt-5 grid gap-3 transition',
              mode === 'response'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-1 pointer-events-none',
              'sm:grid-cols-2',
            )}
            aria-hidden={mode !== 'response'}
          >
            {ranked.topWithScore.map(({ city, score01 }) => (
              <div
                key={city.slug}
                className={cx(
                  'group relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-5',
                  'shadow-[0_28px_110px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]',
                  'transition hover:bg-white/[0.04] hover:border-white/16',
                )}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(560px_180px_at_18%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(560px_180px_at_86%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
                </div>

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-zinc-100">
                      {city.name}
                    </div>
                    <div className="truncate text-[11px] text-zinc-500">
                      {city.country}
                      {city.region ? ` · ${city.region}` : ''}
                    </div>
                  </div>

                  <Link
                    href={`/city/${city.slug}`}
                    prefetch
                    className={cx(
                      'inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-[11px]',
                      'border border-white/10 bg-white/[0.03] text-zinc-200',
                      'transition hover:bg-white/[0.07] hover:border-white/16',
                    )}
                  >
                    Open <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                </div>

                <div className="relative mt-4">
                  <ScoreBar score01={score01} />
                </div>

                <div className="relative mt-3 text-[12px] leading-relaxed text-zinc-300/90">
                  {city.blurb ? city.blurb : 'Private index coverage with truth-first emphasis.'}
                </div>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  <Token>{city.tier ?? 'TIER'}</Token>
                  <Token>{city.status ?? 'STATUS'}</Token>
                  <Token>{city.tz}</Token>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {mode === 'response' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[12px]',
                    'border border-white/10 bg-white/[0.03] text-zinc-200',
                    'transition hover:bg-white/[0.07] hover:border-white/16',
                  )}
                >
                  Reset
                </button>

                <a
                  href={`#${onKeepScanningId}`}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[12px]',
                    'border border-white/10 bg-black/30 text-zinc-200',
                    'transition hover:bg-white/[0.07] hover:border-white/16',
                  )}
                >
                  Keep scanning <ArrowRight className="h-4 w-4 opacity-80" />
                </a>

                <div className="ml-auto hidden lg:flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[12px] text-zinc-300/80">
                  Output is indicative. Proof expands with coverage.
                </div>
              </>
            ) : (
              <div className="text-[12px] text-zinc-500">
                Default mode is intent-first discovery. Direct city search is available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
