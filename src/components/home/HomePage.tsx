// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

type TrustLogo = {
  name: string;
  src: string;
  href: string;
};

const TRUST_LOGOS: TrustLogo[] = [
  { name: "Sotheby's International Realty", src: '/brands/sothebys.svg', href: 'https://www.sothebysrealty.com' },
  { name: "Christie's International Real Estate", src: '/brands/christies.svg', href: 'https://www.christiesrealestate.com' },
  { name: 'Knight Frank', src: '/brands/knightfrank.svg', href: 'https://www.knightfrank.com' },
  { name: 'Engel & Völkers', src: '/brands/engel-volkers.svg', href: 'https://www.engelvoelkers.com' },
  { name: 'BARNES', src: '/brands/barnes.svg', href: 'https://www.barnes-international.com' },
  { name: 'Coldwell Banker Global Luxury', src: '/brands/coldwell.svg', href: 'https://www.coldwellbankerluxury.com' },
  { name: 'Savills', src: '/brands/savills.svg', href: 'https://www.savills.com' },
  { name: 'JLL', src: '/brands/jll.svg', href: 'https://www.jll.com' },
  { name: 'CBRE', src: '/brands/cbre.svg', href: 'https://www.cbre.com' },
  { name: 'Douglas Elliman', src: '/brands/douglas-elliman.svg', href: 'https://www.elliman.com' },
  { name: 'Compass', src: '/brands/compass.svg', href: 'https://www.compass.com' },
  { name: 'Corcoran', src: '/brands/corcoran.svg', href: 'https://www.corcoran.com' },
  { name: 'Century 21', src: '/brands/century21.svg', href: 'https://www.century21.com' },
  { name: 'RE/MAX', src: '/brands/remax.svg', href: 'https://www.remax.com' },
  { name: 'Berkshire Hathaway HomeServices', src: '/brands/bhhs.svg', href: 'https://www.bhhs.com' },
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0B0E13] text-zinc-100">
      {/* Ambient: quieter, more expensive (less gold, more graphite/ivory) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[620px] w-[1080px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_62%)] blur-2xl" />
        <div className="absolute -top-24 right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.14),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-260px] left-[-260px] h-[740px] w-[740px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.82))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:26px_26px]" />
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

function HeroShine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-[vanteraPulse_14s_ease-in-out_infinite]">
        <div className="absolute -top-28 left-1/2 h-[620px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_62%)] blur-2xl" />
        <div className="absolute -top-16 right-[-280px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-240px] left-[-240px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.12),transparent_60%)] blur-2xl" />
      </div>

      <div className="absolute inset-0 animate-[vanteraSweep_10s_ease-in-out_infinite] opacity-25 [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_62%)]" />

      <div className="absolute right-[-80px] top-[-70px] opacity-[0.05] blur-[0.2px]">
        <Image src="/brand/vantera-logo-dark.png" alt="" width={560} height={180} className="w-[560px]" />
      </div>
    </div>
  );
}

function HeroVideo() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="h-full w-full object-cover opacity-[0.55]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/vantera-hero.jpg"
      >
        <source src="/hero/vantera-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.40),rgba(0,0,0,0.72))]" />
      <div className="absolute inset-0 [background:radial-gradient(1200px_520px_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="absolute inset-0 [background:radial-gradient(900px_420px_at_15%_20%,rgba(120,76,255,0.14),transparent_55%)] opacity-70" />
      <div className="absolute inset-0 [background:radial-gradient(900px_420px_at_85%_25%,rgba(62,196,255,0.10),transparent_55%)] opacity-70" />

      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.65)_1px,transparent_0)] [background-size:18px_18px]" />
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

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO - FULL BLEED (edge to edge) */}
      <section className="relative w-full pb-12 pt-12 sm:pb-16 sm:pt-14">
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.040),rgba(255,255,255,0.012),rgba(0,0,0,0.66))] shadow-[0_55px_150px_rgba(0,0,0,0.72)]">
          <HeroVideo />
          <HeroShine />

          {/* IMPORTANT CHANGE:
              - removed mx-auto + max-w-7xl limiter
              - content can now span the entire viewport width */}
          <div className="relative w-full px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20 2xl:px-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] text-zinc-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                  <span className="tracking-wide text-zinc-200">Private index</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Live</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Signal over noise</span>
                </div>

                <h1 className="mt-7 text-balance text-4xl font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Private intelligence for the world’s{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78),rgba(120,76,255,0.70))] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.10)]">
                    most valuable assets
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise.
                  <span className="text-zinc-500"> Built for clarity today. Designed for truth tomorrow.</span>
                </p>

                <div className="mt-7 max-w-2xl">
                  <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] shadow-[0_28px_90px_rgba(0,0,0,0.62)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_22%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.09),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="relative px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">COMMAND</div>
                          <div className="mt-1 text-xs text-zinc-500">Search a city and open its intelligence surface.</div>
                        </div>

                        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300 sm:inline-flex">
                          Press <span className="font-mono text-zinc-100">/</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <CitySearch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 max-w-2xl">
                  <SignalStrip
                    left={[
                      { k: 'COVERAGE', v: <span className="text-zinc-100">{CITIES.length} cities</span> },
                      { k: 'REGIONS', v: <span className="text-zinc-100">{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span className="text-zinc-100">{timezoneCount}</span> },
                    ]}
                    right={[{ k: 'STATUS', v: <span className="text-zinc-100">LIVE</span> }]}
                  />
                </div>

                <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <Pillar title="Signal" body="Market context designed to cut through noise." />
                  <Pillar title="Verification" body="Truth layers activate as coverage becomes real." />
                  <Pillar title="Coverage" body="A private index of the cities that matter." />
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/22 p-5 shadow-[0_42px_130px_rgba(0,0,0,0.70)] sm:p-6">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_35%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_90%_20%,rgba(120,76,255,0.10),transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <SectionLabel hint="Private index">Selected cities</SectionLabel>

                    <CityCardsClient cities={CITIES.slice(0, 4)} columns="grid gap-4 grid-cols-1 sm:grid-cols-2" />

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
                      Curated entry points.
                      <span className="text-zinc-500"> Intelligence expands as the system evolves.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                    <div className="text-[11px] tracking-[0.18em] text-zinc-400">SIGNAL</div>
                    <div className="mt-2 text-zinc-200">Truth-first city intelligence</div>
                    <div className="mt-1 text-xs text-zinc-500">Designed to host verified data, not speculation.</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                    <div className="text-[11px] tracking-[0.18em] text-zinc-400">ACCESS</div>
                    <div className="mt-2 text-zinc-200">Open a city in seconds</div>
                    <div className="mt-1 text-xs text-zinc-500">Immediate context. No friction.</div>
                  </div>
                </div>
              </div>
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
        <section className="mt-10 sm:mt-12">
          <SectionLabel hint={`${CITIES.length} cities tracked`}>Explore the index</SectionLabel>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
            </div>
            <div className="relative">
              <CityCardsClient cities={CITIES} />
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Curated lanes">Curated routes</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'European capitals', subtitle: 'Strategic centers of influence' },
              { title: 'Coastal cities', subtitle: 'Lifestyle-driven value' },
              { title: '24-hour cities', subtitle: 'Always-on markets' },
              { title: 'High-growth hubs', subtitle: 'Emerging signal density' },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-zinc-200 shadow-[0_22px_60px_rgba(0,0,0,0.50)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_180px_at_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="relative">
                  <div className="text-[11px] tracking-[0.18em] text-zinc-400">FEATURED</div>
                  <div className="mt-2 font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
