// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';
import RoyalPortalBackdrop from './RoyalPortalBackdrop';
import HeroGoldCrown from './HeroGoldCrown';
import PremiumBadgeRow from './PremiumBadgeRow';

import IntentHero from './IntentHero';
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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
   Royal layout primitives (white editorial, full-bleed hero)
   ========================================================= */

const HERO_INNER = 'mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const WIDE = 'mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const MID = 'mx-auto w-full max-w-[1400px] px-5 sm:px-8';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';

// Blur token normalisation - hero should feel sharpest, lower panels slightly calmer
const BLUR_HERO = 'backdrop-blur-[14px]';
const BLUR_CARD = 'backdrop-blur-[12px]';

const CARD =
  'bg-[color:var(--surface-2)] ' +
  BLUR_CARD +
  ' ' +
  RING +
  ' shadow-[0_30px_90px_rgba(11,12,16,0.10)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* Global paper stage (very restrained) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-72 left-1/2 h-[820px] w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.18),transparent_66%)] blur-3xl" />
        <div className="absolute -top-72 right-[-420px] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_66%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
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

function GoldWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#f7e7bf_0%,#e6c980_42%,#b7863a_100%)]">
      {children}
    </span>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
  right,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
          {kicker}
        </div>
        <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[26px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 max-w-[90ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>
    </div>
  );
}

type SignalStripItem = { k: string; v: React.ReactNode; hint?: string };

