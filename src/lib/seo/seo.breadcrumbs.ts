// src/lib/seo/seo.breadcrumbs.ts
import { SEO_CONFIG } from './seo.config';

type Crumb = { name: string; path: string };

function abs(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.domain}${p}`;
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

// Helpers for the 3-level ladder
export function crumbsCityLuxuryListing(input: {
  cityName: string;
  citySlug: string;
  listingTitle: string;
  listingPath: string; // eg /listing/xyz OR /listings?...
}) {
  return breadcrumbJsonLd([
    { name: input.cityName, path: `/city/${input.citySlug}` },
    { name: `Luxury real estate in ${input.cityName}`, path: `/city/${input.citySlug}/luxury-real-estate` },
    { name: input.listingTitle, path: input.listingPath },
  ]);
}

export function crumbsCityLuxury(input: { cityName: string; citySlug: string }) {
  return breadcrumbJsonLd([
    { name: input.cityName, path: `/city/${input.citySlug}` },
    { name: `Luxury real estate in ${input.cityName}`, path: `/city/${input.citySlug}/luxury-real-estate` },
  ]);
}

export function crumbsCity(input: { cityName: string; citySlug: string }) {
  return breadcrumbJsonLd([{ name: input.cityName, path: `/city/${input.citySlug}` }]);
}
