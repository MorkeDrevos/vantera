// src/lib/seo/rules/city.intent.ts

import type { PageKind, SeoDoc } from '../seo.intent';

export const CITY_INTENT_RULES = {
  hub: {
    kind: 'city_hub' as PageKind,
    mustTarget: [
      '{city} real estate',
      'supply',
      'pricing signals',
      'market truth',
    ],
    mustLinkTo: ['luxury_city', 'city_supply', 'city_pricing', 'city_truth', 'listing'] as PageKind[],
    mustAvoid: [
      'over-focusing on "for sale" (leave that to listings)',
      'over-focusing on "luxury for sale" (leave that to luxury_city)',
    ],
  },

  supply: {
    kind: 'city_supply' as PageKind,
    mustTarget: ['housing supply', 'inventory', 'pipeline', 'constraints'],
    mustLinkTo: ['city_hub', 'luxury_city', 'listing'] as PageKind[],
  },

  pricing: {
    kind: 'city_pricing' as PageKind,
    mustTarget: ['pricing signals', 'momentum', 'ranges', 'dispersion'],
    mustLinkTo: ['city_hub', 'luxury_city', 'listing'] as PageKind[],
  },

  truth: {
    kind: 'city_truth' as PageKind,
    mustTarget: ['market truth', 'risk flags', 'reality checks'],
    mustLinkTo: ['city_hub', 'luxury_city'] as PageKind[],
  },
};

export function validateCityDoc(doc: SeoDoc): string[] {
  const issues: string[] = [];

  if (doc.kind === 'city_hub') {
    if (!doc.title.toLowerCase().includes('real estate intelligence')) {
      issues.push('City hub title should include "Real Estate Intelligence".');
    }
    if (!doc.description.toLowerCase().includes('pricing')) {
      issues.push('City hub description should mention pricing signals or pricing reality.');
    }
  }

  return issues;
}
