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
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

import { REGION_CLUSTERS } from './cities';

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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* GLOBAL BACKDROP - white editorial */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* warm paper bloom */}
        <div className="absolute -top-56 left-1/2 h-[760px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.26),transparent_62%)] blur-2xl" />
        {/* violet hint */}
        <div className="absolute -top-44 right-[-260px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14),transparent_62%)] blur-2xl" />
        {/* cool lift */}
        <div className="absolute bottom-[-320px] left-[-320px] h-[840px] w-[840px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_60%)] blur-2xl" />

        {/* subtle top-to-bottom editorial wash */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.035))]" />

        {/* micro-grain */}
        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      {/* PAGE */}
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

/* ---------- SignalStrip ---------- */

type SignalStripItem = {
  k: string;
  v: React.ReactNode;
  hint?: string;
};

function SignalStrip({ items }: { items: SignalStripItem[] }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[22px]',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.22),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-4 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.k}
            className={cx(
              'group relative overflow-hidden rounded-2xl',
              'border border-[color:var(--hairline)]',
              'bg-white/70',
              'px-3 py-2.5 sm:px-3.5 sm:py-3',
            )}
            title={it.hint ?? undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_20%_0%,rgba(231,201,130,0.22),transparent_60%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                  {it.k}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-[color:var(--ink)]">{it.v}</div>
              </div>

              {it.hint ? (
                <div className="ml-2 hidden shrink-0 rounded-full border border-[color:var(--hairline)] bg-white/70 px-2 py-1 text-[10px] tracking-[0.18em] text-[color:var(--ink-3)] sm:block">
                  INFO
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Pillar ---------- */

type PillarProps = {
  title: string;
  body: string;
};

function Pillar({ title, body }: PillarProps) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[22px] p-4',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_18px_46px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(520px_160px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[13px] font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>
      </div>
    </div>
  );
}

/* ---------- TruthCardReport ---------- */

function TruthCardReport() {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[26px]',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(700px_220px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_220px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
              TRUTH REPORT
            </div>
            <div className="mt-2 text-lg font-medium text-[color:var(--ink)]">Verification snapshot</div>
            <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">
              A quick read on pricing sanity, paperwork gaps and liquidity signals.
              <span className="text-[color:var(--ink-3)]"> Built to reduce regret.</span>
            </div>
          </div>

          <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/70 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">LIVE</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-[color:var(--hairline)] bg-white/70 p-4">
            <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
              WHAT YOU GET
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-[color:var(--ink-2)]">
              <li className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                Paperwork status in plain language
              </li>
              <li className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                Price reality checks vs market behaviour
              </li>
              <li className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                Risk flags that hurt resale
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-2)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-[color:var(--ink)]">Example output</div>
              <div className="text-[11px] text-[color:var(--ink-3)]">Preview</div>
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
              “Two permits missing. Asking price implies a 14% premium to local velocity. Liquidity is strongest in the
              €3m-€6m band this quarter.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SectionLabel ---------- */

function SectionLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
          {children}
        </div>
        {hint ? <div className="mt-1 text-sm text-[color:var(--ink-2)]">{hint}</div> : null}
      </div>

      <div className="hidden sm:block">
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
      </div>
    </div>
  );
}

/* ---------- PortalVsTruth ---------- */

function PortalVsTruth() {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[28px] p-5 sm:p-6',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-[color:var(--hairline)] bg-white/75 p-5">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
            LUXURY PORTALS
          </div>
          <div className="mt-2 text-lg font-medium text-[color:var(--ink)]">Beautiful inventory</div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Great for browsing, but vulnerable to presentation, persuasion and missing facts.
          </div>

          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.35)]" />
              Asking price leads the story
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.35)]" />
              Verification is often external
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.35)]" />
              Risk hides in the fine print
            </li>
          </ul>
        </div>

        <div className="rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface-2)] p-5">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">VANTERA</div>
          <div className="mt-2 text-lg font-medium text-[color:var(--ink)]">Quiet intelligence</div>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
            Built for signal: value, liquidity and risk, with verification-first outputs.
          </div>

          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-2)]">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              Fair value model, not theatre
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              Paperwork status surfaced early
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              Resale-killer risk flags
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- FeatureCard ---------- */

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
    <div
      className={cx(
        'relative overflow-hidden rounded-[26px] p-5 sm:p-6',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(720px_240px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)] uppercase">
          {eyebrow}
        </div>
        <div className="mt-2 text-lg font-medium text-[color:var(--ink)]">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</div>

        <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-2)]">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- CTA ---------- */

