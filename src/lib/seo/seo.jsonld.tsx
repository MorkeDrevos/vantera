// src/lib/seo/seo.jsonld.tsx
import { SEO_CONFIG } from './seo.config';

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
    url: input.url,
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
 * Breadcrumb JSON-LD
 * Use relative urls like "/city/marbella" and we will convert them to absolute.
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  function abs(u: string) {
    if (!u) return SEO_CONFIG.domain;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    const p = u.startsWith('/') ? u : `/${u}`;
    return `${SEO_CONFIG.domain}${p}`;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}
