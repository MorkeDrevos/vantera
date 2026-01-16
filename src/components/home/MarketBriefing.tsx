// src/components/home/MarketBriefing.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Radar, ShieldCheck, Sparkles } from 'lucide-react';

import type { City } from './cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';
const CARD =
  'bg-[color:var(--surface-2)] backdrop-blur-[12px] ' +
  RING +
  ' shadow-[0_30px_90px_rgba(11,12,16,0.10)]';

type Tone = 'warming' | 'tightening' | 'flight' | 'quiet';

function toneMeta(tone: Tone) {
  if (tone === 'warming')
    return {
      label: 'Signals: warming',
      pill: 'bg-[rgba(16,185,129,0.10)] ring-1 ring-inset ring-[rgba(16,185,129,0.20)] text-[color:var(--ink)]',
      dot: 'bg-[rgba(16,185,129,0.85)]',
      icon: <Radar className="h-4 w-4 opacity-80" />,
    };

  if (tone === 'tightening')
    return {
      label: 'Signals: tightening',
      pill: 'bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink)]',
      dot: 'bg-[rgba(11,12,16,0.55)]',
      icon: <ShieldCheck className="h-4 w-4 opacity-80" />,
    };

  if (tone === 'flight')
    return {
      label: 'Flight-to-quality',
      pill: 'bg-[rgba(139,92,246,0.10)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)] text-[color:var(--ink)]',
      dot: 'bg-[rgba(139,92,246,0.80)]',
      icon: <Sparkles className="h-4 w-4 opacity-80" />,
    };

  return {
    label: 'Quiet positioning',
    pill: 'bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink-2)]',
    dot: 'bg-[rgba(11,12,16,0.45)]',
    icon: <Radar className="h-4 w-4 opacity-80" />,
  };
}

function Pill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const cls =
    tone === 'good'
      ? 'bg-[rgba(16,185,129,0.10)] ring-1 ring-inset ring-[rgba(16,185,129,0.20)] text-[color:var(--ink)]'
      : tone === 'warn'
        ? 'bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink)]'
        : tone === 'violet'
          ? 'bg-[rgba(139,92,246,0.10)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)] text-[color:var(--ink)]'
          : 'bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink-2)]';

  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[12px] leading-none backdrop-blur-xl', cls)}>
      {label}
    </span>
  );
}

function pickBriefing(cities: City[]) {
  const wanted = ['marbella', 'madrid', 'paris', 'dubai', 'london', 'miami', 'new-york'];
  const map = new Map(cities.map((c) => [c.slug, c]));
  const picked: City[] = [];

  for (const slug of wanted) {
    const c = map.get(slug);
    if (c) picked.push(c);
    if (picked.length === 3) break;
  }

  if (picked.length < 3) {
    for (const c of cities) {
      if (!picked.find((p) => p.slug === c.slug)) picked.push(c);
      if (picked.length === 3) break;
    }
  }

  return picked.slice(0, 3);
}

type Briefing = {
  tone: Tone;
  thesis: string;
  liquidity: string;
  confidence: string;

  liquidityHeat: number; // 0..100
  buyerPressure: number; // 0..100
  priceCuts7d: number; // count
  proofDensity: number; // 0..100
  signal: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function barPct(n: number) {
  const p = clamp01(n / 100);
  return `${Math.round(p * 100)}%`;
}

function scoreLabel(n: number) {
  if (n >= 78) return 'High';
  if (n >= 55) return 'Normal';
  if (n >= 35) return 'Watch';
  return 'Low';
}

function seededFromSlug(slug: string, salt: number) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 997;
  return (h + salt * 67) % 100;
}

