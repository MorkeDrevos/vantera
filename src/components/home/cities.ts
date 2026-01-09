// src/components/home/cities.ts

export type CityImage = {
  src: string;
  alt?: string;
};

export type City = {
  slug: string;
  name: string;
  country: string;
  region?: string;
  tz: string;
  blurb?: string;
  image?: CityImage;
};

export const CITIES: City[] = [
  {
    slug: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    blurb: 'Capital energy, culture, and late nights.',
    image: {
      src: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80',
      alt: 'Madrid skyline at sunset',
    },
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    tz: 'Europe/Madrid',
    blurb: 'Architecture, beaches, and design-forward streets.',
    image: {
      src: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?auto=format&fit=crop&w=1600&q=80',
      alt: 'Barcelona city view',
    },
  },
  {
    slug: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    tz: 'Europe/Lisbon',
    blurb: 'Hills, light, and Atlantic charm.',
    // If this URL ever fails again, CityCard has a hard fallback (no broken icon).
    image: {
      src: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=1600&q=80',
      alt: 'Lisbon rooftops and river',
    },
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    tz: 'Europe/London',
    blurb: 'Global capital of business and culture.',
    image: {
      src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
      alt: 'London skyline with river',
    },
  },
  {
    slug: 'paris',
    name: 'Paris',
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
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tz: 'Asia/Dubai',
    blurb: 'Modern skyline, speed, and scale.',
    image: {
      src: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Dubai skyline at night',
    },
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    tz: 'America/New_York',
    blurb: 'The original 24/7 city.',
    image: {
      src: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&q=80',
      alt: 'New York skyline',
    },
  },
];
