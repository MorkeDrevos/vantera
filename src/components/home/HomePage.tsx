// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import MarketBriefing from './MarketBriefing';

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0B0E13] text-zinc-100">
      {/* Ambient: graphite, ivory, violet signal */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[620px] w-[1080px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_62%)] blur-2xl" />
        <div className="absolute -top-24 right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.16),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-260px] left-[-260px] h-[740px] w-[740px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.11),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:26px_26px]" />
      </div>

      <div className="relative">
        {/* IMPORTANT: TopBar uses useSearchParams, so keep it inside Suspense */}
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>

        <main className="w-full">{children}</main>

        <Footer />
      </div>
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
          {String(children).toUpperCase()}
        </div>
        <div className="mt-2 h-px w-28 bg-gradient-to-r from-white/18 via-white/10 to-transparent" />
      </div>
      {hint ? (
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function HeroVideo() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="h-full w-full object-cover opacity-[0.58]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/vantera-hero.jpg"
      >
        <source src="/hero/vantera-hero.mp4" type="video/mp4" />
      </video>

      {/* Film + spectral layers */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.44),rgba(0,0,0,0.82))]" />
      <div className="absolute inset-0 [background:radial-gradient(1200px_520px_at_50%_18%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 opacity-75 [background:radial-gradient(920px_420px_at_15%_18%,rgba(120,76,255,0.16),transparent_56%)]" />
      <div className="absolute inset-0 opacity-75 [background:radial-gradient(920px_420px_at_85%_22%,rgba(62,196,255,0.11),transparent_56%)]" />

      <div className="absolute inset-0 opacity-[0.065] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.65)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#0B0E13]" />
    </div>
  );
}

function HeroShine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[620px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_62%)] blur-2xl" />
      <div className="absolute -top-16 right-[-280px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.18),transparent_62%)] blur-2xl" />
      <div className="absolute bottom-[-240px] left-[-240px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.13),transparent_60%)] blur-2xl" />
      <div className="absolute inset-0 opacity-30 [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.10)_45%,transparent_62%)]" />

      <div className="absolute right-[-90px] top-[-70px] opacity-[0.05] blur-[0.2px]">
        <Image src="/brand/vantera-logo-dark.png" alt="" width={560} height={180} className="w-[560px]" />
      </div>
    </div>
  );
}