function thesisFor(slug: string): Briefing {
  if (slug === 'marbella')
    return {
      tone: 'flight',
      thesis: 'Scarcity-led market with discreet demand. Quality inventory transacts before it surfaces publicly.',
      liquidity: 'Thin supply, high intent',
      confidence: 'Medium',
      liquidityHeat: 78,
      buyerPressure: 82,
      priceCuts7d: 11,
      proofDensity: 64,
      signal: 'Quality clears quietly. Documentation wins.',
    };

  if (slug === 'madrid')
    return {
      tone: 'warming',
      thesis: 'Prime corridors stabilising. Buyers are back, selectively, with discipline on fundamentals and pricing.',
      liquidity: 'Normal depth',
      confidence: 'Medium',
      liquidityHeat: 62,
      buyerPressure: 58,
      priceCuts7d: 17,
      proofDensity: 56,
      signal: 'Discipline is being rewarded again.',
    };

  if (slug === 'paris')
    return {
      tone: 'tightening',
      thesis: 'Selective liquidity. The spread between good and great is widening. Pricing is precise.',
      liquidity: 'Deep prime, thin secondary',
      confidence: 'Medium',
      liquidityHeat: 55,
      buyerPressure: 46,
      priceCuts7d: 23,
      proofDensity: 61,
      signal: 'Prime holds. Secondary reprices.',
    };

  if (slug === 'dubai')
    return {
      tone: 'warming',
      thesis: 'Momentum market. Velocity remains high, but durability concentrates in best-in-class inventory.',
      liquidity: 'High velocity',
      confidence: 'Low → Medium',
      liquidityHeat: 84,
      buyerPressure: 76,
      priceCuts7d: 19,
      proofDensity: 44,
      signal: 'Velocity is high. Proof separates outcomes.',
    };

  if (slug === 'london')
    return {
      tone: 'tightening',
      thesis: 'Capital is cautious and concentrated. Prime stability, secondary softness persists.',
      liquidity: 'Deep prime pockets',
      confidence: 'Medium',
      liquidityHeat: 49,
      buyerPressure: 42,
      priceCuts7d: 21,
      proofDensity: 58,
      signal: 'Prime stable. Negotiation increases.',
    };

  const heat = 35 + Math.round(seededFromSlug(slug, 2) * 0.55);
  const pressure = 30 + Math.round(seededFromSlug(slug, 5) * 0.55);
  const cuts = 8 + Math.round(seededFromSlug(slug, 9) * 0.22);
  const proof = 30 + Math.round(seededFromSlug(slug, 12) * 0.6);

  return {
    tone: 'quiet',
    thesis: 'Private coverage building. Truth layers activate as verified signals expand.',
    liquidity: 'Coverage expanding',
    confidence: 'Low',
    liquidityHeat: heat,
    buyerPressure: pressure,
    priceCuts7d: cuts,
    proofDensity: proof,
    signal: 'Signals landing. Index tightens weekly.',
  };
}

function Meter({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const badge =
    tone === 'good'
      ? 'bg-[rgba(16,185,129,0.10)] ring-1 ring-inset ring-[rgba(16,185,129,0.20)] text-[color:var(--ink)]'
      : tone === 'warn'
        ? 'bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink)]'
        : tone === 'violet'
          ? 'bg-[rgba(139,92,246,0.10)] ring-1 ring-inset ring-[rgba(139,92,246,0.22)] text-[color:var(--ink)]'
          : 'bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink-2)]';

  return (
    <div className={cx('min-w-[180px] flex-1 rounded-3xl px-5 py-4', CARD)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
          {label.toUpperCase()}
        </div>
        <span className={cx('rounded-full px-3 py-1.5 text-[11px] leading-none', badge)}>{value}</span>
      </div>
      {hint ? <div className="mt-2 text-xs text-[color:var(--ink-3)]">{hint}</div> : null}
    </div>
  );
}

function MiniBar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className={cx('rounded-3xl px-5 py-4', CARD)}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">{label.toUpperCase()}</div>
        <div className="text-sm text-[color:var(--ink)]">{value}</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-[rgba(11,12,16,0.08)]">
        <div className="h-2 rounded-full bg-[rgba(11,12,16,0.45)]" style={{ width: barPct(pct) }} />
      </div>
    </div>
  );
}

