// src/components/home/FeaturedIntelligencePanel.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Lock,
  ScanEye,
  Waves,
  ChevronDown,
  MapPin,
} from 'lucide-react';

import { CITIES, type City } from '@/components/home/cities';

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
        active ? cx('bg-white/86', activeRing) : cx('bg-white/66', RING, 'hover:bg-white/80'),
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
        <span className={cx('inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/86', RING)}>
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
            active ? 'bg-white/90 text-[color:var(--ink-2)]' : 'bg-white/66 text-[color:var(--ink-3)]',
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
      <div className="pointer-events-none absolute inset-0 opacity-70">
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
            <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/86', RING)}>
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
          <div key={it.k} className={cx('rounded-2xl px-4 py-3', 'bg-white/74', RING)}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">{it.k}</div>
              <div className="text-[10px] text-[color:var(--ink-3)]">log</div>
            </div>
            <div className="mt-2 text-[13px] leading-snug text-[color:var(--ink-2)]">{it.v}</div>
            {it.note ? <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">{it.note}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CityPicker({
  value,
  onChange,
  options,
}: {
  value: City;
  onChange: (slug: string) => void;
  options: City[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-city-picker]')) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative" data-city-picker>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          'group inline-flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition',
          'bg-white/74 hover:bg-white/84',
          RING,
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
        )}
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/88', RING)}>
              <MapPin className="h-4 w-4 opacity-80" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                CITY INTELLIGENCE
              </span>
              <span className="mt-1 block truncate text-[14px] font-semibold text-[color:var(--ink)]">{value.name}</span>
            </span>
          </span>
        </span>

        <ChevronDown className={cx('h-4 w-4 opacity-70 transition', open ? 'rotate-180' : '')} />
      </button>

      {open ? (
        <div
          className={cx(
            'absolute right-0 z-20 mt-2 w-[min(520px,calc(100vw-32px))] overflow-hidden rounded-2xl',
            'bg-[rgba(255,255,255,0.92)] backdrop-blur-[18px]',
            'ring-1 ring-inset ring-[rgba(11,12,16,0.10)]',
            'shadow-[0_40px_110px_rgba(11,12,16,0.18)]',
          )}
        >
          <div className="px-4 py-3 text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            SELECT CITY
          </div>

          <div className="max-h-[320px] overflow-auto p-2">
            {options.map((c) => {
              const active = c.slug === value.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    onChange(c.slug);
                    setOpen(false);
                  }}
                  className={cx(
                    'w-full rounded-2xl px-3 py-2.5 text-left transition',
                    active ? 'bg-white/92' : 'hover:bg-white/80',
                    'ring-1 ring-inset ring-[rgba(11,12,16,0.08)]',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">{c.name}</div>
                      <div className="mt-1 truncate text-[12px] text-[color:var(--ink-3)]">
                        {c.country}
                        {c.region ? ` · ${c.region}` : ''}
                      </div>
                    </div>

                    {active ? (
                      <span className="rounded-full bg-[rgba(11,12,16,0.06)] px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase text-[color:var(--ink-2)]">
                        active
                      </span>
                    ) : (
                      <span className="rounded-full bg-[rgba(11,12,16,0.04)] px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase text-[color:var(--ink-3)]">
                        open
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[rgba(11,12,16,0.08)] px-4 py-3 text-[12px] text-[color:var(--ink-2)]">
            Clean, city-by-city intelligence. Listings connect next.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function FeaturedIntelligencePanel() {
  const [tab, setTab] = useState<TabKey>('value');
  const [citySlug, setCitySlug] = useState<string>('marbella');
  const sectionRef = useRef<HTMLElement | null>(null);

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

  const allCities = useMemo(() => {
    // Keep it tight and premium: only cities with images first
    const sorted = [...CITIES].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    return sorted;
  }, []);

  const city = useMemo(() => {
    return allCities.find((c) => c.slug === citySlug) ?? allCities[0];
  }, [allCities, citySlug]);

  const toneBadge = useMemo(() => {
    if (tab === 'value') return 'gold' as const;
    if (tab === 'liquidity') return 'emerald' as const;
    return 'violet' as const;
  }, [tab]);

  const accentGlow =
    toneBadge === 'gold'
      ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(231,201,130,0.24),transparent_62%)]'
      : toneBadge === 'emerald'
        ? 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(16,185,129,0.18),transparent_62%)]'
        : 'bg-[radial-gradient(1200px_520px_at_12%_-10%,rgba(139,92,246,0.18),transparent_62%)]';

  const content = useMemo(() => {
    const cityLine = `${city.name} · ${city.country}`;

    // Premium-but-honest placeholders (until metrics are wired)
    const tierLabel = (city.tier ?? 'TIER_3').replace('_', ' ');
    const statusLabel = city.status ?? 'EXPANDING';

    if (tab === 'value') {
      return {
        tone: 'gold' as const,
        eyebrow: 'Intelligence',
        title: 'Valuation Dossier',
        lead: `Price truth for ${cityLine}. Evidence-weighted comp logic, reductions, and pocket discipline.`,
        badgeA: 'Proof-first',
        badgeB: tierLabel,
        badgeC: statusLabel,
        heroIcon: Sparkles,
        stats: [
          { label: 'FAIR BAND', value: 'Calibrating', note: 'Wire comps + reductions per pocket' },
          { label: 'ASKING', value: 'Under review', note: 'Flag fantasy premiums vs earned pricing' },
          { label: 'EDGE', value: 'Street-level', note: 'Best streets emerge first, not broad averages' },
        ],
        proofEyebrow: 'CHECKS',
        proofTitle: `${city.name}: what gets verified before claims`,
        proofIcon: ScanEye,
        proofChip: <Badge tone="gold">Receipts</Badge>,
        proof: [
          { k: 'Comps', v: 'Sold evidence and reductions (not list-only)', note: 'Weights shift by micro-area.' },
          { k: 'History', v: 'Relists, edits and timing patterns', note: 'Narrative changes are logged.' },
          { k: 'Demand', v: 'Buyer depth by pocket and origin', note: 'Where heat sits.' },
        ],
        signalsTitle: `${city.name} signals (examples)`,
        signals: [
          'A comparable cut 6% this week (same pocket, same finish)',
          'Clean inventory stayed tight across 14 days (supply discipline)',
          'Buyer attention rose in best streets (not the whole area)',
        ],
        ctaLabel: `Open ${city.name} dossier`,
      };
    }

    if (tab === 'liquidity') {
      return {
        tone: 'emerald' as const,
        eyebrow: 'Intelligence',
        title: 'Liquidity Dossier',
        lead: `How fast prime inventory actually moves in ${city.name}, without marketing fog.`,
        badgeA: 'Velocity',
        badgeB: tierLabel,
        badgeC: statusLabel,
        heroIcon: TrendingUp,
        stats: [
          { label: 'TIME TO SELL', value: 'Calibrating', note: 'Track by pocket and tier' },
          { label: 'BUYER DEPTH', value: 'Mapping', note: 'Origin flows + verified intent' },
          { label: 'CUT RISK', value: 'Early read', note: 'Reductions, relists, stagnation' },
        ],
        proofEyebrow: 'MEASURED',
        proofTitle: `${city.name}: what gets measured (not guessed)`,
        proofIcon: Waves,
        proofChip: <Badge tone="emerald">Signal</Badge>,
        proof: [
          { k: 'Turnover', v: 'Time-on-market by pocket and tier', note: 'Clean vs compromised inventory.' },
          { k: 'Buyers', v: 'Buyer inflow and direction changes', note: 'Where demand is building.' },
          { k: 'Cuts', v: 'Reductions and stagnation detection', note: 'Signals before headlines.' },
        ],
        signalsTitle: `${city.name} signals (examples)`,
        signals: [
          'Two new buyers entered this pocket (verified demand)',
          'Lower quality stock is sitting longer (drag detected)',
          'Best homes are moving quietly (off-market activity)',
        ],
        ctaLabel: `View ${city.name} liquidity`,
      };
    }

    return {
      tone: 'violet' as const,
      eyebrow: 'Intelligence',
      title: 'Integrity Dossier',
      lead: `Luxury hides risk behind beauty. Vantera surfaces it early for ${city.name}.`,
      badgeA: 'Integrity',
      badgeB: tierLabel,
      badgeC: statusLabel,
      heroIcon: ShieldCheck,
      stats: [
        { label: 'RISK FLAGS', value: 'Scanning', note: 'Mismatch detection + anomaly guards' },
        { label: 'DATA QUALITY', value: 'Improving', note: 'Cross-source verification expands' },
        { label: 'PROOF LEVEL', value: 'Rising', note: 'Traceable logs per listing' },
      ],
      proofEyebrow: 'GUARDED',
      proofTitle: `${city.name}: what gets locked before trust`,
      proofIcon: Lock,
      proofChip: <Badge tone="violet">Guarded</Badge>,
      proof: [
        { k: 'Consistency', v: 'Ownership and listing alignment checks', note: 'Mismatch equals caution.' },
        { k: 'Cross-source', v: 'Verification across independent sources', note: 'Disagreement is flagged.' },
        { k: 'Anomalies', v: 'Manipulation guards and anomaly detection', note: 'Noise is filtered.' },
      ],
      signalsTitle: `${city.name} signals (examples)`,
      signals: [
        'A listing edit was detected and logged (trace preserved)',
        'One source disagreed - flagged for review',
        'Confidence increased as proof landed (status updated)',
      ],
      ctaLabel: `Open ${city.name} integrity`,
    };
  }, [tab, city, toneBadge]);

  const tabs = useMemo(
    () =>
      [
        { k: 'value' as const, title: 'Valuation', subtitle: 'Is the price earned?', kbd: '1', Icon: Sparkles, tone: 'gold' as const },
        { k: 'liquidity' as const, title: 'Liquidity', subtitle: 'How fast does it move?', kbd: '2', Icon: TrendingUp, tone: 'emerald' as const },
        { k: 'risk' as const, title: 'Integrity', subtitle: 'Any hidden risk?', kbd: '3', Icon: ShieldCheck, tone: 'violet' as const },
      ] as const,
    [],
  );

  return (
    <section
      ref={(n) => {
        sectionRef.current = n;
      }}
      className="relative"
    >
      <div className={cx('relative overflow-hidden rounded-[40px]', CARD)}>
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
                  <span className="font-semibold tracking-[0.22em] uppercase">{content.eyebrow}</span>
                </Badge>
                <Badge tone={toneBadge}>{content.badgeA}</Badge>
                <Badge tone="neutral">{content.badgeB}</Badge>
                <Badge tone="neutral">{content.badgeC}</Badge>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span className={cx('mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/86', RING)}>
                  <content.heroIcon className="h-5 w-5 opacity-85" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[32px]">
                    {content.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-2)]">{content.lead}</p>

                  {city.blurb ? (
                    <div className="mt-3 text-[12px] leading-relaxed text-[color:var(--ink-3)]">{city.blurb}</div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Selector block */}
            <div className="w-full lg:w-[460px] space-y-3">
              <CityPicker value={city} onChange={setCitySlug} options={allCities} />

              <div
                className={cx(
                  'rounded-[30px] p-3',
                  'bg-white/72',
                  RING,
                  'shadow-[0_22px_70px_rgba(11,12,16,0.08)]',
                )}
              >
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">MODES</div>
                  <div className="text-[10px] text-[color:var(--ink-3)]">1 / 2 / 3</div>
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
            </div>

            <div className="lg:col-span-5">
              <div className={cx('relative overflow-hidden rounded-[28px] p-5', CARD)}>
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_86%_-10%,rgba(139,92,246,0.10),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_20%_-10%,rgba(11,12,16,0.05),transparent_62%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                </div>

                <div className="relative flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">SIGNALS</div>
                    <div className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      {content.signalsTitle}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--ink-3)]">Examples only. Wiring next.</div>
                  </div>

                  <Badge tone={toneBadge}>City</Badge>
                </div>

                <div className="relative mt-4 grid gap-2">
                  {content.signals.map((a) => (
                    <div key={a} className={cx('relative overflow-hidden rounded-2xl px-4 py-3', 'bg-white/74', RING)}>
                      <div className="relative text-[13px] leading-relaxed text-[color:var(--ink-2)]">{a}</div>
                    </div>
                  ))}
                </div>

                <div className={cx('relative mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3', 'bg-white/74', RING)}>
                  <div className="text-[12px] text-[color:var(--ink-2)]">
                    City-by-city dossiers.
                    <div className="text-[11px] text-[color:var(--ink-3)]">Next: connect listings and verified metrics.</div>
                  </div>
                  <button
                    type="button"
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                      'bg-white/82 hover:bg-white/92',
                      RING,
                      'text-[color:var(--ink)]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
                    )}
                  >
                    {content.ctaLabel} <ArrowRight className="h-4 w-4 opacity-75" />
                  </button>
                </div>
              </div>

              <div className={cx('mt-4 rounded-2xl px-4 py-3 text-[12px]', 'bg-white/74', RING, 'text-[color:var(--ink-2)]')}>
                Proof first. Signal second. Decisions last.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
