// src/components/home/listings.ts

export type ListingImage = {
  src: string;
  alt?: string;
};

export type Listing = {
  id: string;
  slug: string;

  title: string;
  location: string; // e.g. "Golden Mile, Marbella"
  priceEur: number;

  beds?: number;
  baths?: number;
  sqm?: number;

  status?: 'For sale' | 'For rent' | 'New';
  kind?: 'Villa' | 'Apartment' | 'Penthouse' | 'Plot' | 'Townhouse';

  image?: ListingImage;
};

export const FEATURED_LISTINGS: Listing[] = [
  {
    id: 'lm-001',
    slug: 'royal-golden-mile-villa',
    title: 'Royal Villa with Panoramic Sea Views',
    location: 'Golden Mile, Marbella',
    priceEur: 7950000,
    beds: 6,
    baths: 7,
    sqm: 820,
    status: 'For sale',
    kind: 'Villa',
    image: {
      // Use your own images later. For now: stable placeholder via picsum (rarely 404s).
      src: 'https://picsum.photos/id/1018/1600/1000',
      alt: 'Luxury villa exterior',
    },
  },
  {
    id: 'lm-002',
    slug: 'puente-romano-penthouse',
    title: 'Penthouse Steps from Puente Romano',
    location: 'Puente Romano, Marbella',
    priceEur: 3490000,
    beds: 3,
    baths: 3,
    sqm: 240,
    status: 'For sale',
    kind: 'Penthouse',
    image: {
      src: 'https://picsum.photos/id/1025/1600/1000',
      alt: 'Penthouse terrace',
    },
  },
  {
    id: 'lm-003',
    slug: 'benahavis-modern-villa',
    title: 'Modern Architectural Masterpiece',
    location: 'Benahavis, Costa del Sol',
    priceEur: 4995000,
    beds: 5,
    baths: 6,
    sqm: 560,
    status: 'New',
    kind: 'Villa',
    image: {
      src: 'https://picsum.photos/id/1031/1600/1000',
      alt: 'Modern villa',
    },
  },
  {
    id: 'lm-004',
    slug: 'beachfront-apartment',
    title: 'Beachfront Apartment with Hotel Services',
    location: 'Estepona, Costa del Sol',
    priceEur: 1295000,
    beds: 2,
    baths: 2,
    sqm: 135,
    status: 'For sale',
    kind: 'Apartment',
    image: {
      src: 'https://picsum.photos/id/1043/1600/1000',
      alt: 'Beachfront apartment view',
    },
  },
];
