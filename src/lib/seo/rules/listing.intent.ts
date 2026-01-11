// src/lib/seo/rules/listing.intent.ts

import type { SeoDoc } from '../seo.intent';

export const LISTING_INTENT_RULES = {
  mustInclude: [
    'for sale',
    'city',
  ],
  mustAvoid: [
    'writing the luxury pillar content on listing pages',
    'targeting "luxury real estate for sale" as a global pillar',
  ],
  mustLinkToKinds: ['city_hub', 'luxury_city'] as const,
};

export function validateListingDoc(doc: SeoDoc): string[] {
  const issues: string[] = [];

  if (doc.kind !== 'listing') return issues;

  const hay = `${doc.title} ${doc.description}`.toLowerCase();

  if (!hay.includes('for sale')) issues.push('Listing title/description should include "for sale".');

  if (doc.primaryTopic.toLowerCase().includes('luxury real estate for sale in')) {
    issues.push('Listing primaryTopic should not cannibalize the luxury_city page.');
  }

  return issues;
}
