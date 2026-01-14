// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense, type ReactNode } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import FeaturedIntelligencePanel from './FeaturedIntelligencePanel';
import CityCardsVirtualizedClient from './CityCardsVirtualizedClient';
import MarketBriefing from './MarketBriefing';

import IntentHero from './IntentHero';
import WorldSearchHero from './WorldSearchHero';

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

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#070A10] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[720px] w-[1180px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_62%)] blur-2xl" />
        <div className="absolute -top-28 right-[-240px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.14),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-300px] left-[-300px] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.92))]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:28px_28px]" />
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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function SectionLabel({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.30em] text-zinc-400">
          {String(children).toUpperCase()}
        </div>
        <div className="mt-2 h-px w-28 bg-gradient-to-r from-[#E7C982]/26 via-white/10 to-transparent" />
      </div>

      {hint ? (
        <div className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function RoyalPortalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.92))]" />

      <div className="absolute inset-0 opacity-[0.70]">
        <div className="vantera-float-a absolute -left-[22%] top-[-26%] h-[560px] w-[980px] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.20),transparent_60%)]" />
        <div className="vantera-float-b absolute -right-[26%] top-[-20%] h-[560px] w-[1020px] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.14),transparent_62%)]" />
        <div className="vantera-float-c absolute left-[8%] bottom-[-38%] h-[760px] w-[1220px] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.14),transparent_60%)]" />
      </div>

      <div className="vantera-sweep absolute inset-0 opacity-[0.16] mix-blend-screen [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.20)_45%,transparent_62%)]" />

      <div className="absolute inset-0 [background:radial-gradient(1200px_520px_at_50%_18%,transparent_36%,rgba(0,0,0,0.88)_78%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#070A10]" />
    </div>
  );
}

/**
 * JamesEdition-style hero media:
 * - video when allowed
 * - image fallback
 * - reduced-motion hides video
 *
 * Place your assets in /public/hero/
 * - /hero/vantera-hero.mp4
 * - /hero/vantera-hero.jpg (poster)
 * - optional: /hero/vantera-hero-2.jpg for a richer still
 */
function HeroMedia() {
  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
      {/* Still image foundation */}
      <div className="absolute inset-0">
        <Image
          src="/hero/vantera-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.92]"
        />
        {/* Optional secondary still for depth (if file exists). If not, it will 404 in dev - remove if you do not add it. */}
        <div className="absolute inset-0 opacity-[0.45]">
          <Image
            src="/hero/vantera-hero-2.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Video overlay (disabled for reduced motion) */}
      <video
        className={cx(
          'absolute inset-0 h-full w-full object-cover opacity-[0.62]',
          'motion-reduce:hidden',
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/vantera-hero.jpg"
      >
        <source src="/hero/vantera-hero.mp4" type="video/mp4" />
      </video>

      {/* Cinematic grading */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,0,0.34),rgba(0,0,0,0.62))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.90))]" />
      <div className="absolute inset-0 [background:radial-gradient(900px_420px_at_50%_-10%,rgba(255,255,255,0.12),transparent_60%)]" />
    </div>
  );
}

function HeroGoldCrown() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      <div className="mx-auto mt-2 h-px w-[92%] bg-gradient-to-r from-transparent via-[#E7C982]/38 to-transparent" />
      <div className="mx-auto mt-1 h-px w-[82%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto mt-7 h-px w-[58%] bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
    </div>
  );
}

function PremiumBadgeRow() {
  // Calmer, JamesEdition-ish: one clean line, not 5 tags.
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] text-zinc-200 backdrop-blur-2xl">
      <span className="h-1.5 w-1.5 rounded-full bg-[#E7C982]/90 shadow-[0_0_0_3px_rgba(231,201,130,0.12)]" />
      <span className="tracking-wide text-zinc-200">Private intelligence</span>
      <span className="text-zinc-600">·</span>
      <span className="text-zinc-300">Luxury real estate</span>
      <span className="text-zinc-600">·</span>
      <span className="text-zinc-300">Truth-first verification</span>
    </div>
  );
}

