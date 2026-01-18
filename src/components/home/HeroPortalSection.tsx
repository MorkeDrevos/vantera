// src/components/home/HeroPortalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import VanteraSignatureBackdrop from './VanteraSignatureBackdrop';
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type HeroCity = {
  slug: string;
  name: string;
  country: string;

  // Always available (used for image hero OR video poster fallback)
  heroImageSrc: string;
  heroImageAlt?: string | null;

  // Optional: if present, hero uses video instead of image
  heroVideoSrc?: string | null;
  heroVideoPosterSrc?: string | null;

  // Optional micro-signals (wire to your DB later)
  signals?: {
    liquidity?: number | null; // 0-100
    risk?: number | null; // 0-100 (higher = riskier)
    verifiedSupply?: number | null;
    medianEurSqm?: number | null;
  } | null;
};

export type HeroCluster = {
  slug: string;
  name: string;
  country?: string;
  region?: string;
  priority?: number;
  citySlugs: string[];
};

const DEFAULT_WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

const BTN_PRIMARY =
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition ' +
  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white hover:bg-[rgba(10,10,12,1.0)] ' +
  'shadow-[0_18px_60px_rgba(10,10,12,0.12)] hover:shadow-[0_22px_90px_rgba(206,160,74,0.18)]';

const BTN_SECONDARY =
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition ' +
  'border border-[rgba(10,10,12,0.12)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)] ' +
  'shadow-[0_10px_40px_rgba(10,10,12,0.05)] hover:shadow-[0_16px_60px_rgba(10,10,12,0.06)]';

function formatCompactNumber(n?: number | null) {
  if (n === null || n === undefined) return '—';
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  if (v >= 1_000_000) return `${Math.round(v / 100_000) / 10}m`;
  if (v >= 1_000) return `${Math.round(v / 100) / 10}k`;
  return `${Math.round(v)}`;
}

function scoreLabel(v?: number | null, kind?: 'liquidity' | 'risk') {
  if (v === null || v === undefined) return '—';
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const x = Math.round(n);
  if (kind === 'risk') {
    if (x <= 25) return 'low';
    if (x <= 55) return 'mid';
    return 'high';
  }
  if (x >= 75) return 'strong';
  if (x >= 45) return 'mid';
  return 'thin';
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function clamp100(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function hashToUnit(str: string) {
  // Deterministic pseudo-random 0..1 from a string (stable per city)
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const u = (h >>> 0) / 4294967295;
  return clamp01(u);
}

function deriveMockSignals(city: HeroCity) {
  const base = hashToUnit(`${city.slug}|${city.country}|vantera`);
  const base2 = hashToUnit(`${city.slug}|signals|v1`);
  const base3 = hashToUnit(`${city.slug}|sqm|v1`);

  // Liquidity: 48..92
  const liquidity = Math.round(48 + base * 44);

  // Risk: 14..78 (inverse-ish to liquidity but not strictly)
  const risk = Math.round(14 + (1 - base2) * 64);

  // Verified supply: 120..3,400 (city-dependent)
  const verifiedSupply = Math.round(120 + base2 * 3280);

  // Median €/sqm: 6,500..26,000 (city-dependent)
  const medianEurSqm = Math.round(6500 + base3 * 19500);

  return { liquidity, risk, verifiedSupply, medianEurSqm };
}

function CrownRail() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0">
      <div className="h-[2px] bg-[linear-gradient(90deg,transparent,rgba(206,160,74,0.60),transparent)] opacity-90" />
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.34),transparent)] opacity-90" />
    </div>
  );
}

function SignalChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-[rgba(10,10,12,0.12)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[color:var(--ink-2)]">
      <span className="text-[10px] tracking-[0.22em] text-[color:var(--ink-3)]">{label}</span>
      <span className="text-[color:var(--ink)]">{value}</span>
    </span>
  );
}

