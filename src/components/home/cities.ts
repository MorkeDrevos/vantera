// src/components/home/cities.ts

export type CityImage = {
  src: string;
  alt?: string;
};

export type CoverageTier = 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3';
export type CoverageStatus = 'LIVE' | 'TRACKING' | 'EXPANDING';

export type RegionCluster = {
  slug: string;
  name: string;
  country?: string;
  region?: string;

  tier: CoverageTier;
  status: CoverageStatus;

  priority: number;

  headline?: string;
  blurb?: string;

  image?: CityImage;

  // Which cities belong to this cluster (by city slug)
  citySlugs: string[];
};

export type City = {
  slug: string;
  name: string;
  country: string;
  region?: string;
  tz: string;
  blurb?: string;
  image?: CityImage;

  tier?: CoverageTier;
  status?: CoverageStatus;
  priority?: number;

  clusterSlug?: string;
};

/**
 * Canonical Vantera coverage clusters
 */
export const REGION_CLUSTERS: RegionCluster[] = [
  {
    slug: 'miami-metro',
    name: 'Miami Metro',
    country: 'United States',
    region: 'North America',
    tier: 'TIER_0',
    status: 'LIVE',
    priority: 10,
    headline: 'Flagship coverage',
    blurb:
      'Prime waterfront districts, institutional buyer flow and the reference implementation for liquidity-led signals.',
    image: {
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2600&q=85',
      alt: 'Miami Metro skyline at golden hour',
    },
    citySlugs: ['miami', 'new-york'],
  },
  {
    slug: 'costa-del-sol',
    name: 'Costa del Sol',
    country: 'Spain',
    region: 'Europe',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 8,
    headline: 'Unified market',
    blurb:
      'One market, one intelligence lens. All Costa del Sol coverage is represented under Marbella to avoid fragmented signals.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Costa del Sol coastline and Mediterranean light',
    },
    // LOCKED: Costa del Sol is a single canonical city in Vantera
    citySlugs: ['marbella'],
  },
  {
    slug: 'balearics',
    name: 'Balearics',
    country: 'Spain',
    region: 'Europe',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 5,
    headline: 'Island prime',
    blurb: 'Mallorca and Ibiza as distinct luxury islands, tracked separately from mainland clusters.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Balearic coastline and sea',
    },
    citySlugs: ['mallorca', 'ibiza'],
  },
  {
    slug: 'french-riviera',
    name: 'French Riviera',
    country: 'France',
    region: 'Europe',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 6,
    headline: 'Coverage expanding',
    blurb: 'A dense coastal luxury cluster. Market structure first, listings as the dataset matures.',
    image: {
      src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2600&q=85',
      alt: 'French Riviera coastal hillside and sea',
    },
    citySlugs: ['cannes', 'nice', 'saint-tropez', 'paris'],
  },

  // Tier 3 region groupings
  {
    slug: 'lake-como-region',
    name: 'Lake Como Region',
    country: 'Italy',
    region: 'Europe',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 2,
    headline: 'Coverage expanding',
    blurb: 'Trophy lakefront assets. Market structure first, verified inventory later.',
    image: {
      src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=2600&q=85',
      alt: 'Lake Como shoreline with villas',
    },
    citySlugs: ['lake-como'],
  },
  {
    slug: 'swiss-alps-region',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 1,
    headline: 'Coverage expanding',
    blurb: 'Seasonal prime markets with strict truth signals and high verification standards.',
    image: {
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2600&q=85',
      alt: 'Swiss Alps winter ridgeline',
    },
    citySlugs: ['swiss-alps'],
  },
];

/**
 * Core launch cities (Tiers 0-2)
 */
