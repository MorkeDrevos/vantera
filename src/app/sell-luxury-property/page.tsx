// src/app/sell-luxury-property/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

const title = 'Sell Luxury Property Privately - Truth-First Listing on Vantera';
const description =
  'Sell your luxury property privately with truth-first positioning. Publish with verified context, pricing reality, and signals buyers trust. No noise, no gimmicks.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SEO_CONFIG.domain}/sell-luxury-property` },
  openGraph: {
    type: 'article',
    title,
    description,
    url: `${SEO_CONFIG.domain}/sell-luxury-property`,
    images: [`${SEO_CONFIG.domain}/opengraph-image`],
    siteName: 'Vantera',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SEO_CONFIG.domain}/opengraph-image`],
  },
};

function Pill({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

export default function SellLuxuryPropertyPage() {
  const canonical = `${SEO_CONFIG.domain}/sell-luxury-property`;

  const pageJsonLd = webPageJsonLd({
    url: canonical,
    name: title,
    description,
    about: [
      { '@type': 'Thing', name: 'Luxury real estate' },
      { '@type': 'Thing', name: 'Private property sale' },
      { '@type': 'Thing', name: 'Pricing analysis' },
      { '@type': 'Thing', name: 'Property liquidity' },
    ],
  });

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
            Private seller listing
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Sell luxury property privately with truth-first positioning
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Vantera is a listings portal and seller platform, but the truth layer leads.
            Buyers trust context, not hype. We help you publish inside reality constraints so serious buyers lean in.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Contact Vantera
            </Link>
            <Link
              href="/luxury-real-estate"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Explore luxury markets
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Pill title="Truth-first listing format">
            We frame your property with pricing context, liquidity signals, and comparable pressure so buyers stop guessing and start acting.
          </Pill>

          <Pill title="Buyers filter noise instantly">
            Serious buyers ignore generic marketing. Truth-first positioning increases trust and reduces time wasted on low-intent leads.
          </Pill>

          <Pill title="Optional agent collaboration">
            You can sell privately or work with an agent. Vantera supports both paths while keeping the truth layer consistent.
          </Pill>

          <Pill title="Designed for luxury psychology">
            Luxury is confidence. We publish what matters: scarcity, location power, demand depth, and risk flags that buyers actually care about.
          </Pill>
        </div>

        <div className="mt-12 text-xs text-zinc-600">
          <div>Canonical: {canonical}</div>
        </div>
      </div>
    </main>
  );
}
