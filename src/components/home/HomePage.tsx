// src/components/home/HomePage.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';

import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import VanteraSignatureBackdrop from './VanteraSignatureBackdrop';

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
        <div className="absolute inset-0 opacity-[0.028] [background-image:linear-gradient(to_right,rgba(10,10,12,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.18)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
        {/* faint gold paper warmth (royal, still white) */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_16%_8%,rgba(206,160,74,0.06),transparent_62%)]" />
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
    <div className="relative inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-2)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.85)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(180px_48px_at_50%_0%,rgba(206,160,74,0.08),transparent_70%)]" />
      {children}
    </div>
  );
}

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function GoldHairline({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'h-px w-full bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.85)] to-transparent',
        className,
      )}
    />
  );
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
        'group relative flex items-center justify-between gap-4 px-4 py-3',
        'border border-[color:var(--hairline)] bg-white',
        'transition hover:border-[rgba(10,10,12,0.22)]',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.35)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

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
    <div className="group relative border border-[color:var(--hairline)] bg-white p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.45)] to-transparent opacity-60" />
      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{eyebrow}</div>
      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(520px_180px_at_20%_0%,rgba(206,160,74,0.06),transparent_65%)]" />
    </div>
  );
}

// src/components/home/HomePage.tsx
// (inside the same file, add these two helpers near your micro components)

function DnaSeal() {
  return (
    <div className="relative inline-flex items-center gap-3 border border-[color:var(--hairline)] bg-white px-4 py-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.85)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(220px_90px_at_20%_0%,rgba(206,160,74,0.10),transparent_70%)]" />

      <div className="grid h-9 w-9 place-items-center border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.02)]">
        <div className="h-3 w-3 rotate-45 border border-[rgba(206,160,74,0.75)] bg-[rgba(206,160,74,0.08)]" />
      </div>

      <div className="min-w-0">
        <div className="text-[10px] font-semibold tracking-[0.32em] text-[color:var(--ink-3)]">VANTERA DNA</div>
        <div className="mt-0.5 text-[13px] font-semibold text-[color:var(--ink)]">Truth-first marketplace</div>
      </div>
    </div>
  );
}

function TruthLayerMeter() {
  return (
    <div className="relative border border-[color:var(--hairline)] bg-white px-4 py-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.65)] to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.32em] text-[color:var(--ink-3)]">TRUTH LAYER</div>
          <div className="mt-0.5 text-[13px] font-semibold text-[color:var(--ink)]">Verification over theatre</div>
        </div>
        <div className="shrink-0 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">SIGNAL</div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden border border-[rgba(10,10,12,0.16)] bg-[rgba(10,10,12,0.03)]">
        <div className="h-full w-[74%] bg-[linear-gradient(90deg,rgba(10,10,12,0.90),rgba(206,160,74,0.55))]" />
      </div>

      <div className="mt-2 text-[11px] text-[color:var(--ink-3)]">
        Built to attribute what is verified, inferred and unknown.
      </div>
    </div>
  );
}

/* =========================================================
   Buttons (royal editorial)
   ========================================================= */

const BTN_PRIMARY = cx(
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white',
  'hover:bg-[rgba(10,10,12,1.0)]',
  'shadow-[0_18px_60px_rgba(10,10,12,0.12)] hover:shadow-[0_22px_80px_rgba(206,160,74,0.16)]',
);

const BTN_SECONDARY = cx(
  'relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
  'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)]',
  'hover:border-[rgba(10,10,12,0.22)]',
);

const BTN_PRIMARY_SM = cx(
  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
  'border border-[rgba(10,10,12,0.20)] bg-[rgba(10,10,12,0.94)] text-white hover:bg-[rgba(10,10,12,1.0)]',
  'shadow-[0_16px_52px_rgba(10,10,12,0.10)] hover:shadow-[0_20px_70px_rgba(206,160,74,0.14)]',
);

const BTN_SECONDARY_SM = cx(
  'relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
  'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
);

