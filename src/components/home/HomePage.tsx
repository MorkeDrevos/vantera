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
  image?: { src: string; alt?: string | null } | null;
  heroImageSrc?: string | null;
  heroImageAlt?: string | null;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
   JAMES EDITION ARCHITECTURE - Minimalist & Linear
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1440px] px-6 lg:px-12';
const NARROW = 'mx-auto w-full max-w-4xl px-6';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white text-[#1A1A1A] selection:bg-[#A6885B]/20">
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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 border-b border-[#EEE] pb-10">
      <h2 className="text-[11px] font-bold tracking-[0.4em] text-[#999] uppercase mb-4">{title}</h2>
      {subtitle && <p className="text-4xl font-light tracking-tight text-[#1A1A1A] leading-tight">{subtitle}</p>}
    </div>
  );
}

function SignalStrip({ items }: { items: SignalStripItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border-y border-[#EEE] bg-white">
      {items.map((it) => (
        <div key={it.k} className="border-r border-[#EEE] last:border-r-0 p-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#AAA] uppercase mb-2">{it.k}</div>
          <div className="text-base font-medium text-[#1A1A1A]">{it.v}</div>
        </div>
      ))}
    </div>
  );
}

function MarketPillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-10 border-r border-[#EEE] last:border-r-0 group hover:bg-[#FAFAFA] transition-colors">
      <div className="text-[12px] font-bold tracking-widest text-[#1A1A1A] uppercase mb-5">{title}</div>
      <p className="text-sm leading-relaxed text-[#666] font-light">{body}</p>
    </div>
  );
}

function HotLocationsGrid({ cities }: { cities: RuntimeCity[] }) {
  const hot = [...cities]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, 12);

  return (
    <div className="bg-[#1A1A1A] text-white py-20">
      <div className={WIDE}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.5em] text-[#A6885B] uppercase">Global Reach</span>
            <h3 className="mt-4 text-4xl font-light">Trending High-Value Markets</h3>
          </div>
          <a href="#explore-index" className="border border-white/30 px-10 py-4 text-[11px] font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all">
            VIEW ALL LOCATIONS
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-12">
          {hot.map((c) => (
            <a key={c.slug} href={`/city/${c.slug}`} className="group block border-b border-white/10 pb-4">
              <div className="text-[11px] text-[#A6885B] mb-1 font-bold">0{hot.indexOf(c) + 1}</div>
              <div className="text-lg font-light group-hover:translate-x-2 transition-transform duration-300 uppercase tracking-wider">{c.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

type SignalStripItem = {
  k: string;
  v: React.ReactNode;
};

interface HomePageProps {
  cities: RuntimeCity[];
  clusters?: any[];
}

export default function HomePage({ cities, clusters }: HomePageProps) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO SECTION 
          JamesEdition Inspired: Vast white space, centered or left-aligned focus, no "boxes"
      */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 overflow-hidden border-b border-[#EEE]">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <RoyalPortalBackdrop />
        </div>
        
        <div className={WIDE}>
          <div className="max-w-5xl">
            <div className="inline-block mb-8">
              <PremiumBadgeRow />
            </div>
            <h1 className="text-[60px] lg:text-[100px] font-light leading-[0.95] tracking-[-0.04em] text-[#1A1A1A]">
              Private Intelligence for the <br />
              <span className="italic text-[#A6885B] font-normal">World’s Elite Assets</span>
            </h1>
            <p className="mt-12 max-w-2xl text-xl lg:text-2xl leading-relaxed text-[#666] font-light italic">
              A sovereign data surface for buyers, sellers, and advisors who require objective signal in a market of noise.
            </p>

            {/* The ONLY interactive element in the hero */}
            <div className="mt-20 max-w-3xl">
              <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
            </div>
          </div>
        </div>
      </section>

      {/* DATA STRIP - Post-Hero validation */}
      <section className="relative z-10">
        <div className={WIDE}>
          <SignalStrip items={[
            { k: 'Intelligence Index', v: `${cities.length} Global Cities` },
            { k: 'Territories', v: `${regionCount} Key Regions` },
            { k: 'Active Timezones', v: timezoneCount },
            { k: 'Audit Cycle', v: 'Weekly Refresh' },
            { k: 'Data Source', v: 'Verified Registry' },
          ]} />
        </div>
      </section>

      {/* PILLARS - The Institutional Grid */}
      <section className="py-24">
        <div className={WIDE}>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#EEE]">
            <MarketPillar title="Market Integrity" body="Every asset in our index undergoes a multi-point verification process to ensure documentary and legal transparency." />
            <MarketPillar title="Liquidity Modeling" body="We track real-time capital flow and exit velocity to provide an objective view of value beyond the asking price." />
            <MarketPillar title="Friction Analysis" body="Identify structural risks and resale killers before engagement. Data-driven clarity for sophisticated decision-making." />
          </div>
        </div>
      </section>

      {/* HOT LOCATIONS - High Contrast / Dark Mode Break */}
      <HotLocationsGrid cities={cities} />

      {/* BRIEFINGS */}
      <section className="py-32">
        <div className={WIDE}>
          <SectionHeader title="Market Intelligence" subtitle="Verified Briefings & Asset Reports" />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div className="border-y border-[#EEE] py-20 grayscale opacity-30 hover:opacity-100 transition-opacity">
        <div className={WIDE}>
          <TrustMarquee brands={[
              { name: "Sotheby's", domain: 'sothebysrealty.com' },
              { name: "Christie's", domain: 'christiesrealestate.com' },
              { name: 'Knight Frank', domain: 'knightfrank.com' },
              { name: 'Savills', domain: 'savills.com' },
              { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
              { name: 'Douglas Elliman', domain: 'elliman.com' },
          ]} />
        </div>
      </div>

      {/* GLOBAL INDEX */}
      <section id="explore-index" className="py-32 scroll-mt-10">
        <div className={WIDE}>
          <SectionHeader title="The Global Directory" subtitle="Institutional Coverage across 4 Continents" />
          <div className="bg-[#F9F9F9] border border-[#EEE] p-2">
            <div className="bg-white p-12 border border-[#EEE]">
              <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-white border-t border-[#EEE]">
        <div className={NARROW}>
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[0.6em] text-[#A6885B] uppercase">Advisory Access</span>
            <h2 className="mt-8 text-5xl lg:text-6xl font-light tracking-tighter text-[#1A1A1A] mb-12">Entry into the Private Surface</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a href="/coming-soon?flow=sell" className="w-full sm:w-auto bg-[#1A1A1A] text-white px-16 py-6 text-xs font-bold tracking-[0.3em] hover:bg-black transition-all">
                SUBMIT ASSET
              </a>
              <a href="/coming-soon?flow=agents" className="w-full sm:w-auto border border-[#1A1A1A] text-[#1A1A1A] px-16 py-6 text-xs font-bold tracking-[0.3em] hover:bg-[#1A1A1A] hover:text-white transition-all">
                AGENT PORTAL
              </a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
