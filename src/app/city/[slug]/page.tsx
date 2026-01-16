// src/app/city/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

function shortMoney(currency: string, n: number) {
  const cur = (currency || 'EUR').toUpperCase();
  const sym = cur === 'EUR' ? '€' : cur === 'USD' ? '$' : '';
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `${sym}${Math.round(n / 1_000)}k`;
  return `${sym}${n}`;
}

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function GoldHairline() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
    </div>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
      {children}
    </span>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] px-6 py-3 text-sm font-semibold text-white hover:bg-[rgba(10,10,12,1.0)]"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 border border-[color:var(--hairline)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
    >
      {children}
    </Link>
  );
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const city = await prisma.city.findUnique({ where: { slug } });

  if (!city) {
    return (
      <main className="min-h-screen bg-white">
        <div className={cx('py-16', WIDE)}>
          <div className="text-[22px] font-semibold text-[color:var(--ink)]">Not found</div>
          <div className="mt-2 text-[13px] text-[color:var(--ink-2)]">This city does not exist.</div>
          <div className="mt-6">
            <PrimaryLink href="/search">Back to search</PrimaryLink>
          </div>
        </div>
      </main>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { cityId: city.id, status: 'LIVE', visibility: 'PUBLIC', coverMedia: { isNot: null } },
    orderBy: [{ price: 'desc' }, { updatedAt: 'desc' }],
    take: 18,
    include: { coverMedia: true },
  });

  const title = `${city.name}`;
  const meta = `${city.region ? `${city.region}, ` : ''}${city.country}`;

  return (
    <main className="min-h-screen bg-white">
      {/* Quiet paper texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      {/* City hero - full bleed */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-b border-[color:var(--hairline)] bg-[color:var(--paper-2)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1400px_520px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1400px_520px_at_85%_10%,rgba(139,92,246,0.05),transparent_66%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
        </div>

        <div className={cx('relative py-12 sm:py-14', WIDE)}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[980px]">
              <div className="flex flex-wrap items-center gap-2">
                <TagPill>CITY CATALOGUE</TagPill>
                <TagPill>€2M+ ONLY</TagPill>
                <TagPill>VERIFIED LIVE</TagPill>
              </div>

              <h1 className="mt-5 text-balance text-[34px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[44px] lg:text-[56px] lg:leading-[1.02]">
                {title}
              </h1>

              <p className="mt-4 max-w-[75ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
                Browse verified listings in {city.name}. Designed like a catalogue, curated for serious buyers.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--ink-2)]">
                <span className="font-semibold text-[color:var(--ink)]">{meta}</span>
                <span className="text-[color:var(--ink-3)]">·</span>
                <span>{listings.length ? `${listings.length} featured` : 'Coverage opening'}</span>
              </div>

              {city.blurb ? (
                <div className="mt-5 max-w-3xl text-sm leading-relaxed text-[color:var(--ink-2)]">{city.blurb}</div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryLink href={`/search?city=${encodeURIComponent(city.slug)}`}>View all listings</PrimaryLink>
                <SecondaryLink href="/search">Search</SecondaryLink>
                <SecondaryLink href="/">Home</SecondaryLink>
              </div>
            </div>

            <div className="w-full max-w-[520px]">
              <div className="border border-[color:var(--hairline)] bg-white shadow-[0_30px_90px_rgba(11,12,16,0.06)]">
                <div className="relative p-6">
                  <GoldHairline />
                  <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                    MARKET SNAPSHOT
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="border border-[color:var(--hairline)] bg-white p-4">
                      <div className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">FEATURED</div>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        {listings.length}
                      </div>
                      <div className="mt-1 text-[12px] text-[color:var(--ink-2)]">on this page</div>
                    </div>

                    <div className="border border-[color:var(--hairline)] bg-white p-4">
                      <div className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">ALL</div>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        Open
                      </div>
                      <div className="mt-1 text-[12px] text-[color:var(--ink-2)]">via Search</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/search?city=${encodeURIComponent(city.slug)}`}
                      className="inline-flex w-full items-center justify-center border border-[color:var(--hairline)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
                    >
                      Explore {city.name}
                    </Link>
                  </div>

                  <div className="mt-4 text-[12px] text-[color:var(--ink-3)]">
                    Only listings with verified media appear in the marketplace.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Hairline />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className={cx('py-10 sm:py-12', WIDE)}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">FEATURED LISTINGS</div>
            <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
              {listings.length ? 'Catalogue selection' : 'No inventory yet'}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <TagPill>{meta}</TagPill>
            <TagPill>Sorted by price</TagPill>
          </div>
        </div>

        {listings.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l, idx) => {
              const hero = idx === 0 || idx === 3;

              const href = `/listing/${l.slug}`; // ✅ correct route
              const priceLabel = typeof l.price === 'number' ? shortMoney(l.currency ?? 'EUR', l.price) : 'Price on request';
              const cover = l.coverMedia;

              if (!cover?.url) return null;

              return (
                <article key={l.id} className={cx(hero && 'md:col-span-2')}>
                  <Link
                    href={href}
                    className={cx(
                      'group block border border-[color:var(--hairline)] bg-white',
                      'shadow-[0_26px_80px_rgba(11,12,16,0.05)] hover:shadow-[0_36px_110px_rgba(11,12,16,0.08)] transition',
                    )}
                  >
                    <div className={cx('relative w-full overflow-hidden bg-[color:var(--paper-2)]', hero ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? l.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes={hero ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                        priority={false}
                      />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,10,12,0.14)] to-transparent" />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.08))]" />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">{city.name}</div>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        {l.title}
                      </div>
                      <div className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[12px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
                        {priceLabel}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 border border-[color:var(--hairline)] bg-white p-10 shadow-[0_30px_90px_rgba(11,12,16,0.06)]">
            <div className="text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
              Coverage is opening for {city.name}
            </div>
            <div className="mt-2 text-sm text-[color:var(--ink-2)]">
              We only show verified live listings. Use Search to submit a request and get notified when inventory appears.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink href={`/search?city=${encodeURIComponent(city.slug)}`}>Request listings</PrimaryLink>
              <SecondaryLink href="/search">Browse all markets</SecondaryLink>
            </div>
          </div>
        )}

        <div className="mt-10">
          <SecondaryLink href={`/search?city=${encodeURIComponent(city.slug)}`}>Explore {city.name} in Search</SecondaryLink>
        </div>
      </section>
    </main>
  );
}