function SignalStrip({
  left,
  right,
}: {
  left: Array<{ k: string; v: React.ReactNode }>;
  right?: Array<{ k: string; v: React.ReactNode }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
      <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          {left.map((x) => (
            <div key={x.k} className="flex items-baseline gap-2">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{x.k}</div>
              <div className="text-sm text-zinc-100">{x.v}</div>
            </div>
          ))}
        </div>

        {right && right.length ? (
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {right.map((x) => (
              <div key={x.k} className="flex items-baseline gap-2">
                <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{x.k}</div>
                <div className="text-sm text-zinc-100">{x.v}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-200 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_180px_at_20%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="relative">
        <div className="text-[11px] tracking-[0.18em] text-zinc-400">{title.toUpperCase()}</div>
        <div className="mt-2 text-zinc-200">{body}</div>
      </div>
    </div>
  );
}

function TwoColCard({
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
}: {
  leftTitle: string;
  leftBody: string;
  rightTitle: string;
  rightBody: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.09),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative grid gap-0 sm:grid-cols-2">
        <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r sm:border-white/10">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">LISTINGS</div>
          <div className="mt-2 text-sm font-medium text-zinc-100">{leftTitle}</div>
          <div className="mt-1 text-sm leading-relaxed text-zinc-300">{leftBody}</div>
        </div>
        <div className="p-5">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">VANTERA</div>
          <div className="mt-2 text-sm font-medium text-zinc-100">{rightTitle}</div>
          <div className="mt-1 text-sm leading-relaxed text-zinc-300">{rightBody}</div>
        </div>
      </div>
    </div>
  );
}

function TruthCardPreview() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/25 shadow-[0_42px_130px_rgba(0,0,0,0.70)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(255,255,255,0.07),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_90%_10%,rgba(120,76,255,0.12),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">PROPERTY REPORT</div>
            <div className="mt-2 text-lg font-medium text-zinc-100">Truth Card (preview)</div>
            <div className="mt-1 text-sm text-zinc-300">
              One page that shows the facts, the risks and what to check next.
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-300">
            Sample
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { k: 'Ownership', v: 'Looks clear', note: 'No obvious conflicts found' },
            { k: 'Permits', v: 'Needs review', note: 'Missing one document' },
            { k: 'Price check', v: 'High', note: 'Above similar homes nearby' },
            { k: 'Time to sell', v: 'Normal', note: 'Demand is steady' },
            { k: 'Noise / access', v: 'Low', note: 'No major issues flagged' },
            { k: 'Proof', v: '3 sources', note: 'Registry, agent docs, on-site' },
          ].map((row) => (
            <div
              key={row.k}
              className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[10px] font-semibold tracking-[0.24em] text-zinc-500">{row.k.toUpperCase()}</div>
                <div className="text-sm text-zinc-100">{row.v}</div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">{row.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[12px] text-zinc-300">
          This is what goes missing in glossy listings: paperwork, price reality and risk.
        </div>
      </div>
    </div>
  );
}

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
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">{eyebrow.toUpperCase()}</div>
        <div className="mt-2 text-lg font-medium text-zinc-100 sm:text-xl">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-zinc-300">{body}</div>

        <div className="mt-4 grid gap-2">
          {bullets.map((b) => (
            <div
              key={b}
              className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-zinc-200 transition group-hover:bg-white/[0.03]"
            >
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/80 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" />
              <span className="text-zinc-200">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO */}
      <section className="relative w-full pb-10 pt-8 sm:pb-14 sm:pt-10">
        <div className="relative w-full overflow-visible border-y border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.040),rgba(255,255,255,0.012),rgba(0,0,0,0.70))] shadow-[0_55px_150px_rgba(0,0,0,0.72)]">
          <HeroVideo />
          <HeroShine />

          <div className="relative w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-20 2xl:px-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] text-zinc-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                  <span className="tracking-wide text-zinc-200">Luxury homes</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Clear facts</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Less risk</span>
                </div>

                <h1 className="mt-6 text-balance text-[40px] font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Know what you&apos;re{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.80),rgba(120,76,255,0.72))] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.10)]">
                    buying
                  </span>
                  .
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-zinc-300 sm:text-lg">
                  Photos don&apos;t show legal problems, hidden costs or bad pricing.
                  <span className="text-zinc-400"> Vantera shows the facts, the risks and what to check next.</span>
                </p>

                {/* Search terminal card */}
                <div className="mt-6 max-w-2xl">
                  <div className="relative z-20 overflow-visible rounded-[24px] border border-white/10 bg-white/[0.02] shadow-[0_28px_90px_rgba(0,0,0,0.62)]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
                      <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_22%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="relative px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SEARCH</div>
                          <div className="mt-1 text-xs text-zinc-500">
                            Start with a city. Then open a property report.
                          </div>
                        </div>

                        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300 sm:inline-flex">
                          Press <span className="font-mono text-zinc-100">/</span>
                        </div>
                      </div>

                      <div className="mt-4 relative z-30">
                        <div className="rounded-2xl border border-white/10 bg-black/35 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                          <CitySearch cities={cities} />
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-[12px] text-zinc-300">
                        Pick a city, then open a report for a home - price check, paperwork and risk.
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/28 px-3 py-2">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">EXAMPLE</div>
                          <div className="mt-1 font-mono text-[12px] text-zinc-200">CLEAN • FAIR PRICE • LOW RISK</div>
                          <div className="mt-1 text-[12px] text-zinc-400">Strong demand, good access, paperwork ok.</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/28 px-3 py-2">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">YOU GET</div>
                          <div className="mt-1 text-[12px] text-zinc-200">A clear view before you commit</div>
                          <div className="mt-1 text-[12px] text-zinc-400">So you don&apos;t buy blind.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage strip */}
                <div className="mt-4 max-w-2xl">
                  <SignalStrip
                    left={[
                      { k: 'CITIES', v: <span className="text-zinc-100">{cities.length}</span> },
                      { k: 'REGIONS', v: <span className="text-zinc-100">{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span className="text-zinc-100">{timezoneCount}</span> },
                    ]}
                    right={[{ k: 'UPDATED', v: <span className="text-zinc-100">LIVE</span> }]}
                  />
                </div>

                {/* Before you buy */}
                <div className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <Pillar title="Paperwork" body="See what is missing before you waste time." />
                  <Pillar title="Price check" body="Spot overpriced homes fast." />
                  <Pillar title="Risk" body="Catch problems that photos don’t show." />
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/25 p-5 shadow-[0_42px_130px_rgba(0,0,0,0.70)] sm:p-6">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_35%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_90%_20%,rgba(120,76,255,0.12),transparent_60%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <SectionLabel hint="Quick start">Selected cities</SectionLabel>

                    <CityCardsClient cities={cities.slice(0, 4)} columns="grid gap-4 grid-cols-1 sm:grid-cols-2" />

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
                      Start here.
                      <span className="text-zinc-500"> More cities added steadily.</span>
                    </div>

                    <div className="mt-4">
                      <TwoColCard
                        leftTitle="Looks great"
                        leftBody="Photos, lifestyle and sales copy."
                        rightTitle="Is it safe?"
                        rightBody="Paperwork, price check and risk flags."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <TruthCardPreview />
                </div>

                <div className="mt-4 rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">WHY THIS MATTERS</div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                    Most sites help you scroll. Vantera helps you decide.
                  </div>

                  <div className="mt-4 grid gap-2">
                    {[
                      'Spot overpriced homes fast',
                      'Catch missing paperwork early',
                      'Avoid problems that kill resale value',
                    ].map((t) => (
                      <div
                        key={t}
                        className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-zinc-200"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">FAST CHECK</div>
                      <div className="mt-2 text-sm text-zinc-300">
                        A simple read that saves time and mistakes.
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300">
                      Private
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">PRICE</div>
                      <div className="mt-2 text-zinc-200">High</div>
                      <div className="mt-1 text-xs text-zinc-500">Above nearby sales.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">RISK</div>
                      <div className="mt-2 text-zinc-200">Low</div>
                      <div className="mt-1 text-xs text-zinc-500">No major flags.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* “Above listings” section under hero (still inside hero band) */}
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <TwoColCard
                leftTitle="Great photos"
                leftBody="Photos sell the dream. They don’t show risk."
                rightTitle="Clear facts"
                rightBody="Paperwork, pricing and risk - in one place."
              />
              <TwoColCard
                leftTitle="Filter and browse"
                leftBody="You can scroll forever and still miss the key issues."
                rightTitle="Check and decide"
                rightBody="See what matters first, then move fast."
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0B0E13]" />
        </div>
      </section>

      {/* TRUST */}
      <TrustMarquee
        className="-mt-6"
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
          { name: 'RE/MAX', domain: 'remax.com' },
          { name: 'BHHS', domain: 'bhhs.com' },
          { name: 'Corcoran', domain: 'corcoran.com', invert: false },
          { name: 'Century 21', domain: 'century21.com', invert: false },
        ]}
      />

      {/* BODY */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mt-10 sm:mt-12">
          <MarketBriefing cities={cities as any} />
        </div>

        <section className="mt-10 sm:mt-12">
          <SectionLabel hint="Real examples">Featured reports</SectionLabel>
          <FeaturedIntelligencePanel />
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Simple reasons">Why Vantera is different</SectionLabel>

          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureCard
              eyebrow="Price"
              title="Spot overpriced homes"
              body="We compare homes to the market around them. You see if the price looks high, fair or low."
              bullets={[
                'Tracks price cuts and days on market',
                'Compares to nearby sales and listings',
                'Helps you negotiate with facts',
              ]}
            />
            <FeatureCard
              eyebrow="Time"
              title="Save weeks of back and forth"
              body="See missing paperwork early. Don’t waste time chasing homes that can’t close cleanly."
              bullets={[
                'Shows what is missing',
                'Highlights what needs checking',
                'Keeps a clear paper trail',
              ]}
            />
            <FeatureCard
              eyebrow="Risk"
              title="Avoid problems that don’t show in photos"
              body="Noise, access, legal issues and resale killers. The stuff you find out too late."
              bullets={[
                'Flags common resale risks',
                'Shows where the info came from',
                'Built to stay honest under pressure',
              ]}
            />
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint={`${cities.length} cities tracked`}>Explore cities</SectionLabel>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.09),transparent_60%)]" />
            </div>
            <div className="relative">
              <CityCardsVirtualizedClient cities={cities as any} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Pillar title="Global" body="Built for different countries, currencies and rules." />
            <Pillar title="Liquidity" body="A feel for how fast homes move, not just what they cost." />
            <Pillar title="Confidence" body="The more proof we have, the tighter the call." />
          </div>
        </section>
      </div>
    </Shell>
  );
}
