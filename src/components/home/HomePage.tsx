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
   Royal layout primitives (wide, editorial, institutional)
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

// New: dark "quiet luxury" surfaces (no white fog)
const DARK_SHELL = 'bg-[#07080B] text-white';

const DARK_GLASS =
  'bg-[rgba(12,13,18,0.72)] backdrop-blur-[18px] ring-1 ring-inset ring-white/10 shadow-[0_40px_140px_rgba(0,0,0,0.55)]';

const DARK_GLASS_SOFT =
  'bg-[rgba(12,13,18,0.58)] backdrop-blur-[18px] ring-1 ring-inset ring-white/10 shadow-[0_30px_110px_rgba(0,0,0,0.45)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={cx('min-h-[100dvh]', DARK_SHELL)}>
      {/* Global cinematic stage (dark, controlled, premium) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Obsidian base wash */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_-10%,rgba(255,255,255,0.06),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_20%_10%,rgba(231,201,130,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_85%_0%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_700px_at_10%_90%,rgba(62,196,255,0.08),transparent_62%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_900px_at_50%_55%,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]" />

        {/* Micro grain */}
        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] [background-size:26px_26px]" />
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
        <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55 uppercase">
          {title}
        </div>
        {subtitle ? <div className="mt-1 text-sm text-white/75">{subtitle}</div> : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
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
        'relative overflow-hidden rounded-[22px]',
        'ring-1 ring-inset ring-white/10',
        'bg-[rgba(12,13,18,0.55)] backdrop-blur-[18px]',
        'shadow-[0_26px_90px_rgba(0,0,0,0.45)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl',
              'ring-1 ring-inset ring-white/10',
              'bg-white/[0.04]',
              'px-3 py-2.5 sm:px-3.5 sm:py-3',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_20%_0%,rgba(231,201,130,0.14),transparent_60%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.26em] text-white/55">
                  {it.k}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-white/90">
                  {it.v}
                </div>
              </div>

              {it.hint ? (
                <div className="ml-2 hidden shrink-0 rounded-full ring-1 ring-inset ring-white/10 bg-white/[0.05] px-2 py-1 text-[10px] tracking-[0.18em] text-white/55 sm:block">
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
        'relative overflow-hidden rounded-[22px] p-5',
        'ring-1 ring-inset ring-white/10',
        'bg-[rgba(12,13,18,0.52)] backdrop-blur-[18px]',
        'shadow-[0_18px_60px_rgba(0,0,0,0.45)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[13px] font-semibold text-white/92">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-white/70">{body}</div>
      </div>
    </div>
  );
}

