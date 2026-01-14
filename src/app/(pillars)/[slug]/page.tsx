// src/app/(pillars)/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { allPillarSlugs, buildPillarDoc } from '@/lib/seo/seo.pillars';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

export async function generateStaticParams() {
  // Static pages for SEO stability (safe)
  return allPillarSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = buildPillarDoc(slug);
  if (!doc) return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    robots: { index: true, follow: true },

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

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = buildPillarDoc(slug);
  if (!doc) return notFound();

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: doc.title,
    description: doc.description,
    about: [
      { '@type': 'Thing', name: 'Private intelligence for the world’s most valuable assets' },
      { '@type': 'Thing', name: doc.primaryKeyword },
      ...doc.relatedKeywords.map((k) => ({ '@type': 'Thing', name: k })),
    ],
  });

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      {jsonLd(pageJsonLd)}

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
          <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
          Keyword pillar
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {doc.h1}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {doc.intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/luxury-real-estate"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Global luxury hub
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Explore cities
          </Link>
          <Link
            href="/sell-luxury-property"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Sell privately
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-white">Truth-first signals</h2>
          <ul className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
            <li>Pricing reality - reductions, dispersion, comparable pressure</li>
            <li>Liquidity - demand depth, velocity, time-to-sell pressure</li>
            <li>Risk flags - constraint, noise, mismatch between ask and reality</li>
            <li>Verified context - structured truth layers as coverage expands</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
