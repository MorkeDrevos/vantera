// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'risk';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Chip({
  k,
  v,
  hint,
}: {
  k: string;
  v: string;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/22 px-3 py-2">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_18%_0%,rgba(255,255,255,0.05),transparent_62%)]" />
      </div>
      <div className="relative">
        <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{k}</div>
        <div className="mt-1 text-[12px] text-zinc-100">{v}</div>
        {hint ? <div className="mt-1 text-[11px] text-zinc-500">{hint}</div> : null}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3">
      <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">{label.toUpperCase()}</div>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
      {note ? <div className="mt-1 text-xs text-zinc-500">{note}</div> : null}
    </div>
  );
}

function LineItem({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/22 px-3 py-2 text-[13px] text-zinc-200">
      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/80 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" />
      <span className="text-zinc-200">{children}</span>
    </div>
  );
}

function GlowDivider() {
  return (
    <div className="pointer-events-none my-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');

  const content = useMemo(() => {
    if (tab === 'value') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'Is this price real?',
        body:
          'Vantera checks the pricing story. You instantly see if it’s fair, inflated, or quietly underpriced - and why.',
        sub:
          'This is the part most portals never show you.',
        signals: [
          { k: 'FAIR PRICE RANGE', v: 'Tight (high confidence)', hint: 'Small band = less guessing' },
          { k: 'ASKING PRICE', v: 'Inside the range', hint: 'No fantasy premium detected' },
          { k: 'UPSIDE', v: 'Moderate', hint: 'Micro-area demand is improving' },
        ],
        stats: [
          { label: 'Confidence', value: 'High', note: 'More verified signals than usual' },
          { label: 'Price pressure', value: 'Balanced', note: 'Not a “must cut” listing' },
          { label: 'Negotiation room', value: 'Limited', note: 'Fairly positioned already' },
        ],
        bullets: [
          'Stops you overpaying for a story',
          'Shows what matters before you fly in',
          'Explains the best next move in plain language',
        ],
        proof: [
          'Recent sold comps and reductions',
          'Listing history changes',
          'Demand signals by pocket',
        ],
        alerts: [
          'One similar home cut price 6% this week',
          'Supply stayed tight in the last 14 days',
          'Buyer interest rose in the best streets',
        ],
        icon: <Sparkles className="h-4 w-4" />,
        badge: 'Pricing lens',
      };
    }

    if (tab === 'liquidity') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'How fast will it sell?',
        body:
          'You see real buyer depth and real speed. Not marketing. Not vibe. Just how quickly clean homes actually move.',
        sub:
          'This is what makes you early, not late.',
        signals: [
          { k: 'TIME TO SELL', v: 'Short', hint: 'Strong velocity on clean inventory' },
          { k: 'BUYER DEPTH', v: 'Deep', hint: 'International demand present' },
          { k: 'PRICE CUT RISK', v: 'Low', hint: 'Comparables are clean' },
        ],
        stats: [
          { label: 'Velocity', value: 'Fast', note: 'Prime pockets moving first' },
          { label: 'Demand mix', value: 'Global', note: 'Multiple buyer sources' },
          { label: 'Exit risk', value: 'Low', note: 'Less chance of being stuck' },
        ],
        bullets: [
          'Helps you time offers properly',
          'Shows if “prime” is actually illiquid',
          'Stops you buying the wrong pocket',
        ],
        proof: [
          'Buyer pool size and direction',
          'Price cuts and relists',
          'Time-on-market by micro-area',
        ],
        alerts: [
          'Two new buyers entered this pocket this week',
          'Lower-quality inventory is sitting longer',
          'The best homes are selling off-market',
        ],
        icon: <TrendingUp className="h-4 w-4" />,
        badge: 'Liquidity lens',
      };
    }

    return {
      eyebrow: 'Featured intelligence',
      title: 'Is anything hidden?',
      body:
        'Vantera flags risk early - so you don’t fall in love with a problem. Clean facts, clean history, clean signals.',
      sub:
        'This is how you stay safe in luxury markets.',
      signals: [
        { k: 'RISK FLAGS', v: 'Low', hint: 'No obvious red flags detected' },
        { k: 'DATA QUALITY', v: 'Strong', hint: 'Signals cross-checked' },
        { k: 'PROOF LEVEL', v: 'Rising', hint: 'More verification coming online' },
      ],
      stats: [
        { label: 'Integrity', value: 'High', note: 'Harder to game the system' },
        { label: 'Change history', value: 'Tracked', note: 'Edits don’t disappear' },
        { label: 'Proof trail', value: 'Auditable', note: 'Clarity you can trust' },
      ],
      bullets: [
        'Detects suspicious distortions',
        'Keeps a clear change history',
        'Built for outcomes, not clicks',
      ],
      proof: [
        'Ownership and listing consistency',
        'Cross-source verification',
        'Anomaly and manipulation guards',
      ],
      alerts: [
        'A listing edit was detected and logged',
        'One data source disagreed - flagged for review',
        'Confidence improved as more proof landed',
      ],
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: 'Risk lens',
    };
  }, [tab]);

  const tabDefs = useMemo(
    () =>
      [
        { k: 'value' as const, label: 'Value', hint: 'Is the price real?' },
        { k: 'liquidity' as const, label: 'Liquidity', hint: 'How fast will it move?' },
        { k: 'risk' as const, label: 'Risk', hint: 'Any hidden problems?' },
      ] as const,
    [],
  );

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_50px_160px_rgba(0,0,0,0.64)] sm:p-6">
      {/* premium ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_18%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_85%_10%,rgba(120,76,255,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="relative">
        {/* Header row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-zinc-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-100">
                {content.icon}
              </span>
              <span className="font-semibold tracking-[0.22em] text-zinc-300">{content.eyebrow.toUpperCase()}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">{content.badge}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Example dossier</span>
            </div>

            <div className="mt-4 text-xl font-semibold text-zinc-50 sm:text-2xl">{content.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-zinc-300">{content.body}</div>
            <div className="mt-2 text-sm text-zinc-400">{content.sub}</div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {content.signals.map((s) => (
                <Chip key={s.k} k={s.k} v={s.v} hint={s.hint} />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div className="w-full lg:w-[390px]">
            {/* Tabs */}
            <div className="rounded-2xl border border-white/10 bg-black/22 p-2">
              <div className="grid grid-cols-3 gap-2">
                {tabDefs.map((t) => (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => setTab(t.k)}
                    className={cx(
                      'group rounded-xl border px-3 py-2 text-[12px] font-semibold transition',
                      tab === t.k
                        ? 'border-white/16 bg-white/[0.07] text-zinc-100'
                        : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] hover:text-white',
                    )}
                  >
                    <div className="leading-none">{t.label}</div>
                    <div className={cx('mt-1 hidden text-[10px] font-normal text-zinc-500 lg:block', tab === t.k && 'text-zinc-400')}>
                      {t.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live-ish stats */}
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/22 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">QUICK READ</div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-200/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                  Updates: weekly
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {content.stats.map((s) => (
                  <Stat key={s.label} label={s.label} value={s.value} note={s.note} />
                ))}
              </div>

              <GlowDivider />

              <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">WHAT YOU GET</div>
              <div className="mt-2 grid gap-2">
                {content.bullets.map((b) => (
                  <LineItem key={b}>{b}</LineItem>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-zinc-500">Sample report</div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.06] hover:border-white/14 hover:text-white"
                >
                  View sample <ArrowRight className="h-4 w-4 opacity-80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower: proof + alerts (this is the WOW part) */}
        <div className="mt-5 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">PROOF STACK</div>
                <div className="mt-2 text-sm text-zinc-200">What Vantera checks before it makes a claim</div>
              </div>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300">
                Verified-first
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {content.proof.map((p) => (
                <div
                  key={p}
                  className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 text-sm text-zinc-200"
                >
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">SOURCE</div>
                  <div className="mt-2 text-sm text-zinc-200">{p}</div>
                  <div className="mt-1 text-xs text-zinc-500">Logged, cross-checked, traceable.</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/22 px-4 py-3 text-[12px] text-zinc-300">
              Portals show you what sellers want you to feel.
              <span className="text-zinc-500"> Vantera shows you what the market is actually doing.</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">LIVE SIGNALS</div>
                <div className="mt-2 text-sm text-zinc-200">Tiny changes that move big decisions</div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-200/90">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                Just in
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              {content.alerts.map((a) => (
                <div
                  key={a}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/22 px-4 py-3 text-sm text-zinc-200"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-70">
                    <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
                  </div>
                  <div className="relative">
                    <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">ALERT</div>
                    <div className="mt-2 text-sm text-zinc-200">{a}</div>
                    <div className="mt-1 text-xs text-zinc-500">Example output. Real wiring next.</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Stat label="Buyer fit" value="Strong" note="Matches intent, not filters" />
              <Stat label="Waste avoided" value="High" note="Fewer pointless viewings" />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
          This is the “wow” layer: proof + signals + clear outcomes.
          <span className="text-zinc-500"> Next, we wire it to real listings and real market data.</span>
        </div>
      </div>
    </section>
  );
}
