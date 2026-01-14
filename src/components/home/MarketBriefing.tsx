// src/components/home/MarketBriefing.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Radar, ShieldCheck, Sparkles } from 'lucide-react';

import type { City } from './cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type Tone = 'warming' | 'tightening' | 'flight' | 'quiet';

function toneMeta(tone: Tone) {
  if (tone === 'warming')
    return {
      label: 'Signals: warming',
      cls: 'border-emerald-400/18 bg-emerald-500/8 text-emerald-100/95',
      dot: 'bg-emerald-200/80',
      icon: <Radar className="h-4 w-4 opacity-85" />,
    };

  if (tone === 'tightening')
    return {
      label: 'Signals: tightening',
      cls: 'border-white/12 bg-white/[0.04] text-zinc-200/90',
      dot: 'bg-white/80',
      icon: <ShieldCheck className="h-4 w-4 opacity-85" />,
    };

  if (tone === 'flight')
    return {
      label: 'Flight-to-quality',
      cls: 'border-violet-400/18 bg-violet-500/8 text-violet-100/95',
      dot: 'bg-violet-200/80',
      icon: <Sparkles className="h-4 w-4 opacity-85" />,
    };

  return {
    label: 'Quiet positioning',
    cls: 'border-white/10 bg-white/[0.03] text-zinc-200/90',
    dot: 'bg-white/70',
    icon: <Radar className="h-4 w-4 opacity-85" />,
  };
}

function Pill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-[12px] leading-none transition backdrop-blur-xl';

  const cls =
    tone === 'good'
      ? 'border-emerald-400/18 bg-emerald-500/8 text-emerald-100/95'
      : tone === 'warn'
        ? 'border-white/12 bg-white/[0.04] text-zinc-200/90'
        : tone === 'violet'
          ? 'border-violet-400/18 bg-violet-500/8 text-violet-100/95'
          : 'border-white/10 bg-white/[0.03] text-zinc-200/90';

  return <span className={cx(base, cls)}>{label}</span>;
}

function pickBriefing(cities: City[]) {
  const wanted = [
    'marbella',
    'madrid',
    'paris',
    'dubai',
    'london',
    'miami',
    'new-york',
  ];
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

  // “wow” metrics (seeded now, real later)
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
  // deterministic-ish, feels “live” without being random per render
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 997;
  return (h + salt * 67) % 100;
}

function thesisFor(slug: string): Briefing {
  if (slug === 'marbella')
    return {
      tone: 'flight',
      thesis:
        'Scarcity-led market with discreet demand. Quality inventory transacts before it surfaces publicly.',
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
      thesis:
        'Prime corridors stabilising. Buyers are back, selectively, with discipline on fundamentals and pricing.',
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
      thesis:
        'Selective liquidity. The spread between good and great is widening. Pricing is precise.',
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
      thesis:
        'Momentum market. Velocity remains high, but durability concentrates in best-in-class inventory.',
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
      thesis:
        'Capital is cautious and concentrated. Prime stability, secondary softness persists.',
      liquidity: 'Deep prime pockets',
      confidence: 'Medium',
      liquidityHeat: 49,
      buyerPressure: 42,
      priceCuts7d: 21,
      proofDensity: 58,
      signal: 'Prime stable. Negotiation increases.',
    };

  // fallback: seeded believable
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
      ? 'border-emerald-400/18 bg-emerald-500/8 text-emerald-100/95'
      : tone === 'warn'
        ? 'border-white/12 bg-white/[0.04] text-zinc-200/90'
        : tone === 'violet'
          ? 'border-violet-400/18 bg-violet-500/8 text-violet-100/95'
          : 'border-white/10 bg-white/[0.03] text-zinc-200/90';

  return (
    <div className="min-w-[180px] flex-1 rounded-3xl border border-white/10 bg-black/25 px-5 py-4 shadow-[0_28px_110px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
          {label.toUpperCase()}
        </div>
        <span className={cx('rounded-full border px-3 py-1.5 text-[11px] leading-none', badge)}>
          {value}
        </span>
      </div>
      {hint ? <div className="mt-2 text-xs text-zinc-500">{hint}</div> : null}
    </div>
  );
}

function MiniBar({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
          {label.toUpperCase()}
        </div>
        <div className="text-sm text-zinc-100">{value}</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-white/60" style={{ width: barPct(pct) }} />
      </div>
    </div>
  );
}

