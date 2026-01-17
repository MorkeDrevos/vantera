// src/components/home/HomePage.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import VanteraSignatureBackdrop from './VanteraSignatureBackdrop';
import DnaChapterBreak from './DnaChapterBreak';

import type { CoverageTier, CoverageStatus } from '@prisma/client';

export type RuntimeCity = {
  slug: string;
  name: string;
  country: string;
  region?: string | null;
  tz: string;

  tier?: CoverageTier;
  status?: CoverageStatus;
  priority?: number;

  blurb?: string | null;

  image?: {
    src: string;
    alt?: string | null;
  } | null;

  heroImageSrc?: string | null;
  heroImageAlt?: string | null;
};

export type RuntimeRegionCluster = {
  slug: string;
  name: string;
  country?: string;
  region?: string;
  priority?: number;
  citySlugs: string[];
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
   Layout primitives (white, editorial, full-bleed, royal)
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {/* Quiet paper texture + micro grid (luxury editorial) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 opacity-[0.026] [background-image:linear-gradient(to_right,rgba(10,10,12,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.18)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
        {/* faint gold paper warmth (royal, still white) */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_16%_8%,rgba(206,160,74,0.07),transparent_62%)]" />
      </div>

      <main className="w-full">{children}</main>
    </div>
  );
}

/* =========================================================
   Micro components
   ========================================================= */

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function GoldHairline({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'h-px w-full bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.90)] to-transparent',
        className,
      )}
    />
  );
}

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

