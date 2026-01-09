// src/components/home/HomePage.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import SafeImage from './SafeImage';
import type { City } from './cities';
import { CITIES } from './cities';

import PageShell from '@/components/layout/PageShell';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
      <span className="h-px w-6 bg-white/10" />
      <span>{children}</span>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: ReactNode;
  tone?: 'default' | 'good' | 'warn';
}) {
  const valueClass =
    tone === 'good'
      ? 'text-emerald-200'
      : tone === 'warn'
        ? 'text-amber-200'
        : 'text-zinc-100';

  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-300">{body}</div>
    </div>
  );
}

function safeAlt(city: City) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

function NodeRow({ city }: { city: City }) {
  const src = city.image?.src?.trim() ?? '';
  const nodeId = `LOCUS:${city.slug.toUpperCase()}`;

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-white/20"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(city)}
            fill
            sizes="48px"
            className="object-cover opacity-90 transition group-hover:opacity-100"
            fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-semibold text-zinc-100">
            {city.name}
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200 transition group-hover:border-white/20">
            Enter →
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="truncate">
            {city.country}
            {city.region ? ` · ${city.region}` : ''}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
            {nodeId}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-100">
            Market node
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
            Signals: initializing
          </span>
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-100">
            Liquidity model: pending
          </span>
        </div>
      </div>
    </Link>
  );
}

function HomeHero({
  regionCount,
  timezoneCount,
}: {
  regionCount: number;
  timezoneCount: number;
}) {
  const topNodes = CITIES.slice(0, 3);

  return (
    <section className="relative mt-6 sm:mt-12 pb-8 sm:pb-14">
      {/* Full-bleed background layer */}
      <div className="pointer-events-none absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute left-1/2 top-[-240px] h-[620px] w-[1500px] -translate-x-1/2 rounded-full bg-emerald-500/14 blur-[170px]" />
        <div className="absolute right-[-280px] top-[110px] h-[560px] w-[560px] rounded-full bg-violet-500/14 blur-[150px]" />
        <div className="absolute left-[-260px] top-[220px] h-[460px] w-[460px] rounded-full bg-sky-500/10 blur-[150px]" />

        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:76px_76px]" />

        <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_6%,rgba(0,0,0,0),rgba(0,0,0,0.42)_65%,rgba(0,0,0,0.82)_100%)]" />

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
              <span>The system is loyal to reality, not participants</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              <span className="text-zinc-50">Real estate,</span>
              <br />
              <span className="text-zinc-100">stripped of fiction.</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-200/90 sm:text-lg">
              Locus is a buyer-first intelligence layer. It models value,
              liquidity, and pressure - without incentives, listings, or
              negotiation theatre.
            </p>

            <div className="mt-7 max-w-xl rounded-3xl border border-white/20 bg-black/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <CitySearch />
            </div>

            <div className="mt-4 max-w-xl text-xs leading-relaxed text-zinc-500">
              Start with a city. Open its market surface. Truth layers activate
              city by city.
            </div>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Truth labs" value={CITIES.length} />
              <Metric label="Regions" value={regionCount} />
              <Metric label="Timezones" value={timezoneCount} />
              <Metric label="Status" value="Live" tone="good" />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Value, not asking price"
                body="We model market reality, not marketing. Buyers get leverage, not noise."
              />
              <FeatureCard
                title="Probability, not promises"
                body="Truth surfaces express outcomes like time-to-sell and pricing pressure. Not optimism."
              />
              <FeatureCard
                title="Intent replaces search"
                body="Buyers ask for safety, upside, schools, and timing. The system returns candidates and strategy."
              />
              <FeatureCard
                title="Anti-gaming by design"
                body="Truth layers are locked. No paid boosts, no suppression. Outputs change only when reality changes."
              />
            </div>
          </div>

          {/* RIGHT - FIXED */}
          <div className="lg:col-span-5">
            <SectionLabel>Start here</SectionLabel>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-100">
                    Open a market node
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                    Compact surfaces, not portal cards. Enter a city to see its truth layers and coverage state.
                  </div>
                </div>

                <Link
                  href="#explore"
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:border-white/20"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {topNodes.map((c) => (
                  <NodeRow key={c.slug} city={c} />
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-zinc-500">
                Signals are placeholders until verified. No numbers until coverage is real.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <PageShell fullBleedHero={<HomeHero regionCount={regionCount} timezoneCount={timezoneCount} />}>
      {/* EXPLORE */}
      <section id="explore" className="mt-16">
        <SectionLabel>Global truth labs</SectionLabel>
        <div className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-300">
          This is the map layer foundation. City pages become the on-ramp for
          buyers to explore truth-first intelligence, and later the on-ramp for
          agents to distribute it on their own sites.
        </div>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* ROUTES */}
      <section className="mt-16">
        <SectionLabel>Curated routes</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="text-sm font-semibold text-zinc-100">
              Capital signal
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              Major capitals and their surrounding pressure zones.
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="text-sm font-semibold text-zinc-100">
              Coastal demand
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              Sea-adjacent markets where liquidity can flip fast.
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="text-sm font-semibold text-zinc-100">
              Always-on cities
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              24/7 hubs where market activity never fully sleeps.
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="text-sm font-semibold text-zinc-100">
              Growth vectors
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              Talent inflows, infrastructure, and compounding demand.
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
