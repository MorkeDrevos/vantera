'use client';

import Image from 'next/image';
import React, { type ReactNode } from 'react';
import { Activity, ArrowUpRight, Shield, TrendingUp, Zap, Building2, Waves, Home as HomeIcon } from 'lucide-react';

import PageShell from '@/components/layout/PageShell';
import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';

import PremiumBadgeRow from './PremiumBadgeRow';
import IntentHero from './IntentHero';
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

import type { CoverageTier, CoverageStatus } from '@prisma/client';

/* =========================================================
   Royal layout primitives (Preserved)
   ========================================================= */

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
  image?: { src: string; alt?: string | null } | null;
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

const HERO_INNER = 'mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const WIDE = 'mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-12 2xl:px-16';
const MID = 'mx-auto w-full max-w-[1480px] px-5 sm:px-8';
const NARROW = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';
const CARD = 'bg-[color:var(--surface-2)] backdrop-blur-[12px] ' + RING + ' shadow-[0_26px_80px_rgba(10,12,16,0.10)]';
const DARK_GLASS = 'bg-[rgba(9,11,15,0.58)] backdrop-blur-[18px] ring-1 ring-inset ring-white/[0.14] shadow-[0_46px_140px_rgba(0,0,0,0.55)]';
const DARK_PLATE = 'bg-[rgba(9,11,15,0.72)] backdrop-blur-[18px] ring-1 ring-inset ring-white/[0.14] shadow-[0_40px_130px_rgba(0,0,0,0.58)]';

function GoldWord({ children }: { children: ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#fbf0d6_0%,#e9cc86_40%,#b98533_100%)] font-serif italic">
      {children}
    </span>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)] uppercase">{children}</div>;
}

function KickerOnDark({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-semibold tracking-[0.30em] text-white/60 uppercase">{children}</div>;
}

/* =========================================================
   NEW: City Intelligence Data
   ========================================================= */

const CITY_INTEL_DATA = [
  { name: "Dubai", growth: "+9.2%", index: "High Yield", metric: "8-10% ROI", icon: <Zap size={14} />, desc: "Leading super-prime volume." },
  { name: "Madrid", growth: "+5.8%", index: "Lifestyle", metric: "UHNWI Peak", icon: <Building2 size={14} />, desc: "Momentum in Salamanca." },
  { name: "Lisbon", growth: "+7.1%", index: "Appreciation", metric: "Tech Hub", icon: <Waves size={14} />, desc: "Driven by capital influx." },
  { name: "Miami", growth: "+6.4%", index: "Resilience", metric: "Wealth Hub", icon: <HomeIcon size={14} />, desc: "Internal US migration peak." }
];

/* =========================================================
   UPGRADED: RoyalDeviceFrame (Surgical Injection)
   ========================================================= */

function RoyalDeviceFrame() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-6">
        <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(closest-side,rgba(231,201,130,0.14),transparent_72%)] blur-2xl" />
      </div>

      <div className={cx('relative overflow-hidden rounded-[36px] p-4 sm:p-5', DARK_GLASS)}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.75)] to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_340px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3 rounded-[22px] bg-white/[0.06] px-4 py-3 ring-1 ring-inset ring-white/[0.12]">
            <div className="min-w-0">
              <KickerOnDark>Market Intelligence Index</KickerOnDark>
              <div className="mt-1 flex items-center gap-2 truncate text-[14px] font-semibold text-white/90">
                <Activity size={14} className="text-[#e9cc86] animate-pulse" /> Asset Tracking Q1 2026
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {CITY_INTEL_DATA.map((city) => (
              <div key={city.name} className="group relative rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.10] hover:bg-white/[0.08] transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-white/40 group-hover:text-[#e9cc86] transition-colors">{city.icon}</div>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp size={10} /> {city.growth}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white/90">{city.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-tighter mb-2">{city.index}</div>
                <div className="text-[11px] font-medium text-white/80">{city.metric}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-inset ring-white/[0.12]">
            <div className="text-[11px] leading-relaxed text-white/70">
              <Shield size={12} className="inline mr-1 text-[#e9cc86]" />
              All data points are <span className="text-white">registry-verified</span> and updated weekly. 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO & SECTIONS
   ========================================================= */

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/hero.jpg" alt="Vantera" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,11,15,0.66)_0%,rgba(9,11,15,0.60)_26%,rgba(9,11,15,0.34)_54%,rgba(251,251,250,0.92)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.75)] to-transparent opacity-80" />
      </div>

      <div className={cx(HERO_INNER, 'relative pt-12 sm:pt-14 pb-16 sm:pb-24')}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="inline-flex max-w-full rounded-full bg-white/[0.06] px-3 py-2 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
              <PremiumBadgeRow />
          </div>

            <h1 className="mt-8 text-balance text-[32px] font-medium tracking-tight text-white/90 sm:text-[42px] lg:text-[56px] lg:leading-[1.08]">
              Move beyond <br />
              <GoldWord>Portal Theatre.</GoldWord>
            </h1>

            <p className="mt-6 max-w-[60ch] text-lg text-white/70">
              The quiet intelligence layer for the top 1%. 
              <span className="text-white/40 block mt-1">Value, liquidity and risk – verifiable and comparable.</span>
            </p>

            <div className="mt-8 max-w-[720px]">
              <div className={cx('relative overflow-hidden rounded-[28px] p-4', DARK_PLATE)}>
                <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <RoyalDeviceFrame />
          </div>
        </div>

        <div className="mt-16 rounded-[28px] bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] backdrop-blur-[12px] opacity-40 hover:opacity-100 transition-opacity duration-700">
          <TrustMarquee className="!mt-0" brands={[{ name: "Sotheby's", domain: 'sothebysrealty.com' }, { name: "Christie's", domain: 'christiesrealestate.com' }, { name: 'Knight Frank', domain: 'knightfrank.com' }, { name: 'Savills', domain: 'savills.com' }, { name: 'CBRE', domain: 'cbre.com' }]} />
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-[1840px]">
      <section className="mt-14 sm:mt-20">
        <div className={MID}>
          <Kicker>The Index</Kicker>
          <h2 className="mt-3 text-[32px] font-semibold tracking-tight">Discovery Signal</h2>
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      <section className="mt-16">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      <section className="mt-16">
        <div className={WIDE}>
          <FeaturedIntelligencePanel />
        </div>
    </section>

      <section id="explore-index" className="mt-16 scroll-mt-24 pb-20">
        <div className={WIDE}>
          <div className={cx('relative overflow-hidden rounded-[34px] p-8', CARD)}>
            <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
