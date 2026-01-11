// src/components/home/MarketBriefing.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Radar, ShieldCheck, Sparkles } from 'lucide-react';

import type { City } from './cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type Tone = 'warming' | 'tightening' | 'flight' | 'quiet';

function toneMeta(tone: Tone) {
  if (tone === 'warming')
    return {
      label: 'Signals: warming',
      cls: 'border-emerald-400/18 bg-emerald-500/8 text-emerald-100/95',
      dot: 'bg-emerald-200/80',
      icon: <Radar className="h-4 w-4 opacity-85" />,
    };

  if (tone === 'tightening')
    return {
      label: 'Signals: tightening',
      cls: 'border-white/12 bg-white/[0.04] text-zinc-200/90',
      dot: 'bg-white/80',
      icon: <ShieldCheck className="h-4 w-4 opacity-85" />,
    };

  if (tone === 'flight')
    return {
      label: 'Flight-to-quality',
      cls: 'border-violet-400/18 bg-violet-500/8 text-violet-100/95',
      dot: 'bg-violet-200/80',
      icon: <Sparkles className="h-4 w-4 opacity-85" />,
    };

  return {
    label: 'Quiet positioning',
    cls: 'border-white/10 bg-white/[0.03] text-zinc-200/90',
    dot: 'bg-white/70',
    icon: <Radar className="h-4 w-4 opacity-85" />,
  };
}

function Pill({
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

  return <span className={cx(base, cls)}>{label}</span>;
}

function pickBriefing(cities: City[]) {
  // Curated ordering: use what exists, keep stable.
  const wanted = ['marbella', 'madrid', 'paris', 'dubai', 'london', 'miami', 'new-york'];
  const map = new Map(cities.map((c) => [c.slug, c]));
  const picked: City[] = [];

  for (const slug of wanted) {
    const c = map.get(slug);
    if (c) picked.push(c);
    if (picked.length === 3) break;
  }

  // Fallback: first 3
  if (picked.length < 3) {
    for (const c of cities) {
      if (!picked.find((p) => p.slug === c.slug)) picked.push(c);
      if (picked.length === 3) break;
    }
  }

  return picked.slice(0, 3);
}

function thesisFor(slug: string): { tone: Tone; thesis: string; liquidity: string; confidence: string } {
  // Placeholder editorial intelligence - we’ll wire real data later.
  if (slug === 'marbella')
    return {
      tone: 'flight',
      thesis: 'Scarcity-led market with discreet demand. Quality listings move before they surface publicly.',
      liquidity: 'Thin supply, high intent',
      confidence: 'Medium',
    };

  if (slug === 'madrid')
    return {
      tone: 'warming',
      thesis: 'Prime corridors stabilising. Buyers are back, but only for clean fundamentals and pricing discipline.',
      liquidity: 'Normal depth',
      confidence: 'Medium',
    };

  if (slug === 'paris')
    return {
      tone: 'tightening',
      thesis: 'Selective liquidity. The spread between “good” and “great” is widening, pricing is precise.',
      liquidity: 'Deep prime, thin secondary',
      confidence: 'Medium',
    };

  if (slug === 'dubai')
    return {
      tone: 'warming',
      thesis: 'Momentum market. Demand is fast, but only the best inventory holds premium under pressure.',
      liquidity: 'High velocity',
      confidence: 'Low → Medium',
    };

  if (slug === 'london')
    return {
      tone: 'tightening',
      thesis: 'Capital is cautious and concentrated. Prime stability, secondary softness remains.',
      liquidity: 'Deep prime pockets',
      confidence: 'Medium',
    };

  return {
    tone: 'quiet',
    thesis: 'Private coverage building. Truth layers activate as verified signals expand.',
    liquidity: 'Coverage expanding',
    confidence: 'Low',
  };
}

export default function MarketBriefing({
  cities,
  className = '',
}: {
  cities: City[];
  className?: string;
}) {
  const picked = pickBriefing(cities);

  return (
    <section className={cx('w-full', className)}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
              Market briefing
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Curated entry points with institutional tone
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
              Not a directory. A signal layer - designed for buyers, private sellers and advisors who value clarity.
            </p>
          </div>

          <Link
            href="/coming-soon?section=briefing"
            prefetch
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-200/90 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:bg-white/[0.05] hover:border-white/18 hover:text-white"
          >
            Request coverage <ArrowRight className="h-4 w-4 opacity-75" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {picked.map((c) => {
            const meta = thesisFor(c.slug);
            const t = toneMeta(meta.tone);

            return (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                prefetch
                className={cx(
                  'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]',
                  'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_26px_90px_rgba(0,0,0,0.45)]',
                  'transition duration-500 hover:-translate-y-[2px] hover:border-white/18',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
                )}
                aria-label={`Open ${c.name} briefing`}
              >
                {/* top polish */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
                    <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
                  </div>
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                        {c.country}
                        {c.region ? ` · ${c.region}` : ''}
                      </div>

                      <div className="mt-2 truncate text-xl font-semibold tracking-tight text-white">
                        {c.name}
                      </div>
                    </div>

                    <span className={cx('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl', t.cls)}>
                      <span className={cx('h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.08)]', t.dot)} />
                      {t.icon}
                      <span className="whitespace-nowrap">{t.label}</span>
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {meta.thesis}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill label={`Liquidity: ${meta.liquidity}`} tone="neutral" />
                    <Pill label={`Confidence: ${meta.confidence}`} tone="warn" />
                    <Pill label="Private index" tone="violet" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-xs text-zinc-300/90">
                      {`VANTERA:${c.slug.toUpperCase()}`}
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-zinc-200/85 transition group-hover:text-white">
                      Enter <ArrowRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-white/10 transition group-hover:ring-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
