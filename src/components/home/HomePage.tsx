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
    LAYOUT CONSTANTS
   ========================================================= */

const HERO_INNER = 'mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const WIDE = 'mx-auto w-full max-w-[1840px] px-6 sm:px-10 lg:px-16';
const MID = 'mx-auto w-full max-w-[1480px] px-6 sm:px-10';

const GLASS_DARK = 
  'bg-[rgba(10,12,16,0.68)] backdrop-blur-[28px] ' +
  'ring-1 ring-inset ring-white/[0.14] ' +
  'shadow-[0_40px_120px_rgba(0,0,0,0.55)]';

/* =========================================================
    HERO SUB-COMPONENTS
   ========================================================= */

function HeroHotLocations({ cities }: { cities: RuntimeCity[] }) {
  const top = [...cities]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, 10);

  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-8', GLASS_DARK)}>
      <div className="flex items-center justify-between mb-8">
        <div className="text-[11px] font-bold tracking-[0.35em] text-white/50 uppercase">Prime Locations</div>
        <a href="#explore-index" className="text-[11px] text-white/40 hover:text-white transition-colors">Explore full index</a>
      </div>

      <div className="flex flex-wrap gap-3">
        {top.map((c) => (
          <a 
            key={c.slug} 
            href={`/city/${c.slug}`} 
            className="group flex items-center gap-3 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/10 px-5 py-3 transition-all duration-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white group-hover:scale-125 transition-all" />
            <span className="text-[14px] font-medium text-white/90">{c.name}</span>
          </a>
        ))}
        <a 
          href="#explore-index" 
          className="flex items-center justify-center rounded-full bg-white text-black px-7 py-3 text-[13px] font-bold tracking-tight hover:bg-white/90 transition-all shadow-lg"
        >
          Explore the full index
        </a>
      </div>
    </div>
  );
}

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <section className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden bg-[#050609]">
      {/* FULL-SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/brand/hero-city-night.jpg" 
          alt="Vantera Intelligence Surface" 
          fill 
          priority 
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FBFBFA]" />
      </div>

      <div className={cx(HERO_INNER, 'relative z-10 pt-20 pb-16')}>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT: PRIMARY COPY */}
          <div className="lg:col-span-7">
            <div className="inline-block animate-fade-in">
              <PremiumBadgeRow />
            </div>
            
            <h1 className="mt-10 text-balance text-[52px] font-light tracking-[-0.04em] leading-[1.02] text-white sm:text-[72px] lg:text-[84px]">
              Private intelligence for the <br/>
              <span className="font-serif italic text-white/95">world's most valuable assets</span>
            </h1>

            <p className="mt-8 max-w-2xl text-[17px] sm:text-[19px] leading-relaxed text-white/75 font-medium">
              Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise. 
              <span className="block mt-2 opacity-80 font-normal">Built to model value, liquidity and risk without theatre.</span>
            </p>

            <div className="mt-12 max-w-2xl">
              <div className={cx('p-2 rounded-[28px]', GLASS_DARK)}>
                <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
              </div>
            </div>
          </div>

          {/* RIGHT: PRIME LOCATIONS & TRUST */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <HeroHotLocations cities={cities} />
            
            <div className="rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl p-4">
              <TrustMarquee
                className="!mt-0 opacity-50 hover:opacity-100 transition-opacity duration-700"
                brands={[
                  { name: "Sotheby's", domain: 'sothebysrealty.com' },
                  { name: "Christie's", domain: 'christiesrealestate.com' },
                  { name: 'Knight Frank', domain: 'knightfrank.com' },
                  { name: 'Savills', domain: 'savills.com' },
                  { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
                  { name: 'Coldwell Banker', domain: 'coldwellbanker.com' },
                  { name: 'CBRE', domain: 'cbre.com' },
                  { name: 'JLL', domain: 'jll.com' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-none">
      
      <section className="mt-20">
        <div className={MID}>
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      <section className="mt-32">
        <div className={WIDE}>
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
          <div className="rounded-[48px] bg-white/[0.02] ring-1 ring-black/5 p-10">
             <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>

    </PageShell>
  );
}
