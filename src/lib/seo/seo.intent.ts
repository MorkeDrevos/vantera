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
  | 'crm'
  | 'keyword_pillar'
  | 'city_keyword';

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

export type KeywordPillarLite = {
  slug: string; // e.g. "luxury-villas-for-sale"
  phrase: string; // e.g. "Luxury Villas for Sale"
  description?: string | null;
  topics?: string[] | null;
};

export type CityKeywordLite = {
  city: CityLite;
  slug: string; // full path slug after /city/{city.slug}/... e.g. "luxury-villas"
  phrase: string; // e.g. "Luxury Villas"
  description?: string | null;
  topics?: string[] | null;
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
  // Keep hyphen, no long dashes, no Oxford comma logic needed here
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

/* ---------------------------------------------
   Locked language (brand + trust + keywords)
---------------------------------------------- */

const BRAND = {
  name: 'Vantera',
  tagline: 'Private intelligence for the world’s most valuable assets',
  truth: 'Truth-first real estate intelligence built to model value, liquidity, and risk without noise.',
};

const KEY = {
  truthSignals: 'pricing signals, liquidity reality, and risk context',
  beyondListings: 'built to separate asking price from what the market will pay',
};

const MATRIX = {
  homeTitle: () => `Vantera - ${BRAND.tagline}`,
  homeDescription: () =>
    makeDescription(
      `${BRAND.tagline}. ${BRAND.truth} Explore cities, listings, private sellers, and agent launchpads.`
    ),

  cityHubTitle: (city: CityLite) =>
    makeTitle(`${city.name} Real Estate Intelligence - Truth-First Market Signals · ${BRAND.name}`),

  cityHubDescription: (city: CityLite) =>
    makeDescription(
      `Truth-first real estate intelligence for ${city.name}${placeLine(city)}. ${KEY.truthSignals} - ${KEY.beyondListings}.`
    ),

  luxuryGlobalTitle: () =>
    makeTitle(`Luxury Real Estate for Sale - Truth-First Market Intelligence · ${BRAND.name}`),

  luxuryGlobalDescription: () =>
    makeDescription(
      `Luxury real estate for sale with truth-first intelligence. Prime areas, real value signals, and liquidity reality - ${KEY.beyondListings}.`
    ),

  luxuryCityTitle: (city: CityLite) =>
    makeTitle(`Luxury Real Estate for Sale in ${city.name} - Truth-First Intelligence · ${BRAND.name}`),

  luxuryCityDescription: (city: CityLite) =>
    makeDescription(
      `Luxury real estate for sale in ${city.name}${placeLine(city)}. Prime areas, real value signals, and liquidity reality - ${KEY.beyondListings}.`
    ),

  sellLuxuryTitle: () =>
    makeTitle(`Sell Luxury Property Privately - Truth-First Listing on ${BRAND.name}`),

  sellLuxuryDescription: () =>
    makeDescription(
      `Sell your luxury property privately with truth-first positioning. Publish with pricing context and signals buyers trust - no noise, no gimmicks.`
    ),

  agentsTitle: () =>
    makeTitle(`${BRAND.name} for Agents - Launch Your Site on a Truth-First Protocol`),

  agentsDescription: () =>
    makeDescription(
      `Launch your agent site with truth-first intelligence, listings with context, and trust-first positioning. Build inbound without portal games.`
    ),

  crmTitle: () => makeTitle(`${BRAND.name} CRM - Luxury Relationship Intelligence (Coming Soon)`),

  crmDescription: () =>
    makeDescription(
      `A CRM designed for luxury real estate workflows. Truth-first market context, client intelligence, and execution tooling for elite agents.`
    ),

  keywordPillarTitle: (phrase: string) => makeTitle(`${phrase} - Truth-First Intelligence · ${BRAND.name}`),

  keywordPillarDescription: (phrase: string, custom?: string | null) =>
    makeDescription(
      custom ??
        `${phrase} with truth-first intelligence. Real value signals, liquidity reality, and risk context - ${KEY.beyondListings}.`
    ),

  cityKeywordTitle: (phrase: string, city: CityLite) =>
    makeTitle(`${phrase} in ${city.name} - Truth-First Intelligence · ${BRAND.name}`),

  cityKeywordDescription: (phrase: string, city: CityLite, custom?: string | null) =>
    makeDescription(
      custom ??
        `${phrase} in ${city.name}${placeLine(city)} with truth-first intelligence. Prime areas, real value signals, and liquidity reality - ${KEY.beyondListings}.`
    ),
};

/* ---------------------------------------------
   JSON-LD topic packs
---------------------------------------------- */

const ABOUT = {
  brandCore: [
    { type: 'Thing' as const, name: BRAND.tagline },
    { type: 'Thing' as const, name: 'Truth-first real estate intelligence' },
    { type: 'Thing' as const, name: 'Property value signals' },
    { type: 'Thing' as const, name: 'Market liquidity' },
    { type: 'Thing' as const, name: 'Risk flags' },
  ],
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
    { type: 'Thing' as const, name: 'Off-market luxury' },
  ],
  audienceLuxury: [{ type: 'Audience' as const, name: 'High net worth buyers and investors' }],
};

