// src/app/city/[slug]/luxury-real-estate/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CITIES } from '@/components/home/cities';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

type Props = {
  params: Promise<{ slug: string }>;
};

function Pill({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

function ListingCard({
  title,
  price,
  meta,
  href,
}: {
  title: string;
  price?: string;
  meta?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{title}</div>
          {meta ? <div className="mt-1 truncate text-xs text-zinc-400">{meta}</div> : null}
        </div>
        {price ? (
          <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            {price}
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-xs text-zinc-400 group-hover:text-zinc-300">
        View truth-first signals
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const city = CITIES.find((c) => c.slug === slug);
  if (!city) {
    return { title: 'City Not Found · Vantera', robots: { index: false, follow: false } };
  }

  const doc = SEO_INTENT.luxuryCity({
    name: city.name,
    slug: city.slug,
    country: city.country,
    region: city.region ?? null,
  });

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    robots: doc.robots,

    openGraph: {
      type: 'article',
      title: doc.title,
      description: doc.description,
      url: doc.canonical,
      images: [doc.ogImage],
      siteName: 'Vantera',
    },

    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
    },
  };
}

export default async function CityLuxuryPage({ params }: Props) {
  const { slug } = await params;

  const city = CITIES.find((c) => c.slug === slug);
  if (!city) return notFound();

  const doc = SEO_INTENT.luxuryCity({
    name: city.name,
    slug: city.slug,
    country: city.country,
    region: city.region ?? null,
  });

  const intentAbout =
    doc.jsonld?.about?.map((a) => ({
      '@type': a.type,
      name: a.name,
      ...(a.extra ?? {}),
    })) ?? [];

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: doc.jsonld?.name ?? doc.title,
    description: doc.description,
    about: [
      { '@type': 'Thing', name: 'Private intelligence for the world’s most valuable assets' },
      { '@type': 'Thing', name: `Luxury real estate for sale in ${city.name}` },
      { '@type': 'Thing', name: `${city.name} luxury homes` },
      { '@type': 'Thing', name: `${city.name} prime real estate` },
      { '@type': 'Thing', name: 'Pricing reality' },
      { '@type': 'Thing', name: 'Market liquidity' },
      { '@type': 'Thing', name: 'Property risk flags' },
      ...intentAbout,
    ],
  });

  const subtitle = [city.region, city.country].filter(Boolean).join(', ');

  // Placeholder featured listings
  // Swap later to real data source without changing layout or SEO
  const featured = [
    {
      title: `Prime villa with views`,
      price: '€4.2M',
      meta: `${city.name} - Prime zone`,
      href: `/listings?city=${city.slug}&tag=luxury`,
    },
    {
      title: `Penthouse with terrace`,
      price: '€2.8M',
      meta: `${city.name} - Walkable core`,
      href: `/listings?city=${city.slug}&tag=luxury`,
    },
    {
      title: `Modern estate with privacy`,
      price: '€6.9M',
      meta: `${city.name} - Ultra prime`,
      href: `/listings?city=${city.slug}&tag=luxury`,
    },
    {
      title: `Architectural home, turnkey`,
      price: '€3.6M',
      meta: `${city.name} - Prime corridor`,
      href: `/listings?city=${city.slug}&tag=luxury`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.16),transparent_55%)] blur-2xl" />
        <div className="absolute -bottom-40 left-1/2 h-[660px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(155,109,255,0.16),transparent_60%)] blur-2xl" />
      </div>

      {jsonLd(pageJsonLd)}

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
            Luxury intelligence
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Luxury Real Estate for Sale in {city.name}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Prime areas, real value signals, and liquidity reality - built to separate asking price from what the market will actually pay.
            {subtitle ? (
              <>
                <br />
                <span className="text-zinc-400">{subtitle}</span>
              </>
            ) : null}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/city/${city.slug}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              City overview
            </Link>

            <Link
              href="/luxury-real-estate"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Global luxury hub
            </Link>

            <Link
              href={`/listings?city=${city.slug}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              View listings
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Pill title="What defines luxury here">
            Luxury in {city.name} is not price alone. It is scarcity, planning constraints, location power, privacy, and a buyer pool deep enough to stay liquid when the market cools.
          </Pill>

          <Pill title="Prime vs marketed luxury">
            Marketed luxury has photos. Prime luxury has durability. Vantera highlights the difference through price dispersion, reduction pressure, and district-level demand signals.
          </Pill>

          <Pill title="Liquidity matters more than finishes">
            A property that looks perfect but cannot sell is not prime. Liquidity is the real luxury.
            Vantera emphasizes demand depth and time-to-sell pressure so decisions are grounded in reality.
          </Pill>

          <Pill title="Truth-first listings, sellers, and agents">
            Vantera hosts listings from private sellers and vetted agents. The truth layer leads.
            Every listing is framed against real value, liquidity, and risk context, not marketing narratives.
          </Pill>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Featured luxury listings</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                A curated view of luxury inventory in {city.name}. Each listing should show pricing context and liquidity signals as the platform evolves.
              </p>
            </div>
            <Link
              href={`/listings?city=${city.slug}&tag=luxury`}
              className="mt-3 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 sm:mt-0"
            >
              Browse all luxury
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((f) => (
              <ListingCard key={f.title} title={f.title} price={f.price} meta={f.meta} href={f.href} />
            ))}
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Popular searches: luxury homes for sale in {city.name}, prime real estate {city.name}, high-end property {city.name}, exclusive homes {city.name}.
          </div>
        </div>

        <div className="mt-12 text-xs text-zinc-600">
          <div>Canonical: {doc.canonical}</div>
        </div>
      </div>
    </main>
  );
}
