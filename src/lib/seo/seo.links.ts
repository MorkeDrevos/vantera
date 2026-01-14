// src/lib/seo/seo.links.ts
import type { PageKind, CityLite } from './seo.intent';

export type InternalLink = { label: string; href: string };

export function internalLinksFor(kind: PageKind, ctx?: { city?: CityLite }): InternalLink[] {
  // Enforce rules: only return links you "shouldLinkTo" and avoid "shouldNotCompeteWith"
  // (We keep it deterministic and simple.)
  if (kind === 'home') {
    return [
      { label: 'Luxury real estate', href: '/luxury-real-estate' },
      { label: 'Sell privately', href: '/sell-luxury-property' },
      { label: 'For agents', href: '/agents' },
    ];
  }

  if (kind === 'luxury_global') {
    return [
      { label: 'Explore cities', href: '/' },
      { label: 'Sell privately', href: '/sell-luxury-property' },
      { label: 'For agents', href: '/agents' },
    ];
  }

  if (kind === 'city_hub' && ctx?.city) {
    return [
      { label: `Luxury in ${ctx.city.name}`, href: `/city/${ctx.city.slug}/luxury-real-estate` },
      { label: 'Global luxury', href: '/luxury-real-estate' },
      { label: 'Sell privately', href: '/sell-luxury-property' },
    ];
  }

  if (kind === 'luxury_city' && ctx?.city) {
    return [
      { label: `${ctx.city.name} overview`, href: `/city/${ctx.city.slug}` },
      { label: 'Global luxury', href: '/luxury-real-estate' },
      { label: 'For agents', href: '/agents' },
    ];
  }

  return [{ label: 'Explore cities', href: '/' }];
}
