// src/components/home/HomePage.tsx
import type { ReactNode } from 'react';

import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import DnaChapterBreak from './DnaChapterBreak';
import HeroPortalSection from './HeroPortalSection';

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

  // Optional: video hero support
  heroVideoSrc?: string | null;
  heroVideoPosterSrc?: string | null;
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
  const safeCities = Array.isArray(cities) ? cities : [];
  const safeClusters = Array.isArray(clusters) ? clusters : [];

  const EXCLUDE_HERO_SLUGS = new Set(['estepona', 'benahavis']);

  // Step 1: choose candidates by priority (same as before)
  const heroCandidates = safeCities
    .filter((c) => Boolean(c?.slug) && Boolean(c?.name) && Boolean(c?.country))
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .filter((c) => !EXCLUDE_HERO_SLUGS.has(String(c.slug).toLowerCase()));

  // Step 2: ensure every hero city has a REQUIRED heroImageSrc (string)
  // Video is optional and will override image inside HeroPortalSection if present.
  const heroCities = heroCandidates
    .map((c) => {
      const heroSrc = c.heroImageSrc ?? c.image?.src ?? null;
      if (!heroSrc) return null;

      return {
        ...c,
        heroImageSrc: heroSrc,
        heroImageAlt:
          (typeof c.heroImageAlt === 'string' && c.heroImageAlt) ||
          c.image?.alt ||
          c.name ||
          null,

        // pass-through optional video fields
        heroVideoSrc: c.heroVideoSrc ?? null,
        heroVideoPosterSrc: c.heroVideoPosterSrc ?? null,
      };
    })
    .filter(Boolean);

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
      <HeroPortalSection
        cities={heroCities}
        clusters={safeClusters}
        topCountries={
          topCountries.length
            ? topCountries
            : ['Spain', 'France', 'United Arab Emirates', 'United States', 'United Kingdom']
        }
        wideClassName={WIDE}
      />

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

          <CityCardsVirtualizedClient
            cities={cityCards}
            mode="featured"
            columns="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </section>

     <DnaChapterBreak />

      <section className="pb-16 sm:pb-20">
        <div className={NARROW}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">VANTERA</div>

              <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
                Search and browse, the way luxury should feel
              </div>

              <div className="mt-2 max-w-[78ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)]">
                No clutter, no duplicated feeds, and no portal theatre. Just a calm catalogue experience with
                intelligence underneath.
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <a
                href="/search"
                className={cx(
                  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                  'border border-[rgba(10,10,12,0.12)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                )}
              >
                Open search
              </a>
              <a
                href="/marketplace"
                className={cx(
                  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                )}
              >
                Browse
              </a>
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
              <div className="pointer-events-none absolute inset-x-0 top-0">
                <div className="h-[2px] bg-[linear-gradient(90deg,transparent,rgba(206,160,74,0.60),transparent)] opacity-70" />
              </div>
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
              <div className="pointer-events-none absolute inset-x-0 top-0">
                <div className="h-[2px] bg-[linear-gradient(90deg,transparent,rgba(206,160,74,0.60),transparent)] opacity-70" />
              </div>
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
              <div className="pointer-events-none absolute inset-x-0 top-0">
                <div className="h-[2px] bg-[linear-gradient(90deg,transparent,rgba(206,160,74,0.60),transparent)] opacity-70" />
              </div>
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
