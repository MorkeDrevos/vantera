// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';
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
   Editorial layout primitives (white, royal, engineered)
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

const HAIRLINE = 'ring-1 ring-inset ring-black/10';
const PAPER = 'bg-white text-zinc-950';
const PAPER_SOFT = 'bg-white/70';
const CARD =
  'bg-white/85 backdrop-blur-[6px] ring-1 ring-inset ring-black/10 shadow-[0_30px_90px_rgba(10,10,20,0.10)]';
const CARD_SOFT =
  'bg-white/75 backdrop-blur-[6px] ring-1 ring-inset ring-black/10 shadow-[0_22px_70px_rgba(10,10,20,0.08)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={cx('min-h-[100dvh]', PAPER)}>
      {/* Global white stage */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Clean paper wash */}
        <div className="absolute inset-0 bg-white" />

        {/* Crown light - warm, very subtle */}
        <div className="absolute -top-72 left-1/2 h-[980px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.22),transparent_62%)] blur-3xl" />

        {/* Violet edge - right */}
        <div className="absolute -top-60 right-[-360px] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_64%)] blur-3xl" />

        {/* Cool lift - bottom left */}
        <div className="absolute bottom-[-520px] left-[-520px] h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_62%)] blur-3xl" />

        {/* Gentle vignette (keeps white premium, not flat) */}
        <div className="absolute inset-0 bg-[radial-gradient(1400px_900px_at_50%_40%,rgba(0,0,0,0.00),rgba(0,0,0,0.06))]" />

        {/* Micro grain */}
        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,20,0.22)_1px,transparent_0)] [background-size:26px_26px]" />

        {/* Very faint engineered grid */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(10,10,20,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,20,0.14)_1px,transparent_1px)] [background-size:140px_140px]" />
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
        <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
          {title}
        </div>
        {subtitle ? <div className="mt-1 text-sm text-zinc-700">{subtitle}</div> : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-black/12 to-transparent" />
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
    <div className={cx('relative overflow-hidden rounded-[22px]', CARD_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3',
              HAIRLINE,
              'bg-white/80',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_20%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.26em] text-zinc-500">
                  {it.k}
                </div>
                <div className="mt-1 truncate text-sm font-semibold text-zinc-950">
                  {it.v}
                </div>
              </div>

              {it.hint ? (
                <div className="ml-2 hidden shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] tracking-[0.18em] text-zinc-500 ring-1 ring-inset ring-black/10 sm:block">
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
    <div className={cx('relative overflow-hidden rounded-[22px] p-5', CARD_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.14),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[13px] font-semibold text-zinc-950">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-zinc-700">{body}</div>
      </div>
    </div>
  );
}

function FeaturedRail({ cities }: { cities: RuntimeCity[] }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px]', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_86%_10%,rgba(139,92,246,0.10),transparent_64%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">
              Featured markets
            </div>
            <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-zinc-950">
              City-first intelligence
            </div>
            <div className="mt-1 text-sm leading-relaxed text-zinc-700">
              Open a city for pricing reality, liquidity read, and early risk flags.
            </div>
          </div>

          <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full bg-white/80 ring-1 ring-inset ring-black/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <div className="text-[11px] tracking-[0.22em] text-zinc-600">
              UPDATED WEEKLY
            </div>
          </div>
        </div>

        <div className="mt-5">
          <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
        </div>

        <div className="mt-5 rounded-[20px] bg-white/80 ring-1 ring-inset ring-black/10 px-5 py-4">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
            House rule
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            Signal beats story. If it cannot be verified, it cannot lead.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME PAGE (new)
   ========================================================= */

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO - White, editorial, search is the crown */}
      <section className="relative w-full pb-10 pt-10 sm:pb-14 sm:pt-12">
        {/* Print-like separators */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className={cx('relative', WIDE)}>
          <div className={cx('relative overflow-hidden rounded-[34px]', HAIRLINE, PAPER_SOFT, 'shadow-[0_60px_160px_rgba(10,10,20,0.10)]')}>
            {/* Ultra-subtle crown flourish (no fog) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
              <HeroGoldCrown />
            </div>

            {/* Clean inner wash */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_24%_0%,rgba(231,201,130,0.18),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(980px_420px_at_86%_0%,rgba(139,92,246,0.10),transparent_66%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>

            <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 2xl:px-20 2xl:py-16">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                {/* LEFT - headline + magic search */}
                <div className="lg:col-span-7">
                  <PremiumBadgeRow />

                  <h1 className="mt-7 text-balance text-[42px] font-semibold tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-[72px] lg:leading-[1.02] 2xl:text-[80px]">
                    Private intelligence for the world&apos;s{' '}
                    <span className="inline">
                      <GoldWord>most valuable assets</GoldWord>
                    </span>
                  </h1>

                  <p className="mt-4 max-w-[78ch] text-pretty text-[15px] leading-relaxed text-zinc-700 sm:text-lg">
                    Vantera is a quiet intelligence surface for buyers, sellers, and advisors who value signal over noise.
                    <span className="text-zinc-500"> Built to model value, liquidity, and risk without theatre.</span>
                  </p>

                  {/* The magic box (primary product) */}
                  <div className="mt-7 max-w-[920px]">
                    <VanteraOmniSearch
                      cities={cities as any}
                      clusters={REGION_CLUSTERS as any}
                      autoFocus={false}
                    />
                  </div>

                  {/* One calm capability line (no clutter) */}
                  <div className="mt-3 max-w-[920px] text-[13px] leading-relaxed text-zinc-600">
                    Search cities, neighbourhoods, keywords, budgets, and intent. Misspellings should still find the best match.
                  </div>

                  {/* Proof strip - compact, premium */}
                  <div className="mt-6 max-w-[920px]">
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

                  {/* Three pillars - still useful, but clean */}
                  <div className="mt-6 grid max-w-[920px] gap-3 sm:grid-cols-3">
                    <Pillar title="Paperwork" body="See what is missing before you waste time." />
                    <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                    <Pillar title="Risk radar" body="Catch resale killers early." />
                  </div>

                  <div className="mt-10 hidden lg:block h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* RIGHT - featured cities rail */}
                <div className="lg:col-span-5">
                  <FeaturedRail cities={cities} />
                </div>
              </div>
            </div>

            {/* Bottom fade (very light) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white" />
          </div>
        </div>
      </section>

      {/* TRUST - institutional tape */}
      <div className={cx('relative -mt-4', NARROW)}>
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

      {/* INTENT - separate section (no hero clutter) */}
      <section className="mt-10 sm:mt-12">
        <div className={WIDE}>
          <SectionKicker
            title="Intent discovery"
            subtitle="Pick a mandate, then let Vantera surface the best starting markets"
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-inset ring-black/10 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-zinc-600">DISCOVERY</div>
              </div>
            }
          />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      {/* Market briefing - wide */}
      <section className="mt-12 sm:mt-14">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      {/* Featured intelligence */}
      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionKicker
            title="Featured intelligence"
            subtitle="Believable, not fake listings"
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-inset ring-black/10 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-zinc-600">PROOF FIRST</div>
              </div>
            }
          />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      {/* Explore index */}
      <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-18">
        <div className={WIDE}>
          <SectionKicker
            title="Explore the index"
            subtitle="Coverage that feels alive"
            right={
              <div className="hidden sm:block">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-1 ring-inset ring-black/10 bg-white">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            }
          />

          <div className={cx('relative overflow-hidden rounded-[34px] p-5 sm:p-7', CARD)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  Cities
                </div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-zinc-950">
                  Browse coverage with signal
                </div>
                <div className="mt-1 text-sm text-zinc-700">
                  Fast scan for where value is forming, where risk is hiding, and where liquidity is strongest.
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-inset ring-black/10 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-zinc-600">ENTRY POINTS</div>
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
          <div className={cx('relative overflow-hidden rounded-[34px] p-6 sm:p-10', CARD)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(231,201,130,0.18),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-500 uppercase">
                  PRIVATE ACCESS
                </div>

                <div className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-zinc-950 sm:text-[30px]">
                  Bring a serious asset or a serious buyer
                </div>

                <div className="mt-2 max-w-[70ch] text-sm leading-relaxed text-zinc-700">
                  Vantera is built for private sellers, advisors, and agents who want verification, clarity, and speed.
                  <span className="text-zinc-500"> Signal only.</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/coming-soon?flow=sell"
                  className={cx(
                    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
                    'bg-zinc-950 text-white hover:bg-black',
                    'shadow-[0_18px_50px_rgba(10,10,20,0.18)]',
                  )}
                >
                  Submit a private seller
                </a>

                <a
                  href="/coming-soon?flow=agents"
                  className={cx(
                    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
                    'bg-white hover:bg-white',
                    'ring-1 ring-inset ring-black/12',
                    'text-zinc-950',
                  )}
                >
                  Agent access
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
