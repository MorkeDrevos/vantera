// src/components/home/HomePage.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';

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
   Layout primitives (white, editorial, full-bleed)
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {/* Quiet paper texture + micro grid (luxury editorial) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:linear-gradient(to_right,rgba(10,10,12,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.18)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      <main className="w-full">{children}</main>
    </div>
  );
}

/* =========================================================
   Micro components
   ========================================================= */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-2)]">
      {children}
    </div>
  );
}

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{eyebrow}</div>
        <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-2 max-w-[78ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

function QuickLink({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        'group flex items-center justify-between gap-4 px-4 py-3',
        'border border-[color:var(--hairline)] bg-white',
        'transition hover:border-[rgba(10,10,12,0.22)]',
      )}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">{label}</div>
        {hint ? <div className="mt-1 text-[12px] text-[color:var(--ink-2)]">{hint}</div> : null}
      </div>
      <div className="h-px w-10 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-14 group-hover:bg-[rgba(10,10,12,0.30)]" />
    </Link>
  );
}

function DnaPillar({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-[color:var(--hairline)] bg-white p-5">
      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{eyebrow}</div>
      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>
    </div>
  );
}

/* =========================================================
   HERO (full-bleed, marketplace statement + search atelier)
   ========================================================= */

function FullBleedHero({
  cities,
  topCountries,
}: {
  cities: Array<{ name: string; slug: string; country: string }>;
  topCountries: string[];
}) {
  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-[color:var(--hairline)]" />

        <div className="relative min-h-[760px] w-full bg-[color:var(--paper-2)]">
          <Image
            src="/brand/hero.jpg"
            alt="Vantera - Global luxury marketplace"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* White editorial wash (premium, not dark) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.92),rgba(255,255,255,0.62),rgba(255,255,255,0.28))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.44),rgba(255,255,255,0.30),rgba(255,255,255,0.92))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />

          <div className={cx('relative z-10', WIDE)}>
            <div className="grid gap-10 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">
              {/* Left: statement */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>Curated</Chip>
                  <Chip>Verified</Chip>
                  <Chip>Global</Chip>
                </div>

                <h1 className="mt-7 text-balance text-[44px] font-semibold tracking-[-0.055em] text-[color:var(--ink)] sm:text-[56px] lg:text-[72px] lg:leading-[0.98]">
                  A global catalogue of exceptional homes, powered by intelligence
                </h1>

                <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  Built city by city. Under the surface is a Truth Layer that verifies, scores and explains the market so you can
                  move with clarity - not noise.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/marketplace"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
                      'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white',
                      'hover:bg-[rgba(10,10,12,1.0)] transition',
                    )}
                  >
                    Browse marketplace
                  </Link>

                  <Link
                    href="/coming-soon?flow=sell"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
                      'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)]',
                      'hover:border-[rgba(10,10,12,0.22)] transition',
                    )}
                  >
                    List privately
                  </Link>
                </div>
              </div>

              {/* Right: Search atelier */}
              <div className="lg:col-span-5">
                <div
                  className={cx(
                    'relative overflow-hidden',
                    'border border-[color:var(--hairline)] bg-white/82 backdrop-blur-[18px]',
                    'shadow-[0_40px_140px_rgba(10,10,12,0.14)]',
                  )}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,10,12,0.14)] to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_20%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
                  </div>

                  <div className="relative p-5 sm:p-6">
                    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                      SEARCH ATELIER
                    </div>
                    <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                      The fastest way to serious property intelligence
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                      Search by intent, location, or move directly into a market.
                    </div>

                    <form action="/search" method="get" className="mt-5 space-y-3">
                      <div className="border border-[color:var(--hairline)] bg-white">
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

                      <div className="border border-[color:var(--hairline)] bg-white">
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
                        <button
                          type="submit"
                          className={cx(
                            'inline-flex items-center justify-center px-5 py-3 text-sm font-semibold transition',
                            'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                          )}
                        >
                          Search
                        </button>

                        <Link
                          href="/marketplace"
                          className={cx(
                            'inline-flex items-center justify-center px-5 py-3 text-sm font-semibold transition',
                            'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                          )}
                        >
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

            {/* Vantera DNA */}
            <div className="pb-10 sm:pb-12">
              <div className="border border-[color:var(--hairline)] bg-white/84 backdrop-blur-[14px] shadow-[0_40px_140px_rgba(10,10,12,0.10)]">
                <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-[color:var(--hairline)]">
                  <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">VANTERA DNA</div>
                  <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[26px]">
                    Meet the intelligence behind the marketplace
                  </div>
                  <div className="mt-2 max-w-[90ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
                    Listings are one layer. Vantera adds verification, scoring, and clarity that removes noise.
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <DnaPillar
                      eyebrow="TRUTH LAYER"
                      title="Verified versus assumed"
                      body="Clear attribution of what is verified, inferred or unknown - with structured checks designed to remove ambiguity."
                    />
                    <DnaPillar
                      eyebrow="MARKET INTELLIGENCE"
                      title="Markets, with clarity"
                      body="Signals that explain pricing dynamics, liquidity and risk at a city level, built progressively as coverage expands."
                    />
                    <DnaPillar
                      eyebrow="SIGNAL OVER NOISE"
                      title="Designed for signal"
                      body="Editorial control replaces clutter. Higher signal density and a calmer path to a decision."
                    />
                    <DnaPillar
                      eyebrow="PRIVATE NETWORK"
                      title="Private by architecture"
                      body="Controlled access, verified submissions and discretion as a system default for serious buyers and advisors."
                    />
                  </div>

                  <div className="mt-6">
                    <Hairline />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[color:var(--ink-2)]">
                      The marketplace is how you enter. The intelligence is why you stay.
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Link
                        href="/coming-soon?section=intelligence"
                        className={cx(
                          'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                          'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                        )}
                      >
                        Explore intelligence (soon)
                      </Link>
                      <Link
                        href="/search"
                        className={cx(
                          'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                          'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                        )}
                      >
                        Open search
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end DNA */}
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

  // Hero quick destinations:
  // - sorted by priority
  // - explicitly exclude Estepona/Benahavis from hero quick destinations
  const EXCLUDE_HERO_SLUGS = new Set(['estepona', 'benahavis']);

  const heroCandidates = safeCities
    .filter((c) => Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .filter((c) => !EXCLUDE_HERO_SLUGS.has(String(c.slug).toLowerCase()));

  const topForHero = heroCandidates.slice(0, 6).map((c) => ({ name: c.name, slug: c.slug, country: c.country }));

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

  // Adapter: RuntimeCity -> City (for CityCard)
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
      />

      {/* Keep the 6-city marketfront (FIX, don’t remove) */}
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
            </div>
          </div>

          <CityCardsVirtualizedClient cities={cityCards} mode="featured" columns="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      {/* Editorial intro */}
      <section className="pb-16 sm:pb-20">
        <div className={NARROW}>
          <SectionHeader
            eyebrow="VANTERA"
            title="Search and browse, the way luxury should feel"
            subtitle="No clutter, no duplicated feeds, and no portal theatre. Just a calm catalogue experience with intelligence underneath."
            right={
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/search"
                  className={cx(
                    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                    'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                  )}
                >
                  Open search
                </Link>
                <Link
                  href="/marketplace"
                  className={cx(
                    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                  )}
                >
                  Browse
                </Link>
              </div>
            }
          />

          <div className="mt-8">
            <Hairline />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">INTELLIGENCE</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Truth-first</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Verification, structured facts and clear attribution of what is known versus assumed.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">DISCOVERY</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Fast search</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Keywords first, destinations second, and results designed to feel editorial, not noisy.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PRESENTATION</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Catalogue grade</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Big imagery, quiet typography and layouts that sell desire with restraint.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (Per your “img 4” note) Do NOT render the full city grid anywhere on home. */}
    </Shell>
  );
}
