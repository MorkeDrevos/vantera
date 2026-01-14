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
  // Existing fields used by UI today
  slug: string;
  name: string;
  country: string;
  region?: string;
  tz: string;
  blurb?: string;
  image?: CityImage;

  // Coverage metadata (optional - won't break current UI)
  tier?: CoverageTier;
  status?: CoverageStatus;
  priority?: number;

  // Optional: link city to a RegionCluster
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
      src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2400&q=80',
      alt: 'Miami skyline across the water',
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
    headline: 'Coverage tracking',
    blurb:
      'Prime coastal markets, verified supply signals and a disciplined lens for second-home and relocation demand.',
    image: {
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'Costa del Sol coastline',
    },
    citySlugs: ['marbella', 'benahavis', 'estepona', 'ibiza'],
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
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'French Riviera coastline',
    },
    citySlugs: ['cannes', 'nice', 'saint-tropez', 'paris'],
  },

  // Tier 3 region groupings (still included at launch)
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
      src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=2400&q=80',
      alt: 'Lake Como shoreline',
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
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80',
      alt: 'Snowy mountain landscape',
    },
    citySlugs: ['swiss-alps'],
  },
];

/**
 * Core launch cities (Tiers 0-2)
 */
export const CITIES: City[] = [
  // Tier 0 (flagship)
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
    blurb:
      'Prime waterfront capital and global buyer flow. Liquidity-led intelligence and verified market signals.',
    image: {
      src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2400&q=80',
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
      src: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=2400&q=80',
      alt: 'New York skyline',
    },
  },

  // Tier 1
  {
    slug: 'marbella',
    name: 'Marbella',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 80,
    clusterSlug: 'costa-del-sol',
    blurb: 'Prime coastal living and global luxury demand. Signals tracking with disciplined verification.',
    image: {
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'Marbella coastline and Mediterranean horizon',
    },
  },
  {
    slug: 'benahavis',
    name: 'Benahavís',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 78,
    clusterSlug: 'costa-del-sol',
    blurb: 'Gated estates, golf corridors and hillside privacy above the coast.',
    image: {
      src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80',
      alt: 'Hills and valleys above the Costa del Sol',
    },
  },
  {
    slug: 'estepona',
    name: 'Estepona',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 76,
    clusterSlug: 'costa-del-sol',
    blurb: 'Beachfront modern builds and a calmer luxury rhythm with strong value.',
    image: {
      src: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60b?auto=format&fit=crop&w=2400&q=80',
      alt: 'Sunlit coastal promenade on the Costa del Sol',
    },
  },
  {
    slug: 'monaco',
    name: 'Monaco',
    country: 'Monaco',
    region: 'Europe',
    tz: 'Europe/Monaco',
    tier: 'TIER_1',
    status: 'TRACKING',
    priority: 74,
    blurb: 'Ultra-prime density and global capital concentration.',
    image: {
      src: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=2400&q=80',
      alt: 'Monaco harbour with yachts and city skyline',
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
    priority: 72,
    blurb: 'Modern skyline, speed and scale. Prime districts behave like a global asset class.',
    image: {
      src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80',
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
    priority: 70,
    blurb: 'A global capital with deep prime neighbourhood structure and cross-border demand.',
    image: {
      src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2400&q=80',
      alt: 'London skyline with river',
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
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'Cannes waterfront',
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
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'Nice coastline and Promenade-style waterfront',
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
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
      alt: 'Saint-Tropez harbour',
    },
  },
];

/**
 * Tier 3 watchlist - included at launch (visible and searchable)
 */
export const WATCHLIST_CITIES: City[] = [
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
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=80',
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
      src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=2400&q=80',
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
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80',
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
    clusterSlug: 'costa-del-sol',
    blurb: 'Ultra-prime seasonal market. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80',
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
      src: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d0?auto=format&fit=crop&w=2400&q=80',
      alt: 'Singapore skyline at dusk',
    },
  },
];

// Canonical combined list (use this everywhere you want "all cities")
export const ALL_CITIES: City[] = [...CITIES, ...WATCHLIST_CITIES].sort(
  (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
);
