// src/components/home/CoverageTierBadge.tsx
// NOTE: We are intentionally not showing coverage tiers in the UI.
// Keeping this component as a safe no-op so any legacy imports do not reintroduce tier labels.

import type { CoverageTier } from './cities';

export default function CoverageTierBadge({ tier }: { tier: CoverageTier }) {
  void tier;
  return null;
}
