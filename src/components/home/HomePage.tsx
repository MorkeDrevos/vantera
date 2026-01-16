// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import TrustMarquee from '@/components/trust/TrustMarquee';

import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import MarketBriefing from './MarketBriefing';
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
   White Royal system primitives (NOT card-first)
   ========================================================= */

const PAD = 'px-5 sm:px-8 lg:px-12 2xl:px-16';
const CONTAIN = cx('mx-auto w-full max-w-[1600px]', PAD);
const CONTAIN_NARROW = cx('mx-auto w-full max-w-[1200px]', PAD);

// Hairlines are the only "borders" we allow globally
const HAIRLINE = 'bg-[rgba(11,12,16,0.10)]';
const SOFT_SHADOW = 'shadow-[0_30px_90px_rgba(11,12,16,0.08)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* White royal stage - subtle, expensive, not UI-y */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Warm ivory wash */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(252,251,249,1)_55%,rgba(249,248,246,1)_100%)]" />

        {/* Champagne halo */}
        <div className="absolute -top-[520px] left-1/2 h-[980px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.20),transparent_66%)] blur-3xl" />

        {/* Whisper violet for depth (very restrained) */}
        <div className="absolute -top-[560px] right-[-520px] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_68%)] blur-3xl" />

        {/* Paper grain */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
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
   Micro: royal text + separators
   ========================================================= */

function GoldWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#f7edcf_0%,#e6c980_45%,#b7863a_100%)]">
      {children}
    </span>
  );
}

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full', HAIRLINE, className)} />;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-[color:var(--ink-3)]">
      {children}
    </div>
  );
}

