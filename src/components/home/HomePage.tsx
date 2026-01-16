// src/components/home/HomePage.tsx
import Image from 'next/image';
import type { ReactNode } from 'react';

import PageShell from '@/components/layout/PageShell';
import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';

import PremiumBadgeRow from './PremiumBadgeRow';
import IntentHero from './IntentHero';
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

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
  country?: string | null;
  region?: string | null;
  priority?: number | null;
  citySlugs: string[];
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
   Royal layout primitives
   ========================================================= */

const HERO_INNER = 'mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const WIDE = 'mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const MID = 'mx-auto w-full max-w-[1480px] px-5 sm:px-8';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';

const CARD =
  'bg-[color:var(--surface-2)] backdrop-blur-[12px] ' +
  RING +
  ' shadow-[0_26px_80px_rgba(10,12,16,0.10)]';

const DARK_PLATE =
  'bg-[rgba(9,11,15,0.72)] backdrop-blur-[18px] ' +
  'ring-1 ring-inset ring-white/[0.14] ' +
  'shadow-[0_40px_130px_rgba(0,0,0,0.58)]';

function GoldWord({ children }: { children: ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#fbf0d6_0%,#e9cc86_40%,#b98533_100%)]">
      {children}
    </span>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)] uppercase">
      {children}
    </div>
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
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Kicker>{kicker}</Kicker>
        <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[28px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 max-w-[92ch] text-sm leading-relaxed text-[color:var(--ink-2)]">{subtitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.12)] to-transparent" />
      </div>
    </div>
  );
}

type SignalItem = { k: string; v: ReactNode; hint?: string };

