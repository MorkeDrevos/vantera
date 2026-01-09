export type City = {
  slug: string;
  name: string;
  country: string;
  region: string;
  image: string;
  blurb: string;
};

export const CITIES: City[] = [
  {
    slug: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Capital energy, culture, and late nights.',
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1505739773434-c1c6c0c9a2c5?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Architecture, beaches, and design-forward streets.',
  },
  {
    slug: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1526401485004-2fda9f4f1c68?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Hills, light, and Atlantic charm.',
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Global capital of business and culture.',
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Iconic streets and timeless taste.',
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    image:
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=1600&auto=format&fit=crop',
    blurb: 'Modern skyline, speed, and scale.',
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    image:
      'https://images.unsplash.com/photo-1549921296-3fd62c7c8cfa?q=80&w=1600&auto=format&fit=crop',
    blurb: 'The original 24/7 city.',
  },
];
