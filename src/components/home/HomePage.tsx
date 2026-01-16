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
  image?: { src: string; alt?: string | null; } | null;
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
    ULTRA-WIDE LAYOUT PRIMITIVES
   ========================================================= */

// Increased to 1920px for true full-screen feel
const HERO_INNER = 'mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const WIDE = 'mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const MID = 'mx-auto w-full max-w-[1540px] px-6 sm:px-10';
const NARROW = 'mx-auto w-full max-w-5xl px-6 sm:px-10';

const RING = 'ring-1 ring-inset ring-white/10';
const CARD = 'bg-white/[0.03] backdrop-blur-[32px] ring-1 ring-white/10 shadow-2xl';
const GLASS_DARK = 'bg-[rgba(10,12,16,0.7)] backdrop-blur-[24px] ring-1 ring-inset ring-white/[0.15] shadow-2xl';

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[10px] font-bold tracking-[0.4em] text-[color:var(--ink-3)] uppercase">{children}</div>;
}

function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string; }) {
  return (
    <div className="mb-12">
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-4 text-[32px] font-light tracking-tight text-[color:var(--ink)] sm:text-[48px]">{title}</h2>
      {subtitle && <p className="mt-4 max-w-3xl text-lg text-[color:var(--ink-2)] opacity-80">{subtitle}</p>}
    </div>
  );
}

/* =========================================================
    HERO COMPONENTS
   ========================================================= */

function HeroHotLocations({ cities }: { cities: RuntimeCity[] }) {
  const top = [...cities]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, 10);

  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-8', GLASS_DARK)}>
      <div className="flex items-center justify-between mb-8">
        <div className="text-[11px] font-bold tracking-[0.3em] text-white/50 uppercase">Prime Locations</div>
        <a href="#explore-index" className="text-[11px] text-white/40 hover:text-white transition-colors">View Index</a>
      </div>
      <div className="flex flex-wrap gap-3">
        {top.map((c) => (
          <a key={c.slug} href={`/city/${c.slug}`} className="group flex items-center gap-3 rounded-full bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 px-5 py-3 transition-all duration-300">
            <span className="h-1 w-1 rounded-full bg-white/40 group-hover:bg-white group-hover:scale-125 transition-all" />
            <span className="text-[14px] font-medium text-white/90">{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <section className="relative w-full min-h-[95vh] flex flex-col justify-center overflow-hidden bg-[#050609]">
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image src="/HERO.JPG" alt="Vantera Global" fill priority className="object-cover opacity-80" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#FBFBFA]" />
      </div>

      <div className={cx(HERO_INNER, 'relative z-10 py-20')}>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7">
            <PremiumBadgeRow />
            <h1 className="mt-8 text-balance text-[54px] font-light tracking-[-0.03em] leading-[1.1] text-white sm:text-[72px] lg:text-[88px]">
              The Quiet Edge in <br/>
              <span className="font-serif italic text-white/90">Luxury Real Estate</span>
            </h1>
            
            <p className="mt-8 max-w-xl text-lg text-white/70 leading-relaxed">
              Institutional-grade data for the world's most significant residential assets. 
              Clarity, liquidity, and risk—mapped globally.
            </p>

            <div className="mt-12 max-w-2xl">
               <div className={cx('p-2 rounded-[24px]', GLASS_DARK)}>
                  <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
               </div>
            </div>
          </div>

          {/* RIGHT CONTENT: HOT LOCATIONS ONLY */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <HeroHotLocations cities={cities} />
            
            <div className="rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl p-4">
              <TrustMarquee
                className="!mt-0 opacity-50"
                brands={[
                  { name: "Sotheby's", domain: 'sothebysrealty.com' },
                  { name: "Christie's", domain: 'christiesrealestate.com' },
                  { name: 'Knight Frank', domain: 'knightfrank.com' },
                  { name: 'Savills', domain: 'savills.com' },
                  { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
                  { name: 'Coldwell Banker', domain: 'coldwellbanker.com' },
                  { name: 'CBRE', domain: 'cbre.com' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-none">
      
      <section className="mt-24">
        <div className={MID}>
          <SectionHeader kicker="Intelligence" title="Intuitive Discovery" subtitle="Search by city, region, or tax-vector with our unified intelligence layer." />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      <section className="mt-32">
        <div className={WIDE}>
          <SectionHeader kicker="The Registry" title="Flagship Markets" subtitle="Our tier-one coverage of global luxury hubs." />
          <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
        </div>
      </section>

      <section className="mt-32">
        <div className={WIDE}>
          <FeaturedIntelligencePanel />
        </div>
      </section>

      <section className="mt-32">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      <section id="explore-index" className="mt-32 pb-32">
        <div className={WIDE}>
          <SectionHeader kicker="Global Index" title="Full Coverage" />
          <div className={cx('rounded-[48px] p-8 lg:p-16', CARD)}>
             <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>

    </PageShell>
  );
}
