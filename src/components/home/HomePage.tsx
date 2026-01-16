// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';
import PremiumBadgeRow from './PremiumBadgeRow';

import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

import { REGION_CLUSTERS } from './cities';

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
   Royal layout primitives (wide, editorial, institutional)
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const GLASS =
  'bg-white/70 backdrop-blur-[18px] ring-1 ring-inset ring-[color:var(--hairline)] shadow-[0_34px_100px_rgba(11,12,16,0.12)]';
const GLASS_SOFT =
  'bg-white/60 backdrop-blur-[18px] ring-1 ring-inset ring-[color:var(--hairline)] shadow-[0_26px_80px_rgba(11,12,16,0.10)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* ROYAL STAGE - global cinematic paper system */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Crown light (warm) */}
        <div className="absolute -top-64 left-1/2 h-[920px] w-[1500px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.30),transparent_62%)] blur-3xl" />
        {/* Violet edge (right) */}
        <div className="absolute -top-56 right-[-320px] h-[780px] w-[780px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_64%)] blur-3xl" />
        {/* Cool lift (left-bottom) */}
        <div className="absolute bottom-[-420px] left-[-420px] h-[980px] w-[980px] bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_62%)] blur-3xl" />

        {/* Editorial wash and vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(251,251,250,0.0),rgba(11,12,16,0.035))]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(255,255,255,0.70),transparent_62%)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(1400px_900px_at_50%_60%,rgba(11,12,16,0.10),transparent_70%)] opacity-30" />

        {/* Micro grain */}
        <div className="absolute inset-0 opacity-[0.040] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
        {/* Subtle grid (very faint, feels engineered) */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(11,12,16,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,12,16,0.18)_1px,transparent_1px)] [background-size:120px_120px]" />
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
   Micro components (premium labels, plates, cards)
   IMPORTANT: no rounded corners anywhere
   ========================================================= */

function SectionKicker({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-sm text-[color:var(--ink-2)]">{subtitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
      </div>
    </div>
  );
}

function GoldWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7BF] via-[#E6C980] to-[#B7863A]">
      {children}
    </span>
  );
}

type SignalStripItem = {
  k: string;
  v: React.ReactNode;
  hint?: string;
};

