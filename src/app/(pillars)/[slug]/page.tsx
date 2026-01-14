// src/app/(pillars)/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { KEYWORD_PILLARS } from '@/lib/seo/keyword-pillars';
import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return KEYWORD_PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const pillar = KEYWORD_PILLARS.find((p) => p.slug === slug);
  if (!pillar) return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };

  const doc = SEO_INTENT.keywordPillar({
    slug: pillar.slug,
    phrase: pillar.phrase,
    description: pillar.description ?? null,
    topics: pillar.topics ?? null,
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

export default async function KeywordPillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pillar = KEYWORD_PILLARS.find((p) => p.slug === slug);
  if (!pillar) return notFound();

  const doc = SEO_INTENT.keywordPillar({
    slug: pillar.slug,
    phrase: pillar.phrase,
    description: pillar.description ?? null,
    topics: pillar.topics ?? null,
  });

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

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      {jsonLd(pageJsonLd)}

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
            Vantera Pillar
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {pillar.phrase}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Private intelligence for the world’s most valuable assets.
            <br />
            Truth-first pricing signals, liquidity reality, and risk context built to separate asking price from reality.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
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
          </div>

          {pillar.topics?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {pillar.topics.slice(0, 10).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-white">Next step</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              This pillar is designed to feed long-tail city pages. Add internal links from here into the strongest city luxury routes.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/city/marbella/luxury-real-estate"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Marbella luxury
              </Link>
              <Link
                href="/city/dubai/luxury-real-estate"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Dubai luxury
              </Link>
              <Link
                href="/city/paris/luxury-real-estate"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Paris luxury
              </Link>
            </div>
          </div>

          <div className="mt-10 text-xs text-zinc-600">
            <div>Canonical: {doc.canonical}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
