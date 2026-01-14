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
        'group relative overflow-hidden rounded-full px-4 py-2 text-left transition',
        'ring-1 ring-inset',
        active
          ? 'bg-white/[0.08] ring-white/14'
          : 'bg-white/[0.03] ring-white/10 hover:bg-white/[0.07] hover:ring-white/14',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(420px_120px_at_30%_10%,rgba(231,201,130,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(420px_120px_at_80%_0%,rgba(120,76,255,0.14),transparent_62%)]" />
      </div>

      <div className="relative">
        <div className="text-[12px] text-zinc-100">{label}</div>
        <div className="mt-0.5 text-[11px] text-zinc-500">{sub}</div>
      </div>
    </button>
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
        label: 'where quiet money is accumulating',
        sub: 'low noise, high signal',
      },
      {
        id: 'low-noise-prime' as const,
        label: 'low-noise prime markets',
        sub: 'clean demand structure',
      },
      {
        id: 'ahead-of-cycle' as const,
        label: 'cities ahead of the cycle',
        sub: 'early momentum, disciplined',
      },
      {
        id: 'verification-strong' as const,
        label: 'where verification is strong',
        sub: 'truth-first coverage',
      },
      {
        id: 'liquidity-building' as const,
        label: 'where liquidity is building',
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

    const top = pickDistinctTimezones(
      scored.map((x) => x.c),
      defaultTop,
    );

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
      {/* Crown line for this module */}
      <div aria-hidden className="pointer-events-none absolute -top-3 inset-x-0">
        <div className="mx-auto h-px w-[78%] bg-gradient-to-r from-transparent via-[#E7C982]/22 to-transparent" />
      </div>

      {/* Prompt surface */}
      <div
        className={cx(
          'relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]',
          'shadow-[0_34px_110px_rgba(0,0,0,0.62)]',
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_22%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.12),transparent_60%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
        </div>

        <div className="relative p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 opacity-80" />
                <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-300">SHOW ME</div>
              </div>

              <div className="mt-2 text-sm text-zinc-300">
                Pick an intent. Vantera re-weights markets and shows the smartest next move.
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-zinc-300 sm:inline-flex">
              Press <span className="font-mono text-zinc-100">/</span> for city search
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
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
              'mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[12px] text-zinc-300 transition',
              mode === 'response' ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            aria-hidden={mode !== 'response'}
          >
            Re-weighting markets based on intent. Signal over noise.
          </div>

          {/* Response mode tiles */}
          <div
            className={cx(
              'mt-4 grid gap-3 transition',
              mode === 'response' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none',
              'sm:grid-cols-2',
            )}
            aria-hidden={mode !== 'response'}
          >
            {ranked.topWithScore.map(({ city, score01 }) => (
              <div
                key={city.slug}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition hover:bg-white/[0.03] hover:border-white/14"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(420px_140px_at_25%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(420px_140px_at_90%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
                </div>

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-100">{city.name}</div>
                    <div className="truncate text-[11px] text-zinc-500">
                      {city.country}
                      {city.region ? ` · ${city.region}` : ''}
                    </div>
                  </div>

                  <Link
                    href={`/city/${city.slug}`}
                    prefetch
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-white/[0.07] hover:border-white/14 transition"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                </div>

                <div className="relative mt-3">
                  <ScoreBar score01={score01} />
                </div>

                <div className="relative mt-3 text-[12px] text-zinc-300">
                  {city.blurb ? city.blurb : 'Private index coverage with truth-first emphasis.'}
                </div>

                <div className="relative mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-200">
                    {city.tier ?? 'TIER'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-zinc-300">
                    {city.status ?? 'STATUS'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-zinc-400">
                    {city.tz}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {mode === 'response' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] text-zinc-200 hover:bg-white/[0.07] hover:border-white/14 transition"
                >
                  Reset intent
                </button>

                <a
                  href={`#${onKeepScanningId}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[12px] text-zinc-200 hover:bg-white/[0.07] hover:border-white/14 transition"
                >
                  Keep scanning <ArrowRight className="h-4 w-4 opacity-80" />
                </a>
              </>
            ) : (
              <div className="text-[12px] text-zinc-500">
                You can still search cities, but the default is intent-first discovery.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
