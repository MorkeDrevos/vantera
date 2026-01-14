// src/lib/seo/keyword-pillars.ts

export type KeywordPillar = {
  slug: string; // e.g. "luxury-villas-for-sale"
  phrase: string; // e.g. "Luxury Villas for Sale"
  description?: string;
  topics?: string[];
};

/**
 * Add entries here and the site automatically:
 * - generates pages
 * - generates metadata
 * - generates OG images
 * - can be added to sitemap later via one import
 */
export const KEYWORD_PILLARS: KeywordPillar[] = [
  {
    slug: 'luxury-villas-for-sale',
    phrase: 'Luxury Villas for Sale',
    topics: ['luxury villas', 'prime villas', 'exclusive villas', 'high-end villas'],
  },
  {
    slug: 'luxury-apartments-for-sale',
    phrase: 'Luxury Apartments for Sale',
    topics: ['luxury apartments', 'prime apartments', 'exclusive apartments'],
  },
  {
    slug: 'penthouses-for-sale',
    phrase: 'Penthouses for Sale',
    topics: ['penthouse', 'terrace penthouse', 'sea view penthouse'],
  },
  {
    slug: 'waterfront-luxury-real-estate',
    phrase: 'Waterfront Luxury Real Estate',
    topics: ['waterfront property', 'sea front villas', 'beachfront homes'],
  },
  {
    slug: 'off-market-luxury-real-estate',
    phrase: 'Off-Market Luxury Real Estate',
    topics: ['off-market', 'private listings', 'quiet luxury'],
  },
  {
    slug: 'new-development-luxury',
    phrase: 'New Development Luxury Real Estate',
    topics: ['new development', 'turnkey', 'developer inventory'],
  },
];
