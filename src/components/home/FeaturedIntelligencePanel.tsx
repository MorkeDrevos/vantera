// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Lock,
  ScanEye,
  Waves,
  ChevronRight,
  Globe,
} from 'lucide-react';

type TabKey = 'valuation' | 'liquidity' | 'integrity';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';
const CARD =
  'bg-[color:var(--surface-2)] backdrop-blur-[14px] ' +
  RING +
  ' shadow-[0_30px_90px_rgba(11,12,16,0.10)]';

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'gold' | 'emerald' | 'violet';
}) {
  const cls =
    tone === 'gold'
      ? 'bg-[rgba(231,201,130,0.14)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(231,201,130,0.34)]'
      : tone === 'emerald'
        ? 'bg-[rgba(16,185,129,0.12)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(16,185,129,0.22)]'
        : tone === 'violet'
          ? 'bg-[rgba(139,92,246,0.12)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)]'
          : 'bg-white/72 text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]';

  return <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]', cls)}>{children}</span>;
}

function ModeButton({
  active,
  kbd,
  title,
  subtitle,
  Icon,
  tone,
  onClick,
}: {
  active: boolean;
  kbd: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: 'gold' | 'emerald' | 'violet';
  onClick: () => void;
}) {
  const glow =
    tone === 'gold'
      ? 'bg-[radial-gradient(680px_240px_at_14%_0%,rgba(231,201,130,0.28),transparent_62%)]'
      : tone === 'emerald'
        ? 'bg-[radial-gradient(680px_240px_at_14%_0%,rgba(16,185,129,0.22),transparent_62%)]'
        : 'bg-[radial-gradient(680px_240px_at_14%_0%,rgba(139,92,246,0.22),transparent_62%)]';

  const activeRing =
    tone === 'gold'
      ? 'ring-1 ring-inset ring-[rgba(231,201,130,0.40)] shadow-[0_26px_90px_rgba(231,201,130,0.10)]'
      : tone === 'emerald'
        ? 'ring-1 ring-inset ring-[rgba(16,185,129,0.30)] shadow-[0_26px_90px_rgba(16,185,129,0.08)]'
        : 'ring-1 ring-inset ring-[rgba(139,92,246,0.30)] shadow-[0_26px_90px_rgba(139,92,246,0.08)]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative w-full overflow-hidden rounded-[22px] px-4 py-3 text-left transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
        active ? cx('bg-white/88', activeRing) : cx('bg-white/62', RING, 'hover:bg-white/78'),
      )}
      aria-pressed={active}
    >
      <div className={cx('pointer-events-none absolute inset-0 opacity-0 transition', active ? 'opacity-100' : 'group-hover:opacity-100')}>
        <div className={cx('absolute inset-0', glow)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex items-start gap-3">
        <span className={cx('inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
          <Icon className={cx('h-[18px] w-[18px] transition', active ? 'opacity-90' : 'opacity-70')} />
        </span>

        <div className="min-w-0">
          <div className={cx('text-[13px] font-semibold tracking-[-0.01em]', active ? 'text-[color:var(--ink)]' : 'text-[color:var(--ink-2)]')}>
            {title}
          </div>
          <div className="mt-1 text-[12px] leading-snug text-[color:var(--ink-3)]">{subtitle}</div>
        </div>

        <span
          className={cx(
            'ml-auto inline-flex items-center gap-2 rounded-full px-2 py-1 text-[10px] tracking-[0.22em] uppercase',
            RING,
            active ? 'bg-white/88 text-[color:var(--ink-2)]' : 'bg-white/62 text-[color:var(--ink-3)]',
          )}
        >
          <span className="font-mono">{kbd}</span>
          {active ? 'active' : 'enter'}
        </span>
      </div>
    </button>
  );
}

function MiniStat({
  k,
  v,
  note,
  tone,
}: {
  k: string;
  v: string;
  note?: string;
  tone: 'gold' | 'emerald' | 'violet';
}) {
  const dot =
    tone === 'gold'
      ? 'bg-[rgba(231,201,130,0.95)] shadow-[0_0_0_4px_rgba(231,201,130,0.16)]'
      : tone === 'emerald'
        ? 'bg-[rgba(16,185,129,0.88)] shadow-[0_0_0_4px_rgba(16,185,129,0.14)]'
        : 'bg-[rgba(139,92,246,0.88)] shadow-[0_0_0_4px_rgba(139,92,246,0.14)]';

  return (
    <div className={cx('relative overflow-hidden rounded-2xl px-4 py-3', CARD)}>
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <div className="absolute inset-0 bg-[radial-gradient(560px_220px_at_18%_0%,rgba(11,12,16,0.04),transparent_64%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className={cx('inline-block h-1.5 w-1.5 rounded-full', dot)} />
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{k}</div>
        </div>
        <div className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{v}</div>
        {note ? <div className="mt-1 text-[12px] leading-snug text-[color:var(--ink-2)]">{note}</div> : null}
      </div>
    </div>
  );
}

function FeedRow({ label, text }: { label: string; text: string }) {
  return (
    <div className={cx('relative overflow-hidden rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[rgba(11,12,16,0.06)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{label}</div>
          <div className="text-[10px] text-[color:var(--ink-3)]">portal</div>
        </div>
        <div className="mt-2 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{text}</div>
        <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">Logged to dossier trail.</div>
      </div>
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('valuation');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') setTab('valuation');
      if (e.key === '2') setTab('liquidity');
      if (e.key === '3') setTab('integrity');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const data = useMemo(() => {
    if (tab === 'valuation') {
      return {
        tone: 'gold' as const,
        eyebrow: 'The Portal',
        title: 'Valuation Dossier',
        lead: 'A clean answer to a dirty question: is the asking price earned or invented?',
        Icon: Sparkles,
        stats: [
          { k: 'FAIR BAND', v: 'Narrow', note: 'Confidence concentrated in a tight pocket' },
          { k: 'ASKING', v: 'Supported', note: 'No fantasy premium detected' },
          { k: 'EDGE', v: 'Opportunity', note: 'Signals point to best streets' },
        ],
        proof: [
          'Sold evidence and reductions (not list-only noise)',
          'Listing edits, relists and timing pressure',
          'Buyer depth by micro-area and buyer origin',
        ],
        feed: [
          'Comparable cut 6% this week (same pocket, same finish)',
          'Supply stayed tight across 14 days (clean inventory only)',
          'Buyer attention rose in best streets (not the whole area)',
        ],
        cta: 'Open sample dossier',
        proofIcon: ScanEye,
      };
    }

    if (tab === 'liquidity') {
      return {
        tone: 'emerald' as const,
        eyebrow: 'The Portal',
        title: 'Liquidity Dossier',
        lead: 'Speed is the truth in luxury. See how fast clean homes actually move - without the marketing fog.',
        Icon: TrendingUp,
        stats: [
          { k: 'TIME TO SELL', v: 'Short', note: 'Velocity is strong on clean inventory' },
          { k: 'BUYER DEPTH', v: 'Deep', note: 'International demand confirmed' },
          { k: 'CUT RISK', v: 'Low', note: 'Comparables and pricing are clean' },
        ],
        proof: [
          'Time-on-market by pocket and quality tier',
          'Buyer inflow and direction changes',
          'Reductions, relists and stagnation patterns',
        ],
        feed: [
          'Two new buyers entered this pocket (verified demand)',
          'Lower quality stock is sitting longer (drag detected)',
          'Best homes are moving quietly (off-market activity)',
        ],
        cta: 'View liquidity dossier',
        proofIcon: Waves,
      };
    }

    return {
      tone: 'violet' as const,
      eyebrow: 'The Portal',
      title: 'Integrity Log',
      lead: 'Luxury hides risk behind beauty. Surface it early, clearly, and with receipts.',
      Icon: ShieldCheck,
      stats: [
        { k: 'RISK FLAGS', v: 'Low', note: 'No obvious red flags detected' },
        { k: 'CONSISTENCY', v: 'Strong', note: 'Signals cross-checked' },
        { k: 'PROOF LEVEL', v: 'Rising', note: 'Verification expands weekly' },
      ],
      proof: [
        'Ownership and listing alignment checks',
        'Verification across independent sources',
        'Manipulation guards and anomaly detection',
      ],
      feed: [
        'A listing edit was detected and logged (trace preserved)',
        'One source disagreed - flagged for review',
        'Confidence increased as proof landed (status updated)',
      ],
      cta: 'Open integrity log',
      proofIcon: Lock,
    };
  }, [tab]);

  const accentGlow =
    data.tone === 'gold'
      ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(231,201,130,0.26),transparent_62%)]'
      : data.tone === 'emerald'
        ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(16,185,129,0.20),transparent_62%)]'
        : 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(139,92,246,0.20),transparent_62%)]';

  const toneBadge = data.tone === 'gold' ? 'gold' : data.tone === 'emerald' ? 'emerald' : 'violet';

  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute -top-4 inset-x-0">
        <div className="mx-auto h-px w-[92%] bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.28)] to-transparent" />
        <div className="mx-auto mt-2 h-px w-[76%] bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className={cx('relative overflow-hidden rounded-[44px]', CARD)}>
        <div className="pointer-events-none absolute inset-0">
          <div className={cx('absolute inset-0', accentGlow)} />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_6%,rgba(11,12,16,0.04),transparent_64%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-10">
          {/* NEW: portal console bar */}
          <div className={cx('relative overflow-hidden rounded-[28px] px-5 py-4', 'bg-white/72', RING)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(980px_320px_at_20%_0%,rgba(231,201,130,0.14),transparent_60%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
            </div>

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">
                    <span className="inline-flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 opacity-70" />
                      THE PORTAL
                    </span>
                  </Badge>
                  <Badge tone={toneBadge}>Mode</Badge>
                  <Badge tone="neutral">Press 1 / 2 / 3</Badge>
                  <Badge tone="neutral">Sample dossier</Badge>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <span className={cx('mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
                    <data.Icon className="h-5 w-5 opacity-85" />
                  </span>

                  <div className="min-w-0">
                    <div className="text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[22px]">
                      {data.title}
                    </div>
                    <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{data.lead}</div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[520px]">
                <div className="grid gap-2 sm:grid-cols-3">
                  <ModeButton
                    active={tab === 'valuation'}
                    kbd="1"
                    title="Valuation"
                    subtitle="Is it earned?"
                    Icon={Sparkles}
                    tone="gold"
                    onClick={() => setTab('valuation')}
                  />
                  <ModeButton
                    active={tab === 'liquidity'}
                    kbd="2"
                    title="Liquidity"
                    subtitle="How fast?"
                    Icon={TrendingUp}
                    tone="emerald"
                    onClick={() => setTab('liquidity')}
                  />
                  <ModeButton
                    active={tab === 'integrity'}
                    kbd="3"
                    title="Integrity"
                    subtitle="Hidden risk?"
                    Icon={ShieldCheck}
                    tone="violet"
                    onClick={() => setTab('integrity')}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <div className="text-[11px] text-[color:var(--ink-3)]">
                    Portal rule: <span className="text-[color:var(--ink-2)]">no hype, only what can be proven.</span>
                  </div>
                  <Badge tone="gold">Royal-grade</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: dossier layout */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className={cx('relative overflow-hidden rounded-[34px] p-6', CARD)}>
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
                  <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">DOSSIER SNAPSHOT</div>
                      <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                        What you’d see on a portal listing
                      </div>
                    </div>
                    <Badge tone={toneBadge}>Preview</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {data.stats.map((s) => (
                      <MiniStat key={s.k} k={s.k} v={s.v} note={s.note} tone={data.tone} />
                    ))}
                  </div>

                  <div className="mt-4 rounded-[26px] bg-white/72 p-5 ring-1 ring-inset ring-[color:var(--hairline)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">LISTING (SAMPLE)</div>
                        <div className="mt-2 text-[14px] font-semibold text-[color:var(--ink)]">
                          5-bed villa, sea view, gated pocket
                        </div>
                        <div className="mt-1 text-[12px] text-[color:var(--ink-3)]">Prime hillside · Quiet street · International demand</div>
                      </div>

                      <div className={cx('shrink-0 rounded-2xl bg-white/82 px-3 py-2', RING)}>
                        <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">ASKING</div>
                        <div className="mt-1 text-[13px] font-semibold text-[color:var(--ink)]">€4.95m</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/78 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                      <div className="text-[12px] text-[color:var(--ink-2)]">
                        One glance = decision clarity.
                        <div className="text-[11px] text-[color:var(--ink-3)]">Then you open the proof trail.</div>
                      </div>
                      <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]', RING, 'bg-white/86 text-[color:var(--ink-2)]')}>
                        View dossier <ChevronRight className="h-4 w-4 opacity-70" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proof Trail */}
              <div className={cx('mt-4 relative overflow-hidden rounded-[34px] p-6', CARD)}>
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_18%_-10%,rgba(231,201,130,0.12),transparent_62%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                </div>

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={cx('mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
                      <data.proofIcon className="h-5 w-5 opacity-80" />
                    </span>
                    <div>
                      <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">PROOF TRAIL</div>
                      <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                        What the portal verifies before it speaks
                      </div>
                      <div className="mt-1 text-[12px] text-[color:var(--ink-3)]">Short list. High signal. Logged.</div>
                    </div>
                  </div>
                  <Badge tone={toneBadge}>Verification</Badge>
                </div>

                <div className="relative mt-4 grid gap-2">
                  {data.proof.map((p) => (
                    <FeedRow key={p} label="check" text={p} />
                  ))}
                </div>

                <div className={cx('relative mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                  <div className="text-[12px] text-[color:var(--ink-2)]">
                    The dossier is the product.
                    <div className="text-[11px] text-[color:var(--ink-3)]">Portal-friendly: short, decisive, beautiful.</div>
                  </div>
                  <button
                    type="button"
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                      'bg-white/78 hover:bg-white/92',
                      RING,
                      'text-[color:var(--ink)]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
                    )}
                  >
                    {data.cta} <ArrowRight className="h-4 w-4 opacity-75" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Feed column */}
            <div className="lg:col-span-4">
              <div className={cx('relative overflow-hidden rounded-[34px] p-6', CARD)}>
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_86%_-10%,rgba(139,92,246,0.12),transparent_62%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                </div>

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">LIVE FEED</div>
                    <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      Signals coming through the portal
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--ink-3)]">Examples only. Wiring next.</div>
                  </div>
                  <Badge tone={toneBadge}>Just in</Badge>
                </div>

                <div className="relative mt-4 grid gap-2">
                  {data.feed.map((s) => (
                    <FeedRow key={s} label="signal" text={s} />
                  ))}
                </div>

                <div className={cx('relative mt-4 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                  <div className="text-[12px] text-[color:var(--ink-2)]">
                    Next: real listings, real signals.
                    <div className="text-[11px] text-[color:var(--ink-3)]">This becomes interactive per listing.</div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                        'bg-white/78 hover:bg-white/92',
                        RING,
                        'text-[color:var(--ink)]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
                      )}
                    >
                      View portal demo <ArrowRight className="h-4 w-4 opacity-75" />
                    </button>

                    <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px]', 'bg-white/66', RING, 'text-[color:var(--ink-2)]')}>
                      <span className="font-mono text-[11px] opacity-80">/</span> Search is the product
                    </span>
                  </div>
                </div>
              </div>

              <div className={cx('mt-4 rounded-2xl px-4 py-3 text-[12px]', 'bg-white/72', RING, 'text-[color:var(--ink-2)]')}>
                Portal language: clean, decisive, and calm.
                <span className="text-[color:var(--ink-3)]"> No dashboard vibes.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--ink-3)]">
            <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
              Tip: switch modes fast with <span className="font-mono text-[10px] text-[color:var(--ink-2)]">1</span>,{' '}
              <span className="font-mono text-[10px] text-[color:var(--ink-2)]">2</span>,{' '}
              <span className="font-mono text-[10px] text-[color:var(--ink-2)]">3</span>
            </span>
            <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
              The product is the dossier.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
