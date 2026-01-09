// src/components/home/HomePage.tsx
'use client';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

// If you already created these files, keep them.
// If not, comment these 2 imports + the Featured Listings section below for now.
import FeaturedListingsClient from './FeaturedListingsClient';
import { FEATURED_LISTINGS } from './listings';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* premium ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute -bottom-56 left-1/2 h-[640px] w-[1020px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full bg-[rgba(168,85,247,0.14)] blur-[160px]" />
        <div className="absolute right-0 top-12 h-[520px] w-[520px] rounded-full bg-[rgba(245,158,11,0.12)] blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-7 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),transparent_45%,rgba(168,85,247,0.22))]" />
              <div className="absolute inset-0 bg-[radial-gradient(18px_18px_at_30%_25%,rgba(255,255,255,0.25),transparent_70%)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-100">Locus</div>
              <div className="text-xs text-zinc-400">Real estate, truth-first</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Real images
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Live local time
            </span>
            <a
              href="/sell"
              className="ml-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              List your home
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">{children}</main>

        <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-6 text-xs text-zinc-500 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Locus</div>
            <div className="text-zinc-600">Truth-first infrastructure for global listings</div>
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

function findCities(slugs: readonly string[]) {
  type City = (typeof CITIES)[number];
  const map = new Map<string, City>(CITIES.map((c) => [c.slug, c]));
  return slugs.map((s) => map.get(s)).filter(Boolean) as City[];
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  const heroCity = CITIES.find((c) => c.image?.src) ?? CITIES[0];
  const heroSrc = heroCity?.image?.src?.trim() ?? '';

  const featuredRoutes = [
    { title: 'European capitals', slugs: ['madrid', 'barcelona', 'paris', 'london'] },
    { title: 'Coastal cities', slugs: ['barcelona', 'lisbon', 'dubai'] },
    { title: '24/7 cities', slugs: ['new-york', 'london', 'dubai'] },
    { title: 'High-growth hubs', slugs: ['dubai', 'new-york', 'barcelona'] },
  ] as const;

  return (
    <Shell>
      {/* HERO */}
      <section className="pt-6 sm:pt-12">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="relative">
            <div
              className="h-[300px] w-full sm:h-[340px] lg:h-[390px]"
              style={
                heroSrc
                  ? {
                      backgroundImage: `url(${heroSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_30%_20%,rgba(255,255,255,0.22),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.14),transparent_45%,rgba(168,85,247,0.14))]" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-zinc-200 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span>Real listings, truth-first, city intelligence</span>
                </div>

                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                  The one place buyers and sellers
                  <span className="text-zinc-300"> should start</span>
                </h1>

                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Premium listings, real imagery, live local time - and a truth-first foundation so search stops feeling like a 20 year old form.
                </p>

                {/* BUY + SELL CTAs */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="/listings"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20 hover:bg-white/15"
                  >
                    Browse listings
                  </a>

                  <a
                    href="/sell"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),rgba(168,85,247,0.18))] px-5 py-3 text-sm font-semibold text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20"
                  >
                    List your home
                  </a>

                  <div className="text-xs text-zinc-400 sm:ml-2">
                    Private owners welcome - verified options coming.
                  </div>
                </div>

                <div className="mt-7 max-w-xl">
                  <CitySearch />
                </div>

                {/* REAL STATS */}
                <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Cities</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{CITIES.length}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Regions</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{regionCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Timezones</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{timezoneCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Status</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
                  </div>
                </div>
              </div>

              {/* POPULAR = REAL CARDS */}
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between">
                  <SectionLabel>Popular</SectionLabel>
                  <div className="hidden text-xs text-zinc-400 sm:block">
                    {heroCity?.name ? `Hero: ${heroCity.name}` : null}
                  </div>
                </div>
                <CityCardsClient cities={CITIES.slice(0, 4)} />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[34px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        </div>
      </section>

      {/* FEATURED LISTINGS (includes the new ones + makes the homepage feel like a portal) */}
      <section className="mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Featured listings</SectionLabel>
            <div className="text-2xl font-semibold tracking-tight text-zinc-50">
              The most desirable homes
              <span className="text-zinc-300"> right now</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
              A clean, premium feed. This is the anchor for buyers and the standard for sellers.
            </p>
          </div>

          <a
            href="/listings"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            View all listings
          </a>
        </div>

        <div className="mt-6">
          <FeaturedListingsClient listings={FEATURED_LISTINGS} />
        </div>

        {/* PRIVATE OWNER MONETISATION BLOCK */}
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(245,158,11,0.85)]" />
                <span>Private owner listings</span>
              </div>

              <div className="mt-4 text-xl font-semibold tracking-tight text-zinc-50">
                List your home like a premium agency
                <span className="text-zinc-300"> without the hassle</span>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
                Most portals treat owner listings as second-class. Locus makes FSBO clean, trusted, and premium - with optional verification
                and buyer-quality signals so serious buyers actually engage.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/sell"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),rgba(168,85,247,0.18))] px-5 py-3 text-sm font-semibold text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20"
                >
                  Start a private listing
                </a>

                <a
                  href="/sell#pricing"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  See packages
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Presentation</div>
                  <div className="mt-2 text-sm font-semibold text-zinc-100">Premium listing page</div>
                  <div className="mt-1 text-xs text-zinc-400">Photos, facts, clean layout</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Trust</div>
                  <div className="mt-2 text-sm font-semibold text-zinc-100">Optional verification</div>
                  <div className="mt-1 text-xs text-zinc-400">Badges for serious buyers</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Distribution</div>
                  <div className="mt-2 text-sm font-semibold text-zinc-100">Boost + matching</div>
                  <div className="mt-1 text-xs text-zinc-400">Paid upgrades later</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Why it wins</div>
              <div className="mt-3 text-lg font-semibold text-zinc-50">Quality-first marketplace</div>

              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold text-zinc-100">No junk inventory</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Owner listings must meet Locus presentation rules (photos, completeness).
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold text-zinc-100">Buyer-quality signals</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Coming: verified owner, verified address, pricing confidence, and integrity checks.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold text-zinc-100">Monetisation that feels premium</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Paid placement, signature packages, and a deal-room layer later.
                  </div>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-white/10" />
              <div className="mt-4 text-xs text-zinc-400">
                Next: build <span className="text-zinc-200">/sell</span> onboarding and <span className="text-zinc-200">/listing/[slug]</span> premium pages.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROUTES */}
      <section className="mt-16">
        <SectionLabel>Featured routes</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredRoutes.map((row) => (
            <div
              key={row.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-100">{row.title}</div>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-zinc-300">
                  {row.slugs.length} picks
                </span>
              </div>

              <div className="mt-3 text-xs text-zinc-400">Curated collection</div>
              <div className="mt-3 h-px w-full bg-white/10" />
              <div className="mt-3 text-xs text-zinc-300">
                {row.slugs
                  .map((s) => CITIES.find((c) => c.slug === s)?.name)
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section className="mt-16">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* COLLECTION STRIPS */}
      <section className="mt-16">
        <SectionLabel>Collections</SectionLabel>

        <div className="grid gap-10">
          {featuredRoutes.map((row) => {
            const cities = findCities(row.slugs);
            return (
              <div key={`strip-${row.title}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-100">{row.title}</div>
                  <div className="text-xs text-zinc-500">{cities.length} cities</div>
                </div>
                <CityCardsClient cities={cities} />
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
