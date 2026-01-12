// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'risk';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Chip({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{k}</div>
      <div className="mt-1 text-[12px] text-zinc-200">{v}</div>
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');

  const content = useMemo(() => {
    if (tab === 'value') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'Pricing without theatre',
        body:
          'A single panel that tells you if the price is real, how much leverage exists and what would move the outcome.',
        signals: [
          { k: 'FAIR VALUE BAND', v: 'Tight (high confidence)' },
          { k: 'ASKING PRICE', v: 'Within band' },
          { k: 'UPSIDE', v: 'Moderate (micro-market tailwind)' },
        ],
        bullets: [
          'Penalises fantasy listings and anchor pricing',
          'Separates value from persuasion signals',
          'Explains the next best move in plain language',
        ],
        icon: <Sparkles className="h-4 w-4" />,
      };
    }

    if (tab === 'liquidity') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'Liquidity clarity',
        body:
          'You see time-to-sell drivers, buyer pool depth and how fast the market is actually moving - not how it’s marketed.',
        signals: [
          { k: 'TIME-TO-SELL', v: 'Short (strong velocity)' },
          { k: 'BUYER POOL', v: 'Deep (international demand)' },
          { k: 'REDUCTION RISK', v: 'Low (clean comparables)' },
        ],
        bullets: [
          'Tracks velocity and reductions, not headlines',
          'Models demand pressure across pockets',
          'Flags where “prime” is illiquid theatre',
        ],
        icon: <TrendingUp className="h-4 w-4" />,
      };
    }

    return {
      eyebrow: 'Featured intelligence',
      title: 'Risk and integrity',
      body:
        'A truth layer protected against manipulation with audit trails and anti-gaming rules, designed for outcomes.',
      signals: [
        { k: 'RISK FLAGS', v: 'Low (clean ownership signals)' },
        { k: 'DATA INTEGRITY', v: 'High (cross-validated)' },
        { k: 'CONFIDENCE', v: 'Tightening with coverage' },
      ],
      bullets: [
        'Detects coordinated distortions and bias',
        'Maintains an auditable change history',
        'Optimised for outcomes, not clicks',
      ],
      icon: <ShieldCheck className="h-4 w-4" />,
    };
  }, [tab]);

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_40px_130px_rgba(0,0,0,0.60)] sm:p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(920px_320px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(920px_320px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-zinc-300">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-100">
                {content.icon}
              </span>
              <span className="font-semibold tracking-[0.22em] text-zinc-400">{content.eyebrow.toUpperCase()}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Signal over noise</span>
            </div>

            <div className="mt-4 text-xl font-medium text-zinc-50 sm:text-2xl">{content.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-zinc-300">{content.body}</div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {content.signals.map((s) => (
                <Chip key={s.k} k={s.k} v={s.v} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[360px]">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
              {(
                [
                  ['value', 'Value'],
                  ['liquidity', 'Liquidity'],
                  ['risk', 'Risk'],
                ] as Array<[TabKey, string]>
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={cx(
                    'rounded-xl border px-3 py-2 text-[12px] font-semibold transition',
                    tab === k
                      ? 'border-white/16 bg-white/[0.06] text-zinc-100'
                      : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04]',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">WHAT YOU GET</div>
              <div className="mt-2 grid gap-2">
                {content.bullets.map((b) => (
                  <div
                    key={b}
                    className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-zinc-200"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/80 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" />
                    <span className="text-zinc-200">{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-zinc-500">Example panel</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200">
                  View sample <ArrowRight className="h-4 w-4 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
          This replaces fake listings with a believable intelligence surface.
          <span className="text-zinc-500"> Next, we wire it to real listings.</span>
        </div>
      </div>
    </section>
  );
}
