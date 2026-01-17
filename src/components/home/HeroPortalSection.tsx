// src/components/home/HeroPortalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import VanteraSignatureBackdrop from './VanteraSignatureBackdrop';
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

import type { OmniCity, OmniRegionCluster } from '@/components/search/VanteraOmniSearch';
import type { RuntimeCity, RuntimeRegionCluster } from './HomePage';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
   Micro UI
   ========================================================= */

function CrownRail({ className }: { className?: string }) {
  return (
    <div className={cx('pointer-events-none absolute inset-x-0 top-0', className)}>
      <div className="h-[2px] bg-[linear-gradient(90deg,transparent,rgba(206,160,74,0.60),transparent)] opacity-90" />
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.34),transparent)] opacity-90" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center gap-2 border border-[rgba(10,10,12,0.12)] bg-white/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-2)] backdrop-blur-[10px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.70)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(180px_52px_at_50%_0%,rgba(206,160,74,0.10),transparent_72%)]" />
      {children}
    </div>
  );
}

function PortalSignal({ k, v }: { k: string; v: string }) {
  return (
    <div className="relative overflow-hidden border border-[rgba(10,10,12,0.12)] bg-white px-4 py-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.44)] to-transparent" />
      <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{k}</div>
      <div className="mt-1 text-[13px] font-semibold text-[color:var(--ink)]">{v}</div>
    </div>
  );
}