function SignalStrip({ items }: { items: SignalStripItem[] }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'bg-white/65 backdrop-blur-[18px]',
        'shadow-[0_28px_90px_rgba(11,12,16,0.12)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.22),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden',
              'ring-1 ring-inset ring-[color:var(--hairline)]',
              'bg-white/72',
              'px-3 py-2.5 sm:px-3.5 sm:py-3',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_20%_0%,rgba(231,201,130,0.22),transparent_60%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                  {it.k}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-[color:var(--ink)]">
                  {it.v}
                </div>
              </div>

              {it.hint ? (
                <div className="ml-2 hidden shrink-0 ring-1 ring-inset ring-[color:var(--hairline)] bg-white/70 px-2 py-1 text-[10px] tracking-[0.18em] text-[color:var(--ink-3)] sm:block">
                  INFO
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden p-5',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'bg-white/66 backdrop-blur-[18px]',
        'shadow-[0_20px_55px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.16),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[13px] font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>
      </div>
    </div>
  );
}

function IntelligencePlate({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx('relative overflow-hidden', GLASS)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_360px_at_20%_0%,rgba(231,201,130,0.20),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_85%_10%,rgba(139,92,246,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- Portal vs Truth ---------- */

function PortalVsTruth() {
  return (
    <div className={cx('relative overflow-hidden p-5 sm:p-6', GLASS_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-white/72 p-6">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            LUXURY PORTALS
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
            Beautiful inventory
          </div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Great for browsing, but vulnerable to persuasion, missing facts, and theatre.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(11,12,16,0.35)]" />
              Asking price leads the story
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(11,12,16,0.35)]" />
              Verification happens elsewhere
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(11,12,16,0.35)]" />
              Risk hides late in the process
            </li>
          </ul>
        </div>

        <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-[color:var(--paper-2)] p-6">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            VANTERA
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
            Quiet intelligence
          </div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Built for signal: value, liquidity, and risk, with verification-first outputs.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(231,201,130,0.95)]" />
              Fair value model, not theatre
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(231,201,130,0.95)]" />
              Paperwork surfaced early
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(231,201,130,0.95)]" />
              Resale-killer risk flags
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Feature card ---------- */

function FeatureCard({
  eyebrow,
  title,
  body,
  bullets,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div className={cx('relative overflow-hidden p-6', GLASS_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(720px_240px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
          {eyebrow}
        </div>

        <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
          {title}
        </div>

        <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>

        <ul className="mt-5 space-y-2 text-sm text-[color:var(--ink-2)]">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 bg-[rgba(231,201,130,0.95)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- CTA ---------- */

function CTA() {
  return (
    <div className={cx('relative overflow-hidden p-6 sm:p-10', GLASS)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(231,201,130,0.22),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_86%_10%,rgba(139,92,246,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
            PRIVATE ACCESS
          </div>

          <div className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[30px]">
            Bring a serious asset or a serious buyer
          </div>

          <div className="mt-2 max-w-[70ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            Vantera is built for private sellers, advisors, and agents who want verification, clarity, and speed.
            <span className="text-[color:var(--ink-3)]"> Signal only.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/coming-soon?flow=sell"
            className={cx(
              'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
              'bg-white/78 hover:bg-white',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.20)]',
              'text-[color:var(--ink)]',
              'shadow-[0_18px_50px_rgba(11,12,16,0.10)]',
            )}
          >
            Submit a private seller
          </a>

          <a
            href="/coming-soon?flow=agents"
            className={cx(
              'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
              'bg-[color:var(--paper-2)] hover:bg-white',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.20)]',
              'text-[color:var(--ink)]',
            )}
          >
            Agent access
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME PAGE
   ========================================================= */

export default function HomePage({
  cities,
  clusters,
}: {
  cities: RuntimeCity[];
  clusters?: RuntimeRegionCluster[];
}) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  const resolvedClusters = (clusters ?? (REGION_CLUSTERS as any)) as any;

  return (
    <Shell>
      {/* =====================================================
          HERO - ONLY the hero content has the background image
          Fix: moved "Why this exists" OUTSIDE this section
         ===================================================== */}
      <section className="relative w-full pb-12 pt-10 sm:pb-16 sm:pt-12">
        {/* Full-bleed hero image (edge-to-edge) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/brand/hero.jpg"
            alt="Vantera hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* premium light overlay for readability (no heavy dark) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.62),rgba(255,255,255,0.86))]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_86%_10%,rgba(139,92,246,0.10),transparent_64%)]" />
          {/* top/bottom hairlines to feel editorial */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
        </div>

        <div className={cx('relative', WIDE)}>
          <div className="relative ring-1 ring-inset ring-[color:var(--hairline)] bg-white/40 shadow-[0_60px_160px_rgba(11,12,16,0.14)]">
            {/* inner wash (kept light) */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_25%_0%,rgba(231,201,130,0.16),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_0%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
            </div>

            <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-18 2xl:px-20 2xl:py-20">
              {/* Collapse earlier: side-by-side only from xl */}
              <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
                {/* LEFT: Narrative + Omni search */}
                <div className="xl:col-span-6">
                  <PremiumBadgeRow />

                  {/* H1 smaller (editorial) */}
                  <h1 className="mt-7 text-balance text-[34px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[44px] lg:text-[56px] lg:leading-[1.05] 2xl:text-[64px]">
                    Private intelligence for the world&apos;s{' '}
                    <span className="inline">
                      <GoldWord>most valuable assets</GoldWord>
                    </span>
                  </h1>

                  <p className="mt-4 max-w-[78ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                    Vantera is a quiet intelligence surface for buyers, sellers, and advisors who value signal over noise.
                    <span className="text-[color:var(--ink-3)]">
                      {' '}
                      Built to model value, liquidity, and risk without theatre.
                    </span>
                  </p>

                  {/* OmniSearch (only hero search) */}
                  <div className="mt-7 max-w-[1200px]">
                    <VanteraOmniSearch cities={cities as any} clusters={resolvedClusters} autoFocus={false} />
                  </div>

                  <div className="mt-6 max-w-[1200px]">
                    <SignalStrip
                      items={[
                        { k: 'COVERAGE', v: <span>{cities.length} cities</span> },
                        { k: 'REGIONS', v: <span>{regionCount}</span> },
                        { k: 'TIMEZONES', v: <span>{timezoneCount}</span> },
                        { k: 'UPDATES', v: <span>Live</span>, hint: 'Private index' },
                        { k: 'PROOF', v: <span>Registry + docs</span> },
                      ]}
                    />
                  </div>

                  <div className="mt-6 grid max-w-[1200px] gap-3 sm:grid-cols-3">
                    <Pillar title="Paperwork" body="See what is missing before you waste time." />
                    <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                    <Pillar title="Risk radar" body="Catch resale killers early." />
                  </div>

                  <div className="mt-10 hidden xl:block h-px w-full bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
                </div>

                {/* RIGHT: Intelligence plate (wider / more feature) */}
                <div className="xl:col-span-6">
                  <IntelligencePlate>
                    <div className="px-6 py-6 sm:px-7 sm:py-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)] uppercase">
                            Featured markets
                          </div>
                          <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                            Private intelligence, city-first
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">
                            Tap a market to open its intelligence - pricing reality, liquidity read, and risk flags.
                          </div>
                        </div>

                        <div className="hidden sm:flex shrink-0 items-center gap-2 bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] px-3 py-1.5">
                          <div className="h-2 w-2 bg-emerald-500/70" />
                          <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
                            UPDATED WEEKLY
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                      </div>

                      <div className="mt-5 bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] px-5 py-4">
                        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
                          House rule
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                          Signal beats story. If it cannot be verified, it cannot lead.
                        </div>
                      </div>
                    </div>
                  </IntelligencePlate>
                </div>
              </div>
            </div>

            {/* Bottom fade (kept light) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[rgba(251,251,250,0.92)]" />
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS - now on clean paper (no hero image behind it) */}
      <section className="mt-10 sm:mt-12">
        <div className={WIDE}>
          <div className={cx('relative overflow-hidden p-6 sm:p-8', GLASS)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
            </div>

            <div className="relative">
              <SectionKicker title="Why this exists" subtitle="This is why we sit above luxury portals" />
              <PortalVsTruth />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST - keep but make it feel like an institutional tape */}
      <div className={cx('relative mt-10 sm:mt-12', NARROW)}>
        <TrustMarquee
          className=""
          brands={[
            { name: "Sotheby's International Realty", domain: 'sothebysrealty.com' },
            { name: "Christie's International Real Estate", domain: 'christiesrealestate.com' },
            { name: 'Knight Frank', domain: 'knightfrank.com' },
            { name: 'Savills', domain: 'savills.com' },
            { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
            { name: 'BARNES', domain: 'barnes-international.com' },
            { name: 'Coldwell Banker', domain: 'coldwellbanker.com' },
            { name: 'Douglas Elliman', domain: 'elliman.com', invert: false },
            { name: 'Compass', domain: 'compass.com', invert: false },
            { name: 'CBRE', domain: 'cbre.com', invert: false },
            { name: 'JLL', domain: 'jll.com', invert: false },
            { name: 'RE/MAX', domain: 'remax.com' },
            { name: 'BHHS', domain: 'bhhs.com' },
            { name: 'Corcoran', domain: 'corcoran.com', invert: false },
            { name: 'Century 21', domain: 'century21.com', invert: false },
          ]}
        />
      </div>

      {/* =====================================================
          BODY - leave untouched
         ===================================================== */}

      <section className="mt-12 sm:mt-14">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionKicker
            title="Featured intelligence"
            subtitle="Believable, not fake listings"
            right={
              <div className="hidden sm:flex items-center gap-2 bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">PROOF FIRST</div>
              </div>
            }
          />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      <section className="mt-14 sm:mt-18">
        <div className={NARROW}>
          <SectionKicker title="Why Vantera wins" subtitle="Plain language, high precision" />
          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureCard
              eyebrow="Truth-first"
              title="Pricing without illusions"
              body="Asking price is a starting point. Vantera models fair value from market signals and penalises fantasy listings."
              bullets={['Tracks velocity and reductions', 'Separates value from persuasion', 'Protects buyers from regret']}
            />
            <FeatureCard
              eyebrow="Verification"
              title="Permits, ownership, and risk flags"
              body="Luxury buyers deserve certainty. Vantera highlights what is missing, what is inconsistent, and what must be verified next."
              bullets={['Turns paperwork into plain language', 'Surfaces missing documents fast', 'Flags resale killers early']}
            />
            <FeatureCard
              eyebrow="Liquidity"
              title="A private read on demand"
              body="Vantera watches the market behaviour that matters: what sells, what stalls, and what the next buyer will pay for."
              bullets={['Demand signals over hype', 'Comparables that match reality', 'Designed for advisors and sellers']}
            />
          </div>
        </div>
      </section>

      <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-18">
        <div className={WIDE}>
          <SectionKicker
            title="Explore the index"
            subtitle="Coverage that feels alive"
            right={
              <div className="hidden sm:block">
                <div className="relative h-11 w-11 overflow-hidden ring-1 ring-inset ring-[color:var(--hairline)] bg-white/80">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            }
          />

          <div className={cx('relative overflow-hidden p-5 sm:p-7', GLASS)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.20),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.12),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
                  Cities
                </div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                  Browse coverage with signal
                </div>
                <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                  Fast scan for where value is forming, where risk is hiding, and where liquidity is strongest.
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">ENTRY POINTS</div>
              </div>
            </div>

            <div className="relative mt-6">
              <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 sm:mt-18 pb-16 sm:pb-20">
        <div className={NARROW}>
          <CTA />
        </div>
      </section>
    </Shell>
  );
}
