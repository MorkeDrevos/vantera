// src/lib/copy/vanteraCopy.ts
export type Tone = 'anchor' | 'trust' | 'layer' | 'refusal' | 'time' | 'agent' | 'short' | 'footer';

export type TrustLayerId = 'identity' | 'marketReality' | 'liquiditySignal' | 'riskSurface' | 'confidenceGradient';

export type ConfidenceLabel = 'High' | 'Moderate' | 'Limited';
export type IdentityLabel = 'Verified' | 'Partial' | 'Insufficient';
export type MarketRealityLabel = 'Aligned' | 'Diverging' | 'Unclear';
export type LiquidityLabel = 'High' | 'Moderate' | 'Thin';
export type RiskLabel = 'Low' | 'Medium' | 'Elevated';

export const VANTERA_COPY = {
  anchor: {
    h1: 'Private intelligence for the world’s most valuable assets.',
    truthLine: 'Vantera does not tell you what to buy. It shows you what is.',
  },

  trust: {
    listingsVsReality: 'Listings describe properties. Vantera describes reality.',
    truthStructured: 'Truth is structured. Narratives are optional.',
    signalNotStory: 'Confidence comes from signal, not storytelling.',
    marketsMove: 'Markets move. Vantera reflects that movement.',
  },

  trustProfile: {
    name: 'Vantera Trust Profile',
    subtitle: 'A structured, verifiable view of a property’s reality.',
  },

  layers: {
    identity: {
      title: 'Identity',
      blurb: 'Verifies that the asset exists and is represented consistently.',
      labels: ['Verified', 'Partial', 'Insufficient'] as const satisfies readonly IdentityLabel[],
    },
    marketReality: {
      title: 'Market Reality',
      blurb: 'Compares the listing to observable market behaviour.',
      labels: ['Aligned', 'Diverging', 'Unclear'] as const satisfies readonly MarketRealityLabel[],
    },
    liquiditySignal: {
      title: 'Liquidity Signal',
      blurb: 'Reflects the asset’s ability to transact under current conditions.',
      labels: ['High', 'Moderate', 'Thin'] as const satisfies readonly LiquidityLabel[],
    },
    riskSurface: {
      title: 'Risk Surface',
      blurb: 'Highlights areas where information is incomplete or uncertain.',
      labels: ['Low', 'Medium', 'Elevated'] as const satisfies readonly RiskLabel[],
    },
    confidenceGradient: {
      title: 'Confidence Gradient',
      blurb: 'A synthesis of available signals. Not a prediction.',
      labels: ['High', 'Moderate', 'Limited'] as const satisfies readonly ConfidenceLabel[],
    },
  } satisfies Record<TrustLayerId, { title: string; blurb: string; labels: readonly string[] }>,

  timeSignals: {
    improving60d: 'Market confidence improving over the last 60 days.',
    liquidityStable: 'Liquidity signal stable.',
    riskUnchanged: 'Risk surface unchanged.',
    pressureIncreasing: 'Market pressure increasing.',
    clarityImproving: 'Signal clarity improving as data depth increases.',
  },

  refusal: {
    title: 'What Vantera does not optimise for:',
    bullets: [
      'Clickbait pricing',
      'Artificial urgency',
      'Marketing narratives',
      'Vanity metrics',
      'Seller storytelling',
    ],
    oneLiners: {
      noConversion: 'Vantera does not optimise for conversion.',
      noUrgency: 'Vantera does not reward urgency.',
      noAdjustTruth: 'Vantera does not adjust truth for outcomes.',
      showAnyway: 'Some assets score poorly. They are shown anyway.',
    },
  },

  agentEmbed: {
    headline: 'Vantera Trust Profile',
    subline: 'Independent. Read-only. Continuously updated.',
    integrity: 'This verification cannot be edited or influenced.',
    delivery: 'Displayed via live Vantera embed.',
  },

  short: {
    structuredTruth: 'Structured truth. No narrative layer.',
    signalOverStory: 'Signal over story.',
    realityObserved: 'Reality, observed.',
    confidenceNoPersuasion: 'Confidence without persuasion.',
    independent: 'Independent by design.',
  },

  footer: {
    truthAsStands: 'Truth, as it stands.',
    observedNotFramed: 'Observed. Not framed.',
    noEmphasis: 'Reality does not need emphasis.',
  },
} as const;
