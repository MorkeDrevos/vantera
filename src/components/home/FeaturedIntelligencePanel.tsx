// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'risk';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';
const CARD =
  'bg-[color:var(--surface-2)] backdrop-blur-[12px] ' +
  RING +
  ' shadow-[0_30px_90px_rgba(11,12,16,0.10)]';

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'gold' | 'violet' | 'emerald';
}) {
  const toneCls =
    tone === 'gold'
      ? 'bg-[rgba(231,201,130,0.12)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(231,201,130,0.30)]'
      : tone === 'violet'
        ? 'bg-[rgba(139,92,246,0.10)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)]'
        : tone === 'emerald'
          ? 'bg-[rgba(16,185,129,0.10)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(16,185,129,0.20)]'
          : 'bg-white/75 text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]';

  return (
    <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] backdrop-blur-[14px]', toneCls)}>
      {children}
    </span>
  );
}

function LensTab({
  active,
  label,
  hint,
  onClick,
  Icon,
  tone,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  tone: 'gold' | 'violet' | 'emerald';
}) {
  const toneGlow =
    tone === 'gold'
      ? 'bg-[radial-gradient(480px_180px_at_18%_0%,rgba(231,201,130,0.20),transparent_62%)]'
      : tone === 'emerald'
        ? 'bg-[radial-gradient(480px_180px_at_18%_0%,rgba(16,185,129,0.18),transparent_62%)]'
        : 'bg-[radial-gradient(480px_180px_at_18%_0%,rgba(139,92,246,0.18),transparent_62%)]';

  const activeRing =
    tone === 'gold'
      ? 'ring-1 ring-inset ring-[rgba(231,201,130,0.35)] shadow-[0_26px_90px_rgba(231,201,130,0.10)]'
      : tone === 'emerald'
        ? 'ring-1 ring-inset ring-[rgba(16,185,129,0.28)] shadow-[0_26px_90px_rgba(16,185,129,0.08)]'
        : 'ring-1 ring-inset ring-[rgba(139,92,246,0.28)] shadow-[0_26px_90px_rgba(139,92,246,0.08)]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
        active
          ? cx('bg-white/80', activeRing)
          : cx('bg-white/60', RING, 'hover:bg-white/75'),
      )}
    >
      <div className={cx('pointer-events-none absolute inset-0 opacity-0 transition', active ? 'opacity-100' : 'group-hover:opacity-100')}>
        <div className={cx('absolute inset-0', toneGlow)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex items-start gap-3">
        <span
          className={cx(
            'inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80',
            RING,
          )}
        >
          <Icon className={cx('h-[18px] w-[18px]', active ? 'opacity-90' : 'opacity-70')} />
        </span>

        <div className="min-w-0">
          <div className={cx('text-[13px] font-semibold tracking-[-0.01em]', active ? 'text-[color:var(--ink)]' : 'text-[color:var(--ink-2)]')}>
            {label}
          </div>
          <div className="mt-1 text-[12px] leading-snug text-[color:var(--ink-3)]">{hint}</div>
        </div>

        <span
          className={cx(
            'ml-auto inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold tracking-[0.22em]',
            active ? 'bg-white/85 text-[color:var(--ink-2)]' : 'bg-white/60 text-[color:var(--ink-3)]',
            RING,
          )}
        >
          ACTIVE
        </span>
      </div>
    </button>
  );
}

function Metric({
  k,
  v,
  hint,
  accent = 'gold',
}: {
  k: string;
  v: string;
  hint?: string;
  accent?: 'gold' | 'violet' | 'emerald';
}) {
  const dot =
    accent === 'gold'
      ? 'bg-[rgba(231,201,130,0.95)] shadow-[0_0_0_4px_rgba(231,201,130,0.16)]'
      : accent === 'emerald'
        ? 'bg-[rgba(16,185,129,0.88)] shadow-[0_0_0_4px_rgba(16,185,129,0.14)]'
        : 'bg-[rgba(139,92,246,0.88)] shadow-[0_0_0_4px_rgba(139,92,246,0.14)]';

  return (
    <div className={cx('relative overflow-hidden rounded-2xl px-4 py-3', CARD)}>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(560px_220px_at_18%_0%,rgba(11,12,16,0.04),transparent_64%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className={cx('inline-block h-1.5 w-1.5 rounded-full', dot)} />
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{k}</div>
        </div>
        <div className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{v}</div>
        {hint ? <div className="mt-1 text-[12px] leading-snug text-[color:var(--ink-2)]">{hint}</div> : null}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <div className={cx('relative overflow-hidden rounded-2xl px-4 py-3', CARD)}>
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[rgba(11,12,16,0.05)] blur-3xl" />
      </div>
      <div className="relative flex items-start gap-3">
        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(11,12,16,0.55)] shadow-[0_0_0_4px_rgba(11,12,16,0.08)]" />
        <div className="text-[13px] leading-relaxed text-[color:var(--ink-2)]">{children}</div>
      </div>
    </div>
  );
}

