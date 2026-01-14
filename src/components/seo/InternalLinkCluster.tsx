// src/components/seo/InternalLinkCluster.tsx
'use client';

import Link from 'next/link';

import type { SeoDoc, PageKind } from '@/lib/seo/seo.intent';
import { CITIES } from '@/components/home/cities';

function kindToRoutes(kind: PageKind, ctx?: { citySlug?: string }) {
  switch (kind) {
    case 'home':
      return [{ href: '/', label: 'Home' }];

    case 'luxury_global':
      return [{ href: '/luxury-real-estate', label: 'Global luxury hub' }];

    case 'sell_luxury':
      return [{ href: '/sell-luxury-property', label: 'Sell privately' }];

    case 'agents':
      return [{ href: '/agents', label: 'For agents' }];

    case 'city_hub':
      if (!ctx?.citySlug) return [];
      return [{ href: `/city/${ctx.citySlug}`, label: 'City overview' }];

    case 'luxury_city':
      if (!ctx?.citySlug) return [];
      return [{ href: `/city/${ctx.citySlug}/luxury-real-estate`, label: 'City luxury' }];

    case 'listing':
      if (!ctx?.citySlug) return [];
      return [
        { href: `/city/${ctx.citySlug}`, label: 'City overview' },
        { href: `/city/${ctx.citySlug}/luxury-real-estate`, label: 'City luxury' },
      ];

    default:
      return [];
  }
}

export default function InternalLinkCluster({
  doc,
  citySlug,
}: {
  doc: SeoDoc;
  citySlug?: string | null;
}) {
  const ctx = { citySlug: citySlug ?? undefined };

  // Primary links based on intent rules
  const targets = doc.internalLinks?.shouldLinkTo ?? [];
  const links = targets.flatMap((k) => kindToRoutes(k, ctx));

  // Fallback: seed with strong hubs so pages never become isolated
  const fallbacks =
    links.length > 0
      ? []
      : [
          { href: '/luxury-real-estate', label: 'Global luxury hub' },
          { href: '/', label: 'Explore cities' },
        ];

  // Optional: show a few featured city links for crawling strength
  const featuredCities = CITIES.slice(0, 6).map((c) => ({
    href: `/city/${c.slug}/luxury-real-estate`,
    label: `${c.name} luxury`,
  }));

  const finalLinks = [...links, ...fallbacks];

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">Explore next</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        Vantera pages are designed as an intelligence graph. These links keep the authority flowing.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {finalLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 text-xs text-zinc-500">Featured city luxury routes</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {featuredCities.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/[0.05]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
