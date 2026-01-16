// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ScanEye,
  Lock,
  Globe,
  ChevronRight,
} from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'integrity';

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

  return (
    <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]', cls)}>
      {children}
    </span>
  );
}

function Pill({
  title,
  subtitle,
  active,
  onClick,
  tone,
  Icon,
  kbd,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  tone: 'gold' | 'emerald' | 'violet';
  Icon: React.ComponentType<{ className?: string }>;
  kbd: string;
}) {
  const glow =
    tone === 'gold'
      ? 'bg-[radial-gradient(700px_260px_at_20%_0%,rgba(231,201,130,0.24),transparent_62%)]'
      : tone === 'emerald'
        ? 'bg-[radial-gradient(700px_260px_at_20%_0%,rgba(16,185,129,0.20),transparent_62%)]'
        : 'bg-[radial-gradient(700px_260px_at_20%_0%,rgba(139,92,246,0.20),transparent_62%)]';

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
        active ? cx('bg-white/86', activeRing) : cx('bg-white/62', RING, 'hover:bg-white/78'),
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

function Stat({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
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
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{label}</div>
        </div>
        <div className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{value}</div>
        {note ? <div className="mt-1 text-[12px] leading-snug text-[color:var(--ink-2)]">{note}</div> : null}
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  note,
}: {
  k: string;
  v: string;
  note?: string;
}) {
  return (
    <div className={cx('relative overflow-hidden rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[rgba(11,12,16,0.06)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{k}</div>
          <div className="text-[10px] text-[color:var(--ink-3)]">logged</div>
        </div>
        <div className="mt-2 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{v}</div>
        {note ? <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">{note}</div> : null}
      </div>
    </div>
  );
}

function GhostListing() {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px] p-5', 'bg-white/72', RING, 'shadow-[0_18px_60px_rgba(11,12,16,0.10)]')}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(231,201,130,0.12),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">
              <span className="inline-flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 opacity-70" />
                Portal preview
              </span>
            </Badge>
            <Badge tone="gold">Sample listing</Badge>
            <Badge tone="neutral">Private</Badge>
          </div>

          <div className="mt-4 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
            5-bed villa, sea view, gated pocket
          </div>

          <div className="mt-1 text-[12px] text-[color:var(--ink-3)]">
            Marbella index · Prime hillside · Quiet street
          </div>
        </div>

        <div className={cx('shrink-0 rounded-2xl bg-white/80 px-3 py-2', RING)}>
          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">ASKING</div>
          <div className="mt-1 text-[13px] font-semibold text-[color:var(--ink)]">€4.95m</div>
        </div>
      </div>

      <div className="relative mt-4 grid gap-2">
        <div className="grid grid-cols-3 gap-2">
          <div className={cx('rounded-2xl bg-white/78 px-3 py-3', RING)}>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">FAIR RANGE</div>
            <div className="mt-2 text-[12px] font-semibold text-[color:var(--ink)]">€4.6m - €5.1m</div>
          </div>
          <div className={cx('rounded-2xl bg-white/78 px-3 py-3', RING)}>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">VELOCITY</div>
            <div className="mt-2 text-[12px] font-semibold text-[color:var(--ink)]">Strong</div>
          </div>
          <div className={cx('rounded-2xl bg-white/78 px-3 py-3', RING)}>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">INTEGRITY</div>
            <div className="mt-2 text-[12px] font-semibold text-[color:var(--ink)]">Clean</div>
          </div>
        </div>

        <div className={cx('rounded-2xl bg-white/78 px-4 py-3', RING)}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] text-[color:var(--ink-2)]">
              This is what a portal should feel like.
              <div className="text-[11px] text-[color:var(--ink-3)]">One glance = decision clarity.</div>
            </div>

            <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]', RING, 'bg-white/82 text-[color:var(--ink-2)]')}>
              View dossier <ChevronRight className="h-4 w-4 opacity-70" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');

  // Fast portal switching: 1 / 2 / 3
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') setTab('value');
      if (e.key === '2') setTab('liquidity');
      if (e.key === '3') setTab('integrity');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const model = useMemo(() => {
    if (tab === 'value') {
      return {
        tone: 'gold' as const,
        chip: 'Valuation portal',
        title: 'Price clarity, instantly',
        lead:
          'Not “what they want”. What it is worth, what supports it and where the story breaks.',
        Icon: Sparkles,
        stats: [
          { label: 'FAIR BAND', value: 'Narrow', note: 'Confidence concentrated in a tight pocket' },
          { label: 'ASKING', value: 'Supported', note: 'No fantasy premium detected' },
          { label: 'EDGE', value: 'Opportunity', note: 'Signals point to best streets' },
        ],
        checksTitle: 'What gets checked before a price claim',
        checksIcon: ScanEye,
        checks: [
          { k: 'Sold evidence', v: 'Comparable sales and reductions, not list-only noise', note: 'Weighted by micro-area.' },
          { k: 'Listing behaviour', v: 'Relists, edits and timing patterns that reveal pressure', note: 'Narrative changes are logged.' },
          { k: 'Buyer signal', v: 'Where demand is real (and where it is theatre)', note: 'Pocket-by-pocket.' },
        ],
        signalsTitle: 'Portal signals (examples)',
        signals: [
          'A comparable cut 6% this week (same pocket, same finish)',
          'Supply stayed tight across 14 days (clean inventory only)',
          'Buyer attention rose in best streets (not the whole area)',
        ],
        cta: 'Open valuation dossier',
      };
    }

    if (tab === 'liquidity') {
      return {
        tone: 'emerald' as const,
        chip: 'Liquidity portal',
        title: 'How fast does it move?',
        lead:
          'Luxury is about timing. See velocity, buyer depth and price-cut pressure in one clean view.',
        Icon: TrendingUp,
        stats: [
          { label: 'VELOCITY', value: 'Strong', note: 'Clean inventory moves faster than listings suggest' },
          { label: 'BUYER DEPTH', value: 'Deep', note: 'International demand confirmed' },
          { label: 'CUT PRESSURE', value: 'Low', note: 'Less forced discounting in this pocket' },
        ],
        checksTitle: 'What gets measured (not guessed)',
        checksIcon: TrendingUp,
        checks: [
          { k: 'Time to sell', v: 'Time-on-market by pocket and quality tier', note: 'Clean vs compromised inventory.' },
          { k: 'Buyer inflow', v: 'Buyer entry points and direction changes', note: 'Where demand is building.' },
          { k: 'Cuts + relists', v: 'Reductions, relists and stagnation patterns', note: 'Signals before headlines.' },
        ],
        signalsTitle: 'Portal signals (examples)',
        signals: [
          'Two new buyers entered this pocket (verified demand)',
          'Lower quality stock is sitting longer (drag detected)',
          'Best homes are moving quietly (off-market activity)',
        ],
        cta: 'Open liquidity dossier',
      };
    }

    return {
      tone: 'violet' as const,
      chip: 'Integrity portal',
      title: 'Any hidden risk?',
      lead:
        'Before you fall in love, run integrity. Clean history, cross-checks and early flags with receipts.',
      Icon: ShieldCheck,
      stats: [
        { label: 'FLAGS', value: 'Low', note: 'No obvious red flags detected' },
        { label: 'CONSISTENCY', value: 'Strong', note: 'Signals cross-checked' },
        { label: 'PROOF LEVEL', value: 'Rising', note: 'Verification expands weekly' },
      ],
      checksTitle: 'What gets locked before trust',
      checksIcon: Lock,
      checks: [
        { k: 'Consistency', v: 'Ownership and listing alignment checks', note: 'Mismatch equals caution.' },
        { k: 'Cross-source proof', v: 'Verification across independent sources', note: 'Disagreement is flagged.' },
        { k: 'Anomaly guard', v: 'Manipulation detection and change history', note: 'Noise gets filtered.' },
      ],
      signalsTitle: 'Portal signals (examples)',
      signals: [
        'A listing edit was detected and logged (trace preserved)',
        'One source disagreed - flagged for review',
        'Confidence increased as proof landed (status updated)',
      ],
      cta: 'Open integrity dossier',
    };
  }, [tab]);

  const accentGlow =
    model.tone === 'gold'
      ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(231,201,130,0.26),transparent_62%)]'
      : model.tone === 'emerald'
        ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(16,185,129,0.20),transparent_62%)]'
        : 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(139,92,246,0.20),transparent_62%)]';

  const toneBadge = model.tone === 'gold' ? 'gold' : model.tone === 'emerald' ? 'emerald' : 'violet';

  return (
    <section className="relative">
      {/* Crown lines */}
      <div aria-hidden className="pointer-events-none absolute -top-4 inset-x-0">
        <div className="mx-auto h-px w-[92%] bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.28)] to-transparent" />
        <div className="mx-auto mt-2 h-px w-[76%] bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className={cx('relative overflow-hidden rounded-[44px]', CARD)}>
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className={cx('absolute inset-0', accentGlow)} />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_6%,rgba(11,12,16,0.04),transparent_64%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-10">
          {/* New: portal header that reads like a luxury portal feature */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-[64ch]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">
                  <span className="font-semibold tracking-[0.22em]">FEATURED</span>
                </Badge>
                <Badge tone={toneBadge}>{model.chip}</Badge>
                <Badge tone="neutral">Press 1 / 2 / 3</Badge>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span className={cx('mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
                  <model.Icon className="h-5 w-5 opacity-85" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[36px]">
                    {model.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-2)]">{model.lead}</p>
                </div>
              </div>
            </div>

            {/* New: selector is now a "Portal Console" */}
            <div className="w-full lg:w-[480px]">
              <div className={cx('rounded-[34px] p-3', 'bg-white/72', RING, 'shadow-[0_22px_70px_rgba(11,12,16,0.08)]')}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                    PORTAL CONSOLE
                  </div>
                  <div className="text-[10px] text-[color:var(--ink-3)]">Choose your entrance</div>
                </div>

                <div className="mt-3 grid gap-2">
                  <Pill
                    title="Valuation"
                    subtitle="Is the asking price earned?"
                    active={tab === 'value'}
                    onClick={() => setTab('value')}
                    tone="gold"
                    Icon={Sparkles}
                    kbd="1"
                  />
                  <Pill
                    title="Liquidity"
                    subtitle="How fast does it move?"
                    active={tab === 'liquidity'}
                    onClick={() => setTab('liquidity')}
                    tone="emerald"
                    Icon={TrendingUp}
                    kbd="2"
                  />
                  <Pill
                    title="Integrity"
                    subtitle="Any hidden risk?"
                    active={tab === 'integrity'}
                    onClick={() => setTab('integrity')}
                    tone="violet"
                    Icon={ShieldCheck}
                    kbd="3"
                  />
                </div>

                <div className={cx('mt-3 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] text-[color:var(--ink-2)]">
                      Portal rule
                      <div className="text-[11px] text-[color:var(--ink-3)]">If it can’t be verified, it can’t lead.</div>
                    </div>
                    <Badge tone="gold">Royal-grade</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New: show a "portal listing preview" like a real portal feature */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <GhostListing />
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {model.stats.map((s) => (
                  <Stat key={s.label} label={s.label} value={s.value} note={s.note} tone={model.tone} />
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-12">
                {/* Dossier checks */}
                <div className="lg:col-span-7">
                  <div className={cx('relative overflow-hidden rounded-[30px] p-5', CARD)}>
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                      <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/82', RING)}>
                            <model.checksIcon className="h-4 w-4 opacity-80" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                              DOSSIER CHECKS
                            </div>
                            <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                              {model.checksTitle}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Badge tone={toneBadge}>Proof trail</Badge>
                    </div>

                    <div className="relative mt-4 grid gap-2">
                      {model.checks.map((it) => (
                        <Row key={it.k} k={it.k} v={it.v} note={it.note} />
                      ))}
                    </div>

                    <div className={cx('relative mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                      <div className="text-[12px] text-[color:var(--ink-2)]">
                        Built for portal speed.
                        <div className="text-[11px] text-[color:var(--ink-3)]">One glance. Then the receipts.</div>
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
                        {model.cta} <ArrowRight className="h-4 w-4 opacity-75" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Signals */}
                <div className="lg:col-span-5">
                  <div className={cx('relative overflow-hidden rounded-[30px] p-5', CARD)}>
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                      <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_86%_-10%,rgba(139,92,246,0.12),transparent_62%)]" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                    </div>

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                          PORTAL SIGNALS
                        </div>
                        <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                          {model.signalsTitle}
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--ink-3)]">Examples only. Wiring next.</div>
                      </div>

                      <Badge tone={toneBadge}>Just in</Badge>
                    </div>

                    <div className="relative mt-4 grid gap-2">
                      {model.signals.map((s) => (
                        <Row key={s} k="signal" v={s} note="Added to the trail." />
                      ))}
                    </div>

                    <div className={cx('relative mt-4 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                      <div className="text-[12px] text-[color:var(--ink-2)]">
                        Next: real listings, real signals.
                        <div className="text-[11px] text-[color:var(--ink-3)]">
                          This panel becomes interactive per listing.
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
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
                    Portal-friendly output: short, decisive, and beautiful.
                    <span className="text-[color:var(--ink-3)]"> The dossier is the authority.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Micro footer */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--ink-3)]">
            <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
              Switch fast: <span className="font-mono text-[10px] text-[color:var(--ink-2)]">1</span>{' '}
              <span className="font-mono text-[10px] text-[color:var(--ink-2)]">2</span>{' '}
              <span className="font-mono text-[10px] text-[color:var(--ink-2)]">3</span>
            </span>
            <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
              Designed to feel like a premium portal feature.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
