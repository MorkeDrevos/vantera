// src/components/marketplace/MarketplacePage.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// CHANGED: remove TopBar/Footer from page-level (layout already renders them)
// import TopBar from '@/components/layout/TopBar';
// import Footer from '@/components/layout/Footer';

import VanteraOmniSearch, { type OmniCity, type OmniRegionCluster } from '@/components/search/VanteraOmniSearch';

import { CITIES } from '@/components/home/cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function uniqBy<T>(arr: T[], key: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const a of arr) {
    const k = key(a);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }
  return out;
}

function cityToOmni(c: any): OmniCity | null {
  const name = typeof c?.name === 'string' ? c.name.trim() : '';
  const slug = typeof c?.slug === 'string' ? c.slug.trim() : '';
  const country = typeof c?.country === 'string' ? c.country.trim() : '';
  const region = typeof c?.region === 'string' ? c.region.trim() : c?.region ?? null;
  const tz = typeof c?.tz === 'string' ? c.tz.trim() : 'UTC';
  const priority = typeof c?.priority === 'number' ? c.priority : 0;

  if (!name || !slug || !country) return null;
  return { name, slug, country, region, tz, priority };
}

function buildClustersFromCities(cities: OmniCity[]): OmniRegionCluster[] {
  // Minimal "clusters" so OmniSearch has Regions today (can be replaced with real REGION_CLUSTERS later)
  const byCountry = new Map<string, OmniCity[]>();
  for (const c of cities) {
    const k = c.country;
    if (!byCountry.has(k)) byCountry.set(k, []);
    byCountry.get(k)!.push(c);
  }

  const out: OmniRegionCluster[] = [];
  for (const [country, list] of byCountry.entries()) {
    const citySlugs = list
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      .slice(0, 14)
      .map((x) => x.slug);

    out.push({
      slug: country.toLowerCase().replace(/\s+/g, '-'),
      name: country,
      country,
      region: 'Country',
      priority: Math.min(10, Math.round(list.reduce((s, x) => s + (x.priority ?? 0), 0) / 10)),
      citySlugs,
    });
  }

  out.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return out.slice(0, 10);
}

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-[color:var(--hairline)]', className)} />;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em]',
        'border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)]',
      )}
    >
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{eyebrow}</div>
        <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-2 max-w-[80ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)]">
            {subtitle}
          </div>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

type DestinationCard = {
  label: string;
  href: string;
  hint: string;
};

function DestinationGrid({ items }: { items: DestinationCard[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((x) => (
        <Link
          key={x.href}
          href={x.href}
          className={cx(
            'group flex items-center justify-between gap-3 px-4 py-3 transition',
            'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
          )}
        >
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">{x.label}</div>
            <div className="truncate text-[11px] tracking-[0.18em] text-[color:var(--ink-3)]">{x.hint}</div>
          </div>
          <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-90 text-[color:var(--ink)]" />
        </Link>
      ))}
    </div>
  );
}