function SignalStripDark({ items }: { items: SignalItem[] }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[26px] p-3 sm:p-4', DARK_PLATE)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.70)] to-transparent opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_320px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl px-3.5 py-3',
              'bg-white/[0.06] hover:bg-white/[0.10] transition',
              'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.30)]',
            )}
            title={it.hint ?? undefined}
          >
            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-white/55">{it.k}</div>
                <div className="mt-1 truncate text-sm font-medium text-white/90">{it.v}</div>
              </div>

              {it.hint ? (
                <div className="ml-2 hidden shrink-0 rounded-full bg-white/[0.06] px-2 py-1 text-[10px] tracking-[0.18em] text-white/55 ring-1 ring-inset ring-white/[0.12] sm:block">
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

/* =========================================================
   HERO (clean, full-screen, no featured markets)
   ========================================================= */

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden">
      {/* FULL-SCREEN MEDIA */}
      <div className="pointer-events-none absolute inset-0">
        <Image src="/hero.jpg" alt="Vantera" fill priority sizes="100vw" className="object-cover object-center" />

        {/* Cinematic veil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,11,15,0.70)_0%,rgba(9,11,15,0.62)_30%,rgba(9,11,15,0.42)_58%,rgba(251,251,250,0.90)_100%)]" />

        {/* Authority edges */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.70)] to-transparent opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.14)] to-transparent" />
      </div>

      {/* Royal accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[520px] left-1/2 h-[980px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.18),transparent_66%)] blur-3xl" />
        <div className="absolute -top-[560px] right-[-520px] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle_at_center,rgba(78,99,155,0.10),transparent_68%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.24),transparent_18%,transparent_82%,rgba(0,0,0,0.24))]" />
      </div>

      {/* CONTENT */}
      <div className={cx(HERO_INNER, 'relative pt-12 sm:pt-16')}>
        <div className="pb-10 sm:pb-12 lg:pb-[8vh]">
          {/* Top badge */}
          <div className="inline-flex max-w-full rounded-full bg-white/[0.06] px-3 py-2 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
            <PremiumBadgeRow />
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: statement + search */}
            <div className="lg:col-span-8">
              <h1 className="text-balance text-[30px] font-medium tracking-[-0.015em] text-white/92 sm:text-[38px] lg:text-[48px] lg:leading-[1.08]">
                Private intelligence for the world&apos;s <GoldWord>most valuable assets</GoldWord>
              </h1>

              <p className="mt-4 max-w-[78ch] text-pretty text-[15px] leading-relaxed text-white/76 sm:text-lg">
                A quiet intelligence layer for buyers, sellers and advisors who value signal over theatre.
                <span className="text-white/55"> Value, liquidity and risk in plain language.</span>
              </p>

              <div className="mt-7 max-w-[1180px]">
                <div className={cx('relative overflow-hidden rounded-[28px] p-3 sm:p-4', DARK_PLATE)}>
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(980px_320px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.70)] to-transparent opacity-70" />
                  </div>
                  <div className="relative">
                    <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-white/60">
                {['Typos ok', 'Keywords included', 'City-first intelligence', 'Verification-first'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/[0.06] px-3 py-1.5 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 max-w-[1180px]">
                <SignalStripDark
                  items={[
                    { k: 'COVERAGE', v: <span>{cities.length} cities</span> },
                    { k: 'REGIONS', v: <span>{regionCount}</span> },
                    { k: 'TIMEZONES', v: <span>{timezoneCount}</span> },
                    { k: 'UPDATES', v: <span>Weekly</span>, hint: 'Index refresh cadence' },
                    { k: 'PROOF', v: <span>Registry + docs</span> },
                  ]}
                />
              </div>
            </div>

            {/* RIGHT: keep empty / minimal (no more “featured markets” in hero) */}
            <div className="lg:col-span-4">
              <div className="hidden lg:block">
                <div className="rounded-[30px] bg-white/[0.06] p-6 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                  <div className="text-[11px] tracking-[0.26em] text-white/60">HOUSE RULE</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/72">
                    Signal beats story. If it cannot be verified, it cannot lead.
                  </div>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                  <div className="mt-4 text-[11px] text-white/55">
                    Start with the search. The index below does the rest.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust tape stays in hero (this is safe + premium) */}
          <div className="mt-10 sm:mt-12">
            <div className="rounded-[28px] bg-white/[0.06] ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
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
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-7 sm:p-11', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_86%_10%,rgba(38,44,63,0.08),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Kicker>Private access</Kicker>
          <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">
            Bring a serious asset or a serious buyer
          </div>
          <div className="mt-2 max-w-[78ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
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
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(10,12,16,0.20)]',
              'text-[color:var(--ink)]',
              'shadow-[0_18px_50px_rgba(10,12,16,0.12)]',
            )}
          >
            Submit a private seller
          </a>

          <a
            href="/coming-soon?flow=agents"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
              'bg-white/62 hover:bg-white/78',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(10,12,16,0.18)]',
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

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-[1840px]">
      {/* Featured markets (MOVED OUT OF HERO) */}
      <section className="mt-10 sm:mt-14">
        <div className={WIDE}>
          <SectionHeader
            kicker="Featured markets"
            title="Start with the flagship set"
            subtitle="Two per row on wide screens, one per row when space is tight. Clean, calm, premium."
          />
          <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
        </div>
      </section>

      {/* Discovery */}
      <section className="mt-12 sm:mt-16">
        <div className={MID}>
          <SectionHeader
            kicker="Discovery"
            title="One box that does magic"
            subtitle="Start broad, then refine. Cities, lifestyle and keywords without brittle searching."
          />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      {/* Market briefing */}
      <section className="mt-12 sm:mt-14">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      {/* Featured intelligence */}
      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionHeader
            kicker="Featured intelligence"
            title="Decision-grade, not portal theatre"
            subtitle="A product layer built for serious decisions, not screenshots."
          />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      {/* Explore index */}
      <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-18">
        <div className={WIDE}>
          <SectionHeader
            kicker="Explore the index"
            title="Coverage that feels alive"
            subtitle="Scan for where value is forming, where risk is hiding and where liquidity is strongest."
          />
          <div className={cx('relative overflow-hidden rounded-[34px] p-5 sm:p-8', CARD)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.10)] to-transparent" />
            </div>

            <div className="relative mt-1">
              <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 sm:mt-18 pb-16 sm:pb-20">
        <div className={NARROW}>
          <CTA />
        </div>
      </section>
    </PageShell>
  );
}
