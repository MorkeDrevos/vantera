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
   ROYAL PRIMITIVES - Refined for 2026 Ultra-Premium
   ========================================================= */

const WIDE = 'mx-auto w-full max-w-[1840px] px-6 sm:px-10 lg:px-16 2xl:px-24';
const NARROW = 'mx-auto w-full max-w-7xl px-6 sm:px-10';

const GLASS =
  'bg-white/40 backdrop-blur-[24px] ring-1 ring-inset ring-white/60 shadow-[0_45px_110px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700';
const GLASS_SOFT =
  'bg-white/30 backdrop-blur-[20px] ring-1 ring-inset ring-white/50 shadow-[0_30px_70px_rgba(11,12,16,0.06)]';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#FBFBFA] text-[color:var(--ink)] selection:bg-[#E6C980]/30">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 h-[1000px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(230,201,128,0.18),transparent_70%)] blur-[120px]" />
        <div className="absolute top-[20%] -right-64 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_65%)] blur-[100px]" />
        <div className="absolute bottom-[-10%] -left-64 h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.07),transparent_60%)] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:160px_160px]" />
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

function SectionKicker({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.04] pb-6">
      <div className="min-w-0">
        <div className="text-[10px] font-bold tracking-[0.4em] text-[#B7863A] uppercase leading-none">{title}</div>
        {subtitle ? <div className="mt-3 text-lg font-light tracking-tight text-[color:var(--ink-2)] italic">{subtitle}</div> : null}
      </div>
      <div className="flex items-center gap-6">
        {right}
        <div className="hidden lg:block h-[1px] w-64 bg-gradient-to-r from-black/[0.08] to-transparent" />
      </div>
    </div>
  );
}

function GoldWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#E6C980] via-[#B7863A] to-[#8C6221]">
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-[#E6C980]/0 via-[#E6C980]/50 to-[#E6C980]/0" />
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
    <div className={cx('relative overflow-hidden rounded-[20px] p-1.5 transition-all duration-500 hover:shadow-xl', GLASS_SOFT)}>
      <div className="relative grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-5">
        {items.map((it) => (
          <div key={it.k} className="group relative overflow-hidden rounded-[14px] bg-white/40 p-4 transition-all duration-300 hover:bg-white/80" title={it.hint ?? undefined}>
            <div className="text-[9px] font-bold tracking-[0.2em] text-[#A8A29E] uppercase">{it.k}</div>
            <div className="mt-1 text-sm font-semibold tracking-tight text-[#1C1917]">{it.v}</div>
            {it.hint && <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#B7863A]/40" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className={cx('group relative overflow-hidden rounded-[24px] p-7 transition-all duration-500 hover:-translate-y-1', GLASS_SOFT)}>
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#B7863A] transition-all duration-700 group-hover:w-full" />
      <div className="text-[14px] font-bold tracking-tight text-[#1C1917] uppercase">{title}</div>
      <div className="mt-3 text-sm leading-relaxed text-[#57534E] font-light">{body}</div>
    </div>
  );
}

function IntelligencePlate({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx('group relative overflow-hidden rounded-[40px]', GLASS)}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

function HotLocations({ cities }: { cities: RuntimeCity[] }) {
  const hot = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 10).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <div className={cx('relative overflow-hidden rounded-[32px] p-8', GLASS_SOFT)}>
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-[9px] font-black tracking-[0.3em] text-[#B7863A] uppercase">Market Momentum</div>
            <div className="mt-3 text-2xl font-light tracking-tight text-[#1C1917]">Fast entry points into the index</div>
            <p className="mt-2 text-sm text-[#78716C] font-light italic">Hand-picked for momentum and liquidity. Search returns soon.</p>
          </div>
          <a href="#explore-index" className="inline-flex h-12 items-center justify-center rounded-full bg-[#1C1917] px-8 text-[11px] font-bold tracking-widest text-white transition-all hover:bg-black hover:scale-[1.02] shadow-lg shadow-black/10">
            EXPLORE FULL INDEX
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {hot.map((c) => (
            <a key={c.slug} href={`/city/${c.slug}`} className="group flex items-center gap-3 rounded-full bg-white/60 px-5 py-2.5 text-[12px] font-medium text-[#44403C] ring-1 ring-black/[0.03] transition-all hover:bg-white hover:ring-[#B7863A]/30 hover:shadow-md">
              <span className="h-1 w-1 rounded-full bg-[#B7863A]" />
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTA() {
  return (
    <div className={cx('relative overflow-hidden rounded-[40px] p-10 sm:p-16', GLASS)}>
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-[10px] font-bold tracking-[0.4em] text-[#B7863A] uppercase">Private Access</div>
          <h2 className="mt-6 text-4xl font-light tracking-tight text-[#1C1917] sm:text-5xl leading-[1.1]">
            Bring a <span className="italic font-normal">serious asset</span> or a <span className="italic font-normal">serious buyer</span>
          </h2>
          <p className="mt-6 text-lg text-[#57534E] font-light leading-relaxed">
            Vantera is built for private sellers, advisors, and agents who want verification, clarity, and speed.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
          <a href="/coming-soon?flow=sell" className="flex h-16 items-center justify-center rounded-full bg-[#1C1917] px-10 text-sm font-bold tracking-widest text-white transition-all hover:bg-black">
            SUBMIT PRIVATE SELLER
          </a>
          <a href="/coming-soon?flow=agents" className="flex h-16 items-center justify-center rounded-full border border-black/10 bg-white/40 px-10 text-sm font-bold tracking-widest text-[#1C1917] backdrop-blur-md transition-all hover:bg-white">
            AGENT ACCESS
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME PAGE - Fixed with clusters prop
   ========================================================= */

interface HomePageProps {
  cities: RuntimeCity[];
  clusters?: any[]; // Re-added to satisfy the build error from page.tsx
}

export default function HomePage({ cities, clusters }: HomePageProps) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      <section className="relative w-full pb-20 pt-10 sm:pb-32 sm:pt-16">
        <div className={cx('relative', WIDE)}>
          <div className="relative overflow-hidden rounded-[50px] ring-1 ring-black/[0.03] bg-white/[0.15] shadow-[0_80px_180px_-20px_rgba(0,0,0,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-white/40" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"><RoyalPortalBackdrop /></div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.15]"><HeroGoldCrown /></div>

            <div className="relative px-8 py-14 sm:px-16 sm:py-20 lg:px-24 lg:py-28">
              <div className="grid gap-16 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <PremiumBadgeRow />
                  <h1 className="mt-10 text-balance text-[52px] font-light leading-[0.95] tracking-[-0.04em] text-[#1C1917] sm:text-7xl lg:text-[92px] 2xl:text-[104px]">
                    Private intelligence for the world&apos;s <GoldWord>most valuable assets</GoldWord>
                  </h1>
                  <p className="mt-8 max-w-[65ch] text-pretty text-lg leading-relaxed text-[#57534E] font-light sm:text-xl">
                    Vantera is a quiet intelligence surface for buyers, sellers, and advisors who value <span className="text-[#1C1917] font-medium">signal over noise</span>.
                  </p>

                  <div className="mt-12 space-y-6">
                    <HotLocations cities={cities} />
                    <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
                    <SignalStrip items={[
                      { k: 'COVERAGE', v: `${cities.length} Global Cities` },
                      { k: 'REGIONS', v: regionCount },
                      { k: 'TIMEZONES', v: timezoneCount },
                      { k: 'UPDATES', v: 'Weekly Refresh', hint: 'Real-time liquidity scan' },
                      { k: 'PROOF', v: 'Registry Auth' },
                    ]} />
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <Pillar title="Paperwork" body="See what is missing before you waste time." />
                    <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                    <Pillar title="Risk radar" body="Catch resale killers early." />
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <IntelligencePlate>
                    <div className="p-8 sm:p-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[10px] font-bold tracking-[0.3em] text-[#B7863A] uppercase">Featured Markets</div>
                          <div className="mt-3 text-2xl font-light tracking-tight text-[#1C1917]">City-first intelligence</div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-black/[0.05]">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <span className="text-[9px] font-bold tracking-[0.1em] text-[#78716C]">LIVE UPDATE</span>
                        </div>
                      </div>
                      <div className="mt-10">
                        <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                      </div>
                      <div className="mt-8 rounded-3xl bg-[#1C1917] p-8 text-white">
                        <div className="text-[9px] font-bold tracking-[0.4em] text-[#E6C980] uppercase">The Vantera Rule</div>
                        <div className="mt-4 text-lg font-light leading-relaxed italic">
                          &quot;Signal beats story. If it cannot be verified, it cannot lead.&quot;
                        </div>
                      </div>
                    </div>
                  </IntelligencePlate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={cx('relative py-10 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0', NARROW)}>
        <TrustMarquee brands={[
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
            { name: 'RE/MAX', domain: 'remax.com' },
            { name: 'BHHS', domain: 'bhhs.com' },
            { name: 'Corcoran', domain: 'corcoran.com' },
            { name: 'Century 21', domain: 'century21.com' },
        ]} />
      </div>

      <section className="mt-24"><div className={WIDE}><MarketBriefing cities={cities as any} /></div></section>

      <section className="mt-32">
        <div className={WIDE}>
          <SectionKicker title="Featured Intelligence" subtitle="Verified assets, actual liquidity" />
          <FeaturedIntelligencePanel />
        </div>
      </section>

      <section id="explore-index" className="mt-32 scroll-mt-24">
        <div className={WIDE}>
          <SectionKicker title="The Global Index" subtitle="Institutional coverage across 4 continents" />
          <div className={cx('relative rounded-[48px] p-10', GLASS)}>
            <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-light tracking-tight text-[#1C1917]">Browse coverage with signal</h3>
                <p className="mt-3 text-[#78716C] font-light">Fast scan for where value is forming and where risk is hiding.</p>
              </div>
              <div className="h-16 w-16 relative">
                <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-contain" />
              </div>
            </div>
            <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
          </div>
        </div>
      </section>

      <section className="mt-32 pb-32"><div className={NARROW}><CTA /></div></section>
    </Shell>
  );
}
