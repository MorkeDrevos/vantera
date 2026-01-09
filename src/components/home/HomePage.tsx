import Link from 'next/link';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import HeroBackdrop from './HeroBackdrop';
import ListingsPreview from './ListingsPreview';
import FeaturedRoutesRow from './FeaturedRoutesRow';

import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Royal nebula backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[780px] w-[1200px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[150px]" />
        <div className="absolute top-24 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[160px]" />
        <div className="absolute -bottom-64 left-1/2 h-[820px] w-[1280px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_0%_60%,rgba(255,255,255,0.05),transparent_55%),radial-gradient(circle_at_100%_60%,rgba(255,255,255,0.05),transparent_55%)]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-200/90 via-amber-400/60 to-fuchsia-400/60" />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-100">Locus</div>
              <div className="text-xs text-zinc-400">Protocol-first discovery</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
              Real imagery
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
              Live local time
            </span>
            <Link
              href="/listings"
              className="rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-4 py-1.5 text-xs font-medium text-amber-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-amber-300/30 hover:from-amber-300/15"
              prefetch
            >
              Browse listings
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">{children}</main>

        <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 text-xs text-zinc-500 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Locus</div>
            <div className="text-zinc-600">Built as a premium baseline for real listings data</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
      <span className="h-px w-6 bg-white/10" />
      <span>{children}</span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'gold' | 'live' }) {
  const valueClass =
    tone === 'gold'
      ? 'text-amber-100'
      : tone === 'live'
        ? 'text-emerald-200'
        : 'text-zinc-100';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* HERO (royal + listings-first) */}
      <section className="pt-4 sm:pt-10">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          {/* Hero image (safe fallback) */}
          <HeroBackdrop
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=2400&q=80"
            alt="Premium city skyline"
          />

          {/* Glass content */}
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-4 py-2 text-xs text-amber-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/90" />
              <span>Listings-first discovery. Protocol-level presentation.</span>
            </div>

            <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                  The new standard for
                  <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-zinc-50 bg-clip-text text-transparent">
                    {' '}
                    premium property discovery
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-200/90 sm:text-lg">
                  Cities, listings, and market intelligence in one protocol-native interface. Built to become the only
                  destination buyers and sellers trust.
                </p>

                <div className="mt-7 max-w-xl">
                  <div className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-300/80">Search a city</div>
                      <div className="text-[11px] text-zinc-400">Open and expand from there</div>
                    </div>
                    <CitySearch />
                  </div>
                </div>

                <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Cities" value={CITIES.length} tone="gold" />
                  <Stat label="Regions" value={regionCount} />
                  <Stat label="Timezones" value={timezoneCount} />
                  <Stat label="Status" value="Live" tone="live" />
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/listings"
                    className="inline-flex items-center justify-center rounded-2xl border border-amber-300/25 bg-gradient-to-b from-amber-300/15 to-white/5 px-5 py-3 text-sm font-semibold text-amber-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-amber-300/35 hover:from-amber-300/20"
                    prefetch
                  >
                    Browse listings
                  </Link>

                  <Link
                    href="/listings?intent=sell"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20 hover:bg-white/7"
                    prefetch
                  >
                    List your home
                  </Link>

                  <div className="text-xs text-zinc-400">
                    Private owners and agents publish to the same protocol surface.
                  </div>
                </div>
              </div>

              {/* Popular - real cards with images + time */}
              <div className="lg:col-span-5">
                <SectionLabel>Popular right now</SectionLabel>
                <CityCardsClient cities={CITIES.slice(0, 4)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings preview (mock, premium) */}
      <section className="mt-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Featured listings</SectionLabel>
            <div className="text-sm text-zinc-300">
              A protocol-ready preview. Real provider wiring comes next.
            </div>
          </div>

          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
            prefetch
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          <ListingsPreview />
        </div>
      </section>

      {/* Explore (all cities) */}
      <section className="mt-16">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* Featured routes (collections) */}
      <section className="mt-16">
        <SectionLabel>Featured routes</SectionLabel>
        <FeaturedRoutesRow />
      </section>

      {/* Bottom CTA */}
      <section className="mt-16">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Owners + agents</div>
              <div className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">
                Publish your property directly to the protocol surface
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
                No “portal clutter”. No noisy lead funnels. Clean presentation, smart SEO and a single canonical listing
                profile that becomes the market reference.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="grid gap-3">
                <Link
                  href="/listings?intent=sell"
                  className="inline-flex items-center justify-center rounded-2xl border border-amber-300/25 bg-gradient-to-b from-amber-300/15 to-white/5 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-300/35 hover:from-amber-300/20"
                  prefetch
                >
                  List your home
                </Link>
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
                  prefetch
                >
                  Browse listings
                </Link>
                <div className="text-center text-[11px] text-zinc-500">
                  Data wiring next. UI is already protocol-grade.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
