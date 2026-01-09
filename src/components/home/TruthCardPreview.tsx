// src/components/home/TruthCardPreview.tsx
'use client';

import React from 'react';

function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const base =
    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] leading-none';

  const cls =
    tone === 'good'
      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
      : tone === 'warn'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : tone === 'violet'
          ? 'border-violet-400/20 bg-violet-500/10 text-violet-100'
          : 'border-white/10 bg-white/5 text-zinc-200';

  return <span className={`${base} ${cls}`}>{children}</span>;
}

function Row({
  label,
  value,
  tone = 'neutral',
  hint,
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warn';
  hint?: string;
}) {
  const valueCls =
    tone === 'good'
      ? 'text-emerald-100'
      : tone === 'warn'
        ? 'text-amber-100'
        : 'text-zinc-100';

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs text-zinc-400">{label}</div>
        {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
      </div>
      <div className={`shrink-0 text-sm font-semibold ${valueCls}`}>{value}</div>
    </div>
  );
}

export default function TruthCardPreview() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      {/* Ambient intelligence glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 left-10 h-[260px] w-[260px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-100">Truth Card</div>
            <div className="mt-1 text-xs text-zinc-400">
              Example output (static preview)
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill tone="violet">Inference layer</Pill>
            <Pill>Audit-ready</Pill>
            <Pill tone="good">Buyer-first</Pill>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Reality check
          </div>
          <div className="mt-2 text-sm leading-relaxed text-zinc-200">
            This home is priced above its micro-market equilibrium. If nothing changes, buyer leverage increases weekly.
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <Row
            label="Overpricing"
            value="+18.2%"
            tone="warn"
            hint="Relative to comparable closed sales and reductions"
          />
          <Row
            label="Time to sell"
            value="94 days"
            tone="neutral"
            hint="Forecast under current pricing pressure"
          />
          <Row
            label="Leverage"
            value="Buyer"
            tone="good"
            hint="Power balance based on liquidity and reductions"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">
            This is a preview object. Live numbers appear when coverage is verified.
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 transition hover:border-white/20"
          >
            See methodology
          </button>
        </div>
      </div>
    </div>
  );
}
