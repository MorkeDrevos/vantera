// src/components/home/coverageTiers.ts
import type { City, CoverageTier, CoverageStatus } from './cities';

/**
 * Canonical tier resolver for UI.
 * - Prefers explicit city.tier
 * - Falls back to status/priority heuristics
 */
export function getCoverageTier(city: City): CoverageTier {
  if (city.tier) return city.tier;

  // Fallback by status (if present)
  const status = city.status;
  if (status === 'LIVE') return 'TIER_0';
  if (status === 'TRACKING') return 'TIER_1';
  if (status === 'EXPANDING') return 'TIER_2';

  // Fallback by priority (if present)
  const p = typeof city.priority === 'number' ? city.priority : 0;
  if (p >= 80) return 'TIER_0';
  if (p >= 60) return 'TIER_1';
  if (p >= 35) return 'TIER_2';
  return 'TIER_3';
}

/**
 * Human label for badges / UI.
 * CoverageTierBadge.tsx expects this export name.
 */
export function coverageTierLabel(tier: CoverageTier): string {
  switch (tier) {
    case 'TIER_0':
      return 'Tier 0';
    case 'TIER_1':
      return 'Tier 1';
    case 'TIER_2':
      return 'Tier 2';
    case 'TIER_3':
    default:
      return 'Tier 3';
  }
}

/**
 * Optional helpers (safe to use later)
 */
export function coverageTierDescriptor(tier: CoverageTier, status?: CoverageStatus): string {
  const s =
    status === 'LIVE' ? 'Live' : status === 'TRACKING' ? 'Tracking' : status === 'EXPANDING' ? 'Expanding' : undefined;

  switch (tier) {
    case 'TIER_0':
      return s ? `Flagship • ${s}` : 'Flagship';
    case 'TIER_1':
      return s ? `Prime • ${s}` : 'Prime';
    case 'TIER_2':
      return s ? `Expanding • ${s}` : 'Expanding';
    case 'TIER_3':
    default:
      return s ? `Watchlist • ${s}` : 'Watchlist';
  }
}
