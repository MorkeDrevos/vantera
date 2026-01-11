// src/lib/city/cityUiState.ts
import type { City, CoverageTier, CoverageStatus } from '@/components/home/cities';

export type CityUiState =
  | 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED'
  | 'VERIFIED_SUPPLY_ONLY'
  | 'PRIVATE_INDEX'
  | 'COVERAGE_EXPANDING';

export type CitySupplySnapshot = {
  verifiedListingsCount: number;
  pendingListingsCount: number;
  hasIntelligenceModels: boolean;
};

export function computeCityUiState(city: City, supply: CitySupplySnapshot): CityUiState {
  const tier: CoverageTier = city.tier ?? 'TIER_3';
  const status: CoverageStatus = city.status ?? 'EXPANDING';

  // If we have verified supply, enforce the "verified supply only" mode.
  if (supply.verifiedListingsCount > 0) return 'VERIFIED_SUPPLY_ONLY';

  // Intelligence can be active before public inventory.
  if (supply.hasIntelligenceModels && supply.verifiedListingsCount === 0) {
    return 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED';
  }

  // Tier 0/1 cities should feel like a private index early.
  if ((tier === 'TIER_0' || tier === 'TIER_1') && status !== 'EXPANDING') {
    return 'PRIVATE_INDEX';
  }

  return 'COVERAGE_EXPANDING';
}

export function cityUiCopy(state: CityUiState) {
  if (state === 'VERIFIED_SUPPLY_ONLY') {
    return {
      badgeTop: 'VERIFIED SUPPLY ONLY',
      badgeBottom: 'Integrity gated',
      title: 'Verified supply only',
      body: 'Only properties that pass pricing, identity and integrity checks appear here.',
    };
  }

  if (state === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED') {
    return {
      badgeTop: 'INTELLIGENCE ACTIVE',
      badgeBottom: 'LISTINGS LOCKED',
      title: 'Intelligence active · Listings locked',
      body: 'Market intelligence is live. Verified listings unlock once supply meets integrity thresholds.',
    };
  }

  if (state === 'PRIVATE_INDEX') {
    return {
      badgeTop: 'PRIVATE INDEX',
      badgeBottom: 'Early access',
      title: 'Private index',
      body: 'Early access intelligence surface. Coverage deepens progressively as verified supply is ingested.',
    };
  }

  return {
    badgeTop: 'COVERAGE EXPANDING',
    badgeBottom: 'Signals warming',
    title: 'Coverage expanding',
    body: 'This market is indexed. Verified supply unlocks as integrity thresholds are met.',
    };
}
