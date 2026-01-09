export type City = {
  name: string;
  slug: string;
  region?: string;
  tz?: string;
  blurb?: string;
  alt?: string[];
  image: {
    src: string;
    alt: string;
  };
};

export const CITIES: City[] = [
  {
    name: 'Madrid',
    slug: 'madrid',
    region: 'Spain',
    tz: 'Europe/Madrid',
    blurb: 'Capital energy, culture, and late nights.',
    alt: ['madrid, spain'],
    image: {
      // Use the "Download" URL from the Unsplash page you pick (or use images.unsplash.com directly)
      src: 'https://images.unsplash.com/photo-1616088153814-2bff7ea6a0b8?auto=format&fit=crop&w=1600&q=80',
      alt: 'Madrid skyline at sunset',
    },
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    region: 'Spain',
    tz: 'Europe/Madrid',
    blurb: 'Architecture, beaches, and design-forward streets.',
    alt: ['barcelona, spain'],
    image: {
      src: 'https://images.unsplash.com/photo-1505739998589-00fc191ce01d?auto=format&fit=crop&w=1600&q=80',
      alt: 'Barcelona city view',
    },
  },
  {
    name: 'Lisbon',
    slug: 'lisbon',
    region: 'Portugal',
    tz: 'Europe/Lisbon',
    blurb: 'Hills, light, and Atlantic charm.',
    alt: ['lisboa'],
    image: {
      src: 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a42?auto=format&fit=crop&w=1600&q=80',
      alt: 'Lisbon rooftops and river',
    },
  },
  {
    name: 'London',
    slug: 'london',
    region: 'United Kingdom',
    tz: 'Europe/London',
    blurb: 'Global capital of business and culture.',
    image: {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      alt: 'London skyline',
    },
  },
  {
    name: 'Paris',
    slug: 'paris',
    region: 'France',
    tz: 'Europe/Paris',
    blurb: 'Iconic streets, timeless taste.',
    image: {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
      alt: 'Paris city scene',
    },
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    region: 'United Arab Emirates',
    tz: 'Asia/Dubai',
    blurb: 'Modern skyline, speed, and scale.',
    image: {
      src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Dubai skyline at night',
    },
  },
  {
    name: 'New York',
    slug: 'new-york',
    region: 'United States',
    tz: 'America/New_York',
    blurb: 'The original 24/7 city.',
    alt: ['nyc', 'new york city'],
    image: {
      src: 'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=1600&q=80',
      alt: 'New York skyline',
    },
  },
];