function QuickLink({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        'group relative flex items-center justify-between gap-4 px-4 py-3',
        'border border-[rgba(10,10,12,0.12)] bg-white',
        'transition hover:border-[rgba(10,10,12,0.22)]',
        'hover:shadow-[0_16px_60px_rgba(10,10,12,0.06)]',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="min-w-0">
        <div className="text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{label}</div>
        {hint ? <div className="mt-1 text-[12px] text-[color:var(--ink-2)]">{hint}</div> : null}
      </div>

      <div className="h-px w-10 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-14 group-hover:bg-[rgba(10,10,12,0.30)]" />
    </Link>
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

function PortalMarquee({
  items,
}: {
  items: Array<{ name: string; href: string; meta?: string }>;
}) {
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
          <div className="mt-1 text-[13px] text-[color:var(--ink-2)]">
            Browse the catalogue city by city - updated as coverage expands.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {items.slice(0, 6).map((x) => (
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
   Buttons (royal editorial)
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

const BTN_PRIMARY_SM = cx(
  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white hover:bg-[rgba(10,10,12,1.0)]',
  'shadow-[0_16px_52px_rgba(10,10,12,0.10)] hover:shadow-[0_20px_76px_rgba(206,160,74,0.16)]',
);

const BTN_SECONDARY_SM = cx(
  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.12)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
);

/* =========================================================
   HERO (Luxury Portal)
   - White base + signature backdrop
   - Image provides colour (premium)
   - Live markets strip + signals
   ========================================================= */

function FullBleedHero({
  cities,
  topCountries,
  heroImage,
}: {
  cities: Array<{ name: string; slug: string; country: string }>;
  topCountries: string[];
  heroImage?: { src: string; alt?: string | null } | null;
}) {
  const marqueeItems = cities.map((c) => ({
    name: c.name,
    href: `/city/${c.slug}`,
    meta: c.country,
  }));

  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-[color:var(--hairline)]" />

        <div className="relative min-h-[880px] w-full bg-white">
          {/* Identity texture */}
          <VanteraSignatureBackdrop />

          {/* Premium image layer (colour comes from imagery, not UI) */}
          {heroImage?.src ? (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 opacity-[0.78]">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt ?? 'Vantera hero'}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              {/* White veils to keep it premium + readable */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.95),rgba(255,255,255,0.72),rgba(255,255,255,0.34),rgba(255,255,255,0.12))]" />
              <div className="absolute inset-0 bg-[radial-gradient(1200px_620px_at_22%_10%,rgba(255,255,255,0.94),transparent_62%)]" />
              <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />
            </div>
          ) : null}

          {/* Hero frame system */}
          <div className="pointer-events-none absolute inset-0">
            <CrownRail />
            <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_22%_6%,rgba(206,160,74,0.10),transparent_60%)]" />
          </div>

          <div className={cx('relative z-10', WIDE)}>
            <div className="grid gap-10 pb-10 pt-10 sm:pb-12 sm:pt-12 lg:grid-cols-12 lg:gap-12">
              {/* Left: portal statement */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>LUXURY PORTAL</Chip>
                  <Chip>GLOBAL CATALOGUE</Chip>
                  <Chip>TRUTH LAYER</Chip>
                </div>

                <h1 className="mt-7 text-balance text-[40px] font-semibold tracking-[-0.055em] text-[color:var(--ink)] sm:text-[52px] lg:text-[66px] lg:leading-[0.98]">
                  The luxury marketplace built for clarity, not noise
                </h1>

                <div className="mt-5 h-px w-28 bg-gradient-to-r from-[rgba(206,160,74,0.95)] to-transparent" />

                <p className="mt-5 max-w-[74ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-[18px]">
                  Browse exceptional homes globally, city by city. Under the surface, a Truth Layer verifies, scores and explains what
                  you&apos;re seeing - so the catalogue stays calm and decisions stay sharp.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/marketplace" className={BTN_PRIMARY}>
                    Browse marketplace
                  </Link>

                  <Link href="/search" className={BTN_SECONDARY}>
                    Open search
                  </Link>
                </div>

                {/* Portal signals */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <PortalSignal k="CATALOGUE" v="Curated markets" />
                  <PortalSignal k="TRUTH LAYER" v="Verified where possible" />
                  <PortalSignal k="ACCESS" v="Private submissions" />
                </div>
              </div>

              {/* Right: Search atelier */}
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
                      Find what you want fast
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                      Keywords, city, budget - move directly into the catalogue.
                    </div>

                    <form action="/search" method="get" className="mt-5 space-y-3">
                      <div className="border border-[rgba(10,10,12,0.12)] bg-white">
                        <label className="block px-4 pt-3 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                          KEYWORDS
                        </label>
                        <input
                          name="q"
                          placeholder="Waterfront, penthouse, gated, golf, privacy..."
                          className={cx(
                            'w-full bg-transparent px-4 pb-3 pt-2 text-[15px] text-[color:var(--ink)] outline-none',
                            'placeholder:text-[color:var(--ink-3)]',
                          )}
                        />
                      </div>

                      <div className="border border-[rgba(10,10,12,0.12)] bg-white">
                        <label className="block px-4 pt-3 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                          COUNTRY
                        </label>
                        <select
                          name="country"
                          className={cx('w-full bg-transparent px-4 pb-3 pt-2 text-[15px] text-[color:var(--ink)] outline-none')}
                          defaultValue=""
                        >
                          <option value="">Any</option>
                          {topCountries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <button type="submit" className={BTN_PRIMARY_SM}>
                          Search
                        </button>

                        <Link href="/marketplace" className={BTN_SECONDARY_SM}>
                          Browse
                        </Link>
                      </div>

                      <div className="pt-2">
                        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                          QUICK DESTINATIONS
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {cities.slice(0, 6).map((c) => (
                            <QuickLink key={c.slug} href={`/city/${c.slug}`} label={c.name} hint={c.country} />
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-[12px] text-[color:var(--ink-3)]">
                        Tip: press <span className="font-mono">/</span> to jump into search from anywhere.
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

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

/* =========================================================
   HOME PAGE (marketplace-first)
   ========================================================= */

export default function HomePage({
  cities,
  clusters,
}: {
  cities: RuntimeCity[];
  clusters?: RuntimeRegionCluster[];
}) {
  void clusters;

  const safeCities = Array.isArray(cities) ? cities : [];

  const EXCLUDE_HERO_SLUGS = new Set(['estepona', 'benahavis']);

  const heroCandidates = safeCities
    .filter((c) => Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .filter((c) => !EXCLUDE_HERO_SLUGS.has(String(c.slug).toLowerCase()));

  const topForHero = heroCandidates.slice(0, 6).map((c) => ({ name: c.name, slug: c.slug, country: c.country }));

  // pick the top city hero image if available (portal colour source)
  const heroImage =
    heroCandidates.find((c) => Boolean(c?.heroImageSrc))?.heroImageSrc
      ? {
          src: heroCandidates.find((c) => Boolean(c?.heroImageSrc))!.heroImageSrc as string,
          alt: heroCandidates.find((c) => Boolean(c?.heroImageAlt))?.heroImageAlt ?? null,
        }
      : null;

  const countryCounts = new Map<string, number>();
  for (const c of safeCities) {
    const k = String(c?.country || '').trim();
    if (!k) continue;
    countryCounts.set(k, (countryCounts.get(k) ?? 0) + 1);
  }
  const topCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 12);

  const cityCards = safeCities
    .filter((c) => Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      country: c.country,
      region: c.region ?? null,
      tz: c.tz,
      tier: c.tier,
      status: c.status,
      priority: c.priority ?? 0,
      blurb: c.blurb ?? null,
      image: c.image
        ? {
            src: c.image.src,
            alt: c.image.alt ?? null,
          }
        : null,
      heroImageSrc: c.heroImageSrc ?? null,
      heroImageAlt: c.heroImageAlt ?? null,
    }));

  return (
    <Shell>
      <FullBleedHero
        cities={topForHero}
        topCountries={
          topCountries.length ? topCountries : ['Spain', 'France', 'United Arab Emirates', 'United States', 'United Kingdom']
        }
        heroImage={heroImage}
      />

      <DnaChapterBreak />

      <section className="py-12 sm:py-16">
        <div className={WIDE}>
          <div className="mb-6">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">MARKETFRONT</div>
            <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
              Six cities to start the marketplace
            </div>
            <div className="mt-2 max-w-[88ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
              Real signals only. Local time, verified supply when available, and a catalogue-first experience.
            </div>

            <div className="mt-6">
              <Hairline />
              <div className="mt-1">
                <GoldHairline className="opacity-60" />
              </div>
            </div>
          </div>

          <CityCardsVirtualizedClient cities={cityCards} mode="featured" columns="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className={NARROW}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">VANTERA</div>

              <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
                Search and browse, the way luxury should feel
              </div>

              <div className="mt-2 max-w-[78ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)]">
                No clutter, no duplicated feeds, and no portal theatre. Just a calm catalogue experience with intelligence underneath.
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Link href="/search" className={BTN_SECONDARY_SM}>
                Open search
              </Link>
              <Link href="/marketplace" className={BTN_PRIMARY_SM}>
                Browse
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Hairline />
            <div className="mt-1">
              <GoldHairline className="opacity-55" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="relative overflow-hidden border border-[rgba(10,10,12,0.12)] bg-white p-5">
              <CrownRail className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_240px_at_20%_0%,rgba(206,160,74,0.06),transparent_60%)]" />
              <div className="relative">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">INTELLIGENCE</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Truth-first</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Verification, structured facts and clear attribution of what is known versus assumed.
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[rgba(10,10,12,0.12)] bg-white p-5">
              <CrownRail className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_240px_at_20%_0%,rgba(206,160,74,0.06),transparent_60%)]" />
              <div className="relative">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">DISCOVERY</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Fast search</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Keywords first, destinations second, and results designed to feel editorial, not noisy.
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[rgba(10,10,12,0.12)] bg-white p-5">
              <CrownRail className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_240px_at_20%_0%,rgba(206,160,74,0.06),transparent_60%)]" />
              <div className="relative">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PRESENTATION</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Catalogue grade</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Big imagery, quiet typography and layouts that sell desire with restraint.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