function SignalStrip({ items }: { items: SignalStripItem[] }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[22px]', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(980px_280px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_280px_at_84%_10%,rgba(139,92,246,0.06),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3',
              'bg-white/85',
              'ring-1 ring-inset ring-[color:var(--hairline)]',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_20%_0%,rgba(231,201,130,0.16),transparent_60%)]" />
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
                <div className="ml-2 hidden shrink-0 rounded-full bg-white/92 px-2 py-1 text-[10px] tracking-[0.18em] text-[color:var(--ink-3)] ring-1 ring-inset ring-[color:var(--hairline)] sm:block">
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
    <div className={cx('relative overflow-hidden rounded-[22px] p-5', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(560px_180px_at_18%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[13px] font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>
      </div>
    </div>
  );
}

function PortalVsTruth() {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px] p-5 sm:p-6', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(980px_300px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_300px_at_86%_10%,rgba(139,92,246,0.06),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] bg-white/88 p-6 ring-1 ring-inset ring-[color:var(--hairline)]">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
            Luxury portals
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
            Beautiful inventory
          </div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Great for browsing, but vulnerable to persuasion, missing facts and theatre.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/20" />
              Asking price leads the story
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/20" />
              Verification happens elsewhere
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/20" />
              Risk hides late in the process
            </li>
          </ul>
        </div>

        <div className="rounded-[22px] bg-[color:var(--paper-2)] p-6 ring-1 ring-inset ring-[color:var(--hairline)]">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
            Vantera
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
            Quiet intelligence
          </div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Built for signal: value, liquidity and risk, with verification-first outputs.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)]" />
              Fair value model, not theatre
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)]" />
              Paperwork surfaced early
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)]" />
              Resale-killer risk flags
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

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
    <div className={cx('relative overflow-hidden rounded-[28px] p-6', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
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
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.95)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CTA() {
  return (
    <div className={cx('relative overflow-hidden rounded-[30px] p-6 sm:p-10', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_86%_10%,rgba(139,92,246,0.06),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
            Private access
          </div>
          <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[30px]">
            Bring a serious asset or a serious buyer
          </div>
          <div className="mt-2 max-w-[74ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            Vantera is built for private sellers, advisors and agents who want verification, clarity and speed.
            <span className="text-[color:var(--ink-3)]"> Signal only.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/coming-soon?flow=sell"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
              'bg-white hover:bg-white',
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
              'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
              'bg-white/62 hover:bg-white/78',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.18)]',
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
   HOME PAGE (flagship rebuild)
   - FULL-BLEED hero (100vw)
   - Search-first
   - Intent moves BELOW hero
   ========================================================= */

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* FULL-BLEED HERO */}
      <section className="relative w-full overflow-hidden pt-10 sm:pt-12">
        {/* HERO MEDIA (image background) */}
        <div className="pointer-events-none absolute inset-0 -z-[1]">
          <Image
            src="/hero.jpg"
            alt="Vantera hero skyline at night"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Editorial wash for readability (tuned) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(251,251,250,0.92),rgba(251,251,250,0.86),rgba(251,251,250,0.74))]" />
        </div>

        {/* Hero background accents (subtle) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1400px_620px_at_30%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_560px_at_86%_0%,rgba(139,92,246,0.06),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.08)] to-transparent" />
        </div>

        {/* Optional FX (kept subtle, on white) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
          <RoyalPortalBackdrop />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <HeroGoldCrown />
        </div>

        <div className={HERO_INNER}>
          {/* Hero vertical rhythm: slightly more breathing room on large screens */}
          <div className="relative pb-12 sm:pb-14 lg:pb-[8vh]">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* LEFT: Editorial message + search */}
              <div className="lg:col-span-7">
                <PremiumBadgeRow />

                <h1 className="mt-7 text-balance text-[44px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-6xl lg:text-[78px] lg:leading-[1.01] 2xl:text-[86px]">
                  Private intelligence for the world&apos;s{' '}
                  <span className="inline">
                    <GoldWord>most valuable assets</GoldWord>
                  </span>
                </h1>

                <p className="mt-4 max-w-[84ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise.
                  <span className="text-[color:var(--ink-3)]">
                    {' '}
                    Built to model value, liquidity and risk without theatre.
                  </span>
                </p>

                {/* Primary search (hero crown jewel) */}
                <div className="mt-7 max-w-[1240px]">
                  <VanteraOmniSearch
                    cities={cities as any}
                    clusters={REGION_CLUSTERS as any}
                    autoFocus={false}
                  />
                </div>

                {/* Hero support row (clean, not competing) */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--ink-3)]">
                  <span className={cx('rounded-full bg-white/84 px-3 py-1.5', BLUR_HERO, RING)}>
                    Typos ok
                  </span>
                  <span className={cx('rounded-full bg-white/84 px-3 py-1.5', BLUR_HERO, RING)}>
                    Keywords included
                  </span>
                  <span className={cx('rounded-full bg-white/84 px-3 py-1.5', BLUR_HERO, RING)}>
                    City-first intelligence
                  </span>
                  <span className={cx('rounded-full bg-white/84 px-3 py-1.5', BLUR_HERO, RING)}>
                    Verification-first
                  </span>
                </div>

                <div className="mt-6 max-w-[1240px]">
                  <SignalStrip
                    items={[
                      { k: 'COVERAGE', v: <span>{cities.length} cities</span> },
                      { k: 'REGIONS', v: <span>{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span>{timezoneCount}</span> },
                      { k: 'UPDATES', v: <span>Weekly</span>, hint: 'Index refresh cadence' },
                      { k: 'PROOF', v: <span>Registry + docs</span> },
                    ]}
                  />
                </div>

                <div className="mt-6 grid max-w-[1240px] gap-3 sm:grid-cols-3">
                  <Pillar title="Paperwork" body="See what is missing before you waste time." />
                  <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                  <Pillar title="Risk radar" body="Catch resale killers early." />
                </div>
              </div>

              {/* RIGHT: Featured markets plate */}
              <div className="lg:col-span-5">
                <div className={cx('relative overflow-hidden rounded-[28px] p-6 sm:p-7', CARD)}>
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(980px_300px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(980px_300px_at_86%_10%,rgba(139,92,246,0.06),transparent_62%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)] uppercase">
                          Featured markets
                        </div>
                        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                          Private intelligence, city-first
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">
                          Tap a market to open its intelligence - pricing reality, liquidity read and risk flags.
                        </div>
                      </div>

                      <div className={cx('hidden sm:flex shrink-0 items-center gap-2 rounded-full bg-white/92 px-3 py-1.5', BLUR_HERO, RING)}>
                        <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
                        <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
                          UPDATED WEEKLY
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                    </div>

                    <div className="mt-5 rounded-[20px] bg-white/92 p-4 ring-1 ring-inset ring-[color:var(--hairline)]">
                      <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
                        House rule
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                        Signal beats story. If it cannot be verified, it cannot lead.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[26px] bg-white/84 p-6 ring-1 ring-inset ring-[color:var(--hairline)] shadow-[0_22px_70px_rgba(11,12,16,0.10)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
                      Proof stack
                    </div>
                    <div className="text-[11px] text-[color:var(--ink-3)]">Preview</div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div className="rounded-2xl bg-white/92 p-4 ring-1 ring-inset ring-[color:var(--hairline)]">
                      <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                        SOURCE
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                        Logged, cross-checked, traceable.
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/92 p-4 ring-1 ring-inset ring-[color:var(--hairline)]">
                      <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                        SIGNAL
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                        Price reality, liquidity read, risk flags.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-[color:var(--ink-3)]">
                    Portals show inventory. Vantera shows what matters before you fly in.
                  </div>
                </div>
              </div>
            </div>

            {/* Why section inside hero, but calm and readable */}
            <div className="mt-10">
              <SectionHeader
                kicker="Why this exists"
                title="Above the portal layer"
                subtitle="A discipline: verification-first, signal-first, engineered for high-value decisions."
              />
              <PortalVsTruth />
            </div>
          </div>
        </div>

        {/* Trust tape - clean, centered */}
        <div className={cx('mt-10 sm:mt-12', MID)}>
          <TrustMarquee
            className="!mt-0"
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
      </section>

      {/* INTENT (moved BELOW hero - search stays crown jewel) */}
      <section className="mt-12 sm:mt-14">
        <div className={MID}>
          <SectionHeader
            kicker="Discovery"
            title="One box that does magic"
            subtitle="Start broad, then refine. Cities, lifestyle and keywords - without brittle searching."
          />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      {/* BODY */}
      <section className="mt-12 sm:mt-14">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionHeader
            kicker="Featured intelligence"
            title="Believable, not fake listings"
            subtitle="A product layer built for decisions, not screenshots."
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/84 px-3 py-1.5 ring-1 ring-inset ring-[color:var(--hairline)]">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">PROOF FIRST</div>
              </div>
            }
          />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      <section className="mt-14 sm:mt-18">
        <div className={NARROW}>
          <SectionHeader
            kicker="Why Vantera wins"
            title="Plain language, high precision"
            subtitle="The same standards clients expect from institutions, applied to real estate intelligence."
          />

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
              body="Luxury buyers deserve certainty. Vantera highlights what is missing, what is inconsistent and what must be verified next."
              bullets={['Turns paperwork into plain language', 'Surfaces missing documents fast', 'Flags resale killers early']}
            />
            <FeatureCard
              eyebrow="Liquidity"
              title="A private read on demand"
              body="Vantera watches the market behaviour that matters: what sells, what stalls and what the next buyer will pay for."
              bullets={['Demand signals over hype', 'Comparables that match reality', 'Designed for advisors and sellers']}
            />
          </div>
        </div>
      </section>

      <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-18">
        <div className={WIDE}>
          <SectionHeader
            kicker="Explore the index"
            title="Coverage that feels alive"
            subtitle="Fast scan for where value is forming, where risk is hiding and where liquidity is strongest."
            right={
              <div className="hidden sm:block">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white/90 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            }
          />

          <div className={cx('relative overflow-hidden rounded-[32px] p-5 sm:p-7', CARD)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.06),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
            </div>

            <div className="relative mt-1">
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
