// src/components/home/IntentHero.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Globe, TrendingUp } from 'lucide-react';

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
  return p * tw * sw;
}

function intentBonus(id: IntentId, c: RuntimeCityLite) {
  const slug = normalize(c.slug);
  const country = normalize(c.country);
  const region = normalize(c.region ?? '');

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

function formatTier(tier?: string | null) {
  if (!tier) return 'TIER';
  return tier.replace('TIER_', 'T');
}

function formatStatus(status?: string | null) {
  if (!status) return 'TRACKING';
  return status;
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'gold' | 'violet';
}) {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-2xl';

  const cls =
    tone === 'gold'
      ? 'border-[#E7C982]/25 bg-[#E7C982]/[0.08] text-[#F3E3B8]'
      : tone === 'violet'
        ? 'border-[rgba(120,76,255,0.22)] bg-[rgba(120,76,255,0.10)] text-[rgba(230,220,255,0.92)]'
        : 'border-white/10 bg-white/[0.04] text-zinc-200/90';

  return <span className={cx(base, cls)}>{children}</span>;
}

function IntentPill({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative w-full overflow-hidden rounded-3xl border px-4 py-3 text-left transition',
        'backdrop-blur-2xl',
        active
          ? 'border-white/16 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'
          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/14',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_18%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_86%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className={cx('text-[13px] font-semibold', active ? 'text-zinc-100' : 'text-zinc-100/90')}>
            {label}
          </div>
          <span
            className={cx(
              'inline-flex h-7 w-7 items-center justify-center rounded-2xl border transition',
              active ? 'border-white/16 bg-white/[0.06]' : 'border-white/10 bg-black/20',
            )}
          >
            <ArrowRight className={cx('h-4 w-4 transition', active ? 'opacity-85 translate-x-0.5' : 'opacity-55')} />
          </span>
        </div>
        <div className="mt-1 text-[12px] leading-snug text-zinc-400">{sub}</div>
      </div>
    </button>
  );
}