function AtelierHero({ cities, clusters }: { cities: OmniCity[]; clusters: OmniRegionCluster[] }) {
  const featuredCountries = useMemo(() => {
    const preferred = [
      'Spain',
      'France',
      'United Arab Emirates',
      'United States',
      'United Kingdom',
      'Monaco',
      'Portugal',
      'Italy',
      'Switzerland',
      'Greece',
    ];

    const present = uniqBy(
      cities
        .map((c) => c.country)
        .filter(Boolean)
        .map((c) => String(c)),
      (x) => x.toLowerCase(),
    );

    const ordered = [
      ...preferred.filter((p) => present.some((x) => x.toLowerCase() === p.toLowerCase())),
      ...present.filter((x) => !preferred.some((p) => p.toLowerCase() === x.toLowerCase())),
    ];

    return ordered.slice(0, 10);
  }, [cities]);

  const quickDestinations = useMemo(() => {
    const top = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 10);
    const take = (slug: string, label: string, hint: string) => ({
      label,
      hint,
      href: `/city/${slug}`,
    });

    // Try to map some common slugs if you have them, otherwise fall back to top priorities.
    const slugSet = new Set(top.map((x) => x.slug));
    const pick = (slugGuess: string, fallbackIdx: number, label: string, hint: string) => {
      if (slugSet.has(slugGuess)) return take(slugGuess, label, hint);
      const f = top[fallbackIdx];
      return f ? take(f.slug, f.name, f.country) : take(slugGuess, label, hint);
    };

    return [
      pick('marbella', 0, 'Marbella', 'Spain'),
      pick('monaco', 1, 'Monaco', 'Monaco'),
      pick('dubai', 2, 'Dubai', 'United Arab Emirates'),
      pick('london', 3, 'London', 'United Kingdom'),
      pick('miami', 4, 'Miami', 'United States'),
      pick('cannes', 5, 'Cannes', 'France'),
      pick('benahavis', 6, 'Benahavís', 'Spain'),
      pick('estepona', 7, 'Estepona', 'Spain'),
    ].slice(0, 8);
  }, [cities]);

  return (
    <section className={cx('relative overflow-hidden', 'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]')}>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-[color:var(--hairline)]" />

        <div className="relative min-h-[78vh] w-full bg-[color:var(--paper-2)]">
          <Image src="/brand/hero.jpg" alt="Vantera Marketplace" fill priority className="object-cover" sizes="100vw" />

          {/* editorial wash */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.92),rgba(255,255,255,0.60),rgba(255,255,255,0.22))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.40),rgba(255,255,255,0.22),rgba(255,255,255,0.92))]" />

          <div className={cx('relative z-10', WIDE)}>
            <div className="grid gap-8 pb-10 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-16">
              {/* Left - statement */}
              <div className="lg:col-span-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>€2M+ ONLY</Pill>
                  <Pill>GLOBAL CURATION</Pill>
                  <Pill>EDITORIAL PRESENTATION</Pill>
                </div>

                <h1 className="mt-5 text-balance text-[42px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[56px] lg:text-[72px] lg:leading-[0.98]">
                  Global property intelligence for the world’s most valuable homes.
                </h1>

                <p className="mt-5 max-w-[72ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                  A private catalogue built city by city, combining verified listings,
    editorial presentation, and a truth layer designed for clarity over noise.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/listings"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                      'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                    )}
                  >
                    Browse catalogue <ArrowRight className="ml-2 h-4 w-4 opacity-85" />
                  </Link>

                  <Link
                    href="/coming-soon?flow=sell"
                    className={cx(
                      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                      'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                    )}
                  >
                    List privately
                  </Link>
                </div>

                {/* Countries */}
                <div className="mt-8 border border-[color:var(--hairline)] bg-white/70 backdrop-blur-[14px]">
                  <div className="px-5 py-4">
                    <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                      COUNTRIES
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {featuredCountries.map((c) => (
                        <Link
                          key={c}
                          href={`/search?country=${encodeURIComponent(c)}`}
                          className={cx(
                            'px-3.5 py-1.5 text-[12px] transition',
                            'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                            'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                          )}
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Search Atelier */}
              <div className="lg:col-span-6">
                <div
                  className={cx(
                    'border border-[color:var(--hairline)] bg-white/86 backdrop-blur-[18px]',
                    'shadow-[0_40px_140px_rgba(10,10,12,0.12)]',
                  )}
                >
                  <div className="border-b border-[color:var(--hairline)] px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SEARCH ATELIER
                        </div>
                        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                          Type like a human. We’ll interpret it.
                        </div>
                        <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                          City, lifestyle, budget, keywords. Typos are fine. Press <span className="font-mono">/</span>{' '}
                          anywhere.
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
                        <Sparkles className="h-4 w-4 opacity-70" />
                        €2M+
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <VanteraOmniSearch
                      cities={cities}
                      clusters={clusters}
                      className="max-w-none"
                      autoFocus={false}
                      placeholder='try "marbella sea view villa under 8m 4 beds"'
                      limit={9}
                    />

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <Link
                        href="/listings"
                        className={cx(
                          'inline-flex items-center justify-between px-4 py-3 text-sm font-semibold transition',
                          'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink)]',
                        )}
                      >
                        <span>Browse catalogue</span>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </Link>

                      <Link
                        href="/coming-soon?flow=sell"
                        className={cx(
                          'inline-flex items-center justify-between px-4 py-3 text-sm font-semibold transition',
                          'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                        )}
                      >
                        <span>List privately</span>
                        <ArrowRight className="h-4 w-4 opacity-85" />
                      </Link>
                    </div>

                    <div className="mt-6 border-t border-[color:var(--hairline)] pt-5">
                      <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                        QUICK DESTINATIONS
                      </div>
                      <div className="mt-3">
                        <DestinationGrid items={quickDestinations} />
                      </div>
                      <div className="mt-4 text-[11px] text-[color:var(--ink-3)]">
                        Tip: “gated”, “schools”, “waterfront”, “penthouse”, “new build”, “golf”.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-[color:var(--hairline)] bg-white/70 px-5 py-4 text-sm text-[color:var(--ink-2)]">
                  No portal clutter. No duplicated feeds. Just premium inventory and the cleanest way to enter it.
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-[color:var(--hairline)]" />
        </div>
      </div>
    </section>
  );
}

export default function MarketplacePage() {
  const cities = useMemo<OmniCity[]>(() => {
    const raw = Array.isArray(CITIES) ? (CITIES as unknown[]) : [];
    const mapped = raw.map(cityToOmni).filter(Boolean) as OmniCity[];
    mapped.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    return mapped;
  }, []);

  const clusters = useMemo<OmniRegionCluster[]>(() => buildClustersFromCities(cities), [cities]);

  return (
    <div className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {/* Quiet paper texture + micro grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:linear-gradient(to_right,rgba(10,10,12,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.18)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      {/* CHANGED: remove duplicate TopBar (layout renders it) */}
      {/* <TopBar /> */}

      <main className="w-full">
        <AtelierHero cities={cities} clusters={clusters} />

        <section className="py-12 sm:py-16">
          <div className={NARROW}>
            <SectionTitle
              eyebrow="MARKETPLACE"
              title="Luxury, stripped of noise"
              subtitle="Vantera is built for high intent: faster entry, cleaner browsing, and presentation that feels like print."
              right={
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/listings"
                    className={cx(
                      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                      'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                    )}
                  >
                    Browse catalogue
                  </Link>
                </div>
              }
            />

            <div className="mt-8">
              <Hairline />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border border-[color:var(--hairline)] bg-white p-5">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">THRESHOLD</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">€2M+ only</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  The line is enforced. This is a luxury marketplace, not a mixed portal.
                </div>
              </div>

              <div className="border border-[color:var(--hairline)] bg-white p-5">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">BROWSE</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Catalogue grid</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Large cards, clean typography, and a layout designed to sell desire - not checkboxes.
                </div>
              </div>

              <div className="border border-[color:var(--hairline)] bg-white p-5">
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">ENTRY</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">Search Atelier</div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Type your intent. We interpret it. Then we take you straight into results.
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[color:var(--ink-2)]">Ready to browse? The catalogue is the inventory view.</div>

              <Link
                href="/listings"
                className={cx(
                  'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                  'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                )}
              >
                Enter catalogue <ArrowRight className="ml-2 h-4 w-4 opacity-85" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* CHANGED: remove duplicate Footer (layout renders it) */}
      {/* <Footer /> */}
    </div>
  );
}