function MetricRow({
  label,
  value,
  hint,
  barPct,
}: {
  label: string;
  value: string;
  hint?: string;
  barPct?: number; // 0..1
}) {
  const pct = barPct === undefined ? null : clamp01(barPct);

  return (
    <div className="relative border border-[rgba(10,10,12,0.12)] bg-white px-4 py-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.45)] to-transparent opacity-70" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{label}</div>
          {hint ? <div className="mt-1 text-[11px] text-[color:var(--ink-3)]">{hint}</div> : null}
        </div>

        <div className="shrink-0 text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{value}</div>
      </div>

      {pct !== null ? (
        <div className="mt-3 h-2 w-full overflow-hidden border border-[rgba(10,10,12,0.14)] bg-[rgba(10,10,12,0.03)]">
          <div
            className="h-full bg-[linear-gradient(90deg,rgba(10,10,12,0.92),rgba(206,160,74,0.62))]"
            style={{ width: `${Math.round(pct * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function MarketSignalsPanel({
  city,
  signals,
  isMock,
}: {
  city: HeroCity;
  signals: { liquidity: number; risk: number; verifiedSupply: number; medianEurSqm: number };
  isMock: boolean;
}) {
  const liq = clamp100(signals.liquidity);
  const risk = clamp100(signals.risk);

  return (
    <div className="relative overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[12px] shadow-[0_34px_120px_rgba(10,10,12,0.12)]">
      <div className="pointer-events-none absolute inset-0">
        <CrownRail />
        <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_20%_0%,rgba(206,160,74,0.10),transparent_62%)]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">MARKET SIGNALS</div>
            <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
              {city.name}
              <span className="text-[color:var(--ink-3)]"> · {city.country}</span>
            </div>
          </div>

          <div className="shrink-0 text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            {isMock ? 'INDICATIVE' : 'LIVE'}
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <MetricRow
            label="LIQUIDITY"
            value={`${liq}/100 · ${scoreLabel(liq, 'liquidity')}`}
            hint="Buyer velocity and absorption (city-level)"
            barPct={liq / 100}
          />
          <MetricRow
            label="RISK"
            value={`${risk}/100 · ${scoreLabel(risk, 'risk')}`}
            hint="Market volatility and pricing fragility"
            barPct={risk / 100}
          />
          <MetricRow
            label="VERIFIED SUPPLY"
            value={formatCompactNumber(signals.verifiedSupply)}
            hint="Listings passing baseline attribution checks"
            barPct={clamp01(Math.log10(Math.max(10, signals.verifiedSupply)) / 4)}
          />
          <MetricRow
            label="MEDIAN € / SQM"
            value={`€${formatCompactNumber(signals.medianEurSqm)}`}
            hint="Directional benchmark (city-wide)"
            barPct={clamp01((signals.medianEurSqm - 6500) / (26000 - 6500))}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[rgba(10,10,12,0.10)] pt-3">
          <div className="text-[11px] text-[color:var(--ink-3)]">
            {isMock ? 'Shown for design. Wire to DB when ready.' : 'Derived from ingested market signals.'}
          </div>
          <Link
            href={`/city/${city.slug}`}
            className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink)] hover:opacity-80"
          >
            OPEN CITY
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HeroPortalSection({
  cities,
  clusters,
  rotateMs = 6500,
  wideClassName,
  topCountries,
}: {
  cities: HeroCity[];
  clusters: HeroCluster[];
  rotateMs?: number;
  wideClassName?: string;
  topCountries?: string[];
}) {
  const WIDE = wideClassName ?? DEFAULT_WIDE;

  const safeCities = Array.isArray(cities) ? cities.filter(Boolean) : [];
  const list = safeCities.length ? safeCities : [];

  const safeClusters = Array.isArray(clusters) ? clusters.filter(Boolean) : [];
  const safeTopCountries = Array.isArray(topCountries) ? topCountries.filter(Boolean) : [];

  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const tRef = useRef<number | null>(null);

  const active = list[idx] ?? null;
  const prev = prevIdx !== null ? list[prevIdx] ?? null : null;

  function go(next: number) {
    if (!list.length) return;
    const target = (next + list.length) % list.length;
    if (target === idx) return;

    setPrevIdx(idx);
    setIdx(target);
    setIsFading(true);
  }

  function next() {
    go(idx + 1);
  }

  function prevSlide() {
    go(idx - 1);
  }

  useEffect(() => {
    if (!list.length) return;
    if (paused) return;

    if (tRef.current) window.clearInterval(tRef.current);
    tRef.current = window.setInterval(() => {
      next();
    }, rotateMs);

    return () => {
      if (tRef.current) window.clearInterval(tRef.current);
      tRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, rotateMs, list.length]);

  function markLoaded() {
    window.setTimeout(() => setIsFading(false), 40);
    window.setTimeout(() => setPrevIdx(null), 420);
  }

  const preloadNext = useMemo(() => {
    if (!list.length) return null;
    const n = (idx + 1) % list.length;
    const city = list[n];
    if (!city) return null;
    return {
      video: city.heroVideoSrc ?? null,
      image: city.heroImageSrc ?? null,
    };
  }, [idx, list]);

  const derivedSignals = useMemo(() => {
    if (!active) return null;
    const real = active.signals ?? null;

    const hasReal =
      !!real &&
      (typeof real.liquidity === 'number' ||
        typeof real.risk === 'number' ||
        typeof real.verifiedSupply === 'number' ||
        typeof real.medianEurSqm === 'number');

    if (hasReal) {
      return {
        isMock: false,
        signals: {
          liquidity: clamp100(Number(real?.liquidity ?? 0)),
          risk: clamp100(Number(real?.risk ?? 0)),
          verifiedSupply: Math.max(0, Number(real?.verifiedSupply ?? 0)),
          medianEurSqm: Math.max(0, Number(real?.medianEurSqm ?? 0)),
        },
      };
    }

    return { isMock: true, signals: deriveMockSignals(active) };
  }, [active]);

  const overlaySignals = useMemo(() => {
    if (!active || !derivedSignals) return [];
    const s = derivedSignals.signals;

    const out: Array<{ label: string; value: string }> = [];
    out.push({ label: 'LIQ', value: `${Math.round(s.liquidity)}/100 ${scoreLabel(s.liquidity, 'liquidity')}` });
    out.push({ label: 'RISK', value: `${Math.round(s.risk)}/100 ${scoreLabel(s.risk, 'risk')}` });
    out.push({ label: 'VER', value: formatCompactNumber(s.verifiedSupply) });
    out.push({ label: '€/SQM', value: `€${formatCompactNumber(s.medianEurSqm)}` });

    return out.slice(0, 4);
  }, [active, derivedSignals]);

  const h1 = 'A luxury marketplace built on intelligence';
  const sub = 'Editorial catalogue on top. A Truth Layer underneath - verification, liquidity and risk signals, built city by city.';

  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative min-h-[860px] w-full bg-[color:var(--paper-2)]">
        <VanteraSignatureBackdrop />

        <div
          className="absolute inset-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0">
            {/* Previous stays under during transition */}
            {prev ? (
              <div className="absolute inset-0">
                {prev.heroVideoSrc ? (
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={prev.heroVideoPosterSrc ?? prev.heroImageSrc}
                  >
                    <source src={prev.heroVideoSrc} />
                  </video>
                ) : (
                  <Image
                    src={prev.heroImageSrc}
                    alt={prev.heroImageAlt ?? `${prev.name} hero`}
                    fill
                    priority={false}
                    sizes="100vw"
                    className="object-cover opacity-100"
                  />
                )}
              </div>
            ) : null}

            {/* Active fades in */}
            {active ? (
              <div className="absolute inset-0">
                {active.heroVideoSrc ? (
                  <video
                    className={cx(
                      'h-full w-full object-cover transition-opacity duration-[520ms]',
                      isFading ? 'opacity-0' : 'opacity-100',
                    )}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={active.heroVideoPosterSrc ?? active.heroImageSrc}
                    onCanPlay={() => markLoaded()}
                  >
                    <source src={active.heroVideoSrc} />
                  </video>
                ) : (
                  <Image
                    src={active.heroImageSrc}
                    alt={active.heroImageAlt ?? `${active.name} hero`}
                    fill
                    priority
                    sizes="100vw"
                    onLoad={() => markLoaded()}
                    className={cx('object-cover transition-opacity duration-[520ms]', isFading ? 'opacity-0' : 'opacity-100')}
                  />
                )}

                {/* Softer veils (less foggy) */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.78),rgba(255,255,255,0.44),rgba(255,255,255,0.16))]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0.05),rgba(255,255,255,0.92))]" />
              </div>
            ) : null}
          </div>

          {/* Preload next media (hidden) */}
          {preloadNext?.video ? (
            <video className="hidden" muted preload="auto">
              <source src={preloadNext.video} />
            </video>
          ) : preloadNext?.image ? (
            <Image src={preloadNext.image} alt="" width={8} height={8} className="hidden" priority={false} />
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0">
          <CrownRail />
          <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_22%_6%,rgba(206,160,74,0.10),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />
        </div>

        <div className={cx('relative z-10', WIDE)}>
          {safeTopCountries.length ? (
            <div className="hidden pt-6 sm:block">
              <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                <span className="text-[color:var(--ink-3)]">COVERAGE</span>
                <span className="h-px flex-1 bg-[color:var(--hairline)]" />
                <span className="max-w-[70%] truncate tracking-[0.22em] text-[color:var(--ink-2)]">
                  {safeTopCountries.slice(0, 10).join(' · ')}
                </span>
              </div>
            </div>
          ) : null}

          {/* Hero content */}
          <div className="pb-10 pt-10 sm:pb-12 sm:pt-12">
            <div className="max-w-[980px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="relative inline-flex items-center border border-[rgba(10,10,12,0.12)] bg-white/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-2)] backdrop-blur-[10px]">
                  MARKETPLACE
                </span>
                <span className="relative inline-flex items-center border border-[rgba(10,10,12,0.12)] bg-white/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-2)] backdrop-blur-[10px]">
                  TRUTH LAYER
                </span>
                <span className="relative inline-flex items-center border border-[rgba(10,10,12,0.12)] bg-white/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-2)] backdrop-blur-[10px]">
                  EDITORIAL
                </span>
              </div>

              <h1 className="mt-7 text-balance text-[40px] font-semibold tracking-[-0.055em] text-[color:var(--ink)] sm:text-[52px] lg:text-[64px] lg:leading-[0.98]">
                {h1}
              </h1>

              <div className="mt-5 h-px w-28 bg-gradient-to-r from-[rgba(206,160,74,0.95)] to-transparent" />

              <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-[18px]">
                {sub}
              </p>

              {/* HERO SEARCH - wide, star of the show */}
              <div className="mt-7">
                <div className="w-full max-w-[1240px]">
                  <VanteraOmniSearch
                    cities={list.map((c) => ({
                      slug: c.slug,
                      name: c.name,
                      country: c.country,
                      region: null,
                      tz: 'UTC',
                      priority: 0,
                    }))}
                    clusters={safeClusters}
                    placeholder="City, region, country, budget, lifestyle"
                    autoFocus={false}
                    className="w-full"
                  />
                </div>

                <div className="mt-3 text-[11px] text-[color:var(--ink-3)]">
                  Try: <span className="text-[color:var(--ink-2)]">“Monaco penthouse under €12m sea view”</span>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/marketplace" className={BTN_PRIMARY}>
                  Browse marketplace
                </Link>
                <Link href="/coming-soon?flow=sell" className={BTN_SECONDARY}>
                  List privately
                </Link>
              </div>
            </div>
          </div>

          {/* Featured city + controls row */}
          <div className="pb-12 sm:pb-14">
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />

              <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
                {/* Left: featured label + small chips */}
                <div className="max-w-[720px]">
                  <div className="relative inline-block overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 px-4 py-3 backdrop-blur-[10px] shadow-[0_26px_90px_rgba(10,10,12,0.10)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.55)] to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_220px_at_18%_0%,rgba(206,160,74,0.07),transparent_62%)]" />

                    <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">FEATURED CITY</div>

                    <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      {active ? active.name : 'Editorial'}
                      {active ? <span className="text-[color:var(--ink-3)]"> · {active.country}</span> : null}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {overlaySignals.length ? (
                        overlaySignals.map((x) => <SignalChip key={`${x.label}:${x.value}`} label={x.label} value={x.value} />)
                      ) : (
                        <>
                          <SignalChip label="LIQ" value="—" />
                          <SignalChip label="RISK" value="—" />
                          <SignalChip label="VER" value="—" />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 hidden sm:block">
                    <div className="h-px w-full bg-[color:var(--hairline)]" />
                    <div className="mt-1 h-[2px] w-full bg-[rgba(10,10,12,0.06)]" aria-hidden="true">
                      <div
                        className="h-full bg-[linear-gradient(90deg,rgba(10,10,12,0.92),rgba(206,160,74,0.55))]"
                        style={{
                          width: `${Math.round(((idx + 1) / Math.max(1, list.length)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Controls - keep desktop only, premium */}
                  <div className="mt-4 hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className={cx(
                        'inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition',
                        'border border-[rgba(10,10,12,0.12)] bg-white/92 backdrop-blur-[10px]',
                        'hover:border-[rgba(10,10,12,0.22)]',
                      )}
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-4 w-4 opacity-70" />
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      className={cx(
                        'inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition',
                        'border border-[rgba(10,10,12,0.12)] bg-white/92 backdrop-blur-[10px]',
                        'hover:border-[rgba(10,10,12,0.22)]',
                      )}
                      aria-label="Next"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </button>

                    {/* img1 removed: no dot pager */}
                  </div>
                </div>

                {/* Right: production-grade “Market Signals” panel (img2) */}
                <div className="hidden lg:block">
                  {active && derivedSignals ? (
                    <MarketSignalsPanel city={active} signals={derivedSignals.signals} isMock={derivedSignals.isMock} />
                  ) : null}
                </div>

                {/* Mobile: show a lighter version below (still data-driven, but compact) */}
                <div className="lg:hidden">
                  {active && derivedSignals ? (
                    <div className="relative overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[10px] shadow-[0_26px_90px_rgba(10,10,12,0.10)]">
                      <div className="pointer-events-none absolute inset-0">
                        <CrownRail />
                        <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_18%_0%,rgba(206,160,74,0.08),transparent_62%)]" />
                      </div>
                      <div className="relative p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                            SIGNALS
                          </div>
                          <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                            {derivedSignals.isMock ? 'INDICATIVE' : 'LIVE'}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <SignalChip label="LIQ" value={`${Math.round(derivedSignals.signals.liquidity)}/100`} />
                          <SignalChip label="RISK" value={`${Math.round(derivedSignals.signals.risk)}/100`} />
                          <SignalChip label="VER" value={formatCompactNumber(derivedSignals.signals.verifiedSupply)} />
                          <SignalChip
                            label="€/SQM"
                            value={`€${formatCompactNumber(derivedSignals.signals.medianEurSqm)}`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end WIDE */}
      </div>
    </section>
  );
}