export default function MarketBriefing({ cities, className = '' }: { cities: City[]; className?: string }) {
  const picked = pickBriefing(cities);
  const briefs = picked.map((c) => ({ city: c, b: thesisFor(c.slug) }));

  const avgHeat = Math.round(briefs.reduce((s, x) => s + x.b.liquidityHeat, 0) / Math.max(1, briefs.length));
  const avgPressure = Math.round(briefs.reduce((s, x) => s + x.b.buyerPressure, 0) / Math.max(1, briefs.length));
  const avgProof = Math.round(briefs.reduce((s, x) => s + x.b.proofDensity, 0) / Math.max(1, briefs.length));
  const totalCuts = briefs.reduce((s, x) => s + x.b.priceCuts7d, 0);

  const pulseTone = avgHeat >= 70 || avgPressure >= 70 ? 'violet' : avgHeat >= 55 ? 'neutral' : 'warn';

  return (
    <section className={cx('w-full', className)}>
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-[color:var(--ink-3)]">
              Market pulse
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-3xl">
              Luxury market signal - compressed and decision-grade
            </h2>

            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[color:var(--ink-2)]">
              Not a portal feed. An intelligence layer that models liquidity, price reality and verification density so you can act with discipline.
            </p>
          </div>

          <Link
            href="/coming-soon?section=briefing"
            prefetch
            className={cx(
              'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm transition',
              'bg-white/75 hover:bg-white/90',
              RING,
              'text-[color:var(--ink)]',
              'shadow-[0_22px_70px_rgba(11,12,16,0.10)]',
            )}
          >
            Request coverage <ArrowRight className="h-4 w-4 opacity-75" />
          </Link>
        </div>

        {/* Main cockpit slab */}
        <div className={cx('mt-6 relative overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10', CARD)}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_14%_-10%,rgba(231,201,130,0.14),transparent_62%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_86%_10%,rgba(139,92,246,0.08),transparent_62%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.32em] uppercase text-[color:var(--ink-3)]">
                  Intelligence cockpit
                </div>
                <div className="mt-2 text-[14px] text-[color:var(--ink-2)]">
                  Three markets under active watch. Weekly deltas, compressed.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Pill label="Updates: weekly" tone={pulseTone === 'violet' ? 'violet' : 'neutral'} />
                <Pill label={`Liquidity heat: ${scoreLabel(avgHeat)}`} tone={avgHeat >= 70 ? 'violet' : 'warn'} />
                <Pill label={`Proof density: ${scoreLabel(avgProof)}`} tone={avgProof >= 65 ? 'good' : 'warn'} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-4">
              <Meter
                label="Liquidity heat"
                value={`${avgHeat}/100`}
                hint="Velocity for clean, scarce inventory."
                tone={avgHeat >= 70 ? 'violet' : avgHeat >= 55 ? 'neutral' : 'warn'}
              />
              <Meter
                label="Buyer pressure"
                value={`${avgPressure}/100`}
                hint="Competition level for verified listings."
                tone={avgPressure >= 70 ? 'violet' : avgPressure >= 55 ? 'neutral' : 'warn'}
              />
              <Meter
                label="Price cuts (7d)"
                value={`${totalCuts}`}
                hint="Repricing activity and reality checks."
                tone={totalCuts <= 35 ? 'neutral' : 'warn'}
              />
              <Meter
                label="Proof density"
                value={`${avgProof}/100`}
                hint="How much is verifiable, not narrative."
                tone={avgProof >= 65 ? 'good' : 'warn'}
              />
            </div>

            <div className={cx('mt-5 rounded-3xl px-5 py-4 text-[12px]', 'bg-white/70', RING, 'text-[color:var(--ink-2)]')}>
              <span className={cx('mr-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]', 'bg-white/75', RING, 'text-[color:var(--ink-2)]')}>
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.55)] shadow-[0_0_0_3px_rgba(11,12,16,0.10)]" />
                Weekly delta
              </span>
              <span className="text-[color:var(--ink-3)]">
                Price reductions increased in one market, verification density improved in another, and one moved into scarcity-led bidding.
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <div className={cx('rounded-3xl px-5 py-4', 'bg-white/70', RING)}>
                <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PORTALS OUTPUT</div>
                <div className="mt-1 text-sm text-[color:var(--ink)]">Photos, lifestyle framing, sales language</div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">High surface area. Low auditability.</div>
              </div>

              <div className={cx('rounded-3xl px-5 py-4', 'bg-white/70', RING)}>
                <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">VANTERA OUTPUT</div>
                <div className="mt-1 text-sm text-[color:var(--ink)]">Signal, exposures, price reality, proof</div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">Private report posture. Evidence-first.</div>
              </div>

              <div className={cx('rounded-3xl px-5 py-4', 'bg-white/70', RING)}>
                <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">OPERATOR ADVANTAGE</div>
                <div className="mt-1 text-sm text-[color:var(--ink)]">Confidence before site visits</div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">Fewer wasted inspections. Cleaner offers.</div>
              </div>
            </div>
          </div>
        </div>

        {/* City briefing cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {briefs.map(({ city: c, b }) => {
            const t = toneMeta(b.tone);

            return (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                prefetch
                className={cx(
                  'group relative overflow-hidden rounded-[28px] p-6 transition duration-500',
                  CARD,
                  'hover:-translate-y-[2px] hover:shadow-[0_40px_140px_rgba(11,12,16,0.14)]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.16)]',
                )}
                aria-label={`Open ${c.name} briefing`}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(139,92,246,0.08)] blur-3xl" />
                    <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(231,201,130,0.10)] blur-3xl" />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-[color:var(--ink-3)]">
                        {c.country}
                        {c.region ? ` · ${c.region}` : ''}
                      </div>

                      <div className="mt-2 truncate text-xl font-semibold tracking-tight text-[color:var(--ink)]">
                        {c.name}
                      </div>
                    </div>

                    <span className={cx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] backdrop-blur-xl', t.pill)}>
                      <span className={cx('h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(11,12,16,0.08)]', t.dot)} />
                      {t.icon}
                      <span className="whitespace-nowrap">{t.label}</span>
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink-2)]">{b.thesis}</p>

                  <div className="mt-5 grid gap-2">
                    <MiniBar label="Liquidity heat" value={scoreLabel(b.liquidityHeat)} pct={b.liquidityHeat} />
                    <MiniBar label="Buyer pressure" value={scoreLabel(b.buyerPressure)} pct={b.buyerPressure} />

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className={cx('rounded-3xl px-5 py-4', 'bg-white/70', RING)}>
                        <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PRICE CUTS (7D)</div>
                        <div className="mt-1 text-sm text-[color:var(--ink)]">{b.priceCuts7d}</div>
                        <div className="mt-1 text-xs text-[color:var(--ink-3)]">Repricing pressure.</div>
                      </div>

                      <div className={cx('rounded-3xl px-5 py-4', 'bg-white/70', RING)}>
                        <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PROOF DENSITY</div>
                        <div className="mt-1 text-sm text-[color:var(--ink)]">{b.proofDensity}/100</div>
                        <div className="mt-1 text-xs text-[color:var(--ink-3)]">Auditability.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill label={`Liquidity: ${b.liquidity}`} tone="neutral" />
                    <Pill label={`Confidence: ${b.confidence}`} tone="warn" />
                    <Pill label={`Signal: ${b.signal}`} tone="violet" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className={cx('rounded-md px-2 py-1 font-mono text-xs', 'bg-white/70', RING, 'text-[color:var(--ink-2)]')}>
                      {`VANTERA:${c.slug.toUpperCase()}`}
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-[color:var(--ink-2)] transition group-hover:text-[color:var(--ink)]">
                      Enter <ArrowRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