function CTA() {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[28px] p-6 sm:p-8',
        'border border-[color:var(--hairline)]',
        'bg-[color:var(--surface)] backdrop-blur-xl',
        'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_280px_at_20%_0%,rgba(231,201,130,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_280px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
      </div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">PRIVATE ACCESS</div>
          <div className="mt-2 text-xl font-medium text-[color:var(--ink)]">Bring a serious asset or a serious buyer</div>
          <div className="mt-2 max-w-[64ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
            Vantera is built for private sellers, advisors and agents who want verification, clarity and speed.
            <span className="text-[color:var(--ink-3)]"> Signal only.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/coming-soon?flow=sell"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
              'bg-[color:var(--surface-2)] hover:bg-white',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
              'text-[color:var(--ink)]',
            )}
          >
            Submit a private seller
          </a>

          <a
            href="/coming-soon?flow=agents"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
              'bg-white/70 hover:bg-white',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
              'text-[color:var(--ink)]',
            )}
          >
            Agent access
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- HOME PAGE ---------- */

export default function HomePage({ cities }: { cities: RuntimeCity[] }) {
  const regionCount = new Set(cities.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(cities.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO */}
      <section className="relative w-full pb-10 pt-8 sm:pb-14 sm:pt-10">
        <div
          className={cx(
            'relative w-full overflow-hidden',
            'border-y border-[color:var(--hairline)]',
            'bg-[color:var(--paper)]',
            'shadow-[0_30px_90px_rgba(11,12,16,0.10)]',
          )}
        >
          {/* Keep your existing portal media but run it as a subtle overlay on white */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply">
            <RoyalPortalBackdrop />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.20]">
            <HeroGoldCrown />
          </div>

          <div className="relative w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-20 2xl:px-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <PremiumBadgeRow />

                <h1 className="mt-6 text-balance text-[40px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Private intelligence for the world&apos;s{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(11,12,16,0.92),rgba(11,12,16,0.72),rgba(231,201,130,0.90),rgba(139,92,246,0.75))] bg-clip-text text-transparent">
                    most valuable assets
                  </span>
                </h1>

                <p className="mt-4 max-w-[860px] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise.
                  <span className="text-[color:var(--ink-3)]"> Built to model value, liquidity and risk without theatre.</span>
                </p>

                {/* OMNI SEARCH (PRIMARY) */}
                <div className="mt-6 max-w-[980px] lg:max-w-[1120px]">
                  <VanteraOmniSearch cities={cities as any} clusters={REGION_CLUSTERS as any} autoFocus={false} />
                </div>

                {/* Intent console (secondary layer) */}
                <div className="mt-4 max-w-[980px] lg:max-w-[1120px]">
                  <IntentHero cities={cities as any} defaultTop={6} onKeepScanningId="explore-index" />
                </div>

                <div className="mt-4 max-w-[980px] lg:max-w-[1120px]">
                  <SignalStrip
                    items={[
                      { k: 'COVERAGE', v: <span className="text-[color:var(--ink)]">{cities.length} cities</span> },
                      { k: 'REGIONS', v: <span className="text-[color:var(--ink)]">{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span className="text-[color:var(--ink)]">{timezoneCount}</span> },
                      { k: 'UPDATES', v: <span className="text-[color:var(--ink)]">Live</span>, hint: 'private index' },
                      { k: 'PROOF', v: <span className="text-[color:var(--ink)]">Registry + docs</span> },
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[color:var(--paper)]" />
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

          <div
            className={cx(
              'relative overflow-hidden rounded-[28px] p-4 sm:p-6',
              'border border-[color:var(--hairline)]',
              'bg-[color:var(--surface)] backdrop-blur-xl',
              'shadow-[0_24px_70px_rgba(11,12,16,0.10)]',
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(231,201,130,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(139,92,246,0.10),transparent_60%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">CITIES</div>
                <div className="mt-2 text-lg font-medium text-[color:var(--ink)]">Browse coverage with signal</div>
                <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                  Fast scan for where value is forming, where risk is hiding and where liquidity is strongest.
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-white/80">
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