function SectionTitle({
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Kicker>{kicker}</Kicker>
        <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[28px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-2 max-w-[92ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

function Stat({
  k,
  v,
  hint,
}: {
  k: string;
  v: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="min-w-0" title={hint ?? undefined}>
      <div className="text-[10px] font-semibold tracking-[0.30em] uppercase text-[color:var(--ink-3)]">
        {k}
      </div>
      <div className="mt-1 truncate text-[14px] font-medium text-[color:var(--ink)]">{v}</div>
    </div>
  );
}

function RoyalCTAButton({
  href,
  children,
  tone = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'primary' | 'secondary';
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(231,201,130,0.55)]';

  if (tone === 'secondary') {
    return (
      <a
        href={href}
        className={cx(
          base,
          'bg-transparent',
          'ring-1 ring-inset ring-[rgba(11,12,16,0.18)] hover:ring-[rgba(11,12,16,0.28)]',
          'text-[color:var(--ink)]',
        )}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cx(
        base,
        'bg-[color:var(--ink)] text-white hover:bg-black',
        'shadow-[0_22px_60px_rgba(11,12,16,0.14)]',
      )}
    >
      {children}
    </a>
  );
}

/* =========================================================
   HOME PAGE - full redesign (white editorial, no boxed hero)
   ========================================================= */

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO: full-bleed, no card, no container box */}
      <section className="relative w-full overflow-hidden">
        {/* Top breathing room under TopBar */}
        <div className="h-6 sm:h-10" />

        {/* Full-bleed royal edge rules */}
        <div className="pointer-events-none absolute inset-x-0 top-0">
          <Hairline className="opacity-60" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <Hairline className="opacity-50" />
        </div>

        <div className={cx(CONTAIN, 'relative py-10 sm:py-14 lg:py-18')}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: headline + search */}
            <div className="lg:col-span-7">
              <Kicker>Vantera</Kicker>

              <h1 className="mt-6 text-balance text-[44px] font-semibold tracking-[-0.04em] text-[color:var(--ink)] sm:text-6xl lg:text-[84px] lg:leading-[1.01] 2xl:text-[92px]">
                Private intelligence for the world&apos;s <GoldWord>most valuable assets</GoldWord>
              </h1>

              <p className="mt-5 max-w-[86ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-[17px]">
                A white-glove intelligence surface for buyers, sellers and advisors who value signal over noise.
                Built to model value, liquidity and risk with verification-first outputs.
              </p>

              <div className="mt-8">
                <VanteraOmniSearch cities={cities as any} clusters={REGION_CLUSTERS as any} autoFocus={false} />
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Stat k="Coverage" v={<span>{cities.length} cities</span>} />
                  <Stat k="Regions" v={<span>{regionCount}</span>} />
                  <Stat k="Timezones" v={<span>{timezoneCount}</span>} />
                  <Stat k="Cadence" v={<span>Weekly</span>} hint="Index refresh cadence" />
                </div>

                <Hairline className="opacity-60" />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-[color:var(--ink-2)]">
                    Portals show inventory. Vantera shows what matters before you fly in.
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <RoyalCTAButton href="/coming-soon?flow=explore">Enter Vantera</RoyalCTAButton>
                    <RoyalCTAButton href="/coming-soon?flow=access" tone="secondary">
                      Request access
                    </RoyalCTAButton>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: featured markets (NOT a card - an editorial plate) */}
            <div className="lg:col-span-5">
              <div
                className={cx(
                  'relative overflow-hidden rounded-[28px] bg-white/75 ring-1 ring-inset ring-[rgba(11,12,16,0.12)]',
                  SOFT_SHADOW,
                )}
              >
                {/* Minimal, expensive header */}
                <div className="px-6 pt-6 sm:px-7 sm:pt-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Kicker>Featured markets</Kicker>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        City-first intelligence
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                        Tap a market to open its briefing: pricing reality, liquidity read and risk flags.
                      </div>
                    </div>

                    <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-inset ring-[rgba(11,12,16,0.12)]">
                      <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
                      <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                        UPDATED WEEKLY
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 px-2 sm:px-3">
                  <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                </div>

                <div className="mt-4 px-6 pb-6 sm:px-7 sm:pb-7">
                  <Hairline className="opacity-70" />
                  <div className="mt-4 text-sm text-[color:var(--ink-2)]">
                    <span className="font-medium text-[color:var(--ink)]">House rule:</span> If it cannot be verified,
                    it cannot lead.
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-[rgba(11,12,16,0.12)]">
                      <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)] uppercase">
                        Proof stack
                      </div>
                      <div className="text-sm text-[color:var(--ink-2)]">Registry, documents, traceable sources.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiny editorial note, no box */}
              <div className="mt-6 text-sm leading-relaxed text-[color:var(--ink-2)]">
                Designed for discretion. Built for decision-making. Calibrated for ultra-prime reality.
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip: clean, white, breathable */}
        <div className={cx(CONTAIN_NARROW, 'pb-10 sm:pb-12')}>
          <div className="mt-8">
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
        </div>
      </section>

      {/* DISCOVERY: intent mode (white editorial) */}
      <section className="relative w-full">
        <div className={cx(CONTAIN_NARROW, 'py-12 sm:py-14')}>
          <SectionTitle
            kicker="Discovery"
            title="One search that understands intent"
            subtitle="Start broad, then refine. Cities, lifestyle and keywords without brittle filtering."
          />

          <div className="mt-8">
            <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
          </div>
        </div>

        <div className={cx(CONTAIN_NARROW, 'pb-2')}>
          <Hairline className="opacity-60" />
        </div>
      </section>

      {/* MARKET BRIEFING: full width feel, still readable */}
      <section className="relative w-full">
        <div className={cx(CONTAIN, 'py-12 sm:py-14')}>
          <SectionTitle
            kicker="Market"
            title="Briefing, not browsing"
            subtitle="A calm read on where value is forming, where liquidity tightens and where risk hides."
          />
          <div className="mt-8">
            <MarketBriefing cities={cities as any} />
          </div>
        </div>

        <div className={cx(CONTAIN_NARROW, 'pb-2')}>
          <Hairline className="opacity-55" />
        </div>
      </section>

      {/* FEATURED INTELLIGENCE */}
      <section className="relative w-full">
        <div className={cx(CONTAIN, 'py-12 sm:py-14')}>
          <SectionTitle
            kicker="Intelligence"
            title="Believable, not performative"
            subtitle="Built for decisions and verification, not screenshots and theatre."
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-inset ring-[rgba(11,12,16,0.12)]">
                <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">PROOF FIRST</div>
              </div>
            }
          />
          <div className="mt-8">
            <FeaturedIntelligencePanel />
          </div>
        </div>

        <div className={cx(CONTAIN_NARROW, 'pb-2')}>
          <Hairline className="opacity-55" />
        </div>
      </section>

      {/* EXPLORE INDEX: subtle plate, still not "boxed cards" */}
      <section id="explore-index" className="relative w-full scroll-mt-24">
        <div className={cx(CONTAIN, 'py-12 sm:py-14')}>
          <SectionTitle
            kicker="Coverage"
            title="Explore the index"
            subtitle="Scan cities fast. Open the briefing. See signal first."
          />

          <div className="mt-8 rounded-[30px] bg-white/70 ring-1 ring-inset ring-[rgba(11,12,16,0.12)] p-3 sm:p-5">
            <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--ink-2)]">
              Bring a serious asset or a serious buyer. We operate quietly.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <RoyalCTAButton href="/coming-soon?flow=sell">Submit a private seller</RoyalCTAButton>
              <RoyalCTAButton href="/coming-soon?flow=agents" tone="secondary">
                Agent access
              </RoyalCTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer breathing room */}
      <div className="h-10 sm:h-16" />
    </Shell>
  );
}
