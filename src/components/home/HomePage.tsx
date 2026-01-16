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
   JAMES EDITION PRIMITIVES - Minimalist, Grid-Focused, Black & White
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1440px] px-6 lg:px-12';
const NARROW = 'mx-auto w-full max-w-5xl px-6';

// JamesEdition uses sharp, thin lines and solid backgrounds rather than heavy blurs
const PANEL = 'bg-white border border-[#E5E5E5] shadow-sm';
const INTERACTIVE_PANEL = 'bg-white border border-[#E5E5E5] hover:border-black transition-colors duration-300';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white text-[#1A1A1A] selection:bg-[#B7863A]/20">
      {/* Background is clean white - no distracting gradients, JamesEdition style */}
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
    <div className="mb-10 border-b border-[#E5E5E5] pb-8">
      <h2 className="text-[12px] font-bold tracking-[0.3em] text-[#888] uppercase mb-3">{title}</h2>
      {subtitle && <p className="text-3xl font-light tracking-tight text-[#1A1A1A]">{subtitle}</p>}
    </div>
  );
}

function GoldWord({ children }: { children: React.ReactNode }) {
  // A more muted, "Brass" gold typical of high-end real estate portals
  return (
    <span className="text-[#A6885B] font-medium tracking-tight italic">
      {children}
    </span>
  );
}

function SignalStrip({ items }: { items: SignalStripItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border-t border-l border-[#E5E5E5]">
      {items.map((it) => (
        <div key={it.k} className="border-r border-b border-[#E5E5E5] p-6 hover:bg-[#F9F9F9] transition-colors">
          <div className="text-[10px] font-bold tracking-widest text-[#888] uppercase mb-2">{it.k}</div>
          <div className="text-sm font-medium text-[#1A1A1A]">{it.v}</div>
        </div>
      ))}
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="group p-8 border border-[#E5E5E5] hover:bg-[#F9F9F9] transition-all">
      <div className="h-1 w-8 bg-black mb-6 transition-all group-hover:w-16" />
      <div className="text-sm font-bold tracking-tighter text-[#1A1A1A] uppercase mb-3">{title}</div>
      <div className="text-sm leading-relaxed text-[#666] font-light">{body}</div>
    </div>
  );
}

function HotLocations({ cities }: { cities: RuntimeCity[] }) {
  const hot = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 10).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <div className="bg-[#1A1A1A] text-white p-10 lg:p-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-[#A6885B] uppercase mb-4">Market Momentum</div>
          <h3 className="text-4xl font-light tracking-tight">Access the Index</h3>
        </div>
        <a href="#explore-index" className="inline-block border border-white/20 px-8 py-4 text-[11px] font-bold tracking-widest hover:bg-white hover:text-black transition-all">
          BROWSE FULL DIRECTORY
        </a>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {hot.map((c) => (
          <a key={c.slug} href={`/city/${c.slug}`} className="text-sm font-light text-white/60 hover:text-[#A6885B] transition-colors border-b border-white/10 pb-1">
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}

type SignalStripItem = {
  k: string;
  v: React.ReactNode;
  hint?: string;
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
      {/* HERO SECTION - Institutional & Bold */}
      <section className="relative bg-[#F9F9F9] border-b border-[#E5E5E5] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <RoyalPortalBackdrop />
        </div>
        
        <div className={cx('relative py-20 lg:py-32', WIDE)}>
          <div className="max-w-4xl">
            <PremiumBadgeRow />
            <h1 className="mt-12 text-[56px] lg:text-[84px] font-light leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
              The Intelligence Layer for <br />
              <GoldWord>Elite Real Estate</GoldWord>
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-[#666] font-light">
              Vantera provides private data modeling for the world’s most significant assets. 
              Objective signal for the modern investor.
            </p>
          </div>

          <div className="mt-20">
            <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white">
        <div className={WIDE}>
          <SignalStrip items={[
            { k: 'Global Index', v: `${cities.length} Cities` },
            { k: 'Territories', v: regionCount },
            { k: 'Timezones', v: timezoneCount },
            { k: 'Frequency', v: 'Weekly Audit' },
            { k: 'Integrity', v: 'Registry Verified' },
          ]} />
        </div>
      </section>

      {/* PILLARS / SERVICES */}
      <section className="py-24 bg-white">
        <div className={WIDE}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E5E5] border border-[#E5E5E5]">
            <Pillar title="Verification" body="Deep-dive documentary audits before engagement." />
            <Pillar title="Valuation" body="Real-time liquidity modeling vs. asking price." />
            <Pillar title="Risk Mitigation" body="Identifying structural and legal resale friction." />
          </div>
        </div>
      </section>

      {/* HOT LOCATIONS - The Black Box Section */}
      <section className="py-12">
        <div className={WIDE}>
          <HotLocations cities={cities} />
        </div>
      </section>

      {/* FEATURED INTELLIGENCE */}
      <section className="py-24">
        <div className={WIDE}>
          <SectionHeader title="Intelligence Briefings" subtitle="Market Analysis & Liquidity Reports" />
          <div className="mt-10">
            <FeaturedIntelligencePanel />
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE - Integrated into the grid */}
      <div className="border-t border-b border-[#E5E5E5] py-16 grayscale opacity-40 hover:opacity-100 transition-opacity">
        <div className={WIDE}>
          <TrustMarquee brands={[
              { name: "Sotheby's", domain: 'sothebysrealty.com' },
              { name: "Christie's", domain: 'christiesrealestate.com' },
              { name: 'Knight Frank', domain: 'knightfrank.com' },
              { name: 'Savills', domain: 'savills.com' },
              { name: 'Engel & Völkers', domain: 'engelvoelkers.com' },
              { name: 'Douglas Elliman', domain: 'elliman.com' },
              { name: 'Compass', domain: 'compass.com' },
          ]} />
        </div>
      </div>

      {/* MARKET BRIEFING */}
      <section className="py-24 bg-[#F9F9F9]">
        <div className={WIDE}>
          <MarketBriefing cities={cities as any} />
        </div>
      </section>

      {/* EXPLORE INDEX */}
      <section id="explore-index" className="py-24 scroll-mt-20">
        <div className={WIDE}>
          <SectionHeader title="Global Directory" subtitle="Institutional Coverage Index" />
          <div className="mt-12 bg-white border border-[#E5E5E5] p-1">
            <div className="p-10 border border-[#E5E5E5]">
               <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - High Contrast */}
      <section className="py-32 bg-white">
        <div className={NARROW}>
          <div className="text-center">
            <div className="text-[10px] font-bold tracking-[0.5em] text-[#A6885B] uppercase mb-8">Exclusive Access</div>
            <h2 className="text-5xl font-light tracking-tight mb-10 text-[#1A1A1A]">Elevate Your Portfolio Intelligence</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="/coming-soon?flow=sell" className="w-full sm:w-auto bg-[#1A1A1A] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] hover:bg-black transition-all">
                SUBMIT ASSET
              </a>
              <a href="/coming-soon?flow=agents" className="w-full sm:w-auto border border-[#1A1A1A] text-[#1A1A1A] px-12 py-5 text-xs font-bold tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-all">
                AGENT PORTAL
              </a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