function PortalMarquee({ items }: { items: Array<{ name: string; href: string; meta?: string }> }) {
  return (
    <div className="relative overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[10px]">
      <div className="pointer-events-none absolute inset-0">
        <CrownRail />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_20%_0%,rgba(206,160,74,0.08),transparent_62%)]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.06)]" />
      </div>

      <div className="relative flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">LIVE MARKETS</div>
          <div className="mt-1 text-[13px] text-[color:var(--ink-2)]">Browse city by city. Built progressively.</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {items.slice(0, 8).map((x) => (
            <Link
              key={x.href}
              href={x.href}
              className={cx(
                'group inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold',
                'border border-[rgba(10,10,12,0.12)] bg-white',
                'hover:border-[rgba(10,10,12,0.22)] transition',
              )}
            >
              <span className="text-[color:var(--ink)]">{x.name}</span>
              {x.meta ? <span className="text-[color:var(--ink-3)]">{x.meta}</span> : null}
              <span className="ml-1 h-px w-6 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-10 group-hover:bg-[rgba(206,160,74,0.70)]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Buttons
   ========================================================= */

const BTN_PRIMARY = cx(
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white hover:bg-[rgba(10,10,12,1.0)]',
  'shadow-[0_18px_60px_rgba(10,10,12,0.12)] hover:shadow-[0_22px_90px_rgba(206,160,74,0.18)]',
);

const BTN_SECONDARY = cx(
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.12)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
  'shadow-[0_10px_40px_rgba(10,10,12,0.05)] hover:shadow-[0_16px_60px_rgba(10,10,12,0.06)]',
);

/* =========================================================
   Rotation (premium crossfade + controls)
   ========================================================= */

type HeroSlide = {
  slug: string;
  name: string;
  country: string;
  src: string;
  alt?: string | null;
  // optional signals (if present in RuntimeCity)
  tier?: string | null;
  status?: string | null;
  tz?: string | null;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;

    const apply = () => setReduced(Boolean(mq.matches));
    apply();

    const onChange = () => apply();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

function formatTier(t?: string | null) {
  if (!t) return null;
  // best-effort pretty print
  return String(t).replace(/_/g, ' ').toLowerCase();
}

function formatStatus(s?: string | null) {
  if (!s) return null;
  return String(s).replace(/_/g, ' ').toLowerCase();
}

function buildCitySignals(s: HeroSlide) {
  const out: string[] = [];
  // Keep these subtle, not dashboardy
  if (s.status) out.push(`status: ${formatStatus(s.status)}`);
  if (s.tier) out.push(`tier: ${formatTier(s.tier)}`);
  out.push('catalogue live');
  return out.slice(0, 3);
}

/* =========================================================
   HERO PORTAL SECTION
   ========================================================= */

export default function HeroPortalSection({
  cities,
  clusters,
  topCountries,
  wideClassName,
}: {
  cities: RuntimeCity[];
  clusters?: RuntimeRegionCluster[];
  topCountries: string[];
  wideClassName: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  const omniCities: OmniCity[] = useMemo(
    () =>
      (Array.isArray(cities) ? cities : [])
        .filter((c) => Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
        .map((c) => ({
          slug: c.slug,
          name: c.name,
          country: c.country,
          region: c.region ?? null,
          tz: c.tz,
          priority: c.priority ?? 0,
        })),
    [cities],
  );

  const omniClusters: OmniRegionCluster[] = useMemo(
    () =>
      (Array.isArray(clusters) ? clusters : []).map((r) => ({
        slug: r.slug,
        name: r.name,
        country: r.country,
        region: r.region,
        priority: r.priority ?? 0,
        citySlugs: r.citySlugs ?? [],
      })),
    [clusters],
  );

  const slides: HeroSlide[] = useMemo(() => {
    return (Array.isArray(cities) ? cities : [])
      .filter((c) => Boolean(c?.heroImageSrc) && Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
      .slice()
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      .slice(0, 8)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        country: c.country,
        src: String(c.heroImageSrc),
        alt: c.heroImageAlt ?? `${c.name} luxury property`,
        tier: c.tier ? String(c.tier) : null,
        status: c.status ? String(c.status) : null,
        tz: c.tz ? String(c.tz) : null,
      }));
  }, [cities]);

  const [idx, setIdx] = useState(0);
  const userPauseUntilRef = useRef<number>(0);

  function pauseAuto(ms: number) {
    userPauseUntilRef.current = Date.now() + ms;
  }

  function goNext() {
    if (slides.length <= 1) return;
    pauseAuto(18_000);
    setIdx((v) => clampIndex(v + 1, slides.length));
  }

  function goPrev() {
    if (slides.length <= 1) return;
    pauseAuto(18_000);
    setIdx((v) => clampIndex(v - 1, slides.length));
  }

  function goTo(i: number) {
    if (slides.length <= 1) return;
    pauseAuto(18_000);
    setIdx(clampIndex(i, slides.length));
  }

  useEffect(() => {
    if (reducedMotion) return;
    if (slides.length <= 1) return;

    const ms = 8500; // calm cadence
    const t = window.setInterval(() => {
      if (Date.now() < userPauseUntilRef.current) return;
      setIdx((v) => (v + 1) % slides.length);
    }, ms);

    return () => window.clearInterval(t);
  }, [slides.length, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (slides.length <= 1) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const active = slides[idx] ?? null;
  const next = slides.length > 1 ? slides[(idx + 1) % slides.length] : null;

  const marqueeItems = useMemo(
    () =>
      omniCities
        .slice()
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
        .slice(0, 8)
        .map((c) => ({
          name: c.name,
          href: `/city/${c.slug}`,
          meta: c.country,
        })),
    [omniCities],
  );

  const liveCountriesCount = useMemo(() => new Set(omniCities.map((c) => c.country)).size, [omniCities]);
  const liveMarketsCount = useMemo(() => omniCities.length, [omniCities]);

  const overlaySignals = useMemo(() => (active ? buildCitySignals(active) : []), [active]);

  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-[color:var(--hairline)]" />

        <div className="relative min-h-[920px] w-full bg-white">
          {/* Identity texture */}
          <VanteraSignatureBackdrop />

          {/* Rotating hero image plane */}
          {active?.src ? (
            <div className="absolute inset-0">
              {/* Preload next image */}
              {next?.src ? (
                <div className="absolute h-0 w-0 overflow-hidden opacity-0">
                  <Image src={next.src} alt={next.alt ?? 'next'} width={16} height={16} />
                </div>
              ) : null}

              {/* Images (crossfade) */}
              <div className="pointer-events-none absolute inset-0">
                {slides.map((s, i) => {
                  const isActive = i === idx;
                  return (
                    <div
                      key={s.src}
                      className={cx(
                        'absolute inset-0',
                        reducedMotion ? '' : 'transition-opacity duration-[1400ms] ease-out',
                        isActive ? 'opacity-[0.82]' : 'opacity-0',
                      )}
                    >
                      <Image
                        src={s.src}
                        alt={s.alt ?? 'Vantera hero'}
                        fill
                        priority={i === 0}
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  );
                })}
              </div>

              {/* White veils for readability */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.96),rgba(255,255,255,0.78),rgba(255,255,255,0.34),rgba(255,255,255,0.12))]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_620px_at_22%_10%,rgba(255,255,255,0.94),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />

              {/* City label overlay (bottom-left, aligned to headline grid) */}
<div className={cx('absolute bottom-6 z-20', wideClassName)}>
  {/* match the hero grid: left column width */}
  <div className="max-w-[720px]">
    <div className="relative inline-block overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 px-4 py-3 backdrop-blur-[12px] shadow-[0_26px_90px_rgba(10,10,12,0.10)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.55)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_220px_at_18%_0%,rgba(206,160,74,0.08),transparent_62%)]" />

      <div className="text-[10px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">FEATURED CITY</div>
      <div className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
        {active ? active.name : 'Editorial'}
        {active ? <span className="text-[color:var(--ink-3)]"> · {active.country}</span> : null}
      </div>

      {overlaySignals.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {overlaySignals.map((t) => (
            <span
              key={t}
              className="inline-flex items-center border border-[rgba(10,10,12,0.12)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[color:var(--ink-2)]"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </div>
</div>

          {/* Hero frame system */}
          <div className="pointer-events-none absolute inset-0">
            <CrownRail />
            <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_22%_6%,rgba(206,160,74,0.10),transparent_60%)]" />
          </div>

          <div className={cx('relative z-10', wideClassName)}>
            <div className="grid gap-10 pb-10 pt-10 sm:pb-12 sm:pt-12 lg:grid-cols-12 lg:gap-12">
              {/* Left: portal statement */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>LUXURY PORTAL</Chip>
                  <Chip>GLOBAL CATALOGUE</Chip>
                  <Chip>TRUTH LAYER</Chip>
                </div>

                {/* Tightened copy */}
                <h1 className="mt-7 text-balance text-[40px] font-semibold tracking-[-0.055em] text-[color:var(--ink)] sm:text-[52px] lg:text-[66px] lg:leading-[0.98]">
                  A global luxury marketplace for exceptional homes
                </h1>

                <div className="mt-5 h-px w-28 bg-gradient-to-r from-[rgba(206,160,74,0.95)] to-transparent" />

                <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-[18px]">
                  Curated presentation. Serious search. A Truth Layer underneath to keep decisions clean.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/marketplace" className={BTN_PRIMARY}>
                    Browse marketplace
                  </Link>

                  <Link href="/coming-soon?flow=sell" className={BTN_SECONDARY}>
                    List privately
                  </Link>
                </div>

                {/* Signals */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <PortalSignal k="LIVE MARKETS" v={`${liveMarketsCount}`} />
                  <PortalSignal k="COUNTRIES" v={`${liveCountriesCount}`} />
                  <PortalSignal k="FEATURED" v={active ? active.name : 'Editorial'} />
                </div>
              </div>

              {/* Right: Portal search instrument */}
              <div className="lg:col-span-5">
                <div
                  className={cx(
                    'relative overflow-hidden',
                    'border border-[rgba(10,10,12,0.14)] bg-white/94 backdrop-blur-[16px]',
                    'shadow-[0_40px_140px_rgba(10,10,12,0.14)]',
                  )}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <CrownRail />
                    <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_22%_0%,rgba(206,160,74,0.10),transparent_62%)]" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
                    <div className="absolute inset-[1px] ring-1 ring-inset ring-[rgba(255,255,255,0.65)]" />
                  </div>

                  <div className="relative p-5 sm:p-6">
                    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">PORTAL SEARCH</div>
                    <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                      Search like a pro
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                      City, lifestyle, budget, keywords. Typos are fine.
                    </div>

                    <div className="mt-5">
                      <VanteraOmniSearch
                        cities={omniCities}
                        clusters={omniClusters}
                        placeholder="search city, lifestyle, budget, keywords (typos ok)"
                      />
                    </div>

                    <div className="mt-4 border border-[rgba(10,10,12,0.12)] bg-white">
                      <div className="px-4 pt-3 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                        COUNTRY SHORTLIST
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 px-4 pb-4">
                        {topCountries.slice(0, 8).map((c) => (
                          <Link
                            key={c}
                            href={`/search?country=${encodeURIComponent(c)}`}
                            className="inline-flex items-center border border-[rgba(10,10,12,0.12)] bg-white px-3 py-2 text-[12px] font-semibold text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)] transition"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-[12px] text-[color:var(--ink-3)]">
                      Tip: press <span className="font-mono">/</span> from anywhere.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls row (desktop only): Prev/Next + dots (dots hidden on mobile) */}
            {slides.length > 1 ? (
              <div className="pb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      className={cx(
                        'inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition',
                        'border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[10px]',
                        'hover:border-[rgba(10,10,12,0.22)]',
                        'shadow-[0_18px_60px_rgba(10,10,12,0.08)]',
                      )}
                      aria-label="Previous hero image"
                    >
                      Prev
                      <span className="h-px w-6 bg-[color:var(--hairline)]" />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className={cx(
                        'inline-flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition',
                        'border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[10px]',
                        'hover:border-[rgba(10,10,12,0.22)]',
                        'shadow-[0_18px_60px_rgba(10,10,12,0.08)]',
                      )}
                      aria-label="Next hero image"
                    >
                      Next
                      <span className="h-px w-6 bg-[color:var(--hairline)]" />
                    </button>
                  </div>

                  {/* Dots hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-2">
                    {slides.map((s, i) => {
                      const isActive = i === idx;
                      return (
                        <button
                          key={s.src}
                          type="button"
                          onClick={() => goTo(i)}
                          className={cx(
                            'h-2.5 w-2.5 border transition',
                            isActive
                              ? 'border-[rgba(206,160,74,0.95)] bg-[rgba(206,160,74,0.30)]'
                              : 'border-[rgba(10,10,12,0.18)] bg-white',
                          )}
                          aria-label={`Go to ${s.name}`}
                          title={s.name}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 hidden sm:block text-[11px] text-[color:var(--ink-3)]">
                  Tip: use <span className="font-mono">←</span> <span className="font-mono">→</span> to switch cities.
                </div>
              </div>
            ) : null}

            {/* Live markets strip */}
            <div className="pb-10 sm:pb-12">
              <PortalMarquee items={marqueeItems} />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-[color:var(--hairline)]" />
      </div>
    </section>
  );
}
