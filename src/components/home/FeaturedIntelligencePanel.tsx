// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'risk';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Pill({
  active,
  label,
  hint,
  onClick,
  Icon,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition',
        'backdrop-blur-2xl',
        active
          ? 'border-white/16 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/14',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_86%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
      </div>

      <div className="relative flex items-start gap-3">
        <span
          className={cx(
            'inline-flex h-9 w-9 items-center justify-center rounded-2xl border transition',
            active ? 'border-white/16 bg-white/[0.06]' : 'border-white/10 bg-black/20',
          )}
        >
          <Icon className={cx('h-4 w-4 transition', active ? 'opacity-90' : 'opacity-70')} />
        </span>

        <div className="min-w-0">
          <div className={cx('text-[13px] font-semibold', active ? 'text-zinc-100' : 'text-zinc-100/90')}>
            {label}
          </div>
          <div className="mt-1 text-[12px] leading-snug text-zinc-400">{hint}</div>
        </div>
      </div>
    </button>
  );
}

function Metric({
  k,
  v,
  hint,
}: {
  k: string;
  v: string;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(540px_200px_at_18%_0%,rgba(255,255,255,0.05),transparent_64%)]" />
      </div>
      <div className="relative">
        <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{k}</div>
        <div className="mt-2 text-[15px] font-semibold text-zinc-100">{v}</div>
        {hint ? <div className="mt-1 text-[12px] leading-snug text-zinc-400">{hint}</div> : null}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/22 px-4 py-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/85 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" />
      <div className="text-[13px] leading-relaxed text-zinc-200/90">{children}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-200/90">
      {children}
    </span>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');

  const content = useMemo(() => {
    if (tab === 'value') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'Is the price real?',
        body:
          'Vantera checks the pricing story and shows if it is fair, inflated, or quietly underpriced - and why.',
        sub: 'No portal gives you this clearly.',
        metrics: [
          { k: 'FAIR RANGE', v: 'Tight band', hint: 'High confidence in this pocket' },
          { k: 'ASKING', v: 'Inside range', hint: 'No fantasy premium detected' },
          { k: 'UPSIDE', v: 'Moderate', hint: 'Demand improving in best streets' },
        ],
        bullets: [
          'Stops you overpaying for a narrative',
          'Shows what matters before you fly in',
          'Gives a next move in plain language',
        ],
        proof: ['Sold comps and reductions', 'Listing history changes', 'Demand signals by micro-area'],
        alerts: ['One similar home cut 6% this week', 'Supply stayed tight in last 14 days', 'Buyer interest rose in best streets'],
        Icon: Sparkles,
        badge: 'Pricing lens',
      };
    }

    if (tab === 'liquidity') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'How fast will it sell?',
        body:
          'You see buyer depth and real speed. Not marketing. Not vibe. Just how quickly clean homes actually move.',
        sub: 'This is what makes you early, not late.',
        metrics: [
          { k: 'TIME TO SELL', v: 'Short', hint: 'Velocity is strong on clean inventory' },
          { k: 'BUYER DEPTH', v: 'Deep', hint: 'International demand present' },
          { k: 'CUT RISK', v: 'Low', hint: 'Comparables are clean' },
        ],
        bullets: ['Helps you time offers properly', 'Shows if “prime” is actually illiquid', 'Stops you buying the wrong pocket'],
        proof: ['Buyer pool size and direction', 'Price cuts and relists', 'Time-on-market by micro-area'],
        alerts: ['Two new buyers entered this pocket', 'Lower quality inventory is sitting longer', 'Best homes are moving off-market'],
        Icon: TrendingUp,
        badge: 'Liquidity lens',
      };
    }

    return {
      eyebrow: 'Featured intelligence',
      title: 'Is anything hidden?',
      body:
        'Vantera flags risk early so you do not fall in love with a problem. Clean facts, clean history, clean signals.',
      sub: 'This is how you stay safe in luxury markets.',
      metrics: [
        { k: 'RISK FLAGS', v: 'Low', hint: 'No obvious red flags detected' },
        { k: 'DATA QUALITY', v: 'Strong', hint: 'Signals cross-checked' },
        { k: 'PROOF LEVEL', v: 'Rising', hint: 'Verification expands weekly' },
      ],
      bullets: ['Detects suspicious distortions', 'Keeps a clear change history', 'Built for outcomes, not clicks'],
      proof: ['Ownership and listing consistency', 'Cross-source verification', 'Anomaly and manipulation guards'],
      alerts: ['A listing edit was detected and logged', 'One source disagreed - flagged', 'Confidence improved as proof landed'],
      Icon: ShieldCheck,
      badge: 'Risk lens',
    };
  }, [tab]);

  const tabs = useMemo(
    () =>
      [
        { k: 'value' as const, label: 'Value', hint: 'Is the price real?', Icon: Sparkles },
        { k: 'liquidity' as const, label: 'Liquidity', hint: 'How fast will it move?', Icon: TrendingUp },
        { k: 'risk' as const, label: 'Risk', hint: 'Any hidden problems?', Icon: ShieldCheck },
      ] as const,
    [],
  );

  return (
    <section className="relative">
      {/* Crown lines */}
      <div aria-hidden className="pointer-events-none absolute -top-4 inset-x-0">
        <div className="mx-auto h-px w-[92%] bg-gradient-to-r from-transparent via-[#E7C982]/26 to-transparent" />
        <div className="mx-auto mt-2 h-px w-[76%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div
        className={cx(
          'relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03]',
          'shadow-[0_54px_190px_rgba(0,0,0,0.70),inset_0_1px_0_rgba(255,255,255,0.06)]',
        )}
      >
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_14%_-10%,rgba(255,255,255,0.08),transparent_64%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_6%,rgba(120,76,255,0.16),transparent_64%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/22 to-black/46" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  <span className="font-semibold tracking-[0.22em] text-zinc-300">
                    {content.eyebrow.toUpperCase()}
                  </span>
                </Badge>
                <Badge>{content.badge}</Badge>
                <Badge>Example dossier</Badge>
              </div>

              <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-zinc-50 sm:text-[32px]">
                {content.title}
              </h2>

              <p className="mt-3 text-[14px] leading-relaxed text-zinc-300/90">{content.body}</p>
              <p className="mt-2 text-[13px] text-zinc-400">{content.sub}</p>
            </div>

            {/* Tabs (now actually premium) */}
            <div className="w-full lg:w-[420px]">
              <div className="rounded-[28px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="mb-3 text-[10px] font-semibold tracking-[0.26em] text-zinc-500">
                  LENS SELECTOR
                </div>
                <div className="grid gap-2">
                  {tabs.map((t) => (
                    <Pill
                      key={t.k}
                      active={tab === t.k}
                      label={t.label}
                      hint={t.hint}
                      Icon={t.Icon}
                      onClick={() => setTab(t.k)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {content.metrics.map((m) => (
              <Metric key={m.k} k={m.k} v={m.v} hint={m.hint} />
            ))}
          </div>

          {/* Proof + Signals */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-[28px] border border-white/10 bg-black/22 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">PROOF STACK</div>
                  <div className="mt-2 text-[14px] font-semibold text-zinc-200">What Vantera checks before a claim</div>
                </div>
                <Badge>Verification-first</Badge>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {content.proof.map((p) => (
                  <div key={p} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">SOURCE</div>
                    <div className="mt-2 text-[13px] leading-snug text-zinc-200">{p}</div>
                    <div className="mt-1 text-[11px] text-zinc-500">Logged and cross-checked.</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                {content.bullets.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-[28px] border border-white/10 bg-black/22 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">LIVE SIGNALS</div>
                  <div className="mt-2 text-[14px] font-semibold text-zinc-200">Tiny changes that move decisions</div>
                </div>
                <Badge>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                    Just in
                  </span>
                </Badge>
              </div>

              <div className="mt-4 grid gap-2">
                {content.alerts.map((a) => (
                  <div
                    key={a}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                      <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
                    </div>
                    <div className="relative">
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">ALERT</div>
                      <div className="mt-2 text-[13px] leading-relaxed text-zinc-200">{a}</div>
                      <div className="mt-1 text-[11px] text-zinc-500">Example output. Real wiring next.</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <div className="text-[12px] text-zinc-300">
                  Want this on a real listing?
                  <div className="text-[11px] text-zinc-500">Next: connect to verified inventory.</div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[12px] text-zinc-200 transition hover:bg-white/[0.07] hover:border-white/16"
                >
                  View sample <ArrowRight className="h-4 w-4 opacity-75" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
            This is the “wow” layer: proof + signals + clear outcomes.
            <span className="text-zinc-500"> Next we wire it to real listings and real market data.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