function SignalStrip({
  items,
}: {
  items: Array<{ k: string; v: ReactNode; hint?: string }>;
}) {
  // Keep, but calmer and more "index-like".
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.07),transparent_60%)]" />
      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-5">
        {items.map((x) => (
          <div key={x.k} className="flex items-baseline gap-2">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{x.k}</div>
            <div className="text-sm text-zinc-100">{x.v}</div>
            {x.hint ? (
              <span className="ml-1 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] text-zinc-400">
                {x.hint}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-200 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition hover:translate-y-[-2px] hover:border-white/14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_180px_at_20%,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
      <div className="relative">
        <div className="text-[11px] tracking-[0.18em] text-zinc-400">{title.toUpperCase()}</div>
        <div className="mt-2 text-zinc-200">{body}</div>
      </div>
    </div>
  );
}

function TruthCardReport() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 shadow-[0_42px_130px_rgba(0,0,0,0.70)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(255,255,255,0.06),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_90%_10%,rgba(120,76,255,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">TRUTH CARD</div>
            <div className="mt-2 text-lg font-medium text-zinc-100">Confidential property report</div>
            <div className="mt-1 text-sm text-zinc-300">
              The facts, the risks and what to verify next - in one page.
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-300">
            Preview
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { k: 'Ownership', v: 'Looks clear', note: 'No obvious conflicts found' },
            { k: 'Permits', v: 'Needs review', note: 'One document missing' },
            { k: 'Price check', v: 'High', note: 'Above similar homes nearby' },
            { k: 'Liquidity', v: 'Normal', note: 'Demand looks steady' },
            { k: 'Risk radar', v: 'Low', note: 'Noise and access look ok' },
            { k: 'Evidence', v: '3 sources', note: 'Registry, docs, on-site' },
          ].map((row) => (
            <div key={row.k} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[10px] font-semibold tracking-[0.24em] text-zinc-500">
                  {row.k.toUpperCase()}
                </div>
                <div className="text-sm text-zinc-100">{row.v}</div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">{row.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[12px] text-zinc-300">
          Listings sell the dream. This protects the decision.
        </div>
      </div>
    </div>
  );
}

function PortalVsTruth() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="relative">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">PORTALS</div>
          <div className="mt-2 text-lg font-medium text-zinc-100">Beauty-first browsing</div>
          <div className="mt-2 text-sm text-zinc-300">
            Photos, lifestyle and sales copy. Great for inspiration, weak for decisions.
          </div>
          <div className="mt-4 grid gap-2">
            {['Looks amazing', 'Easy to scroll', 'Hard to verify'].map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-zinc-200">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/30 p-5 shadow-[0_42px_130px_rgba(0,0,0,0.70)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_300px_at_90%_10%,rgba(120,76,255,0.10),transparent_62%)]" />
        <div className="relative">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">VANTERA</div>
          <div className="mt-2 text-lg font-medium text-zinc-100">Truth-first intelligence</div>
          <div className="mt-2 text-sm text-zinc-300">
            Paperwork, price reality and risk flags - presented like a private report.
          </div>
          <div className="mt-4 grid gap-2">
            {['Shows what is missing', 'Checks the price story', 'Protects resale value'].map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] text-zinc-200">
                {t}
              </div>
            ))}
          </div>
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
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6 transition hover:translate-y-[-2px] hover:border-white/14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
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
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#E7C982]/85 shadow-[0_0_0_4px_rgba(231,201,130,0.10)]" />
              <span className="text-zinc-200">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTA() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 shadow-[0_42px_130px_rgba(0,0,0,0.70)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_320px_at_22%_0%,rgba(255,255,255,0.06),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_88%_18%,rgba(120,76,255,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
      </div>

      <div className="relative grid gap-6 p-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">PRIVATE LAUNCH</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">The portal that protects the decision</div>
          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Vantera is building the intelligence layer luxury real estate never had. A quiet system that makes buyers smarter, sellers cleaner and advisors faster.
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-zinc-200">
            {['Buyers', 'Sellers', 'Advisors', 'Developers'].map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">STATUS</div>
                <div className="mt-1 text-sm text-zinc-200">Private build, expanding coverage</div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300">
                Coming soon
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { k: 'Truth Cards', v: 'In progress' },
                { k: 'Private listings', v: 'Phase 1' },
                { k: 'Permit checks', v: 'Phase 2' },
                { k: 'Price models', v: 'Phase 2' },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{x.k.toUpperCase()}</div>
                  <div className="mt-1 text-sm text-zinc-100">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              For now: explore coverage, open city intelligence and use the property search to jump straight into results.
            </div>
          </div>
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
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-black/40 shadow-[0_55px_160px_rgba(0,0,0,0.78)]">
          <HeroMedia />
          <RoyalPortalBackdrop />
          <HeroGoldCrown />

          <div className="relative w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-20 2xl:px-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <PremiumBadgeRow />

                <h1 className="mt-6 text-balance text-[40px] font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Private intelligence for the world&apos;s{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78),rgba(231,201,130,0.55),rgba(120,76,255,0.68))] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(231,201,130,0.10)]">
                    most valuable assets
                  </span>
                </h1>

                <p className="mt-4 max-w-[860px] text-pretty text-[15px] leading-relaxed text-zinc-300 sm:text-lg">
                  Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise.
                  <span className="text-zinc-500"> Built to model value, liquidity and risk without theatre.</span>
                </p>

                {/* Property search */}
                <div className="mt-6 max-w-[980px] lg:max-w-[1120px]">
                  <WorldSearchHero cities={cities as any} onKeepScanningId="explore-index" />
                </div>

                {/* Intent console */}
                <div className="mt-4 max-w-[980px] lg:max-w-[1120px]">
                  <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
                </div>

                <div className="mt-4 max-w-[980px] lg:max-w-[1120px]">
                  <SignalStrip
                    items={[
                      { k: 'COVERAGE', v: <span className="text-zinc-100">{cities.length} cities</span> },
                      { k: 'REGIONS', v: <span className="text-zinc-100">{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span className="text-zinc-100">{timezoneCount}</span> },
                      { k: 'UPDATES', v: <span className="text-zinc-100">Live</span>, hint: 'private index' },
                      { k: 'PROOF', v: <span className="text-zinc-100">Registry + docs</span> },
                    ]}
                  />
                </div>

                <div className="mt-4 grid max-w-[980px] gap-3 sm:grid-cols-3 lg:max-w-[1120px]">
                  <Pillar title="Paperwork" body="See what is missing before you waste time." />
                  <Pillar title="Price reality" body="Spot fantasy pricing in seconds." />
                  <Pillar title="Risk radar" body="Catch resale killers early." />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4 lg:col-span-5">
                <CityCardsVirtualizedClient cities={cities as any} mode="featured" />
                <TruthCardReport />
              </div>
            </div>

            <div className="mt-10">
              <SectionLabel hint="This is why we sit above luxury portals">Portal vs intelligence</SectionLabel>
              <PortalVsTruth />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#070A10]" />
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
          <SectionLabel hint="Believable, not fake listings">Featured intelligence</SectionLabel>
          <FeaturedIntelligencePanel />
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Plain language, high precision">Why Vantera wins</SectionLabel>

          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureCard
              eyebrow="Truth-first"
              title="Pricing without illusions"
              body="Asking price is a starting point. Vantera models fair value from market signals and penalises fantasy listings."
              bullets={['Tracks velocity and reductions', 'Separates value from persuasion', 'Protects buyers from regret']}
            />
            <FeatureCard
              eyebrow="Verification"
              title="Permits, ownership and risk flags"
              body="Luxury buyers deserve certainty. Vantera highlights what is missing, what is inconsistent and what must be verified next."
              bullets={['Turns paperwork into plain language', 'Surfaces missing documents fast', 'Flags resale killers early']}
            />
            <FeatureCard
              eyebrow="Liquidity"
              title="A private read on demand"
              body="Vantera watches the market behaviour that matters: what sells, what stalls and what the next buyer will pay for."
              bullets={['Demand signals over hype', 'Comparables that match reality', 'Designed for advisors and sellers']}
            />
          </div>
        </section>

        <section id="explore-index" className="mt-14 scroll-mt-24 sm:mt-16">
          <SectionLabel hint="Coverage that feels alive">Explore the index</SectionLabel>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/16 to-transparent" />
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">CITIES</div>
                <div className="mt-2 text-lg font-medium text-zinc-100">Browse coverage with signal</div>
                <div className="mt-1 text-sm text-zinc-300">
                  Fast scan for where value is forming, where risk is hiding and where liquidity is strongest.
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="relative mt-6">
              <CityCardsVirtualizedClient cities={cities as any} showFeatured={false} />
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <CTA />
        </section>
      </div>
    </Shell>
  );
}
