// src/components/home/HomePage.tsx
import Image from 'next/image';
import { Suspense } from 'react';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import TrustMarquee from '@/components/trust/TrustMarquee';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

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
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.44),rgba(0,0,0,0.78))]" />
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
      {/* quiet top halo */}
      <div className="absolute -top-32 left-1/2 h-[620px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_62%)] blur-2xl" />
      {/* violet + cyan bloom */}
      <div className="absolute -top-16 right-[-280px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.18),transparent_62%)] blur-2xl" />
      <div className="absolute bottom-[-240px] left-[-240px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.13),transparent_60%)] blur-2xl" />

      {/* premium sheen (static but expensive) */}
      <div className="absolute inset-0 opacity-30 [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.10)_45%,transparent_62%)]" />

      {/* ghost mark */}
      <div className="absolute right-[-90px] top-[-70px] opacity-[0.05] blur-[0.2px]">
        <Image
          src="/brand/vantera-logo-dark.png"
          alt=""
          width={560}
          height={180}
          className="w-[560px]"
        />
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

function MockListing({
  title,
  location,
  price,
  metaLeft,
  metaRight,
  signal,
}: {
  title: string;
  location: string;
  price: string;
  metaLeft: string;
  metaRight: string;
  signal: { k: string; v: string; tone?: 'good' | 'warn' | 'neutral' };
}) {
  const tone =
    signal.tone === 'good'
      ? 'bg-emerald-400/15 text-emerald-200 border-emerald-300/20'
      : signal.tone === 'warn'
      ? 'bg-amber-400/15 text-amber-200 border-amber-300/20'
      : 'bg-white/[0.04] text-zinc-200 border-white/10';

  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] shadow-[0_34px_110px_rgba(0,0,0,0.55)] transition hover:translate-y-[-2px] hover:border-white/14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-75 [background:radial-gradient(900px_300px_at_25%_10%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(900px_300px_at_85%_20%,rgba(120,76,255,0.10),transparent_60%)]" />
      </div>

      <div className="relative h-44 overflow-hidden sm:h-48">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(0,0,0,0.35))]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.85)_1px,transparent_0)] [background-size:16px_16px]" />
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.22),transparent_62%)] blur-2xl" />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-zinc-200">
          Featured
        </div>
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-zinc-100">{title}</div>
            <div className="mt-1 text-xs text-zinc-400">{location}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-zinc-50">{price}</div>
            <div className="mt-1 text-[11px] text-zinc-500">Indicative</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">PROPERTY DNA</div>
            <div className="mt-1 text-[12px] text-zinc-200">{metaLeft}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">LIQUIDITY</div>
            <div className="mt-1 text-[12px] text-zinc-200">{metaRight}</div>
          </div>
        </div>

        <div className={`mt-3 flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-[12px] ${tone}`}>
          <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{signal.k}</div>
          <div className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px]">{signal.v}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">Signal over noise</div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 transition group-hover:bg-white/[0.06]">
            View details
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO - full bleed, mobile-first */}
      <section className="relative w-full pb-10 pt-8 sm:pb-14 sm:pt-10">
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.040),rgba(255,255,255,0.012),rgba(0,0,0,0.66))] shadow-[0_55px_150px_rgba(0,0,0,0.72)]">
          <HeroVideo />
          <HeroShine />

          <div className="relative w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-20 2xl:px-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] text-zinc-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
                  <span className="tracking-wide text-zinc-200">Luxury property portal</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Truth-first intelligence</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Signal over noise</span>
                </div>

                {/* Stronger subheadline */}
                <h1 className="mt-6 text-balance text-[40px] font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Private intelligence for the world&apos;s{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78),rgba(120,76,255,0.70))] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.10)]">
                    most valuable assets
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-zinc-300 sm:text-lg">
                  Vantera is a quiet intelligence surface for buyers, sellers and advisors who value signal over noise.
                  <span className="text-zinc-500"> Built to model value, liquidity and risk without theatre.</span>
                </p>

                {/* Search terminal card */}
                <div className="mt-6 max-w-2xl">
                  <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] shadow-[0_28px_90px_rgba(0,0,0,0.62)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_22%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="relative px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SEARCH</div>
                          <div className="mt-1 text-xs text-zinc-500">
                            Start with a city. Then open the home&apos;s intelligence.
                          </div>
                        </div>

                        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300 sm:inline-flex">
                          Press <span className="font-mono text-zinc-100">/</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {/* CitySearch already includes its own UI - this wrapper makes it feel terminal-grade */}
                        <div className="rounded-2xl border border-white/10 bg-black/35 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                          <CitySearch />
                        </div>
                      </div>

                      {/* Bridge line */}
                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-[12px] text-zinc-300">
                        Browse homes, then open their intelligence - value, liquidity, risk and leverage in seconds.
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/28 px-3 py-2">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">EXAMPLE</div>
                          <div className="mt-1 font-mono text-[12px] text-zinc-200">
                            SAFE • UNDERVALUED • UPSIDE
                          </div>
                          <div className="mt-1 text-[12px] text-zinc-400">
                            Near schools, strong demand, 5-year lift.
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/28 px-3 py-2">
                          <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">YOU GET</div>
                          <div className="mt-1 text-[12px] text-zinc-200">Homes, timing guidance and leverage clarity</div>
                          <div className="mt-1 text-[12px] text-zinc-400">A truth layer you can act on.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 max-w-2xl">
                  <SignalStrip
                    left={[
                      { k: 'COVERAGE', v: <span className="text-zinc-100">{CITIES.length} cities</span> },
                      { k: 'REGIONS', v: <span className="text-zinc-100">{regionCount}</span> },
                      { k: 'TIMEZONES', v: <span className="text-zinc-100">{timezoneCount}</span> },
                    ]}
                    right={[{ k: 'MODE', v: <span className="text-zinc-100">TRUTH-FIRST</span> }]}
                  />
                </div>

                {/* Sharpened pills copy */}
                <div className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <Pillar title="Reality" body="Fair value is modelled from signals, not asking prices." />
                  <Pillar title="Liquidity" body="We estimate time-to-sell and what is driving it." />
                  <Pillar title="Integrity" body="Anti-gaming rules keep the surface loyal to reality." />
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
                    <SectionLabel hint="Private index">Selected cities</SectionLabel>

                    {/* iPhone-perfect: 1 col, then 2 col */}
                    <CityCardsClient
                      cities={CITIES.slice(0, 4)}
                      columns="grid gap-4 grid-cols-1 sm:grid-cols-2"
                    />

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
                      Curated entry points.
                      <span className="text-zinc-500"> Coverage expands as the index becomes real.</span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                        <div className="text-[11px] tracking-[0.18em] text-zinc-400">TRUTH CARD</div>
                        <div className="mt-2 text-zinc-200">Value, risk and leverage</div>
                        <div className="mt-1 text-xs text-zinc-500">A universal intelligence layer per home.</div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                        <div className="text-[11px] tracking-[0.18em] text-zinc-400">CONFIDENCE</div>
                        <div className="mt-2 text-zinc-200">Probability over promises</div>
                        <div className="mt-1 text-xs text-zinc-500">Clarity that stays honest under pressure.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">THE DIFFERENCE</div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                    Most portals optimise for attention. Vantera optimises for outcomes by modelling value, liquidity and
                    incentives without bias.
                  </div>

                  <div className="mt-4 grid gap-2">
                    {[
                      'Understands intent, not filters',
                      'Understands value, not asking price',
                      'Understands probability, not promises',
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

                {/* Micro wow: a subtle "live preview" strip */}
                <div className="mt-4 rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">LIVE PREVIEW</div>
                      <div className="mt-2 text-sm text-zinc-300">
                        The same home looks different once you can see its incentives.
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300">
                      Private
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">VALUE BAND</div>
                      <div className="mt-2 text-zinc-200">Tight</div>
                      <div className="mt-1 text-xs text-zinc-500">Little room for theatre.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">LIQUIDITY</div>
                      <div className="mt-2 text-zinc-200">Fast</div>
                      <div className="mt-1 text-xs text-zinc-500">Deep buyer pool, high velocity.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* fade into page */}
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
        {/* Featured properties */}
        <section className="mt-10 sm:mt-12">
          <SectionLabel hint="Editorial selection">Featured properties</SectionLabel>

          <div className="grid gap-4 lg:grid-cols-3">
            <MockListing
              title="Architect’s sea-view villa"
              location="Coastal micro-market, prime zone"
              price="€4.95M"
              metaLeft="Fair value band: tight"
              metaRight="High demand, fast velocity"
              signal={{ k: 'PRICE REALISM', v: 'Fairly priced', tone: 'good' }}
            />
            <MockListing
              title="Penthouse, legacy address"
              location="Capital district, landmark proximity"
              price="€7.40M"
              metaLeft="Value uplift potential: strong"
              metaRight="Buyer pool: selective"
              signal={{ k: 'NEGOTIATION', v: 'Moderate leverage', tone: 'neutral' }}
            />
            <MockListing
              title="Hillside estate with privacy"
              location="Low supply pocket, long holds"
              price="€12.80M"
              metaLeft="Risk flags: low"
              metaRight="Time-to-sell: extended"
              signal={{ k: 'LIQUIDITY', v: 'May sit longer', tone: 'warn' }}
            />
          </div>

          <div className="mt-4 rounded-[26px] border border-white/10 bg-white/[0.02] p-5 text-sm text-zinc-300 shadow-[0_30px_95px_rgba(0,0,0,0.50)]">
            Vantera doesn’t just show homes.
            <span className="text-zinc-500"> It shows value, liquidity and risk in plain language.</span>
          </div>
        </section>

        {/* Why Vantera wins */}
        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Plain-language intelligence">Why Vantera wins</SectionLabel>

          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureCard
              eyebrow="Truth-first"
              title="Pricing without illusions"
              body="Asking price is a starting point. Vantera models fair value from market signals and penalises fantasy listings."
              bullets={[
                'Tracks velocity and reductions',
                'Separates value from persuasion',
                'Protects both sides from bad pricing',
              ]}
            />
            <FeatureCard
              eyebrow="AI-native"
              title="Intent-based matching"
              body="Forget filters. Describe what you want. Vantera returns homes, timing guidance and the smartest next move."
              bullets={['Understands intent, not checkboxes', 'Suggests strategy, not just options', 'Gives wait-or-buy clarity']}
            />
            <FeatureCard
              eyebrow="Integrity"
              title="Anti-gaming by design"
              body="The truth layer is protected. Manipulation guards and audit trails keep the surface loyal to reality when incentives push the other way."
              bullets={['Detects coordinated distortions', 'Maintains an auditable history', 'Optimised for outcomes, not clicks']}
            />
          </div>
        </section>

        {/* City index */}
        <section className="mt-14 sm:mt-16">
          <SectionLabel hint={`${CITIES.length} cities tracked`}>Explore cities</SectionLabel>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.09),transparent_60%)]" />
            </div>
            <div className="relative">
              <CityCardsClient cities={CITIES} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Pillar title="Global-first" body="Multi-currency, multi-legal and multi-market reality built in." />
            <Pillar title="Liquidity clarity" body="Estimated time-to-sell and demand pressure, not wishful thinking." />
            <Pillar title="Confidence score" body="Confidence tightens as signal density improves." />
          </div>
        </section>

        {/* Curated routes */}
        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Curated lanes">Curated routes</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'European capitals', subtitle: 'Prime districts and resilient demand' },
              { title: 'Coastal living', subtitle: 'Lifestyle markets with real liquidity clarity' },
              { title: '24-hour cities', subtitle: 'Deep buyer pools and global connectivity' },
              { title: 'High-growth hubs', subtitle: 'Emerging signal density, measured honestly' },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-zinc-200 shadow-[0_22px_60px_rgba(0,0,0,0.50)] transition hover:translate-y-[-2px] hover:border-white/14"
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
