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

  // hero image (prefer local /public so we control quality)
  heroImageSrc: string;
  heroImageAlt?: string | null;

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

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

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

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
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
  // liquidity
  if (x >= 75) return 'strong';
  if (x >= 45) return 'mid';
  return 'thin';
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

export default function HeroPortalSection({
  cities,
  clusters,
  rotateMs = 6500,
}: {
  cities: HeroCity[];
  clusters: HeroCluster[];
  rotateMs?: number;
}) {
  const safeCities = Array.isArray(cities) ? cities.filter(Boolean) : [];
  const list = safeCities.length ? safeCities : [];

  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const loaded = useRef<Set<number>>(new Set());
  const tRef = useRef<number | null>(null);

  const active = list[idx] ?? null;
  const prev = prevIdx !== null ? list[prevIdx] ?? null : null;

  // Crossfade driver (never show white flash)
  function go(next: number) {
    if (!list.length) return;

    const target = (next + list.length) % list.length;
    if (target === idx) return;

    setPrevIdx(idx);
    setIdx(target);

    // begin fade: keep prev visible until new is ready
    setIsFading(true);
  }

  function next() {
    go(idx + 1);
  }

  function prevSlide() {
    go(idx - 1);
  }

  // Auto-rotate
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

  // When new image loads, complete fade
  function markLoaded(i: number) {
    loaded.current.add(i);
    // If we are fading into this index, finish quickly
    window.setTimeout(() => setIsFading(false), 40);
    // Cleanup prev after fade
    window.setTimeout(() => setPrevIdx(null), 420);
  }

  // Preload next image (helps kill “white time”)
  const preloadNextSrc = useMemo(() => {
    if (!list.length) return null;
    const n = (idx + 1) % list.length;
    return list[n]?.heroImageSrc ?? null;
  }, [idx, list]);

  const overlaySignals = useMemo(() => {
    if (!active?.signals) return [];

    const s = active.signals;
    const out: Array<{ label: string; value: string }> = [];

    if (typeof s.liquidity === 'number') out.push({ label: 'LIQ', value: `${Math.round(s.liquidity)}/100 ${scoreLabel(s.liquidity, 'liquidity')}` });
    if (typeof s.risk === 'number') out.push({ label: 'RISK', value: `${Math.round(s.risk)}/100 ${scoreLabel(s.risk, 'risk')}` });
    if (typeof s.verifiedSupply === 'number') out.push({ label: 'VER', value: formatCompactNumber(s.verifiedSupply) });
    if (typeof s.medianEurSqm === 'number') out.push({ label: '€/SQM', value: `€${formatCompactNumber(s.medianEurSqm)}` });

    return out.slice(0, 4);
  }, [active]);

  // Tight portal copy
  const h1 = 'A luxury marketplace built on intelligence';
  const sub =
    'Editorial catalogue on top. A Truth Layer underneath - verification, liquidity and risk signals, built city by city.';

  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative min-h-[860px] w-full bg-[color:var(--paper-2)]">
        {/* Base signature backdrop always present (prevents white flash perception) */}
        <VanteraSignatureBackdrop />

        {/* Image stage */}
        <div
          className="absolute inset-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-hidden="true"
        >
          {/* Image container */}
          <div className="absolute inset-0">
            {/* Previous stays under during transition */}
            {prev ? (
              <div className="absolute inset-0">
                <Image
                  src={prev.heroImageSrc}
                  alt={prev.heroImageAlt ?? `${prev.name} hero`}
                  fill
                  priority={false}
                  sizes="100vw"
                  className={cx(
                    'object-cover',
                    // reduce blur: NONE on the image itself
                    'opacity-100',
                  )}
                />
              </div>
            ) : null}

            {/* Active fades in */}
            {active ? (
              <div className="absolute inset-0">
                <Image
                  src={active.heroImageSrc}
                  alt={active.heroImageAlt ?? `${active.name} hero`}
                  fill
                  priority
                  sizes="100vw"
                  onLoad={() => markLoaded(idx)}
                  className={cx(
                    'object-cover transition-opacity duration-[520ms]',
                    isFading ? 'opacity-0' : 'opacity-100',
                  )}
                />

                {/* Image veil for readability, not blur */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.88),rgba(255,255,255,0.52),rgba(255,255,255,0.18))]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.14),rgba(255,255,255,0.06),rgba(255,255,255,0.92))]" />
              </div>
            ) : null}
          </div>

          {/* Preload next (hidden) */}
          {preloadNextSrc ? (
            <Image
              src={preloadNextSrc}
              alt=""
              width={8}
              height={8}
              className="hidden"
              priority={false}
            />
          ) : null}
        </div>

        {/* Hero frame + crown */}
        <div className="pointer-events-none absolute inset-0">
          <CrownRail />
          <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_22%_6%,rgba(206,160,74,0.10),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />
        </div>

        {/* Content */}
        <div className={cx('relative z-10', WIDE)}>
          <div className="grid gap-10 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">
            {/* Left: statement */}
            <div className="lg:col-span-7">
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

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/marketplace" className={BTN_PRIMARY}>
                  Browse marketplace
                </Link>
                <Link href="/coming-soon?flow=sell" className={BTN_SECONDARY}>
                  List privately
                </Link>
              </div>
            </div>

            {/* Right: smart search */}
            <div className="lg:col-span-5">
              <div
                className={cx(
                  'relative overflow-hidden',
                  'border border-[rgba(10,10,12,0.14)] bg-white/94 backdrop-blur-[14px]',
                  'shadow-[0_40px_140px_rgba(10,10,12,0.14)]',
                )}
              >
                <div className="pointer-events-none absolute inset-0">
                  <CrownRail />
                  <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_22%_0%,rgba(206,160,74,0.10),transparent_62%)]" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
                  <div className="absolute inset-[1px] ring-1 ring-inset ring-[rgba(255,255,255,0.62)]" />
                </div>

                <div className="relative p-5 sm:p-6">
                  <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                    SEARCH ATELIER
                  </div>
                  <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                    Type and it reacts instantly
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                    City, lifestyle, budget, keywords. Typos are fine.
                  </div>

                  <div className="mt-4">
                    <VanteraOmniSearch
                      cities={list.map((c) => ({
                        slug: c.slug,
                        name: c.name,
                        country: c.country,
                        region: null,
                        tz: 'UTC',
                        priority: 0,
                      }))}
                      clusters={clusters}
                      placeholder="marbella sea view villa under €5m"
                      autoFocus={false}
                    />
                  </div>

                  <div className="mt-4 text-[11px] text-[color:var(--ink-3)]">
                    Tip: press <span className="font-mono text-[color:var(--ink-2)]">/</span> anywhere.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial rail (caption + signals + controls) - bottom-left, grid-aligned */}
          <div className="pb-12 sm:pb-14">
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />

              <div className="flex items-end justify-between gap-6">
                {/* Left rail block */}
                <div className="max-w-[720px]">
                  <div className="relative inline-block overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 px-4 py-3 backdrop-blur-[10px] shadow-[0_26px_90px_rgba(10,10,12,0.10)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.55)] to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_220px_at_18%_0%,rgba(206,160,74,0.07),transparent_62%)]" />

                    <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                      FEATURED CITY
                    </div>

                    <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                      {active ? active.name : 'Editorial'}
                      {active ? <span className="text-[color:var(--ink-3)]"> · {active.country}</span> : null}
                    </div>

                    {overlaySignals.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {overlaySignals.map((x) => (
                          <SignalChip key={`${x.label}:${x.value}`} label={x.label} value={x.value} />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <SignalChip label="LIQ" value="—" />
                        <SignalChip label="RISK" value="—" />
                        <SignalChip label="VER" value="—" />
                      </div>
                    )}
                  </div>

                  {/* tiny progress rail (desktop only) - makes the rotation noticeable */}
                  <div className="mt-3 hidden sm:block">
                    <div className="h-px w-full bg-[color:var(--hairline)]" />
                    <div
                      className="mt-1 h-[2px] w-full bg-[rgba(10,10,12,0.06)]"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full bg-[linear-gradient(90deg,rgba(10,10,12,0.92),rgba(206,160,74,0.55))]"
                        style={{
                          width: `${Math.round(((idx + 1) / Math.max(1, list.length)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Controls (desktop only, integrated - no scattered UI) */}
                <div className="hidden sm:flex items-center gap-2">
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

                  {/* dots */}
                  <div className="ml-2 flex items-center gap-2 border border-[rgba(10,10,12,0.12)] bg-white/92 px-3 py-2 backdrop-blur-[10px]">
                    {list.slice(0, 8).map((_, i) => {
                      const activeDot = i === idx;
                      return (
                        <button
                          key={`dot-${i}`}
                          type="button"
                          onClick={() => go(i)}
                          className={cx(
                            'h-1.5 w-1.5 transition',
                            activeDot ? 'bg-[rgba(10,10,12,0.72)]' : 'bg-[rgba(10,10,12,0.20)] hover:bg-[rgba(10,10,12,0.36)]',
                          )}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end rail */}
        </div>
      </div>
    </section>
  );
}