function CityRow({
  city,
  score01,
  rank,
}: {
  city: RuntimeCityLite;
  score01: number;
  rank: number;
}) {
  const glow = clamp(score01, 0, 1);

  return (
    <div
      className={cx(
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-4',
        'shadow-[0_26px_100px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]',
        'transition hover:bg-white/[0.04] hover:border-white/14',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(520px_200px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_200px_at_86%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[12px] font-semibold text-zinc-100/90">
              {rank}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-zinc-100">{city.name}</div>
              <div className="truncate text-[11px] text-zinc-500">
                {city.country}
                {city.region ? ` · ${city.region}` : ''}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="gold">{formatTier(city.tier)}</Badge>
            <Badge tone="neutral">{formatStatus(city.status)}</Badge>
            <Badge tone="violet">{city.tz}</Badge>
          </div>

          <div className="mt-3 text-[12px] leading-relaxed text-zinc-300/90">
            {city.blurb ? city.blurb : 'Private index coverage with truth-first emphasis.'}
          </div>
        </div>

        <Link
          href={`/city/${city.slug}`}
          prefetch
          className={cx(
            'shrink-0 inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-[11px] transition',
            'border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] hover:border-white/16',
          )}
        >
          Open <ArrowRight className="h-4 w-4 opacity-75" />
        </Link>
      </div>

      {/* confidence line (quiet, not flashy) */}
      <div className="relative mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(231,201,130,0.72),rgba(255,255,255,0.42),rgba(120,76,255,0.64))]"
            style={{ width: `${Math.round(glow * 100)}%` }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
      </div>
    </div>
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
  const [active, setActive] = useState<IntentId>('quiet-accumulation');

  const intents = useMemo(
    () => [
      {
        id: 'quiet-accumulation' as const,
        label: 'Quiet accumulation',
        sub: 'Low noise. Deep capital. Long horizon.',
        icon: ShieldCheck,
      },
      {
        id: 'low-noise-prime' as const,
        label: 'Low-noise prime',
        sub: 'Clean demand. Structural scarcity.',
        icon: Sparkles,
      },
      {
        id: 'ahead-of-cycle' as const,
        label: 'Ahead of cycle',
        sub: 'Early momentum with discipline.',
        icon: TrendingUp,
      },
      {
        id: 'verification-strong' as const,
        label: 'Verification strong',
        sub: 'Truth-first coverage and evidence.',
        icon: ShieldCheck,
      },
      {
        id: 'liquidity-building' as const,
        label: 'Liquidity building',
        sub: 'Velocity-led signals and flow.',
        icon: Globe,
      },
    ],
    [],
  );

  const ranked = useMemo(() => {
    const id = active;
    const scored = (cities ?? [])
      .map((c) => {
        const base = computeBaseScore(c);
        const bonus = intentBonus(id, c);
        return { c, score: base + bonus };
      })
      .sort((a, b) => b.score - a.score);

    const top = pickDistinctTimezones(scored.map((x) => x.c), defaultTop);

    const maxScore = scored.length ? scored[0].score : 1;
    const minScore = scored.length ? scored[Math.min(scored.length - 1, 10)].score : 0;

    const to01 = (s: number) => {
      const den = Math.max(1, maxScore - minScore);
      return clamp((s - minScore) / den, 0, 1);
    };

    const topWithScore = top.map((city) => {
      const row = scored.find((x) => x.c.slug === city.slug);
      return { city, score: row?.score ?? 0, score01: to01(row?.score ?? 0) };
    });

    const activeMeta = intents.find((x) => x.id === id);
    return { id, topWithScore, activeMeta };
  }, [cities, active, defaultTop, intents]);

  const ActiveIcon = ranked.activeMeta?.icon ?? Sparkles;

  return (
    <section className="relative">
      {/* Quiet crown lines */}
      <div aria-hidden className="pointer-events-none absolute -top-5 inset-x-0">
        <div className="mx-auto h-px w-[92%] bg-gradient-to-r from-transparent via-[#E7C982]/28 to-transparent" />
        <div className="mx-auto mt-2 h-px w-[78%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div
        className={cx(
          'relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03]',
          'shadow-[0_52px_190px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.06)]',
        )}
      >
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_12%_-12%,rgba(255,255,255,0.08),transparent_64%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_86%_6%,rgba(120,76,255,0.16),transparent_64%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/22 to-black/46" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                  <ActiveIcon className="h-4 w-4 text-zinc-100/90" />
                </span>
                <div className="text-[11px] font-semibold tracking-[0.30em] text-zinc-200/70">
                  INTENT-LED DISCOVERY
                </div>
              </div>

              <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-zinc-100 sm:text-[34px]">
                Search is the interface.
                <span className="text-zinc-300/90"> Intent is the engine.</span>
              </h1>

              <p className="mt-3 text-[14px] leading-relaxed text-zinc-300/90">
                Pick a mandate and Vantera surfaces the most probable markets to start from - quiet, verified, and
                signal-first. This is not a portal. It is a decision surface.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="gold">Royal minimal</Badge>
                <Badge tone="neutral">Readable by default</Badge>
                <Badge tone="violet">Proof expands weekly</Badge>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[12px] text-zinc-300/85">
              Tip: press <span className="font-mono text-zinc-100">/</span> for city search
            </div>
          </div>

          {/* Body */}
          <div className="mt-7 grid gap-5 lg:grid-cols-12 lg:gap-6">
            {/* Left: intents */}
            <div className="lg:col-span-4">
              <div className="rounded-[28px] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-zinc-200/70">
                  SELECT A MANDATE
                </div>

                <div className="grid gap-2.5">
                  {intents.map((i) => (
                    <IntentPill
                      key={i.id}
                      label={i.label}
                      sub={i.sub}
                      active={active === i.id}
                      onClick={() => setActive(i.id)}
                    />
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] text-zinc-300/90">
                  Vantera re-weights markets using coverage tier, status, and priority.
                  <span className="text-zinc-500"> Signals replace heuristics as metrics land.</span>
                </div>
              </div>
            </div>

            {/* Right: results */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-200/70">
                  TOP MARKETS RIGHT NOW
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <a
                    href={`#${onKeepScanningId}`}
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition',
                      'border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] hover:border-white/16',
                    )}
                  >
                    Keep scanning <ArrowRight className="h-4 w-4 opacity-75" />
                  </a>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {ranked.topWithScore.map(({ city, score01 }, idx) => (
                  <CityRow key={city.slug} city={city} score01={score01} rank={idx + 1} />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:hidden">
                <a
                  href={`#${onKeepScanningId}`}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition',
                    'border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] hover:border-white/16',
                  )}
                >
                  Keep scanning <ArrowRight className="h-4 w-4 opacity-75" />
                </a>
              </div>

              <div className="mt-4 text-[12px] text-zinc-500">
                Output is indicative. The evidence layer (comparables, liquidity, risk) expands with each city release.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