/* =========================================================
   HERO (full-bleed, marketplace statement + search atelier)
   Signature Vantera (no stock city photo)
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

        <div className="relative min-h-[820px] w-full bg-[color:var(--paper-2)]">
          {/* NEW: Signature Vantera backdrop (ownable, not a generic city photo) */}
          <VanteraSignatureBackdrop />

          <div className={cx('relative z-10', WIDE)}>
            <div className="grid gap-10 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">
              {/* Left: statement */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>GLOBAL CATALOGUE</Chip>
                  <Chip>TRUTH LAYER</Chip>
                  <Chip>EDITORIAL</Chip>
                </div>

                <h1 className="mt-7 text-balance text-[44px] font-semibold tracking-[-0.055em] text-[color:var(--ink)] sm:text-[56px] lg:text-[72px] lg:leading-[0.98]">
                  A global catalogue of exceptional homes, powered by intelligence
                </h1>

                <div className="mt-5 h-px w-24 bg-gradient-to-r from-[rgba(206,160,74,0.95)] to-transparent" />

                <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  Built city by city. Under the surface is a Truth Layer that verifies, scores and explains the market so you can
                  move with clarity - not noise.
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

              {/* Right: Search atelier */}
              <div className="lg:col-span-5">
                <div
                  className={cx(
                    'relative overflow-hidden',
                    'border border-[color:var(--hairline)] bg-white/92 backdrop-blur-[14px]',
                    'shadow-[0_34px_120px_rgba(10,10,12,0.12)]',
                  )}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0">
                      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.95)] to-transparent" />
                      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent" />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_22%_0%,rgba(206,160,74,0.10),transparent_62%)]" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
                  </div>

                  <div className="relative p-5 sm:p-6">
                    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">SEARCH ATELIER</div>
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
                          className={cx(
                            'w-full bg-transparent px-4 pb-3 pt-2 text-[15px] text-[color:var(--ink)] outline-none',
                          )}
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

            {/* Vantera DNA */}
            // src/components/home/HomePage.tsx
// (inside FullBleedHero, replace the entire {/* Vantera DNA */} section with this)

{/* Vantera DNA - hero-level band */}
<div className="pb-12 sm:pb-14">
  <div className="relative overflow-hidden border border-[rgba(10,10,12,0.14)] bg-white/92 backdrop-blur-[10px] shadow-[0_50px_170px_rgba(10,10,12,0.14)]">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.90)] to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_30%_0%,rgba(206,160,74,0.10),transparent_62%)]" />
      <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.08)]" />
    </div>

    {/* Top row: manifesto */}
    <div className="relative px-6 py-6 sm:px-8 sm:py-7 border-b border-[color:var(--hairline)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">VANTERA DNA</div>
          <div className="mt-2 text-balance text-[24px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[30px]">
            Intelligence is the product, the marketplace is the interface
          </div>
          <div className="mt-2 max-w-[92ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            Every listing is treated as an asset record with attribution. Calm presentation on top, structured truth underneath.
          </div>

          <div className="mt-5 h-px w-24 bg-gradient-to-r from-[rgba(206,160,74,0.90)] to-transparent" />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <DnaSeal />
          <TruthLayerMeter />
        </div>
      </div>
    </div>

    {/* Bottom row: pillars (bigger, more premium spacing) */}
    <div className="relative p-6 sm:p-8">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DnaPillar
          eyebrow="TRUTH LAYER"
          title="Verified versus assumed"
          body="Clear attribution of what is verified, inferred or unknown with structured checks to remove ambiguity."
        />
        <DnaPillar
          eyebrow="MARKET INTELLIGENCE"
          title="Markets, with clarity"
          body="Signals that explain pricing dynamics, liquidity and risk at a city level built progressively as coverage expands."
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

      <div className="mt-7">
        <Hairline />
        <div className="mt-1">
          <GoldHairline className="opacity-70" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[color:var(--ink-2)]">
          The marketplace is how you enter. The intelligence is why you stay.
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/coming-soon?section=intelligence" className={BTN_SECONDARY_SM}>
            Explore intelligence (soon)
          </Link>
          <Link href="/search" className={BTN_PRIMARY_SM}>
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
              <div className="mt-1">
                <GoldHairline className="opacity-60" />
              </div>
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
                <Link href="/search" className={BTN_SECONDARY_SM}>
                  Open search
                </Link>
                <Link href="/marketplace" className={BTN_PRIMARY_SM}>
                  Browse
                </Link>
              </div>
            }
          />

          <div className="mt-8">
            <Hairline />
            <div className="mt-1">
              <GoldHairline className="opacity-55" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="relative border border-[color:var(--hairline)] bg-white p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent" />
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">INTELLIGENCE</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Truth-first</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Verification, structured facts and clear attribution of what is known versus assumed.
              </div>
            </div>

            <div className="relative border border-[color:var(--hairline)] bg-white p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent" />
              <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">DISCOVERY</div>
              <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Fast search</div>
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Keywords first, destinations second, and results designed to feel editorial, not noisy.
              </div>
            </div>

            <div className="relative border border-[color:var(--hairline)] bg-white p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent" />
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
