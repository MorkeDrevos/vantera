// src/app/listing/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/seo.jsonld';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Temporary listing loader.
 * Swap this to Prisma later:
 * - find by slug
 * - return verificationLevel
 * - return price label, property type, etc.
 */
async function getListingBySlug(slug: string) {
  // Placeholder "listing" so the route exists and SEO wiring is correct.
  // If you want this route to 404 until real listings exist, return null here.
  if (!slug) return null;

  // Minimal stub. Replace later.
  return {
    id: slug,
    slug,
    title: `Listing ${slug.toUpperCase()}`,
    cityName: 'Marbella',
    citySlug: 'marbella',
    priceLabel: null as string | null,
    propertyType: 'luxury home',
    // Truth gate: only verified listings should be indexable.
    verificationLevel: 'SELF_REPORTED' as 'SELF_REPORTED' | 'VERIFIED_DOCS' | 'VERIFIED_ON_SITE',
  };
}

function shouldIndexListing(verificationLevel: string) {
  // Truth-first gate: only index when verified.
  // You can loosen this later if you want.
  return verificationLevel === 'VERIFIED_DOCS' || verificationLevel === 'VERIFIED_ON_SITE';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const listing = await getListingBySlug(slug);
  if (!listing) {
    return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };
  }

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    cityName: listing.cityName,
    citySlug: listing.citySlug,
    priceLabel: listing.priceLabel,
    propertyType: listing.propertyType,
  });

  const indexable = shouldIndexListing(listing.verificationLevel);

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },

    // Truth-first SEO: crawl is fine, indexing depends on verification.
    robots: { index: indexable, follow: true },

    openGraph: {
      type: 'article',
      title: doc.title,
      description: doc.description,
      url: doc.canonical,
      siteName: 'Vantera',
      images: [doc.ogImage],
    },

    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;

  const listing = await getListingBySlug(slug);
  if (!listing) return notFound();

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    cityName: listing.cityName,
    citySlug: listing.citySlug,
    priceLabel: listing.priceLabel,
    propertyType: listing.propertyType,
  });

  const indexable = shouldIndexListing(listing.verificationLevel);

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: doc.jsonld?.name ?? doc.title,
    description: doc.description,
    about: (doc.jsonld?.about ?? []).map((a) => ({
      '@type': a.type,
      name: a.name,
      ...(a.extra ?? {}),
    })),
  });

  const crumbs = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: listing.cityName, url: `/city/${listing.citySlug}` },
    { name: 'Luxury real estate', url: `/city/${listing.citySlug}/luxury-real-estate` },
    { name: listing.title, url: `/listing/${listing.slug || listing.id}` },
  ]);

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbs)}

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/city/${listing.citySlug}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              ← Back to {listing.cityName}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
              {indexable ? 'Verified listing' : 'Unverified listing (noindex)'}
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {listing.title}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Private intelligence for the world’s most valuable assets.
            <br />
            Truth-first pricing signals, liquidity reality, and risk context built to separate asking price from reality.
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-white">Truth-first signals</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              This is the listing surface. When the data layer goes live, this area will show:
              pricing context, liquidity pressure, comparable tension, and risk flags.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-zinc-400">Value signal</div>
                <div className="mt-2 text-sm font-semibold text-white">Coming soon</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-zinc-400">Liquidity</div>
                <div className="mt-2 text-sm font-semibold text-white">Coming soon</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-zinc-400">Risk flags</div>
                <div className="mt-2 text-sm font-semibold text-white">Coming soon</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-xs text-zinc-400">Negotiation</div>
                <div className="mt-2 text-sm font-semibold text-white">Coming soon</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/city/${listing.citySlug}/luxury-real-estate`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Luxury in {listing.cityName}
              </Link>

              <Link
                href="/luxury-real-estate"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Global luxury hub
              </Link>

              <Link
                href="/sell-luxury-property"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Sell privately
              </Link>
            </div>
          </div>

          <div className="mt-10 text-xs text-zinc-600">
            <div>Canonical: {doc.canonical}</div>
            <div className="mt-1">
              Robots: {indexable ? 'index, follow' : 'noindex, follow'} (truth-first gate)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
