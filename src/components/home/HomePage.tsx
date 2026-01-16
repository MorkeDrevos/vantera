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
    Types & Utilities (Preserved)
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
const GLASS_DARK = 'bg-[rgba(10,12,16,0.62)] backdrop-blur-[18px] ring-1 ring-inset ring-white/[0.12] shadow-[0_40px_130px_rgba(0,0,0,0.56)]';

/* =========================================================
    New: City Intelligence Grid (Royal Upgrade)
   ========================================================= */

const CITY_INTEL_DATA = [
  { name: "Dubai", growth: "+9.2%", index: "High Yield", metric: "8-10% ROI", icon: <Zap size={16} />, desc: "Tax-free incentives and super-prime volume leader." },
  { name: "Madrid", growth: "+5.8%", index: "Lifestyle Hub", metric: "UHNWI Peak", icon: <Building2 size={16} />, desc: "Leading luxury growth in the Salamanca district." },
  { name: "Lisbon", growth: "+7.1%", index: "Appreciation", metric: "Tech Hub", icon: <Waves size={16} />, desc: "Momentum driven by digital nomad and tech influx." },
  { name: "Miami", growth: "+6.4%", index: "Resilience", metric: "Wealth Hub", icon: <HomeIcon size={16} />, desc: "Benefiting from massive internal US wealth migration." }
];

function CityIntelligenceGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CITY_INTEL_DATA.map((city) => (
        <div key={city.name} className={cx('group relative rounded-2xl p-5 transition-all duration-500 hover:bg-white/[0.08]', GLASS_DARK)}>
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 rounded-xl bg-white/5 text-white/90 ring-1 ring-white/10 group-hover:text-[#E7C982] transition-colors">
              {city.icon}
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> {city.growth}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-white/90">{city.name}</h4>
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1">
            <Shield size={10} /> {city.index}
          </div>
          <p className="text-[13px] leading-relaxed text-white/50 mb-6 line-clamp-2">{city.desc}</p>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-sm font-medium text-white/80">{city.metric}</span>
            <ArrowUpRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
    Updated Components
   ========================================================= */

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)] uppercase">{children}</div>;
}

function SectionHeader({ kicker, title, subtitle, right }: { kicker: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Kicker>{kicker}</Kicker>
        <div className="mt-2 text-balance text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[28px]">{title}</div>
        {subtitle ? <div className="mt-1 max-w-[92ch] text-sm leading-relaxed text-[color:var(--ink-2)]">{subtitle}</div> : null}
      </div>
      <div className="flex items-center gap-3">
        {right}
        <div className="hidden sm:block h-px w-44 bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.12)] to-transparent" />
      </div>
    </div>
  );
}

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/HERO.JPG" alt="Vantera" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,6,9,0.72)_0%,rgba(7,9,12,0.58)_28%,rgba(9,11,15,0.42)_56%,rgba(251,251,250,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1400px_760px_at_50%_18%,rgba(0,0,0,0.14),transparent_62%)]" />
      </div>

      <div className={cx(HERO_INNER, 'relative pt-12 sm:pt-16 pb-20')}>
        <div className="inline-flex max-w-full rounded-full bg-white/[0.06] px-3 py-2 ring-1 ring-inset ring-white/[0.12] backdrop-blur-[18px]">
          <PremiumBadgeRow />
        </div>

        <div className="mt-8 mb-12 max-w-4xl">
          <h1 className="text-balance text-[40px] font-medium tracking-[-0.018em] text-white/92 sm:text-[50px] lg:text-[72px] lg:leading-[1.02]">
            Invest with <span className="font-serif italic text-white/60 font-light">Certainty.</span>
          </h1>
          <p className="mt-6 max-w-[65ch] text-pretty text-lg leading-relaxed text-white/70">
            The private advisory for global real estate intelligence. 
            <span className="text-white/40 italic"> Decision-grade signals for the top 1%.</span>
          </p>
        </div>

        <div className="max-w-3xl mb-12">
          <div className={cx('relative overflow-hidden rounded-2xl p-3.5 sm:p-4 shadow-2xl', GLASS_DARK)}>
            <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
          </div>
        </div>

        {/* REPLACEMENT: 4-City Intelligence Grid instead of Hot Locations */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#E7C982]">
            <Activity size={14} className="animate-pulse" /> Asset Intelligence Index Q1 2026
          </div>
          <CityIntelligenceGrid />
        </div>

        <div className="mt-12 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] backdrop-blur-[12px] opacity-40 hover:opacity-100 transition-opacity duration-1000">
          <TrustMarquee
            className="!mt-0"
            brands={[
              { name: "Sotheby's", domain: 'sothebysrealty.com' },
              { name: "Christie's", domain: 'christiesrealestate.com' },
              { name: 'Knight Frank', domain: 'knightfrank.com' },
              { name: 'Savills', domain: 'savills.com' },
              { name: 'CBRE', domain: 'cbre.com' },
              { name: 'JLL', domain: 'jll.com' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-7 sm:p-11', CARD)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_380px_at_20%_0%,rgba(10,12,16,0.06),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.12)] to-transparent" />
      </div>
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Kicker>Private access</Kicker>
          <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">Bring a serious asset or a serious buyer</div>
          <div className="mt-2 max-w-[78ch] text-sm leading-relaxed text-[color:var(--ink-2)]">Vantera is built for private sellers and advisors who want verification.</div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="/coming-soon?flow=sell" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition bg-white ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink)] shadow-lg">Submit a private seller</a>
          <a href="/coming-soon?flow=agents" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition bg-white/60 ring-1 ring-inset ring-[color:var(--hairline)] text-[color:var(--ink)]">Agent access</a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-[1840px]">
      <section className="mt-10 sm:mt-14">
        <div className={MID}>
          <SectionHeader kicker="Discovery" title="Intelligent Search" subtitle="Find value across cities, lifestyle and keywords." />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionHeader kicker="Featured markets" title="Global Flagships" />
          <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <SectionHeader kicker="Featured intelligence" title="Decision-Grade Signal" />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-18 pb-20">
        <div className={WIDE}>
          <SectionHeader kicker="Explore the index" title="The Global Inventory" />
          <div className={cx('relative overflow-hidden rounded-[34px] p-5 sm:p-8', CARD)}>
             <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>

      <section className="mt-14 sm:mt-18 pb-16 sm:pb-20">
        <div className={NARROW}>
          <CTA />
        </div>
      </section>
    </PageShell>
  );
}
