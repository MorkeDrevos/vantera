// src/app/luxury-real-estate/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { CITIES } from '@/components/home/cities';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

export const dynamic = 'force-static';

export const metadata: Metadata = (() => {
  const doc = SEO_INTENT.luxuryGlobal();

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
})();

function Pill({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
      {children}
    </span>
  );
}

export default function LuxuryRealEstatePage() {
  const doc = SEO_INTENT.luxuryGlobal();

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

  const exampleCities = CITIES.slice(0, 8);

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
            Vantera Luxury Intelligence
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Luxury Real Estate for Sale
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Not just listings. A truth layer.
            <br />
            Prime markets, real value signals, and liquidity reality - built to separate asking price from what the market will actually pay.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Tag>Prime areas</Tag>
            <Tag>Pricing reality</Tag>
            <Tag>Liquidity signals</Tag>
            <Tag>Risk flags</Tag>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Explore cities
            </Link>

            <Link
              href="/agents"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              For agents
            </Link>

            <Link
              href="/sell-luxury-property"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Sell privately
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Pill title="What defines luxury beyond price">
            Luxury is not price alone. True luxury is scarcity, location power, privacy, planning constraints, and a buyer pool that stays deep through cycles.
            Vantera