export default function MarketBriefing({
  cities,
  className = '',
}: {
  cities: City[];
  className?: string;
}) {
  const picked = pickBriefing(cities);
  const briefs = picked.map((c) => ({ city: c, b: thesisFor(c.slug) }));

  // Aggregate “pulse” (seeded now)
  const avgHeat = Math.round(
    briefs.reduce((s, x) => s + x.b.liquidityHeat, 0) / Math.max(1, briefs.length)
  );
  const avgPressure = Math.round(
    briefs.reduce((s, x) => s + x.b.buyerPressure, 0) / Math.max(1, briefs.length)
  );
  const avgProof = Math.round(
    briefs.reduce((s, x) => s + x.b.proofDensity, 0) / Math.max(1, briefs.length)
  );
  const totalCuts = briefs.reduce((s, x) => s + x.b.priceCuts7d, 0);

  const pulseTone =
    avgHeat >= 70 || avgPressure >= 70
      ? 'violet'
      : avgHeat >= 55
        ? 'neutral'
        : 'warn';

  return (
    <section className={cx('w-full', className)}>
      {/* Wider, more portal-like container */}
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
              Market pulse
            </div>

            {/* colder, more institutional */}
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Luxury market signal - compressed and decision-grade
            </h2>

            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-zinc-300/90">
              Not a portal feed. An intelligence layer that models liquidity,
              price reality and verification density so you can act with
              discipline.
            </p>
          </div>

          <Link
            href="/coming-soon?section=briefing"
            prefetch
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-200/90 shadow-[0_28px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:bg-white/[0.05] hover:border-white/18 hover:text-white"
          >
            Request coverage <ArrowRight className="h-4 w-4 opacity-75" />
          </Link>
        </div>

        {/* Main cockpit slab - wider + more "luxury intelligence console" */}
        <div className="mt-6 relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_40px_160px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Ambient layers */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_14%_-10%,rgba(255,255,255,0.07),transparent_62%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_86%_10%,rgba(120,76,255,0.12),transparent_62%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.32em] uppercase text-zinc-200/70">
                  Intelligence cockpit
                </div>
                <div className="mt-2 text-[14px] text-zinc-300/90">
                  Three markets under active watch. Weekly deltas, compressed.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Pill
                  label="Updates: live"
                  tone={pulseTone === 'violet' ? 'violet' : 'neutral'}
                />
                <Pill
                  label={`Liquidity heat: ${scoreLabel(avgHeat)}`}
                  tone={avgHeat >= 70 ? 'violet' : 'warn'}
                />
                <Pill
                  label={`Proof density: ${scoreLabel(avgProof)}`}
                  tone={avgProof >= 65 ? 'good' : 'warn'}
                />
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
                tone={
                  avgPressure >= 70 ? 'violet' : avgPressure >= 55 ? 'neutral' : 'warn'
                }
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

            {/* Signal tape (no playful language) */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 px-5 py-4 text-[12px] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="mr-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-200/90">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                Weekly delta
              </span>
              <span className="text-zinc-400">
                Price reductions increased in one market, verification density improved in another, and one
                moved into scarcity-led bidding.
              </span>
            </div>

            {/* Portal contrast - colder, more institutional */}
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
                  PORTALS OUTPUT
                </div>
                <div className="mt-1 text-sm text-zinc-200">
                  Photos, lifestyle framing, sales language
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  High surface area. Low auditability.
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
                  VANTERA OUTPUT
                </div>
                <div className="mt-1 text-sm text-zinc-200">
                  Signal, exposures, price reality, proof
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Private report posture. Evidence-first.
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
                  OPERATOR ADVANTAGE
                </div>
                <div className="mt-1 text-sm text-zinc-200">
                  Confidence before site visits
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Fewer wasted inspections. Cleaner offers.
                </div>
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
                  'group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]',
                  'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_36px_140px_rgba(0,0,0,0.58)]',
                  'transition duration-500 hover:-translate-y-[2px] hover:border-white/18',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20'
                )}
                aria-label={`Open ${c.name} briefing`}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(120,76,255,0.10)] blur-3xl" />
                    <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
                  </div>
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                        {c.country}
                        {c.region ? ` · ${c.region}` : ''}
                      </div>

                      <div className="mt-2 truncate text-xl font-semibold tracking-tight text-white">
                        {c.name}
                      </div>
                    </div>

                    <span
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl',
                        t.cls
                      )}
                    >
                      <span
                        className={cx(
                          'h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.08)]',
                          t.dot
                        )}
                      />
                      {t.icon}
                      <span className="whitespace-nowrap">{t.label}</span>
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-300/90">{b.thesis}</p>

                  {/* Mini metrics */}
                  <div className="mt-5 grid gap-2">
                    <MiniBar label="Liquidity heat" value={scoreLabel(b.liquidityHeat)} pct={b.liquidityHeat} />
                    <MiniBar label="Buyer pressure" value={scoreLabel(b.buyerPressure)} pct={b.buyerPressure} />

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
                          PRICE CUTS (7D)
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">{b.priceCuts7d}</div>
                        <div className="mt-1 text-xs text-zinc-500">Repricing pressure.</div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-black/22 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500">
                          PROOF DENSITY
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">{b.proofDensity}/100</div>
                        <div className="mt-1 text-xs text-zinc-500">Auditability.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill label={`Liquidity: ${b.liquidity}`} tone="neutral" />
                    <Pill label={`Confidence: ${b.confidence}`} tone="warn" />
                    <Pill label={`Signal: ${b.signal}`} tone="violet" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-black/22 px-2 py-1 font-mono text-xs text-zinc-300/90">
                      {`VANTERA:${c.slug.toUpperCase()}`}
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-zinc-200/85 transition group-hover:text-white">
                      Enter <ArrowRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-0 ring-white/10 transition group-hover:ring-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
