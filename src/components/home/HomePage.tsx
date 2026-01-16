// src/components/home/HomePage.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

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

      <div className="relative">
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>

        <main className="w-full">{children}</main>

        <Footer />
      </div>
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

type ListingTease = {
  title: string;
  place: string;
  price: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
};

function ListingCardTease({ item }: { item: ListingTease }) {
  const href = item.href ?? '/marketplace';
  return (
    <Link
      href={href}
      className={cx(
        'group block overflow-hidden border border-[color:var(--hairline)] bg-white',
        'transition hover:border-[rgba(10,10,12,0.22)]',
      )}
      aria-label={`${item.title} - ${item.place} - ${item.price}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--paper-2)]">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(800px_420px_at_50%_0%,rgba(0,0,0,0.06),transparent_62%)]" />
        )}

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.08))]" />
        </div>
      </div>

      <div className="p-5">
        <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">{item.place}</div>
        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{item.title}</div>
        <div className="mt-2 text-sm text-[color:var(--ink-2)]">{item.price}</div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">VIEW</div>
          <div className="h-px w-10 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-14 group-hover:bg-[rgba(10,10,12,0.30)]" />
        </div>
      </div>
    </Link>
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
            alt="Vantera - Global €2M+ marketplace"
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
                  Vantera is built city by city. Under the surface is a Truth Layer that verifies, scores, and explains the market.
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

              {/* Right: Search atelier (server-safe form, feels like a product) */}
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
                      The fastest path through verified markets
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                      Use keywords, a country, or step directly into a city.
                    </div>

                    <form action="/search" method="get" className="mt-5 space-y-3">
                      {/* Keyword */}
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

                      {/* Country */}
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

                      {/* CTA row */}
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

            {/* Vantera DNA (replaces Institutional benchmark) */}
            <div className="pb-10 sm:pb-12">
              <div className="border border-[color:var(--hairline)] bg-white/84 backdrop-blur-[14px] shadow-[0_40px_140px_rgba(10,10,12,0.10)]">
                <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-[color:var(--hairline)]">
                  <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                    VANTERA DNA
                  </div>
                  <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[26px]">
                    Meet the Truth Layer behind the marketplace
                  </div>
                  <div className="mt-2 max-w-[90ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
                    Listings are the surface. Vantera is the intelligence underneath - verification, scoring, and clarity that removes noise.
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <DnaPillar
  eyebrow="TRUTH LAYER"
  title="What’s verified, and what isn’t"
  body="Structured facts, cross-checks, and consistency rules. Clear separation between verified data, inferred signals, and unknowns — so you always know what you’re looking at."
/>

<DnaPillar
  eyebrow="MARKET INTELLIGENCE"
  title="Understand price, liquidity, and risk"
  body="City-level signals that explain how markets behave, not just what’s listed. Built market by market, designed to support real decisions."
/>

<DnaPillar
  eyebrow="SIGNAL OVER NOISE"
  title="Curated, not flooded"
  body="A controlled catalogue with editorial restraint. No duplicated feeds, no algorithmic clutter, no endless scroll — only listings that meet integrity thresholds."
/>

<DnaPillar
  eyebrow="PRIVATE NETWORK"
  title="Discreet by default"
  body="Verified sellers, private submissions, and controlled visibility. Built for serious buyers, advisors, and long-term decision-makers — not mass traffic."
/>
                  </div>

                  <div className="mt-6">
                    <Hairline />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[color:var(--ink-2)]">
                      This is the foundation of Vantera. The marketplace is how you enter.
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
   HOME PAGE (marketplace-first, wow-factor search + browse)
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

  // Prioritise cities that have hero imagery so the page looks real instantly
  const imageCities = safeCities
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      country: c.country,
      img: c.heroImageSrc ?? c.image?.src ?? '',
      alt: c.heroImageAlt ?? c.image?.alt ?? c.name,
      priority: c.priority ?? 0,
    }))
    .filter((x) => Boolean(x.slug) && Boolean(x.name) && Boolean(x.country))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const topForHero = imageCities.slice(0, 6);

  const countryCounts = new Map<string, number>();
  for (const c of imageCities) {
    const k = String(c.country || '').trim();
    if (!k) continue;
    countryCounts.set(k, (countryCounts.get(k) ?? 0) + 1);
  }
  const topCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 12);

  // Featured teaser (editorial)
  const tease: ListingTease[] = [
    {
      place: topForHero[0] ? `${topForHero[0].name}, ${topForHero[0].country}` : 'Cap Ferrat, France',
      title: 'Waterfront Villa',
      price: 'From €18,500,000',
      imageSrc: topForHero[0]?.img || undefined,
      imageAlt: topForHero[0]?.alt,
      href: topForHero[0]?.slug ? `/city/${topForHero[0].slug}` : '/marketplace',
    },
    {
      place: topForHero[1] ? `${topForHero[1].name}, ${topForHero[1].country}` : 'Marbella, Spain',
      title: 'Modern Estate',
      price: 'From €7,900,000',
      imageSrc: topForHero[1]?.img || undefined,
      imageAlt: topForHero[1]?.alt,
      href: topForHero[1]?.slug ? `/city/${topForHero[1].slug}` : '/marketplace',
    },
    {
      place: topForHero[2] ? `${topForHero[2].name}, ${topForHero[2].country}` : 'Dubai, UAE',
      title: 'Penthouse Residence',
      price: 'From €12,200,000',
      imageSrc: topForHero[2]?.img || undefined,
      imageAlt: topForHero[2]?.alt,
      href: topForHero[2]?.slug ? `/city/${topForHero[2].slug}` : '/marketplace',
    },
    {
      place: topForHero[3] ? `${topForHero[3].name}, ${topForHero[3].country}` : 'Miami, USA',
      title: 'Beachfront Compound',
      price: 'From €9,400,000',
      imageSrc: topForHero[3]?.img || undefined,
      imageAlt: topForHero[3]?.alt,
      href: topForHero[3]?.slug ? `/city/${topForHero[3].slug}` : '/marketplace',
    },
    {
      place: topForHero[4] ? `${topForHero[4].name}, ${topForHero[4].country}` : 'London, UK',
      title: 'Townhouse Residence',
      price: 'From €6,200,000',
      imageSrc: topForHero[4]?.img || undefined,
      imageAlt: topForHero[4]?.alt,
      href: topForHero[4]?.slug ? `/city/${topForHero[4].slug}` : '/marketplace',
    },
    {
      place: topForHero[5] ? `${topForHero[5].name}, ${topForHero[5].country}` : 'Monaco',
      title: 'Skyline Apartment',
      price: 'From €11,700,000',
      imageSrc: topForHero[5]?.img || undefined,
      imageAlt: topForHero[5]?.alt,
      href: topForHero[5]?.slug ? `/city/${topForHero[5].slug}` : '/marketplace',
    },
  ];

  return (
    <Shell>
      <FullBleedHero
        cities={topForHero.map((c) => ({ name: c.name, slug: c.slug, country: c.country }))}
        topCountries={
          topCountries.length ? topCountries : ['Spain', 'France', 'United Arab Emirates', 'United States', 'United Kingdom']
        }
      />

      {/* Editorial intro */}
      <section className="py-12 sm:py-16">
        <div className={NARROW}>
          <SectionHeader
            eyebrow="VANTERA"
            title="Search and browse, the way luxury should feel"
            subtitle="No clutter, no duplicated feeds, and no portal look. Just €2M+ property discovery with editorial restraint and serious speed."
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
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">THRESHOLD</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">€2M+ only</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                The line is enforced. This is a luxury marketplace, not a mixed portal.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">DISCOVERY</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Fast search</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Keywords first, destinations second, and results that feel curated.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">PRESENTATION</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                Catalogue grade
              </div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Layouts designed to sell desire, not checkboxes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured (wow browse) */}
      <section className="pb-16 sm:pb-20">
        <div className={WIDE}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">FEATURED</div>
              <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
                The browse of your lifetime
              </div>
              <div className="mt-2 max-w-[80ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
                Big imagery, quiet typography, and a layout that feels like a high-end print spread.
              </div>
            </div>

            <Link
              href="/marketplace"
              className={cx(
                'hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
              )}
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tease.map((t) => (
              <ListingCardTease key={`${t.place}-${t.title}`} item={t} />
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--ink-2)]">Curated €2M+ listings. Global coverage. Zero portal feel.</div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/search"
                className={cx(
                  'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                  'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                )}
              >
                Search
              </Link>

              <Link
                href="/marketplace"
                className={cx(
                  'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                  'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                )}
              >
                Browse marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