/* ---------------------------------------------
   Public intent API (single source of truth)
---------------------------------------------- */

export const SEO_INTENT = {
  abs,

  home(): SeoDoc {
    const canonical = abs('/');
    return {
      kind: 'home',
      canonical,
      title: MATRIX.homeTitle(),
      description: MATRIX.homeDescription(),
      primaryTopic: 'private real estate intelligence',
      secondaryTopics: [
        'truth-first real estate intelligence',
        'luxury real estate',
        'pricing signals',
        'liquidity reality',
        'verified listings',
        'agent launchpads',
        'private sellers',
      ],
      ogImage: abs('/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Vantera', about: [...ABOUT.brandCore, ...ABOUT.truthPlatform] },
      internalLinks: { shouldLinkTo: ['luxury_global', 'city_hub', 'sell_luxury', 'agents'], shouldNotCompeteWith: [] },
    };
  },

  luxuryGlobal(): SeoDoc {
    const canonical = abs('/luxury-real-estate');
    return {
      kind: 'luxury_global',
      canonical,
      title: MATRIX.luxuryGlobalTitle(),
      description: MATRIX.luxuryGlobalDescription(),
      primaryTopic: 'luxury real estate for sale',
      secondaryTopics: ['luxury homes for sale', 'prime real estate', 'high-end property', 'off-market luxury', 'luxury market intelligence'],
      ogImage: abs('/luxury-real-estate/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Luxury Real Estate for Sale', about: [...ABOUT.brandCore, ...ABOUT.luxury, ...ABOUT.truthPlatform, ...ABOUT.audienceLuxury] },
      internalLinks: { shouldLinkTo: ['luxury_city', 'city_hub'], shouldNotCompeteWith: ['listing'] },
    };
  },

  cityHub(city: CityLite): SeoDoc {
    const canonical = abs(`/city/${city.slug}`);

    return {
      kind: 'city_hub',
      canonical,
      title: MATRIX.cityHubTitle(city),
      description: MATRIX.cityHubDescription(city),
      primaryTopic: `${city.name} real estate`,
      secondaryTopics: [
        `${city.name} property market`,
        `${city.name} housing supply`,
        `${city.name} pricing`,
        `${city.name} luxury real estate`,
        'pricing signals',
        'market liquidity',
      ],
      ogImage: abs(`/city/${city.slug}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `${city.name} Real Estate Intelligence`,
        about: [
          { type: 'Place', name: city.name, extra: { country: city.country ?? undefined, region: city.region ?? undefined } },
          ...ABOUT.brandCore,
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

    return {
      kind: 'luxury_city',
      canonical,
      title: MATRIX.luxuryCityTitle(city),
      description: MATRIX.luxuryCityDescription(city),
      primaryTopic: `luxury real estate for sale in ${city.name}`,
      secondaryTopics: [
        `luxury homes for sale in ${city.name}`,
        `prime real estate ${city.name}`,
        `high-end property ${city.name}`,
        `exclusive homes ${city.name}`,
        'pricing reality',
        'liquidity signals',
      ],
      ogImage: abs(`/city/${city.slug}/luxury-real-estate/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `Luxury Real Estate for Sale in ${city.name}`,
        about: [
          { type: 'Place', name: city.name, extra: { country: city.country ?? undefined, region: city.region ?? undefined } },
          ...ABOUT.brandCore,
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
      title: makeTitle(`${listing.title}${price} - ${propertyType} for sale in ${listing.cityName} · ${BRAND.name}`),
      description: makeDescription(
        `${listing.title} in ${listing.cityName}. View pricing context, liquidity indicators, and truth-first listing signals - ${KEY.beyondListings}.`
      ),
      primaryTopic: `${propertyType} for sale in ${listing.cityName}`,
      secondaryTopics: [
        `${listing.cityName} property for sale`,
        `${listing.cityName} real estate listing`,
        'luxury homes for sale',
        'market value signals',
        'pricing reality',
      ],
      ogImage: abs(`/listing/${listing.slug || listing.id}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `${listing.title} - ${listing.cityName}`,
        about: [
          { type: 'Thing', name: BRAND.tagline },
          { type: 'Place', name: listing.cityName },
          { type: 'Thing', name: 'Real estate listing' },
          ...ABOUT.truthPlatform,
        ],
      },
      internalLinks: { shouldLinkTo: ['city_hub', 'luxury_city'], shouldNotCompeteWith: ['luxury_city', 'luxury_global'] },
    };
  },

  sellLuxury(): SeoDoc {
    const canonical = abs('/sell-luxury-property');
    return {
      kind: 'sell_luxury',
      canonical,
      title: MATRIX.sellLuxuryTitle(),
      description: MATRIX.sellLuxuryDescription(),
      primaryTopic: 'sell luxury property privately',
      secondaryTopics: ['sell high-end property', 'private seller platform', 'truth-first listing', 'pricing context'],
      ogImage: abs('/sell-luxury-property/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Sell Luxury Property Privately', about: [...ABOUT.brandCore, ...ABOUT.luxury] },
      internalLinks: { shouldLinkTo: ['home', 'luxury_global', 'agents'], shouldNotCompeteWith: [] },
    };
  },

  agents(): SeoDoc {
    const canonical = abs('/agents');
    return {
      kind: 'agents',
      canonical,
      title: MATRIX.agentsTitle(),
      description: MATRIX.agentsDescription(),
      primaryTopic: 'agent websites for luxury real estate',
      secondaryTopics: ['real estate agent website', 'luxury agent tools', 'truth-first listings', 'agent launchpad'],
      ogImage: abs('/agents/opengraph-image'),
      robots: { index: true, follow: true },
      jsonld: { name: 'Vantera for Agents', about: [...ABOUT.brandCore, ...ABOUT.truthPlatform] },
      internalLinks: { shouldLinkTo: ['home', 'luxury_global', 'sell_luxury'], shouldNotCompeteWith: [] },
    };
  },

  crm(): SeoDoc {
    const canonical = abs('/crm');
    return {
      kind: 'crm',
      canonical,
      title: MATRIX.crmTitle(),
      description: MATRIX.crmDescription(),
      primaryTopic: 'luxury real estate CRM',
      secondaryTopics: ['client relationship management', 'deal pipeline', 'luxury agent workflows', 'market context'],
      ogImage: abs('/crm/opengraph-image'),
      robots: { index: false, follow: false },
      jsonld: { name: 'Vantera CRM', about: [...ABOUT.brandCore] },
      internalLinks: { shouldLinkTo: ['agents'], shouldNotCompeteWith: [] },
    };
  },

  // Future domination pages (global keyword pillars)
  keywordPillar(input: KeywordPillarLite): SeoDoc {
    const canonical = abs(`/${input.slug}`);
    const topics = (input.topics ?? []).filter(Boolean);

    return {
      kind: 'keyword_pillar',
      canonical,
      title: MATRIX.keywordPillarTitle(input.phrase),
      description: MATRIX.keywordPillarDescription(input.phrase, input.description ?? null),
      primaryTopic: clean(input.phrase.toLowerCase()),
      secondaryTopics: [
        ...topics,
        'truth-first intelligence',
        'pricing reality',
        'liquidity signals',
        'prime real estate',
      ],
      ogImage: abs(`/${input.slug}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: input.phrase,
        about: [
          { type: 'Thing', name: BRAND.tagline },
          { type: 'Thing', name: input.phrase },
          ...ABOUT.luxury,
          ...ABOUT.truthPlatform,
        ],
      },
      internalLinks: { shouldLinkTo: ['luxury_global', 'city_hub'], shouldNotCompeteWith: ['luxury_global'] },
    };
  },

  // Future domination pages (city + keyword long-tail)
  cityKeyword(input: CityKeywordLite): SeoDoc {
    const canonical = abs(`/city/${input.city.slug}/${input.slug}`);
    const topics = (input.topics ?? []).filter(Boolean);

    return {
      kind: 'city_keyword',
      canonical,
      title: MATRIX.cityKeywordTitle(input.phrase, input.city),
      description: MATRIX.cityKeywordDescription(input.phrase, input.city, input.description ?? null),
      primaryTopic: clean(`${input.phrase} in ${input.city.name}`.toLowerCase()),
      secondaryTopics: [
        ...topics,
        `${input.city.name} luxury real estate`,
        'pricing reality',
        'liquidity signals',
        'risk context',
      ],
      ogImage: abs(`/city/${input.city.slug}/${input.slug}/opengraph-image`),
      robots: { index: true, follow: true },
      jsonld: {
        name: `${input.phrase} in ${input.city.name}`,
        about: [
          { type: 'Place', name: input.city.name, extra: { country: input.city.country ?? undefined, region: input.city.region ?? undefined } },
          { type: 'Thing', name: BRAND.tagline },
          { type: 'Thing', name: input.phrase },
          ...ABOUT.luxury,
          ...ABOUT.truthPlatform,
        ],
      },
      internalLinks: { shouldLinkTo: ['luxury_city', 'city_hub', 'listing'], shouldNotCompeteWith: [] },
    };
  },
};