export const CITIES: City[] = [
  // Tier 0
  {
    slug: 'miami',
    name: 'Miami',
    country: 'United States',
    region: 'North America',
    tz: 'America/New_York',
    tier: 'TIER_0',
    status: 'LIVE',
    priority: 100,
    clusterSlug: 'miami-metro',
    blurb: 'Prime waterfront capital and global buyer flow. Liquidity-led intelligence and verified market signals.',
    image: {
      src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2600&q=85',
      alt: 'Miami skyline across the water',
    },
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    tz: 'America/New_York',
    tier: 'TIER_0',
    status: 'LIVE',
    priority: 95,
    clusterSlug: 'miami-metro',
    blurb: 'Prime districts only, with a truth-first lens and disciplined cross-border comparables.',
    image: {
      src: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=2600&q=85',
      alt: 'New York skyline at blue hour',
    },
  },

  // Tier 1
  {
    slug: 'monaco',
    name: 'Monaco',
    country: 'Monaco',
    region: 'Europe',
    tz: 'Europe/Paris',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 86,
    blurb: 'Ultra-prime density and global capital concentration. Verified signals only.',
    image: {
      src: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=2600&q=85',
      alt: 'Monaco harbour with yachts and skyline',
    },
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tz: 'Asia/Dubai',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 76,
    blurb: 'Modern skyline, speed and scale. Prime districts behave like a global asset class.',
    image: {
      src: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=2600&q=85',
      alt: 'Dubai skyline at dusk',
    },
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    tz: 'Europe/London',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 74,
    blurb: 'A global capital with deep prime neighbourhood structure and cross-border demand.',
    image: {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2600&q=85',
      alt: 'London skyline with river and lights',
    },
  },

  // LOCKED: Costa del Sol = Marbella
  {
    slug: 'marbella',
    name: 'Marbella (Costa del Sol)',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 70,
    clusterSlug: 'costa-del-sol',
    blurb:
      'The canonical Costa del Sol market. Prime coastal living, gated estates and hillside luxury unified under one intelligence lens.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Mediterranean coastline near Marbella',
    },
  },

  // Tier 2
  {
    slug: 'cannes',
    name: 'Cannes',
    country: 'France',
    region: 'Europe',
    tz: 'Europe/Paris',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 50,
    clusterSlug: 'french-riviera',
    blurb: 'Riviera prime and yachting density. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=2600&q=85',
      alt: 'Cannes-style marina and waterfront',
    },
  },
  {
    slug: 'nice',
    name: 'Nice',
    country: 'France',
    region: 'Europe',
    tz: 'Europe/Paris',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 45,
    clusterSlug: 'french-riviera',
    blurb: 'Coastal lifestyle and prime districts. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Nice coastline with promenade and sea',
    },
  },
  {
    slug: 'saint-tropez',
    name: 'Saint-Tropez',
    country: 'France',
    region: 'Europe',
    tz: 'Europe/Paris',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 40,
    clusterSlug: 'french-riviera',
    blurb: 'Ultra-prime seasonal market. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=2600&q=85',
      alt: 'Saint-Tropez harbour with yachts',
    },
  },
];

/**
 * Tier 3 watchlist - included at launch (visible and searchable)
 */
export const WATCHLIST_CITIES: City[] = [
  // Mallorca added (separate from Costa del Sol)
  {
    slug: 'mallorca',
    name: 'Mallorca',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_2',
    status: 'EXPANDING',
    priority: 34,
    clusterSlug: 'balearics',
    blurb: 'Island prime with distinct micro-markets, coastal trophy homes and year-round demand pockets.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Mallorca coastline and coves',
    },
  },

  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    tz: 'Europe/Paris',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 30,
    blurb: 'Prime districts only. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2600&q=85',
      alt: 'Paris Eiffel Tower view',
    },
  },
  {
    slug: 'lake-como',
    name: 'Lake Como',
    country: 'Italy',
    region: 'Europe',
    tz: 'Europe/Rome',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 25,
    clusterSlug: 'lake-como-region',
    blurb: 'Trophy lakefront assets. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=2600&q=85',
      alt: 'Lake Como shoreline',
    },
  },
  {
    slug: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    tz: 'Europe/Zurich',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 20,
    clusterSlug: 'swiss-alps-region',
    blurb: 'Seasonal prime with strict truth signals. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2600&q=85',
      alt: 'Snowy mountain landscape',
    },
  },
  {
    slug: 'ibiza',
    name: 'Ibiza',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 18,
    clusterSlug: 'balearics',
    blurb: 'Ultra-prime seasonal market. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Ibiza coastline',
    },
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    tz: 'Asia/Singapore',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 15,
    blurb: 'Global capital with prime-only coverage. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d0?auto=format&fit=crop&w=2600&q=85',
      alt: 'Singapore skyline at dusk',
    },
  },
];

export const ALL_CITIES: City[] = [...CITIES, ...WATCHLIST_CITIES].sort(
  (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
);
