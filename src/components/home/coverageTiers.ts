// src/components/home/coverageTiers.ts
import type { City } from './cities';

export type CoverageTier = 'Core' | 'Plus' | 'Watch';

// Keep your core logic here (you can refine the lists anytime)
export function coverageTierForCity(city: City): CoverageTier {
  const slug = (city.slug ?? '').toLowerCase();
  const country = (city.country ?? '').toLowerCase();
  const name = (city.name ?? '').toLowerCase();

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

// Compatibility export (CityCard.tsx expects this)
export function getCoverageTier(city: City): CoverageTier {
  return coverageTierForCity(city);
}

// Compatibility export (CoverageTierBadge.tsx expects this)
export function coverageTierLabel(tier: CoverageTier): string {
  if (tier === 'Core') return 'Core coverage';
  if (tier === 'Plus') return 'Plus coverage';
  return 'Watchlist';
}
