// src/app/listing/[slug]/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/seo.jsonld';

export const revalidate = 300;

type Props = {
  params: { slug: string };
};

function shouldIndexListing(verificationLevel: string) {
  return verificationLevel === 'VERIFIED_DOCS' || verificationLevel === 'VERIFIED_ON_SITE';
}

function formatMoney(n: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '';
    return `${sym}${Math.round(n).toLocaleString()}`;
  }
}

async function getListing(slugOrId: string) {
  if (!slugOrId) return null;

  // Primary: stable slug
  const bySlug = await prisma.listing.findUnique({
    where: { slug: slugOrId },
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
      media: { orderBy: { sortOrder: 'asc' }, select: { url: true, alt: true, sortOrder: true, kind: true } },
    },
  });

  if (bySlug) return bySlug;

  // Back-compat: if someone still hits /listing/<id>
  const byId = await prisma.listing.findUnique({
    where: { id: slugOrId },
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
      media: { orderBy: { sortOrder: 'asc' }, select: { url: true, alt: true, sortOrder: true, kind: true } },
    },
  });

  return byId;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing(params.slug);

  if (!listing) {
    return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };
  }

  const priceLabel =
    typeof listing.price === 'number' ? formatMoney(listing.price, listing.currency || 'USD') : null;

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    cityName: listing.city.name,
    citySlug: listing.city.slug,
    priceLabel,
    propertyType: listing.propertyType ?? undefined,
  });

  const indexable = shouldIndexListing(listing.verification);

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
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
  const listing = await getListing(params.slug);
  if (!listing) return notFound();

  const priceLabel =
    typeof listing.price === 'number' ? formatMoney(listing.price, listing.currency || 'USD') : null;

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    cityName: listing.city.name,
    citySlug: listing.city.slug,
    priceLabel,
    propertyType: listing.propertyType ?? undefined,
  });

  const indexable = shouldIndexListing(listing.verification);

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
    { name: listing.city.name, url: `/city/${listing.city.slug}` },
    { name: 'Luxury real estate', url: `/city/${listing.city.slug}/luxury-real-estate` },
    { name: listing.title, url: `/listing/${listing.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbs)}

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/city/${listing.city.slug}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              ← Back to {listing.city.name}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
              {indexable ? 'Verified listing' : 'Unverified listing (noindex)'}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              {listing.city.name}, {listing.city.country}
              {listing.city.region ? ` · ${listing.city.region}` : ''}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{listing.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {priceLabel ?? 'Price on request'}
              </div>
              {listing.propertyType ? (
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{listing.propertyType}</div>
              ) : null}
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Source: {listing.source}
              </div>
            </div>
          </div>

          {listing.coverMedia?.url ? (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.coverMedia.url}
                alt={listing.coverMedia.alt || listing.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Private intelligence for the world’s most valuable assets.
            <br />
            Truth-first pricing signals, liquidity reality, and risk context built to separate asking price from reality.
          </p>

          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-zinc-400">Beds</div>
              <div className="mt-2 text-sm font-semibold text-white">{listing.bedrooms ?? '—'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-zinc-400">Baths</div>
              <div className="mt-2 text-sm font-semibold text-white">{listing.bathrooms ?? '—'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-zinc-400">Built</div>
              <div className="mt-2 text-sm font-semibold text-white">{listing.builtM2 ? `${listing.builtM2} m²` : '—'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-zinc-400">Plot</div>
              <div className="mt-2 text-sm font-semibold text-white">{listing.plotM2 ? `${listing.plotM2} m²` : '—'}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-white">Truth-first signals</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              This is the listing surface. Once ATTOM ingestion is live for Miami, this area will show pricing context,
              comparable tension, and risk flags derived from public record signals.
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
                href={`/city/${listing.city.slug}/luxury-real-estate`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Luxury in {listing.city.name}
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
            <div className="mt-1">Robots: {indexable ? 'index, follow' : 'noindex, follow'} (truth-first gate)</div>
          </div>
        </div>
      </div>
    </main>
  );
}
