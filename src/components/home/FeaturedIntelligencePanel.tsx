// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Lock, ScanEye, Waves } from 'lucide-react';

type TabKey = 'value' | 'liquidity' | 'risk';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function isEditableTarget(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
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
  tone?: 'neutral' | 'gold' | 'violet' | 'emerald';
}) {
  const toneCls =
    tone === 'gold'
      ? 'bg-[rgba(231,201,130,0.14)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(231,201,130,0.34)]'
      : tone === 'emerald'
        ? 'bg-[rgba(16,185,129,0.12)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(16,185,129,0.22)]'
        : tone === 'violet'
          ? 'bg-[rgba(139,92,246,0.12)] text-[color:var(--ink)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)]'
          : 'bg-white/72 text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] backdrop-blur-[14px]',
        toneCls,
      )}
    >
      {children}
    </span>
  );
}

function PortalTab({
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
      ? 'bg-[radial-gradient(520px_220px_at_16%_0%,rgba(231,201,130,0.24),transparent_62%)]'
      : tone === 'emerald'
        ? 'bg-[radial-gradient(520px_220px_at_16%_0%,rgba(16,185,129,0.20),transparent_62%)]'
        : 'bg-[radial-gradient(520px_220px_at_16%_0%,rgba(139,92,246,0.20),transparent_62%)]';

  const activeRing =
    tone === 'gold'
      ? 'ring-1 ring-inset ring-[rgba(231,201,130,0.38)] shadow-[0_26px_90px_rgba(231,201,130,0.10)]'
      : tone === 'emerald'
        ? 'ring-1 ring-inset ring-[rgba(16,185,129,0.30)] shadow-[0_26px_90px_rgba(16,185,129,0.08)]'
        : 'ring-1 ring-inset ring-[rgba(139,92,246,0.30)] shadow-[0_26px_90px_rgba(139,92,246,0.08)]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
        active ? cx('bg-white/85', activeRing) : cx('bg-white/62', RING, 'hover:bg-white/78'),
      )}
      aria-pressed={active}
    >
      <div
        className={cx(
          'pointer-events-none absolute inset-0 opacity-0 transition',
          active ? 'opacity-100' : 'group-hover:opacity-100',
        )}
      >
        <div className={cx('absolute inset-0', glow)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex items-start gap-3">
        <span className={cx('inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
          <Icon className={cx('h-[18px] w-[18px] transition', active ? 'opacity-90' : 'opacity-70')} />
        </span>

        <div className="min-w-0">
          <div
            className={cx(
              'text-[13px] font-semibold tracking-[-0.01em]',
              active ? 'text-[color:var(--ink)]' : 'text-[color:var(--ink-2)]',
            )}
          >
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

function PortalCard({
  eyebrow,
  title,
  items,
  chip,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  items: Array<{ k: string; v: string; note?: string }>;
  chip: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px] p-5', CARD)}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/82', RING)}>
              <Icon className="h-4 w-4 opacity-80" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">{eyebrow}</div>
              <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{title}</div>
            </div>
          </div>
        </div>
        {chip}
      </div>

      <div className="relative mt-4 grid gap-2">
        {items.map((it) => (
          <div key={it.k} className={cx('rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{it.k}</div>
              <div className="text-[10px] text-[color:var(--ink-3)]">portal log</div>
            </div>
            <div className="mt-2 text-[13px] leading-snug text-[color:var(--ink-2)]">{it.v}</div>
            {it.note ? <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">{it.note}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');
  const sectionRef = useRef<HTMLElement | null>(null);

  // ✅ Hotkeys: 1/2/3 switch modes (ignored while typing)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target as Element | null)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '1') setTab('value');
      if (e.key === '2') setTab('liquidity');
      if (e.key === '3') setTab('risk');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const content = useMemo(() => {
    if (tab === 'value') {
      return {
        tone: 'gold' as const,
        eyebrow: 'The Portal',
        title: 'Enter Valuation',
        lead: 'A clean answer to a dirty question: is the asking price earned or invented?',
        sub: 'Plain language, backed by a proof trail.',
        badgeA: 'Portal lens',
        badgeB: 'Valuation',
        heroIcon: Sparkles,
        stats: [
          { label: 'FAIR BAND', value: 'Narrow', note: 'Confidence concentrated in a tight pocket' },
          { label: 'ASKING', value: 'Within band', note: 'No fantasy premium detected' },
          { label: 'EDGE', value: 'Opportunity', note: 'Signals point to best streets' },
        ],
        bullets: [
          'Cuts through “luxury narrative” pricing in seconds',
          'Shows what matters before you fly in',
          'Ends with a next move you can act on',
        ],
        proofEyebrow: 'PORTAL CHECKS',
        proofTitle: 'What gets verified before a claim',
        proofIcon: ScanEye,
        proofChip: <Badge tone="gold">Proof-first</Badge>,
        proof: [
          { k: 'Comps', v: 'Sold evidence and reductions (not list-only)', note: 'Weighting shifts by micro-area.' },
          { k: 'History', v: 'Relists, edits and timing patterns', note: 'Narrative changes are logged.' },
          { k: 'Demand', v: 'Buyer depth by pocket and buyer origin', note: 'Where the real heat sits.' },
        ],
        signalsTitle: 'Signals coming through the portal',
        signals: [
          'A comparable cut 6% this week (same pocket, same finish)',
          'Supply stayed tight across 14 days (clean inventory)',
          'Buyer attention rose in best streets (not the whole area)',
        ],
        ctaLabel: 'Open sample dossier',
      };
    }

    if (tab === 'liquidity') {
      return {
        tone: 'emerald' as const,
        eyebrow: 'The Portal',
        title: 'Enter Liquidity',
        lead: 'Speed is the truth in luxury. See how fast clean homes actually move - without the marketing fog.',
        sub: 'Timing, velocity and buyer depth in one view.',
        badgeA: 'Portal lens',
        badgeB: 'Liquidity',
        heroIcon: TrendingUp,
        stats: [
          { label: 'TIME TO SELL', value: 'Short', note: 'Velocity is strong on clean inventory' },
          { label: 'BUYER DEPTH', value: 'Deep', note: 'International demand confirmed' },
          { label: 'CUT RISK', value: 'Low', note: 'Comparables and pricing are clean' },
        ],
        bullets: [
          'Stops you overpaying for illiquid “prime” pockets',
          'Helps you time offers instead of chasing',
          'Shows where deals happen quietly off-market',
        ],
        proofEyebrow: 'PORTAL CHECKS',
        proofTitle: 'What gets measured (not guessed)',
        proofIcon: Waves,
        proofChip: <Badge tone="emerald">Velocity layer</Badge>,
        proof: [
          { k: 'Turnover', v: 'Time-on-market by pocket and quality tier', note: 'Clean vs compromised inventory.' },
          { k: 'Buyers', v: 'Buyer inflow and direction changes', note: 'Where demand is truly building.' },
          { k: 'Cuts', v: 'Reductions, relists and stagnation patterns', note: 'Signals before headlines.' },
        ],
        signalsTitle: 'Signals coming through the portal',
        signals: [
          'Two new buyers entered this pocket (verified demand)',
          'Lower quality stock is sitting longer (drag detected)',
          'Best homes are moving quietly (off-market activity)',
        ],
        ctaLabel: 'View liquidity dossier',
      };
    }

    return {
      tone: 'violet' as const,
      eyebrow: 'The Portal',
      title: 'Enter Integrity',
      lead: 'Luxury hides risk behind beauty. Vantera surfaces it early, clearly, and with receipts.',
      sub: 'Clean facts, clean history, clean signals.',
      badgeA: 'Portal lens',
      badgeB: 'Integrity',
      heroIcon: ShieldCheck,
      stats: [
        { label: 'RISK FLAGS', value: 'Low', note: 'No obvious red flags detected' },
        { label: 'DATA QUALITY', value: 'Strong', note: 'Signals cross-checked' },
        { label: 'PROOF LEVEL', value: 'Rising', note: 'Verification expands weekly' },
      ],
      bullets: [
        'Detects suspicious distortions before you commit',
        'Keeps a complete change history (no surprises)',
        'Built for outcomes, not clicks',
      ],
      proofEyebrow: 'PORTAL CHECKS',
      proofTitle: 'What gets locked before trust',
      proofIcon: Lock,
      proofChip: <Badge tone="violet">Integrity layer</Badge>,
      proof: [
        { k: 'Consistency', v: 'Ownership and listing alignment checks', note: 'Mismatch equals caution.' },
        { k: 'Cross-source', v: 'Verification across independent sources', note: 'Disagreement is flagged.' },
        { k: 'Anomalies', v: 'Manipulation guards and anomaly detection', note: 'Noise gets filtered.' },
      ],
      signalsTitle: 'Signals coming through the portal',
      signals: [
        'A listing edit was detected and logged (trace preserved)',
        'One source disagreed - flagged for review',
        'Confidence increased as proof landed (status updated)',
      ],
      ctaLabel: 'Open integrity log',
    };
  }, [tab]);

  const tabs = useMemo(
    () =>
      [
        { k: 'value' as const, title: 'Valuation', subtitle: 'Is the price earned?', kbd: '1', Icon: Sparkles, tone: 'gold' as const },
        { k: 'liquidity' as const, title: 'Liquidity', subtitle: 'How fast does it move?', kbd: '2', Icon: TrendingUp, tone: 'emerald' as const },
        { k: 'risk' as const, title: 'Integrity', subtitle: 'Any hidden risk?', kbd: '3', Icon: ShieldCheck, tone: 'violet' as const },
      ] as const,
    [],
  );

  const accentGlow =
    content.tone === 'gold'
      ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(231,201,130,0.24),transparent_62%)]'
      : content.tone === 'emerald'
        ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(16,185,129,0.18),transparent_62%)]'
        : 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(139,92,246,0.18),transparent_62%)]';

  const toneBadge = content.tone === 'gold' ? 'gold' : content.tone === 'emerald' ? 'emerald' : 'violet';

  return (
    <section
      // ✅ Important: callback ref must return void (not the element)
      ref={(n) => {
        sectionRef.current = n;
      }}
      className="relative"
    >
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
                <Badge tone={toneBadge}>{content.badgeA}</Badge>
                <Badge tone="neutral">Sample dossier</Badge>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span className={cx('mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/82', RING)}>
                  <content.heroIcon className="h-5 w-5 opacity-85" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">
                    {content.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-2)]">{content.lead}</p>
                  <p className="mt-2 text-[13px] text-[color:var(--ink-3)]">{content.sub}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone={toneBadge}>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)] shadow-[0_0_0_3px_rgba(231,201,130,0.14)]" />
                    Portal output: proof + plain language
                  </span>
                </Badge>
                <Badge tone="neutral">Typos allowed</Badge>
                <Badge tone="neutral">Keywords included</Badge>
              </div>
            </div>

            {/* Portal Selector */}
            <div className="w-full lg:w-[460px]">
              <div className={cx('rounded-[30px] p-3', 'bg-white/72', RING, 'shadow-[0_22px_70px_rgba(11,12,16,0.08)]')}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">PORTAL MODES</div>
                  <div className="text-[10px] text-[color:var(--ink-3)]">Choose your entrance</div>
                </div>

                <div className="mt-3 grid gap-2">
                  {tabs.map((t) => (
                    <PortalTab
                      key={t.k}
                      active={tab === t.k}
                      kbd={t.kbd}
                      title={t.title}
                      subtitle={t.subtitle}
                      Icon={t.Icon}
                      tone={t.tone}
                      onClick={() => setTab(t.k)}
                    />
                  ))}
                </div>

                <div className={cx('mt-3 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] text-[color:var(--ink-2)]">
                      Portal rule
                      <div className="text-[11px] text-[color:var(--ink-3)]">No hype. Only what can be proven.</div>
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

          {/* Stats */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {content.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} note={s.note} tone={content.tone} />
            ))}
          </div>

          {/* Proof + Signals */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <PortalCard
                eyebrow={content.proofEyebrow}
                title={content.proofTitle}
                items={content.proof}
                icon={content.proofIcon}
                chip={content.proofChip}
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
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                      PORTAL SIGNALS
                    </div>
                    <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      {content.signalsTitle}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--ink-3)]">Examples only. Wiring next.</div>
                  </div>

                  <Badge tone={toneBadge}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.55)] shadow-[0_0_0_3px_rgba(11,12,16,0.10)]" />
                      Just in
                    </span>
                  </Badge>
                </div>

                <div className="relative mt-4 grid gap-2">
                  {content.signals.map((a) => (
                    <div key={a} className={cx('relative overflow-hidden rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                      <div className="pointer-events-none absolute inset-0 opacity-70">
                        <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[rgba(139,92,246,0.10)] blur-3xl" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">SIGNAL</div>
                          <div className="text-[10px] text-[color:var(--ink-3)]">sample</div>
                        </div>
                        <div className="mt-2 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{a}</div>
                        <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">Logged to the dossier trail.</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={cx('relative mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3', 'bg-white/72', RING)}>
                  <div className="text-[12px] text-[color:var(--ink-2)]">
                    Want this on a real listing?
                    <div className="text-[11px] text-[color:var(--ink-3)]">Next: connect verified inventory.</div>
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
                    {content.ctaLabel} <ArrowRight className="h-4 w-4 opacity-75" />
                  </button>
                </div>
              </div>

              <div className={cx('mt-4 rounded-2xl px-4 py-3 text-[12px]', 'bg-white/72', RING, 'text-[color:var(--ink-2)]')}>
                This is the portal layer: proof + signals + clear decisions.
                <span className="text-[color:var(--ink-3)]"> Next we wire it to real listings and real market data.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tiny help row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--ink-3)]">
        <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
          Tip: switch modes fast with <span className="font-mono text-[10px] text-[color:var(--ink-2)]">1</span>,{' '}
          <span className="font-mono text-[10px] text-[color:var(--ink-2)]">2</span>,{' '}
          <span className="font-mono text-[10px] text-[color:var(--ink-2)]">3</span>
        </span>
        <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70', RING)}>
          The product is the dossier.
        </span>
      </div>
    </section>
  );
}
