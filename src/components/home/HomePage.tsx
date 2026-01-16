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
    ULTRA-PREMIUM PRIMITIVES
   ========================================================= */

const HERO_INNER = 'mx-auto w-full max-w-[1720px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const WIDE = 'mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const MID = 'mx-auto w-full max-w-[1540px] px-6 sm:px-10';
const NARROW = 'mx-auto w-full max-w-5xl px-6 sm:px-10';

const RING = 'ring-[1px] ring-inset ring-white/[0.08] dark:ring-white/[0.12]';

const CARD = 
  'bg-white/[0.03] backdrop-blur-[32px] ' + 
  RING + 
  ' shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] transition-all duration-700';

const GLASS_ROYAL = 
  'bg-[rgba(15,17,23,0.75)] backdrop-blur-[28px] ' +
  'ring-[1px] ring-inset ring-white/[0.15] ' +
  'shadow-[0_40px_130px_rgba(0,0,0,0.6)]';

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[1px] w-6 bg-white/20" />
      <div className="text-[10px] font-bold tracking-[0.4em] text-[color:var(--ink-3)] uppercase">
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, subtitle, right }: { kicker: string; title: string; subtitle?: string; right?: ReactNode; }) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-4 text-balance text-[32px] font-light tracking-[-0.03em] text-[color:var(--ink)] sm:text-[42px] lg:text-[48px]">
          {title}
        </h2>
        {subtitle && <p className="mt-4 max-w-[70ch] text-[16px] font-medium text-[color:var(--ink-2)] opacity-80">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-6">
        {right}
        <div className="hidden lg:block h-[1px] w-32 bg-gradient-to-r from-[rgba(10,12,16,0.15)] to-transparent" />
      </div>
    </div>
  );
}

/* =========================================================
    REFINED HERO COMPONENTS
   ========================================================= */

function SignalStripDark({ items }: { items: { k: string; v: ReactNode; hint?: string }[] }) {
  return (
    <div className={cx('relative overflow-hidden rounded-[24px] p-1.5', GLASS_ROYAL)}>
      <div className="relative grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div key={it.k} className="group relative rounded-[18px] px-5 py-4 hover:bg-white/[0.05] transition-all duration-500" title={it.hint}>
            <div className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase mb-1.5">{it.k}</div>
            <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{it.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroHotLocations({ cities }: { cities: RuntimeCity[] }) {
  const top = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 10);

  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-8', GLASS_ROYAL)}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-bold tracking-[0.35em] text-white/50 uppercase">Prime Locations</div>
        <a href="#explore-index" className="text-[11px] text-white/40 hover:text-white transition-colors">Explore full index</a>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {top.map((c) => (
          <a key={c.slug} href={`/city/${c.slug}`} className="group flex items-center gap-3 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 px-4 py-2.5 transition-all">
            <span className="h-1 w-1 rounded-full bg-white/40 group-hover:scale-150 group-hover:bg-white transition-all" />
            <span className="text-[13px] font-medium text-white/80">{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function HeroBand({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <section className="relative w-full min-h-[96vh] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/HERO.JPG" alt="Vantera Global" fill priority className="object-cover scale-105 animate-[vanteraPan_60s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609]/85 via-[#07090C]/50 to-[#FBFBFA]" />
      </div>

      <div className={cx(HERO_INNER, 'relative z-10 pt-20 pb-16')}>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-7">
            <div className="inline-block animate-fade-in-up">
              <PremiumBadgeRow />
            </div>
            
            <h1 className="mt-8 text-balance text-[48px] font-light tracking-[-0.04em] leading-[1.05] text-white sm:text-[64px] lg:text-[84px]">
              The Quiet Edge in <br/>
              <span className="font-serif italic opacity-90 text-white/95">Luxury Real Estate</span>
            </h1>

            <div className="mt-12 max-w-2xl">
               <div className={cx('p-2.5 rounded-[28px]', GLASS_ROYAL)}>
                  <VanteraOmniSearch cities={cities as any} clusters={clusters as any} autoFocus={false} />
               </div>
            </div>

            <div className="mt-10">
              <SignalStripDark items={[
                { k: 'Portfolio', v: `${cities.length} Global Hubs` },
                { k: 'Intelligence', v: 'Weekly Audit' },
                { k: 'Verification', v: 'Full Registry' },
                { k: 'Standard', v: 'Ultra Prime' },
                { k: 'Status', v: 'Verified Only' }
              ]} />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <HeroHotLocations cities={cities} />
            <div className="rounded-[32px] bg-white/[0.04] border border-white/10 backdrop-blur-xl p-3">
              <TrustMarquee
                className="!mt-0 opacity-60 hover:opacity-100 transition-opacity duration-700"
                brands={[
                  { name: "Sotheby's International Realty", domain: 'sothebysrealty.com' },
                  { name: "Christie's International Real Estate", domain: 'christiesrealestate.com' },
                  { name: 'Knight Frank', domain: 'knightfrank.com' },
                  { name: 'Savills', domain: 'savills.com' },
                  { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
                  { name: 'BARNES', domain: 'barnes-international.com' },
                  { name: 'Coldwell Banker', domain: 'coldwellbanker.com' },
                  { name: 'Douglas Elliman', domain: 'elliman.com' },
                  { name: 'Compass', domain: 'compass.com' },
                  { name: 'CBRE', domain: 'cbre.com' },
                  { name: 'JLL', domain: 'jll.com' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vanteraPan {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.15) translate(-2%, -1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}

export default function HomePage({ cities, clusters }: { cities: RuntimeCity[]; clusters: RuntimeRegionCluster[] }) {
  return (
    <PageShell fullBleedHero={<HeroBand cities={cities} clusters={clusters} />} bodyMaxWidthClassName="max-w-none">
      
      <section className="mt-24">
        <div className={MID}>
          <SectionHeader kicker="Discovery" title="Intuitive Intelligence" subtitle="A unified search architecture designed for asset class and tax-liquidity vectors." />
          <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
        </div>
      </section>

      <section className="mt-32">
        <div className={WIDE}>
          <SectionHeader kicker="The Collection" title="Flagship Markets" subtitle="Global tier-one coverage. Evaluated on proprietary risk and opportunity metrics." />
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

      <section id="explore-index" className="mt-32 scroll-mt-32">
        <div className={WIDE}>
          <SectionHeader kicker="Full Index" title="Global Coverage" subtitle="The definitive registry of luxury liquidity. Updated in real-time." />
          <div className={cx('rounded-[48px] p-8 lg:p-16', CARD)}>
             <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>

      <section className="mt-32 pb-32">
        <div className={NARROW}>
          <div className={cx('relative overflow-hidden rounded-[48px] p-12 lg:p-20 text-center', CARD)}>
            <Kicker>Membership</Kicker>
            <h2 className="mt-6 text-[42px] font-light tracking-tight text-[color:var(--ink)] leading-tight">
              Curated for the Significant Asset.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/join?flow=sell" className="px-10 py-5 rounded-full bg-[color:var(--ink)] text-white text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:scale-105 shadow-xl">
                Submit Private Asset
              </a>
              <a href="/join?flow=agent" className="px-10 py-5 rounded-full border border-[color:var(--ink)]/20 text-[color:var(--ink)] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[color:var(--ink)]/5 transition-colors">
                Advisor Access
              </a>
            </div>
          </div>
        </div>
      </section>

    </PageShell>
  );
}
