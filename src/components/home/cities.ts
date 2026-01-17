// src/components/home/cities.ts

export type CityImage = {
  src: string;
  alt?: string;

  // Optional: allow card media to be a video too (no breaking change)
  // If omitted, treat as image.
  kind?: 'image' | 'video';
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

  // Card / catalogue media (image or video)
  image?: CityImage;

  tier?: CoverageTier;
  status?: CoverageStatus;
  priority?: number;

  clusterSlug?: string;

  // HERO (required image, optional video)
  // HeroPortalSection uses video if heroVideoSrc is present
  heroImageSrc: string;
  heroImageAlt?: string;

  heroVideoSrc?: string;
  heroVideoPosterSrc?: string;
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
    headline: 'Single-market lock',
    blurb:
      'One market, one city. Costa del Sol is represented as Marbella for clean data, clean UX and disciplined signals.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Costa del Sol coastline at dusk',
    },
    citySlugs: ['marbella'],
  },
  {
    slug: 'balearic-islands',
    name: 'Balearic Islands',
    country: 'Spain',
    region: 'Europe',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 3,
    headline: 'Coverage expanding',
    blurb: 'Ultra-prime island markets. Clean structure first, deeper verification later.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Balearic Islands coastline at golden hour',
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

    heroImageSrc: '/images/city/miami.jpg',
    heroImageAlt: 'Miami skyline across the water',

    // heroVideoSrc: '/images/hero/homepage/miami.mp4',
    // heroVideoPosterSrc: '/images/city/miami.jpg',
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

    heroImageSrc: '/images/city/new-york.jpg',
    heroImageAlt: 'New York skyline at blue hour',

    // heroVideoSrc: '/images/hero/homepage/new-york.mp4',
    // heroVideoPosterSrc: '/images/city/new-york.jpg',
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
      src: '/images/hero/homepage/monaco.mp4',
      alt: 'Monaco harbour with yachts and skyline',
      kind: 'video',
    },

    heroImageSrc: '/images/city/monaco.jpg',
    heroImageAlt: 'Monaco harbour with yachts and skyline',

    // heroVideoSrc: '/images/hero/homepage/monaco.mp4',
    // heroVideoPosterSrc: '/images/city/monaco.jpg',
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

    heroImageSrc: '/images/city/dubai.jpg',
    heroImageAlt: 'Dubai skyline at dusk',

    // heroVideoSrc: '/images/hero/homepage/dubai.mp4',
    // heroVideoPosterSrc: '/images/city/dubai.jpg',
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

    heroImageSrc: '/images/city/london.jpg',
    heroImageAlt: 'London skyline with river and lights',

    // heroVideoSrc: '/images/hero/homepage/london.mp4',
    // heroVideoPosterSrc: '/images/city/london.jpg',
  },

  // Marbella = Costa del Sol (single city)
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
    blurb: 'Costa del Sol, locked as one market. Prime coastal living and global luxury demand.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Mediterranean coastline near Marbella',
    },

    heroImageSrc: '/images/city/marbella.jpg',
    heroImageAlt: 'Mediterranean coastline near Marbella',

    // heroVideoSrc: '/images/hero/homepage/marbella.mp4',
    // heroVideoPosterSrc: '/images/city/marbella.jpg',
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

    heroImageSrc: '/images/city/cannes.jpg',
    heroImageAlt: 'Cannes-style marina and waterfront',

    // heroVideoSrc: '/images/hero/homepage/cannes.mp4',
    // heroVideoPosterSrc: '/images/city/cannes.jpg',
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

    heroImageSrc: '/images/city/nice.jpg',
    heroImageAlt: 'Nice coastline with promenade and sea',

    // heroVideoSrc: '/images/hero/homepage/nice.mp4',
    // heroVideoPosterSrc: '/images/city/nice.jpg',
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

    heroImageSrc: '/images/city/saint-tropez.jpg',
    heroImageAlt: 'Saint-Tropez harbour with yachts',

    // heroVideoSrc: '/images/hero/homepage/saint-tropez.mp4',
    // heroVideoPosterSrc: '/images/city/saint-tropez.jpg',
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
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2600&q=85',
      alt: 'Paris Eiffel Tower view',
    },

    heroImageSrc: '/images/city/paris.jpg',
    heroImageAlt: 'Paris Eiffel Tower view',

    // heroVideoSrc: '/images/hero/homepage/paris.mp4',
    // heroVideoPosterSrc: '/images/city/paris.jpg',
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

    heroImageSrc: '/images/city/lake-como.jpg',
    heroImageAlt: 'Lake Como shoreline',

    // heroVideoSrc: '/images/hero/homepage/lake-como.mp4',
    // heroVideoPosterSrc: '/images/city/lake-como.jpg',
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

    heroImageSrc: '/images/city/swiss-alps.jpg',
    heroImageAlt: 'Snowy mountain landscape',

    // heroVideoSrc: '/images/hero/homepage/swiss-alps.mp4',
    // heroVideoPosterSrc: '/images/city/swiss-alps.jpg',
  },
  {
    slug: 'mallorca',
    name: 'Mallorca',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    tier: 'TIER_3',
    status: 'EXPANDING',
    priority: 19,
    clusterSlug: 'balearic-islands',
    blurb: 'Ultra-prime coastal estates and trophy hillside assets. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Mallorca coastline',
    },

    heroImageSrc: '/images/city/mallorca.jpg',
    heroImageAlt: 'Mallorca coastline',

    // heroVideoSrc: '/images/hero/homepage/mallorca.mp4',
    // heroVideoPosterSrc: '/images/city/mallorca.jpg',
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
    clusterSlug: 'balearic-islands',
    blurb: 'Ultra-prime seasonal market. Coverage expanding.',
    image: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=85',
      alt: 'Ibiza coastline',
    },

    heroImageSrc: '/images/city/ibiza.jpg',
    heroImageAlt: 'Ibiza coastline',

    // heroVideoSrc: '/images/hero/homepage/ibiza.mp4',
    // heroVideoPosterSrc: '/images/city/ibiza.jpg',
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

    heroImageSrc: '/images/city/singapore.jpg',
    heroImageAlt: 'Singapore skyline at dusk',

    // heroVideoSrc: '/images/hero/homepage/singapore.mp4',
    // heroVideoPosterSrc: '/images/city/singapore.jpg',
  },
];

export const ALL_CITIES: City[] = [...CITIES, ...WATCHLIST_CITIES].sort(
  (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
);
