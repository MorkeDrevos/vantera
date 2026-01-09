'use client';

import type { ReactNode } from 'react';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient premium background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute top-24 left-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <div className="h-4 w-4 rounded-full bg-emerald-300/80" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-100">
                Locus
              </div>
              <div className="text-xs text-zinc-400">Truth-first real estate intelligence</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Buyer-first
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              No portal logic
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Reality over hype
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 text-xs text-zinc-500 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Locus</div>
            <div className="text-zinc-600">
              Early build. UI is live. Intelligence layers evolve city by city.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

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
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function FeatureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-300">{body}</div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO */}
      <section className="pt-6 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
              <span>The system is loyal to reality, not participants</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Real estate, stripped of fiction.
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
              Locus is a buyer-first intelligence layer. Start with a city truth lab, then expand.
              No portal games. No boosted listings. No incentive fog.
            </p>

            <div className="mt-7 max-w-xl">
              <CitySearch />
            </div>

            <div className="mt-4 max-w-xl text-xs leading-relaxed text-zinc-500">
              Tip: search a city, open its page, then explore the network. This is the foundation that later
              powers truth cards, value signals, and liquidity forecasts.
            </div>

            {/* METRICS */}
            <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Truth labs" value={CITIES.length} />
              <Metric label="Regions" value={regionCount} />
              <Metric label="Timezones" value={timezoneCount} />
              <Metric label="Status" value="Live" tone="good" />
            </div>

            {/* DIFFERENTIATION */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Value, not asking price"
                body="We are building systems that model real value and liquidity, not marketing. Buyers get leverage, not noise."
              />
              <FeatureCard
                title="Probability, not promises"
                body="Truth surfaces will express outcomes like time-to-sell and pricing pressure. Not agent optimism."
              />
              <FeatureCard
                title="Intent replaces search"
                body="Instead of filters, buyers ask for safety, upside, schools, walkability, and the system returns strategy and candidates."
              />
              <FeatureCard
                title="Anti-gaming by design"
                body="Truth layers are locked. No paid boosts, no suppression. The model updates when reality updates."
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5">
            <SectionLabel>Start here</SectionLabel>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-zinc-100">
                Open a city truth lab
              </div>
              <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                Each city page is a clean surface for real imagery, local time, and the scaffolding for intelligence layers.
                This becomes the distribution entry point for buyers and agents later.
              </div>

              <div className="mt-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Popular labs
                </div>
                <div className="mt-3">
                  <CityCardsClient cities={CITIES.slice(0, 4)} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-zinc-100">What comes next</div>
              <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                Truth cards for properties, market pressure signals, liquidity scoring, and negotiation leverage.
                Buyers see reality. Agents can distribute it, but never control it.
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
                  Reality check: overpricing index
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
                  Liquidity: time-to-sell forecast
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
                  Risk: legal and zoning flags
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="mt-16">
        <SectionLabel>Global truth labs</SectionLabel>
        <div className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-300">
          This is the map layer foundation. City pages become the on-ramp for buyers to explore truth-first intelligence,
          and later the on-ramp for agents to distribute it on their own sites.
        </div>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* ROUTES */}
      <section className="mt-16">
        <SectionLabel>Curated routes</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="text-sm font-semibold text-zinc-100">Capital signal</div>
            <div className="mt-2 text-sm text-zinc-300">
              Major capitals and their surrounding pressure zones.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="text-sm font-semibold text-zinc-100">Coastal demand</div>
            <div className="mt-2 text-sm text-zinc-300">
              Sea-adjacent markets where liquidity can flip fast.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="text-sm font-semibold text-zinc-100">Always-on cities</div>
            <div className="mt-2 text-sm text-zinc-300">
              24/7 hubs where market activity never fully sleeps.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="text-sm font-semibold text-zinc-100">Growth vectors</div>
            <div className="mt-2 text-sm text-zinc-300">
              Talent inflows, infrastructure, and compounding demand.
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
