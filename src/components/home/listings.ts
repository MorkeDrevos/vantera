export type Listing = {
  id: string;
  title: string;
  city: string;
  country: string;
  region?: string;
  priceEur: number;
  beds?: number;
  baths?: number;
  areaM2?: number;
  image?: { src: string; alt?: string };
};

export const LISTINGS: Listing[] = [
  {
    id: 'mdr-royal-001',
    title: 'Penthouse with skyline terrace',
    city: 'Madrid',
    country: 'Spain',
    region: 'Europe',
    priceEur: 1950000,
    beds: 3,
    baths: 3,
    areaM2: 210,
    image: {
      src: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=2000&q=80',
      alt: 'Penthouse interior with premium finish',
    },
  },
  {
    id: 'bcn-gold-002',
    title: 'Design apartment near the sea',
    city: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    priceEur: 1250000,
    beds: 2,
    baths: 2,
    areaM2: 128,
    image: {
      src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80',
      alt: 'Bright apartment with modern design',
    },
  },
  {
    id: 'lis-atlantic-003',
    title: 'Historic loft with river light',
    city: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    priceEur: 890000,
    beds: 2,
    baths: 2,
    areaM2: 112,
    image: {
      src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80',
      alt: 'Loft interior with warm light',
    },
  },
  {
    id: 'ldn-prime-004',
    title: 'Prime central townhouse',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    priceEur: 4200000,
    beds: 4,
    baths: 4,
    areaM2: 320,
    image: {
      src: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=2000&q=80',
      alt: 'Luxury living room',
    },
  },
  {
    id: 'paris-atelier-005',
    title: 'Atelier-style apartment',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    priceEur: 1580000,
    beds: 2,
    baths: 2,
    areaM2: 140,
    image: {
      src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
      alt: 'Atelier apartment interior',
    },
  },
  {
    id: 'dubai-sky-006',
    title: 'Skyline view residence',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    priceEur: 2300000,
    beds: 3,
    baths: 3,
    areaM2: 205,
    image: {
      src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80',
      alt: 'Premium apartment with skyline view',
    },
  },
];
