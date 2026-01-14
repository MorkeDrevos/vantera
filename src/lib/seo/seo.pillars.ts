// src/lib/seo/seo.pillars.ts
import { SEO_CONFIG } from './seo.config';

export type PillarDoc = {
  slug: string;
  canonical: string;
  title: string;
  description: string;
  ogImage: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  relatedKeywords: string[];
};

function abs(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.domain}${p}`;
}

// 1 function -> N pages
export function buildPillarDoc(slug: string): PillarDoc | null {
  const clean = slug.trim().toLowerCase();
  if (!clean) return null;

  // Examples:
  // "luxury-villas-for-sale"
  // "luxury-apartments-for-sale"
  // "off-market-luxury-homes"
  // "prime-real-estate-investment"

  const map: Record<string, Omit<PillarDoc, 'slug' | 'canonical' | 'ogImage'>> = {
    'luxury-villas-for-sale': {
      title: 'Luxury Villas for Sale - Truth-First Market Intelligence',
      description:
        'Explore luxury villas for sale through truth-first market intelligence. Prime areas, pricing reality, liquidity signals, and risk flags beyond listing hype.',
      h1: 'Luxury Villas for Sale',
      intro:
        'Not just listings. A truth layer for villa markets - designed to separate asking price from real value, liquidity, and risk context.',
      primaryKeyword: 'luxury villas for sale',
      relatedKeywords: ['villas for sale', 'prime villas', 'high-end villas', 'exclusive villas'],
    },
    'luxury-apartments-for-sale': {
      title: 'Luxury Apartments for Sale - Real Value and Liquidity Signals',
      description:
        'Luxury apartments for sale with pricing reality, liquidity indicators, and truth-first context designed for clarity in prime markets.',
      h1: 'Luxury Apartments for Sale',
      intro:
        'Luxury apartments move on different rules: scarcity, micro-location, and buyer depth. Vantera models the reality beneath the marketing.',
      primaryKeyword: 'luxury apartments for sale',
      relatedKeywords: ['luxury flats', 'prime apartments', 'high-end apartments', 'penthouse for sale'],
    },
    'off-market-luxury-homes': {
      title: 'Off Market Luxury Homes - Private Supply and Pricing Reality',
      description:
        'Off market luxury homes with truth-first signals. Private supply patterns, pricing reality, and liquidity context beyond public portals.',
      h1: 'Off Market Luxury Homes',
      intro:
        'The best inventory is often private. Vantera is built to handle off-market context with disciplined signals and verified data.',
      primaryKeyword: 'off market luxury homes',
      relatedKeywords: ['off market property', 'private listings', 'exclusive homes', 'discreet sales'],
    },
  };

  const base = map[clean];
  if (!base) return null;

  return {
    slug: clean,
    canonical: abs(`/(pillars)/${clean}`.replace('/(pillars)', '')), // canonical should be /<slug> not showing route group
    title: base.title,
    description: base.description,
    ogImage: abs(`/pillars/${clean}/opengraph-image`),
    h1: base.h1,
    intro: base.intro,
    primaryKeyword: base.primaryKeyword,
    relatedKeywords: base.relatedKeywords,
  };
}

export function allPillarSlugs(): string[] {
  // Add as many as you want here and you instantly get pages.
  return [
    'luxury-villas-for-sale',
    'luxury-apartments-for-sale',
    'off-market-luxury-homes',
  ];
}
