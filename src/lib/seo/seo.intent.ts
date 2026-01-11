// src/lib/seo/seo.intent.ts

import { SEO_CONFIG } from './seo.config';

export type PageKind =
  | 'home'
  | 'luxury_global'
  | 'luxury_city'
  | 'city_hub'
  | 'listing'
  | 'sell_luxury'
  | 'agents'
  | 'crm';

export type CityLite = {
  name: string;
  slug: string;
  country?: string | null;
  region?: string | null;
};

export type ListingLite = {
  id: string;
  slug: string;
  title: string;
  cityName: string;
  citySlug: string;
  priceLabel?: string | null;
  propertyType?: string | null;
};

export type SeoDoc = {
  kind: PageKind;
  canonical: string;
  title: string;
  description: string;
  primaryTopic: string;
  secondaryTopics: string[];
  ogImage: string;
  robots?: { index?: boolean; follow?: boolean };
  jsonld?: {
    name: string;
    about: Array<{ type: 'Thing' | 'Place' | 'Audience'; name: string; extra?: Record<string, any> }>;
  };
  internalLinks: {
    shouldLinkTo: PageKind[];
    shouldNotCompeteWith: PageKind[];
  };
};

function abs(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.domain}${p}`;
}

function clean(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

function makeTitle(core: string) {
  return clean(core);
}

function makeDescription(core: string) {
  return clean(core);
}

function placeLine(city?: CityLite) {
  if (!city) return '';
  const extra = [city.region, city.country].filter(Boolean).join(', ');
  return extra ? ` (${extra})` : '';
}

const ABOUT = {
  truthPlatform: [
    { type: 'Thing' as const, name: 'Real estate market intelligence' },
    { type: 'Thing' as const, name: 'Market value modeling' },
    { type: 'Thing' as const, name: 'Property liquidity' },
    { type: 'Thing' as const, name: 'Pricing analysis' },
  ],
  luxury: [
    { type: 'Thing' as const, name: 'Luxury real estate' },
    { type: 'Thing' as const, name: 'Prime real estate' },
    { type: 'Thing' as const, name: 'High-end property markets' },
  ],
  audienceLuxury: [{ type: 'Audience' as const, name: 'High net worth buyers and investors' }],
};

export const SEO_INTENT = {
  abs,

  home(): SeoDoc {
    const canonical = abs('/');
    return {
      kind: 'home',
      canonical,
      title: makeTitle('Vantera - Truth-First Real Estate Intelligence'),
      description: makeDescription(SEO_CONFIG.defaultDescription),
      primaryTopic: 'truth-first real estate intelligence',
      secondaryTopics: ['city market intelligence', 'luxury real estate', 'pricing signals', 'supply dynamics', 'verified listings'],
      ogImage: abs('/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Vantera', about: [...ABOUT.truthPlatform] },
      internalLinks: { shouldLinkTo: ['luxury_global', 'city_hub', 'sell_luxury', 'agents'], shouldNotCompeteWith: [] },
    };
  },

  luxuryGlobal(): SeoDoc {
    const canonical = abs('/luxury-real-estate');
    return {
      kind: 'luxury_global',
      canonical,
      title: makeTitle('Luxury Real Estate for Sale - Truth-First Market Intelligence'),
      description: makeDescription(
        'Explore luxury real estate for sale through truth-first market intelligence. Prime areas, real value signals, liquidity indicators, and pricing reality beyond listings.'
      ),
      primaryTopic: 'luxury real estate for sale',
      secondaryTopics: ['luxury homes for sale', 'prime real estate', 'high-end property', 'luxury market intelligence'],
      ogImage: abs('/luxury-real-estate/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Luxury Real Estate for Sale', about: [...ABOUT.luxury, ...ABOUT.truthPlatform, ...ABOUT.audienceLuxury] },
      internalLinks: { shouldLinkTo: ['luxury_city', 'city_hub'], shouldNotCompeteWith: ['listing'] },
    };
  },

  cityHub(city: CityLite): SeoDoc {
    const canonical = abs(`/city/${city.slug}`);
    const citySuffix = placeLine(city);

    return {
      kind: 'city_hub',
      canonical,
      title: makeTitle(`${city.name} Real Estate Intelligence - Supply, Pricing Signals, Market Truth`),
      description: makeDescription(
        `Real estate intelligence for ${city.name}${citySuffix}. Track supply pressure, pricing signals, market reality, and explore verified listings built on truth-first analysis.`
      ),
      primaryTopic: `${city.name} real estate`,
      secondaryTopics: [`${city.name} property market`, `${city.name} housing supply`, `${city.name} pricing`, `${city.name} luxury real estate`],
      ogImage: abs(`/city/${city.slug}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `${city.name} Real Estate Intelligence`,
        about: [
          { type: 'Place', name: city.name, extra: { country: city.country ?? undefined, region: city.region ?? undefined } },
          ...ABOUT.truthPlatform,
        ],
      },
      internalLinks: {
        shouldLinkTo: ['luxury_city', 'listing'],
        shouldNotCompeteWith: ['luxury_city'],
      },
    };
  },

  luxuryCity(city: CityLite): SeoDoc {
    const canonical = abs(`/city/${city.slug}/luxury-real-estate`);
    const citySuffix = placeLine(city);

    return {
      kind: 'luxury_city',
      canonical,
      title: makeTitle(`Luxury Real Estate for Sale in ${city.name} - Real Value and Market Truth`),
      description: makeDescription(
        `Luxury real estate for sale in ${city.name}${citySuffix}. Prime areas, real value signals, liquidity indicators, and pricing reality - designed for clarity beyond marketing.`
      ),
      primaryTopic: `luxury real estate for sale in ${city.name}`,
      secondaryTopics: [
        `luxury homes for sale in ${city.name}`,
        `prime real estate ${city.name}`,
        `high-end property ${city.name}`,
        `exclusive homes ${city.name}`,
      ],
      ogImage: abs(`/city/${city.slug}/luxury-real-estate/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `Luxury Real Estate for Sale in ${city.name}`,
        about: [
          { type: 'Place', name: city.name, extra: { country: city.country ?? undefined, region: city.region ?? undefined } },
          ...ABOUT.luxury,
          ...ABOUT.truthPlatform,
          ...ABOUT.audienceLuxury,
        ],
      },
      internalLinks: {
        shouldLinkTo: ['city_hub', 'listing'],
        shouldNotCompeteWith: ['luxury_global'],
      },
    };
  },

  listing(listing: ListingLite): SeoDoc {
    const canonical = abs(`/listing/${listing.slug || listing.id}`);
    const price = listing.priceLabel ? ` - ${listing.priceLabel}` : '';
    const propertyType = listing.propertyType ? listing.propertyType : 'home';

    return {
      kind: 'listing',
      canonical,
      title: makeTitle(`${listing.title}${price} - ${propertyType} for sale in ${listing.cityName}`),
      description: makeDescription(
        `${listing.title} in ${listing.cityName}. View pricing context, liquidity indicators, and truth-first listing signals designed to separate asking price from market reality.`
      ),
      primaryTopic: `${propertyType} for sale in ${listing.cityName}`,
      secondaryTopics: [`${listing.cityName} property for sale`, `${listing.cityName} real estate listing`, 'luxury homes for sale', 'market value signals'],
      ogImage: abs(`/listing/${listing.slug || listing.id}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `${listing.title} - ${listing.cityName}`,
        about: [{ type: 'Place', name: listing.cityName }, { type: 'Thing', name: 'Real estate listing' }, ...ABOUT.truthPlatform],
      },
      internalLinks: { shouldLinkTo: ['city_hub', 'luxury_city'], shouldNotCompeteWith: ['luxury_city', 'luxury_global'] },
    };
  },
};
