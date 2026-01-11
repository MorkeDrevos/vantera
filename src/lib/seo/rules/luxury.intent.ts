// src/lib/seo/rules/luxury.intent.ts

import type { PageKind, SeoDoc } from '../seo.intent';

export type LuxuryIntentRules = {
  global: {
    kind: PageKind;
    mustTarget: string[];
    mustAvoid: string[];
    mustLinkTo: PageKind[];
  };
  city: {
    kind: PageKind;
    mustTarget: string[];
    mustAvoid: string[];
    mustLinkTo: PageKind[];
  };
  listing: {
    kind: PageKind;
    mustAvoid: string[];
  };
};

export const LUXURY_INTENT_RULES: LuxuryIntentRules = {
  global: {
    kind: 'luxury_global',
    mustTarget: [
      'luxury real estate for sale',
      'luxury homes for sale',
      'prime real estate',
      'high-end property',
    ],
    mustAvoid: [
      'city-specific exact targeting (leave that to luxury_city pages)',
      'listing-specific titles',
    ],
    mustLinkTo: ['luxury_city', 'city_hub'],
  },

  city: {
    kind: 'luxury_city',
    mustTarget: [
      'luxury real estate for sale in {city}',
      'luxury homes for sale in {city}',
      'prime areas',
      'pricing reality',
    ],
    mustAvoid: [
      'global-only keywords without city modifier (leave that to luxury_global)',
    ],
    mustLinkTo: ['city_hub', 'listing'],
  },

  listing: {
    kind: 'listing',
    mustAvoid: [
      'targeting the phrase "luxury real estate for sale in {city}" as the primary intent',
      'writing generic luxury pillar content',
    ],
  },
};

export function validateLuxuryDoc(doc: SeoDoc): string[] {
  const issues: string[] = [];

  if (doc.kind === 'luxury_global') {
    for (const k of LUXURY_INTENT_RULES.global.mustTarget) {
      const hit = (doc.title + ' ' + doc.description).toLowerCase().includes(k.toLowerCase());
      if (!hit) issues.push(`Luxury global page should target "${k}".`);
    }
  }

  if (doc.kind === 'luxury_city') {
    if (!doc.primaryTopic.toLowerCase().includes('luxury real estate for sale in')) {
      issues.push('Luxury city primaryTopic should include "luxury real estate for sale in {city}".');
    }
  }

  return issues;
}
