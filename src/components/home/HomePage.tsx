// src/components/home/HomePage.tsx
import Image from 'next/image';
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

function Kicker({
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
        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
          {eyebrow}
        </div>
        <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-2 max-w-[75ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

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

type ListingTease = {
  title: string;
  place: string;
  price: string;
  imageSrc?: string;
  imageAlt?: string;
};

function ListingCardTease({ item }: { item: ListingTease }) {
  return (
    <a
      href="/marketplace"
      className={cx(
        'group block overflow-hidden border border-[color:var(--hairline)] bg-white',
        'transition',
        'hover:border-[rgba(10,10,12,0.22)]',
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
        <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
          {item.place}
        </div>
        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
          {item.title}
        </div>
        <div className="mt-2 text-sm text-[color:var(--ink-2)]">{item.price}</div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            VIEW
          </div>
          <div className="h-px w-10 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-14 group-hover:bg-[rgba(10,10,12,0.30)]" />
        </div>
      </div>
    </a>
  );
}

/* =========================================================
   HERO (full-bleed, sexy marketplace statement)
   ========================================================= */

function FullBleedHero() {
  return (
    <section
      className={cx(
        'relative overflow-hidden',
        'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]',
      )}
    >
      <div className="relative">
        {/* Top hairline */}
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-[color:var(--hairline)]" />

        {/* Visual stage */}
        <div className="relative h-[78vh] min-h-[620px] w-full bg-[color:var(--paper-2)]">
          {/* Background image (replace /brand/hero.jpg with your best global hero) */}
          <Image
            src="/brand/hero.jpg"
            alt="Vantera - World’s Largest Luxury Marketplace"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* White editorial wash (keeps it premium, not dark) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.90),rgba(255,255,255,0.55),rgba(255,255,255,0.25))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.42),rgba(255,255,255,0.28),rgba(255,255,255,0.88))]" />

          {/* Copy */}
          <div className={cx('relative z-10 h-full', WIDE)}>
            <div className="flex h-full items-end pb-10 sm:pb-14 lg:pb-16">
              <div className="max-w-[980px]">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <Chip>€2M+ ONLY</Chip>
                  <Chip>GLOBAL CURATION</Chip>
                  <Chip>EDITORIAL PRESENTATION</Chip>
                </div>

                <h1 className="text-balance text-[42px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[56px] lg:text-[72px] lg:leading-[0.98]">
                  World’s Largest Luxury Marketplace
                </h1>

                <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  A single destination for €2M+ properties, presented like a catalogue - not a portal.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/marketplace"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
                      'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white',
                      'hover:bg-[rgba(10,10,12,1.0)] transition',
                    )}
                  >
                    Enter marketplace
                  </a>

                  <a
                    href="/listings"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
                      'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)]',
                      'hover:border-[rgba(10,10,12,0.22)] transition',
                    )}
                  >
                    View listings
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom hairline */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-[color:var(--hairline)]" />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE (marketplace-first, zero intelligence talk)
   ========================================================= */

export default function HomePage({
  cities,
  clusters,
}: {
  cities: RuntimeCity[];
  clusters?: RuntimeRegionCluster[];
}) {
  // Note: clusters intentionally unused for this phase (marketplace visuals first)
  void clusters;

  // Use city hero images if available (so the page instantly looks real).
  const cityImages = cities
    .map((c) => ({
      src: c.heroImageSrc ?? c.image?.src ?? '',
      alt: c.heroImageAlt ?? c.image?.alt ?? c.name,
      place: `${c.name}, ${c.country}`,
    }))
    .filter((x) => Boolean(x.src))
    .slice(0, 3);

  const tease: ListingTease[] = [
    {
      place: cityImages[0]?.place ?? 'Cap Ferrat, France',
      title: 'Waterfront Villa',
      price: 'From €18,500,000',
      imageSrc: cityImages[0]?.src,
      imageAlt: cityImages[0]?.alt,
    },
    {
      place: cityImages[1]?.place ?? 'Marbella, Spain',
      title: 'Modern Estate',
      price: 'From €7,900,000',
      imageSrc: cityImages[1]?.src,
      imageAlt: cityImages[1]?.alt,
    },
    {
      place: cityImages[2]?.place ?? 'Dubai, UAE',
      title: 'Penthouse Residence',
      price: 'From €12,200,000',
      imageSrc: cityImages[2]?.src,
      imageAlt: cityImages[2]?.alt,
    },
  ];

  return (
    <Shell>
      <FullBleedHero />

      {/* Editorial intro */}
      <section className="py-12 sm:py-16">
        <div className={NARROW}>
          <Kicker
            eyebrow="VANTERA"
            title="Luxury, stripped of noise"
            subtitle="No clutter, no duplicated feeds, no portal look. Just the best €2M+ properties, presented with restraint and taste."
            right={
              <div className="hidden sm:flex items-center gap-3">
                <a
                  href="/marketplace"
                  className={cx(
                    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold',
                    'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)]',
                    'hover:border-[rgba(10,10,12,0.22)] transition',
                  )}
                >
                  Explore
                </a>
              </div>
            }
          />

          <div className="mt-8">
            <Hairline />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                THRESHOLD
              </div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                €2M+ only
              </div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                The line is enforced. This is a luxury marketplace, not a mixed portal.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                CURATION
              </div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                Fewer, better
              </div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                We prioritise presentation, photography, and clarity - the opposite of volume.
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                EDITORIAL
              </div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                Catalogue grade
              </div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Layouts designed to sell desire - not checkboxes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured (teaser) - designed to feel like a printed catalogue */}
      <section className="pb-16 sm:pb-20">
        <div className={WIDE}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                FEATURED
              </div>
              <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
                A taste of the marketplace
              </div>
            </div>

            <a
              href="/marketplace"
              className={cx(
                'hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold',
                'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)]',
                'hover:border-[rgba(10,10,12,0.22)] transition',
              )}
            >
              View all
            </a>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {tease.map((t) => (
              <ListingCardTease key={`${t.place}-${t.title}`} item={t} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="text-sm text-[color:var(--ink-2)]">
              Curated €2M+ listings. Global coverage. Zero portal feel.
            </div>

            <a
              href="/marketplace"
              className={cx(
                'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
                'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white',
                'hover:bg-[rgba(10,10,12,1.0)] transition',
              )}
            >
              Enter marketplace
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
