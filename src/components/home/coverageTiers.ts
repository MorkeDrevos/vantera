// src/components/home/coverageTiers.ts
import type { City } from './cities';

export type CoverageTier = 'Core' | 'Plus' | 'Watch';

export function coverageTierForCity(city: City): CoverageTier {
  const slug = city.slug?.toLowerCase?.() ?? '';
  const country = city.country?.toLowerCase?.() ?? '';
  const name = city.name?.toLowerCase?.() ?? '';

  // Core = deepest coverage (start here)
  if (
    slug === 'marbella' ||
    slug === 'london' ||
    slug === 'paris' ||
    slug === 'madrid' ||
    slug === 'barcelona' ||
    slug === 'monaco' ||
    slug === 'dubai' ||
    slug === 'new-york' ||
    slug === 'miami' ||
    slug === 'geneva' ||
    slug === 'zurich'
  ) {
    return 'Core';
  }

  // Plus = strong luxury relevance, good density
  if (
    name.includes('cannes') ||
    name.includes('antibes') ||
    name.includes('ibiza') ||
    name.includes('mallorca') ||
    name.includes('lisbon') ||
    name.includes('rome') ||
    name.includes('milan') ||
    name.includes('vienna') ||
    name.includes('amsterdam') ||
    name.includes('stockholm') ||
    name.includes('copenhagen') ||
    country.includes('switzerland') ||
    country.includes('uae')
  ) {
    return 'Plus';
  }

  // Watch = tracked, but depth still building
  return 'Watch';
}
