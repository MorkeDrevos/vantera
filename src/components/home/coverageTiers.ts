// src/components/home/coverageTiers.ts
import type { City } from './cities';

export type CoverageTier = 'core' | 'expanded' | 'scout';

export function coverageTierLabel(tier: CoverageTier) {
  if (tier === 'core') return 'Core';
  if (tier === 'expanded') return 'Expanded';
  return 'Scout';
}

// You can tune this list anytime without touching the City type.
const CORE_SLUGS = new Set<string>([
  'madrid',
  'paris',
  'london',
  'dubai',
  'new-york',
  'nyc',
  'marbella',
]);

// Simple, deterministic tiering:
// - Core = flagship cities
// - Expanded = has a blurb and image (stronger editorial coverage)
// - Scout = everything else
export function getCoverageTier(city: City): CoverageTier {
  const slug = (city.slug || '').toLowerCase();
  if (CORE_SLUGS.has(slug)) return 'core';

  const hasEditorial = Boolean(city.blurb && city.blurb.trim().length > 0);
  const hasImage = Boolean(city.image?.src && city.image.src.trim().length > 0);

  if (hasEditorial && hasImage) return 'expanded';
  return 'scout';
}
