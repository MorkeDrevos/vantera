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

const PLATE =
  'bg-[color:var(--surface-1)] backdrop-blur-[14px] ' +
  'ring-1 ring-inset ring-[color:var(--hairline)] ' +
  'shadow-[0_24px_74px_rgba(10,12,16,0.12)]';

const DARK_GLASS =
  'bg-[rgba(9,11,15,0.58)] backdrop-blur-[18px] ' +
  'ring-1 ring-inset ring-white/[0.14] ' +
  'shadow-[0_46px_140px_rgba(0,0,0,0.55)]';

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

function KickerOnDark({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-semibold tracking-[0.30em] text-white/60 uppercase">{children}</div>;
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

function SignalStrip({ items }: { items: SignalItem[] }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[24px]', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(980px_260px_at_20%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.10)] to-transparent" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3',
              'bg-white/92',
              'ring-1 ring-inset ring-[color:var(--hairline)]',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.14),transparent_60%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">{it.k}</div>
                <div className="mt-1 truncate text-sm font-medium text-[color:var(--ink)]">{it.v}</div>
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
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(540px_180px_at_18%_0%,rgba(231,201,130,0.16),transparent_60%)]" />
            </div>

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

function Pillars() {
  const items = [
    {
      t: 'Pricing reality',
      b: 'Detect fantasy pricing, reductions and true demand signals before you engage.',
    },
    {
      t: 'Liquidity read',
      b: 'Understand what will sell, what will stall and what the next buyer will pay for.',
    },
    {
      t: 'Risk radar',
      b: 'Surface resale killers early: paperwork gaps, inconsistencies and hidden downside.',
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((x) => (
        <div key={x.t} className={cx('relative overflow-hidden rounded-[22px] p-5', CARD)}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(560px_180px_at_18%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.10)] to-transparent" />
          </div>
          <div className="relative">
            <div className="text-[13px] font-semibold text-[color:var(--ink)]">{x.t}</div>
            <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">{x.b}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <section className="relative w-full overflow-hidden">
      {/* FULL-BLEED MEDIA */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Vantera"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Cinematic dark veil (matches the new TopBar energy) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,11,15,0.62)_0%,rgba(9,11,15,0.58)_28%,rgba(9,11,15,0.36)_54%,rgba(251,251,250,0.92)_100%)]" />

        {/* Authority edges */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.70)] to-transparent opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.14)] to-transparent" />
      </div>

      {/* Royal accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[520px] left-1/2 h-[980px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.18),transparent_66%)] blur-3xl" />
        <div className="absolute -top-[560px] right-[-520px] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle_at_center,rgba(78,99,155,0.10),transparent_68%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),transparent_20%,transparent_80%,rgba(0,0,0,0.22))]" />
      </div>

      {/* CONTENT */}
      <div className={cx(HERO_INNER, 'relative pt-12 sm:pt-14')}>
        <div className="pb-10 sm:pb-12 lg:pb-[7vh]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT */}
            <div className="lg:col-span-7">
              {/* Badge row stays yours, but sits on dark */}
              <div className="inline-flex max-w-full rounded-full bg-white/[0.06] px-3 py-2 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                <PremiumBadgeRow />
              </div>

              <h1 className="mt-5 text-balance text-[26px] font-medium tracking-[-0.015em] text-white/90 sm:text-[30px] lg:text-[36px] lg:leading-[1.15]">
                Private intelligence for the world&apos;s <GoldWord>most valuable assets</GoldWord>
              </h1>

              <p className="mt-4 max-w-[86ch] text-pretty text-[15px] leading-relaxed text-white/76 sm:text-lg">
                A quiet intelligence layer for buyers, sellers and advisors who value signal over theatre.
                <span className="text-white/55"> Value, liquidity and risk in plain language.</span>
              </p>

              {/* Search crown jewel (dark, commanding) */}
              <div className="mt-7 max-w-[1240px]">
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

              <div className="mt-6 max-w-[1240px]">
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

              {/* Pillars as “quiet power” - stays light, appears after fade */}
              <div className="mt-8 max-w-[1240px]">
                <div className={cx('rounded-[28px] p-4 sm:p-5', 'bg-white/70 ring-1 ring-inset ring-[color:var(--hairline)] backdrop-blur-[18px]')}>
                  <Pillars />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className={cx('relative overflow-hidden rounded-[32px] p-6 sm:p-8', DARK_GLASS)}>
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.70)] to-transparent opacity-70" />
                  <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_18%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent_38%,rgba(0,0,0,0.34))]" />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <KickerOnDark>Featured markets</KickerOnDark>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-white">
                        City-first intelligence
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-white/70">
                        Tap a market to open its intelligence: pricing reality, liquidity read and risk flags.
                      </div>
                    </div>

                    <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                      <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                      <div className="text-[11px] tracking-[0.22em] text-white/60">UPDATED WEEKLY</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="rounded-[24px] bg-white/[0.04] p-3 ring-1 ring-inset ring-white/[0.10]">
                      <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[22px] bg-white/[0.06] p-5 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                    <KickerOnDark>House rule</KickerOnDark>
                    <div className="mt-1 text-sm leading-relaxed text-white/70">
                      Signal beats story. If it cannot be verified, it cannot lead.
                    </div>
                  </div>

                  <div className="mt-5 rounded-[22px] bg-white/[0.06] p-5 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                    <div className="flex items-center justify-between gap-3">
                      <KickerOnDark>Proof stack</KickerOnDark>
                      <div className="text-[11px] text-white/55">Preview</div>
                    </div>

                    <div className="mt-3 grid gap-2">
                      {[
                        { t: 'SOURCE', b: 'Logged, cross-checked, traceable.' },
                        { t: 'SIGNAL', b: 'Value, liquidity, risk flags in plain language.' },
                        { t: 'OUTPUT', b: 'Decision-ready briefs, not screenshots.' },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/[0.12]"
                        >
                          <div className="text-[10px] font-semibold tracking-[0.28em] text-white/55">{x.t}</div>
                          <div className="mt-1 text-sm text-white/72">{x.b}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-white/60">
                      Portals show inventory. Vantera shows what matters before you fly in.
                    </div>
                  </div>
                </div>
              </div>

              {/* Prestige mark */}
              <div className="mt-4 hidden lg:block">
                <div className="flex items-center justify-between rounded-[22px] bg-white/[0.06] px-5 py-4 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
                  <div className="text-[11px] tracking-[0.24em] text-white/60">VANTERA INDEX</div>
                  <div className="relative h-9 w-9 overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-inset ring-white/[0.12]">
                    <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust tape inside hero */}
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
   HOME PAGE (flagship)
   ========================================================= */

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-[1840px]">
      {/* Discovery */}
      <section className="mt-10 sm:mt-14">
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
            right={
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 ring-1 ring-inset ring-[color:var(--hairline)]">
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">PROOF FIRST</div>
              </div>
            }
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
            right={
              <div className="hidden sm:block">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white/90 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            }
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
