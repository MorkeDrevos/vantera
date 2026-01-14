// src/lib/seo/seo.jsonld.tsx

import { SEO_CONFIG } from './seo.config';

function normalizeUrl(url: string) {
  // Accept absolute or relative, always output absolute
  if (!url) return SEO_CONFIG.domain;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const p = url.startsWith('/') ? url : `/${url}`;
  return `${SEO_CONFIG.domain}${p}`;
}

export function jsonLd(json: unknown) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.domain,
    description: SEO_CONFIG.brandStatement,
    knowsAbout: [
      'Real estate market value',
      'Luxury real estate',
      'Property liquidity',
      'Pricing analysis',
      'Private property sales',
      'Agent publishing platforms',
      'Real estate intelligence systems',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.domain,
    description: SEO_CONFIG.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
    },
  };
}

export function webPageJsonLd(input: {
  url: string;
  name: string;
  description?: string;
  about?: any[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    url: normalizeUrl(input.url),
    description: input.description,
    isPartOf: {
      '@type': 'WebSite',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.domain,
    },
    about: input.about ?? [],
  };
}

/**
 * BreadcrumbList JSON-LD
 * Use on city -> luxury -> listing (and any future subpages)
 *
 * Example:
 * jsonLd(
 *   breadcrumbJsonLd([
 *     { name: 'Home', url: '/' },
 *     { name: 'Marbella', url: '/city/marbella' },
 *     { name: 'Luxury real estate', url: '/city/marbella/luxury-real-estate' },
 *   ])
 * )
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const safe = (items ?? [])
    .map((i) => ({
      name: String(i?.name ?? '').trim(),
      url: normalizeUrl(String(i?.url ?? '').trim()),
    }))
    .filter((i) => i.name.length > 0 && i.url.length > 0);

  // BreadcrumbList requires at least 2 items to be meaningful
  if (safe.length < 2) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: safe.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: i.name,
      item: i.url,
    })),
  };
}