function DossierCard({
  label,
  title,
  items,
  chip,
}: {
  label: string;
  title: string;
  items: string[];
  chip: React.ReactNode;
}) {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px] p-5', CARD)}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">{label}</div>
          <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{title}</div>
        </div>
        {chip}
      </div>

      <div className="relative mt-4 grid gap-2">
        {items.map((p) => (
          <div key={p} className={cx('rounded-2xl px-4 py-3', 'bg-white/70', RING)}>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">ENTRY</div>
            <div className="mt-2 text-[13px] leading-snug text-[color:var(--ink-2)]">{p}</div>
            <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">Logged and cross-checked.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');

  const content = useMemo(() => {
    if (tab === 'value') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'Is the price real?',
        body: 'Vantera checks the pricing story and shows if it is fair, inflated, or quietly underpriced and why.',
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
        tone: 'gold' as const,
      };
    }

    if (tab === 'liquidity') {
      return {
        eyebrow: 'Featured intelligence',
        title: 'How fast will it sell?',
        body: 'You see buyer depth and real speed. Not marketing. Not vibe. Just how quickly clean homes actually move.',
        sub: 'This is what makes you early, not late.',
        metrics: [
          { k: 'TIME TO SELL', v: 'Short', hint: 'Velocity is strong on clean inventory' },
          { k: 'BUYER DEPTH', v: 'Deep', hint: 'International demand present' },
          { k: 'CUT RISK', v: 'Low', hint: 'Comparables are clean' },
        ],
        bullets: [
          'Helps you time offers properly',
          'Shows if “prime” is actually illiquid',
          'Stops you buying the wrong pocket',
        ],
        proof: ['Buyer pool size and direction', 'Price cuts and relists', 'Time-on-market by micro-area'],
        alerts: ['Two new buyers entered this pocket', 'Lower quality inventory is sitting longer', 'Best homes are moving off-market'],
        Icon: TrendingUp,
        badge: 'Liquidity lens',
        tone: 'emerald' as const,
      };
    }

    return {
      eyebrow: 'Featured intelligence',
      title: 'Is anything hidden?',
      body: 'Vantera flags risk early so you do not fall in love with a problem. Clean facts, clean history, clean signals.',
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
      tone: 'violet' as const,
    };
  }, [tab]);

  const tabs = useMemo(
    () =>
      [
        { k: 'value' as const, label: 'Value', hint: 'Is the price real?', Icon: Sparkles, tone: 'gold' as const },
        { k: 'liquidity' as const, label: 'Liquidity', hint: 'How fast will it move?', Icon: TrendingUp, tone: 'emerald' as const },
        { k: 'risk' as const, label: 'Risk', hint: 'Any hidden problems?', Icon: ShieldCheck, tone: 'violet' as const },
      ] as const,
    [],
  );

  const accentGlow =
    content.tone === 'gold'
      ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(231,201,130,0.22),transparent_62%)]'
      : content.tone === 'emerald'
        ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(16,185,129,0.18),transparent_62%)]'
        : 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(139,92,246,0.18),transparent_62%)]';

  return (
    <section className="relative">
      {/* Crown lines */}
      <div aria-hidden className="pointer-events-none absolute -top-4 inset-x-0">
        <div className="mx-auto h-px w-[92%] bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.28)] to-transparent" />
        <div className="mx-auto mt-2 h-px w-[76%] bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className={cx('relative overflow-hidden rounded-[40px]', CARD)}>
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className={cx('absolute inset-0', accentGlow)} />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_6%,rgba(11,12,16,0.04),transparent_64%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">
                  <span className="font-semibold tracking-[0.22em]">{content.eyebrow.toUpperCase()}</span>
                </Badge>
                <Badge tone={content.tone === 'gold' ? 'gold' : content.tone === 'emerald' ? 'emerald' : 'violet'}>
                  {content.badge}
                </Badge>
                <Badge tone="neutral">Example dossier</Badge>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span className={cx('mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80', RING)}>
                  <content.Icon className="h-5 w-5 opacity-85" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">
                    {content.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-2)]">{content.body}</p>
                  <p className="mt-2 text-[13px] text-[color:var(--ink-3)]">{content.sub}</p>
                </div>
              </div>
            </div>

            {/* Lens Selector */}
            <div className="w-full lg:w-[440px]">
              <div className={cx('rounded-[30px] p-3', 'bg-white/70', RING, 'shadow-[0_22px_70px_rgba(11,12,16,0.08)]')}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                    LENS SELECTOR
                  </div>
                  <div className="text-[10px] text-[color:var(--ink-3)]">3 modes, one truth layer</div>
                </div>

                <div className="mt-3 grid gap-2">
                  {tabs.map((t) => (
                    <LensTab
                      key={t.k}
                      active={tab === t.k}
                      label={t.label}
                      hint={t.hint}
                      Icon={t.Icon}
                      tone={t.tone}
                      onClick={() => setTab(t.k)}
                    />
                  ))}
                </div>

                <div className={cx('mt-3 rounded-2xl px-4 py-3', 'bg-white/70', RING)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] text-[color:var(--ink-2)]">
                      Output style
                      <div className="text-[11px] text-[color:var(--ink-3)]">Plain-language + proof trail.</div>
                    </div>
                    <Badge tone="gold">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)] shadow-[0_0_0_3px_rgba(231,201,130,0.14)]" />
                        Royal-grade
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {content.metrics.map((m) => (
              <Metric key={m.k} k={m.k} v={m.v} hint={m.hint} accent={content.tone} />
            ))}
          </div>

          {/* Proof + Signals */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DossierCard
                label="PROOF STACK"
                title="What Vantera checks before a claim"
                items={content.proof}
                chip={<Badge tone="neutral">Verification-first</Badge>}
              />

              <div className="mt-4 grid gap-2">
                {content.bullets.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={cx('relative overflow-hidden rounded-[28px] p-5', CARD)}>
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_86%_-10%,rgba(139,92,246,0.12),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                </div>

                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">LIVE SIGNALS</div>
                    <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      Tiny changes that move decisions
                    </div>
                  </div>

                  <Badge tone="violet">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.55)] shadow-[0_0_0_3px_rgba(11,12,16,0.10)]" />
                      Just in
                    </span>
                  </Badge>
                </div>

                <div className="relative mt-4 grid gap-2">
                  {content.alerts.map((a) => (
                    <div key={a} className={cx('relative overflow-hidden rounded-2xl px-4 py-3', 'bg-white/70', RING)}>
                      <div className="pointer-events-none absolute inset-0 opacity-70">
                        <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[rgba(139,92,246,0.10)] blur-3xl" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">ALERT</div>
                          <div className="text-[10px] text-[color:var(--ink-3)]">Example</div>
                        </div>
                        <div className="mt-2 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{a}</div>
                        <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">Real wiring next.</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={cx('relative mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3', 'bg-white/70', RING)}>
                  <div className="text-[12px] text-[color:var(--ink-2)]">
                    Want this on a real listing?
                    <div className="text-[11px] text-[color:var(--ink-3)]">Next: connect to verified inventory.</div>
                  </div>
                  <button
                    type="button"
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                      'bg-white/75 hover:bg-white/90',
                      RING,
                      'text-[color:var(--ink)]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
                    )}
                  >
                    View sample <ArrowRight className="h-4 w-4 opacity-75" />
                  </button>
                </div>
              </div>

              <div className={cx('mt-4 rounded-2xl px-4 py-3 text-[12px]', 'bg-white/70', RING, 'text-[color:var(--ink-2)]')}>
                This is the “wow” layer: proof + signals + clear outcomes.
                <span className="text-[color:var(--ink-3)]"> Next we wire it to real listings and real market data.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
