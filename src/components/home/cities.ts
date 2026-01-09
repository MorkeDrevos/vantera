export type CityMeta = {
  name: string;
  slug: string;
  country: string;
  region: string;
  tz: string; // IANA timezone
  blurb: string;
  image: {
    src: string; // remote image URL
    alt: string;
  };
  alt?: string[];
};

export const CITIES: CityMeta[] = [
  {
    name: 'Madrid',
    slug: 'madrid',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    blurb: 'Capital energy, culture, and late nights.',
    image: {
      src: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80',
      alt: 'Madrid skyline at sunset',
    },
    alt: ['madrid, spain'],
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    blurb: 'Architecture, beaches, and design-forward streets.',
    image: {
      src: 'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Barcelona city view',
    },
    alt: ['barcelona, spain'],
  },
  {
    name: 'Lisbon',
    slug: 'lisbon',
    country: 'Portugal',
    region: 'Europe',
    tz: 'Europe/Lisbon',
    blurb: 'Hills, light, and Atlantic charm.',
    image: {
      src: 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a3f?auto=format&fit=crop&w=1600&q=80',
      alt: 'Lisbon rooftops and river',
    },
    alt: ['lisboa'],
  },
  {
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    region: 'Europe',
    tz: 'Europe/London',
    blurb: 'Global capital of business and culture.',
    image: {
      src: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      alt: 'London skyline with river',
    },
  },
  {
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    region: 'Europe',
    tz: 'Europe/Paris',
    blurb: 'Iconic streets, timeless taste.',
    image: {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
      alt: 'Paris Eiffel Tower view',
    },
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tz: 'Asia/Dubai',
    blurb: 'Modern skyline, speed, and scale.',
    image: {
      src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Dubai skyline at dusk',
    },
  },
  {
    name: 'New York',
    slug: 'new-york',
    country: 'United States',
    region: 'North America',
    tz: 'America/New_York',
    blurb: 'The original 24/7 city.',
    image: {
      src: 'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=1600&q=80',
      alt: 'New York skyline',
    },
    alt: ['nyc', 'new york city'],
  },
];