function IntelligencePlate({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px]', DARK_GLASS)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_360px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_85%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- Portal vs Truth ---------- */

function PortalVsTruth() {
  return (
    <div className={cx('relative overflow-hidden rounded-[28px] p-5 sm:p-6', DARK_GLASS_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] ring-1 ring-inset ring-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55">
            LUXURY PORTALS
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white/92">
            Beautiful inventory
          </div>
          <div className="mt-2 text-sm leading-relaxed text-white/70">
            Great for browsing, but vulnerable to persuasion, missing facts, and theatre.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/70">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
              Asking price leads the story
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
              Verification happens elsewhere
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
              Risk hides late in the process
            </li>
          </ul>
        </div>

        <div className="rounded-[22px] ring-1 ring-inset ring-white/10 bg-white/[0.02] p-6">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55">
            VANTERA
          </div>
          <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white/92">
            Quiet intelligence
          </div>
          <div className="mt-2 text-sm leading-relaxed text-white/70">
            Built for signal: value, liquidity, and risk, with verification-first outputs.
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/70">
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
    <div className={cx('relative overflow-hidden rounded-[28px] p-6', DARK_GLASS_SOFT)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(720px_240px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55 uppercase">
          {eyebrow}
        </div>

        <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white/92">
          {title}
        </div>

        <div className="mt-2 text-sm leading-relaxed text-white/70">
          {body}
        </div>

        <ul className="mt-5 space-y-2 text-sm text-white/70">
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

/* ---------- CTA ---------- */

function CTA() {
  return (
    <div className={cx('relative overflow-hidden rounded-[30px] p-6 sm:p-10', DARK_GLASS)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55 uppercase">
            PRIVATE ACCESS
          </div>

          <div className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-white/92 sm:text-[30px]">
            Bring a serious asset or a serious buyer
          </div>

          <div className="mt-2 max-w-[70ch] text-sm leading-relaxed text-white/70">
            Vantera is built for private sellers, advisors, and agents who want verification, clarity, and speed.
            <span className="text-white/55"> Signal only.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/coming-soon?flow=sell"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
              'bg-white/90 hover:bg-white',
              'text-black',
              'shadow-[0_18px_50px_rgba(0,0,0,0.35)]',
            )}
          >
            Submit a private seller
          </a>

          <a
            href="/coming-soon?flow=agents"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
              'bg-white/[0.05] hover:bg-white/[0.09]',
              'ring-1 ring-inset ring-white/12',
              'text-white/90',
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

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO - Dark, premium, search-first */}
      <section className="relative w-full pb-10 pt-10 sm:pb-14 sm:pt-12">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className={cx('relative', WIDE)}>
          <div className={cx('relative overflow-hidden rounded-[34px]', DARK_GLASS)}>
            {/* Cinematic portal layers, but controlled (no white wash) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-screen">
              <RoyalPortalBackdrop />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen">
              <HeroGoldCrown />
            </div>

            {/* Hero ambient */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_22%_0%,rgba(231,201,130,0.14),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_0%,rgba(139,92,246,0.12),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.35))]" />
            </div>

            <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 2xl:px-20 2xl:py-16">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                {/* LEFT: Narrative + Search */}
                <div className="lg:col-span-7">
                  <PremiumBadgeRow />

                  <h1 className="mt-7 text-balance text-[42px] font-semibold tracking-[-0.035em] text-white sm:text-6xl lg:text-[72px] lg:leading-[1.02] 2xl:text-[80px]">
                    Private intelligence for the world&apos;s{' '}
                    <span className="inline">
                      <GoldWord>most valuable assets</GoldWord>
                    </span>
                  </h1>

                  <p className="mt-4 max-w-[78ch] text-pretty text-[15px] leading-relaxed text-white/75 sm:text-lg">
                    Vantera is a quiet intelligence surface for buyers, sellers, and advisors who value signal over noise.
                    <span className="text-white/55"> Built to model value, liquidity, and risk without theatre.</span>
                  </p>

                  {/* Primary: OmniSearch (hero element) */}
                  <div className="mt-7 max-w-[860px]">
                    <VanteraOmniSearch
                      cities={cities as any}
                      clusters={REGION_CLUSTERS as any}
                      autoFocus={false}
                    />
                  </div>

                  <div className="mt-6 max-w-[860px]">
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

                  <div className="mt-6 grid max-w-[860px] gap-3 sm:grid-cols-3">
                    <Pillar title="Paperwork" body="See what is missing before you waste time." />
                    <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                    <Pillar title="Risk radar" body="Catch resale killers early." />
                  </div>

                  <div className="mt-10 hidden lg:block h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* RIGHT: Featured markets dossier */}
                <div className="lg:col-span-5">
                  <IntelligencePlate>
                    <div className="px-6 py-6 sm:px-7 sm:py-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
                            Featured markets
                          </div>
                          <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-white/92">
                            Private intelligence, city-first
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-white/70">
                            Tap a market to open its intelligence - pricing reality, liquidity read, and risk flags.
                          </div>
                        </div>

                        <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/12 px-3 py-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                          <div className="text-[11px] tracking-[0.22em] text-white/60">
                            UPDATED WEEKLY
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                      </div>

                      <div className="mt-5 rounded-[20px] bg-white/[0.03] ring-1 ring-inset ring-white/10 px-5 py-4">
                        <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55 uppercase">
                          House rule
                        </div>
                        <div className="mt-1 text-sm text-white/70">
                          Signal beats story. If it cannot be verified, it cannot lead.
                        </div>
                      </div>
                    </div>
                  </IntelligencePlate>
                </div>
              </div>

              <div className="mt-10">
                <SectionKicker title="Why this exists" subtitle="This is why we sit above luxury portals" />
                <PortalVsTruth />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intent is now a separate premium section (not cluttering hero) */}
      <section className="mt-8 sm:mt-10">
        <div className={WIDE}>
          <SectionKicker
            title="Intent discovery"
            subtitle="Pick a mandate, then let Vantera surface the best starting markets"
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/12 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-white/60">DISCOVERY</div>
              </div>
            }
          />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      {/* TRUST - keep for now, but it will be redesigned later for dark mode */}
      <div className={cx('relative mt-10', NARROW)}>
        <TrustMarquee
          className="opacity-90"
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
            { name: 'JLL', domain: 'jll.com' },
            { name: 'RE/MAX', domain: 'remax.com' },
            { name: 'BHHS', domain: 'bhhs.com' },
            { name: 'Corcoran', domain: 'corcoran.com', invert: false },
            { name: 'Century 21', domain: 'century21.com', invert: false },
          ]}
        />
      </div>

      {/* BODY */}
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
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/12 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-white/60">PROOF FIRST</div>
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
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/12 bg-white/[0.04]">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            }
          />

          <div className={cx('relative overflow-hidden rounded-[32px] p-5 sm:p-7', DARK_GLASS)}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.26em] text-white/55 uppercase">
                  Cities
                </div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white/92">
                  Browse coverage with signal
                </div>
                <div className="mt-1 text-sm text-white/70">
                  Fast scan for where value is forming, where risk is hiding, and where liquidity is strongest.
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/12 px-3 py-1.5">
                <div className="text-[11px] tracking-[0.22em] text-white/60">ENTRY POINTS</div>
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
