// src/app/agents/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

const title = 'Vantera for Agents - Launch Your Site on a Truth-First Protocol';
const description =
  'Vantera is a truth-first real estate intelligence layer plus a listings portal and an agent launchpad. Build your own site, publish listings with context, and earn trust at scale.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SEO_CONFIG.domain}/agents` },
  openGraph: {
    type: 'article',
    title,
    description,
    url: `${SEO_CONFIG.domain}/agents`,
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

export default function AgentsPage() {
  const canonical = `${SEO_CONFIG.domain}/agents`;

  const pageJsonLd = webPageJsonLd({
    url: canonical,
    name: title,
    description,
    about: [
      { '@type': 'Thing', name: 'Real estate agent websites' },
      { '@type': 'Thing', name: 'Luxury real estate' },
      { '@type': 'Thing', name: 'Pricing analysis' },
      { '@type': 'Thing', name: 'Market intelligence' },
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
            Agent launchpad
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Build your agent site on a truth-first protocol
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Vantera is not anti-agent. It is anti-noise.
            The top agents win by being transparent and decisive. This platform gives you publishing power while the truth layer protects trust.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Partner with Vantera
            </Link>

            <Link
              href="/luxury-real-estate"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Luxury hub
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Pill title="Launch your own site">
            Your own branded site, your own domain, your own inbound.
            Vantera becomes the intelligence layer and the trust backbone.
          </Pill>

          <Pill title="Publish listings with context">
            Listings without truth are marketing. Vantera lets you publish with pricing reality, liquidity signals, and risk flags that build buyer trust.
          </Pill>

          <Pill title="Compete on truth, not spend">
            Incumbent portals are pay-to-win. Vantera is designed to reward clarity and quality, not who buys the most exposure.
          </Pill>

          <Pill title="CRM and operating system later">
            This is the launchpad phase. CRM and agent operations follow once distribution and demand are proven.
          </Pill>
        </div>

        <div className="mt-12 text-xs text-zinc-600">
          <div>Canonical: {canonical}</div>
        </div>
      </div>
    </main>
  );
}
