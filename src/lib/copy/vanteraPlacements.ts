// src/lib/copy/vanteraPlacements.ts
export type PlacementId =
  | 'home.heroUnderH1'
  | 'home.belowFoldAnchor'
  | 'home.trustStrip'
  | 'home.refusalBlock'
  | 'property.trustProfileIntro'
  | 'property.trustProfileOutro'
  | 'property.layerBlurb.identity'
  | 'property.layerBlurb.marketReality'
  | 'property.layerBlurb.liquiditySignal'
  | 'property.layerBlurb.riskSurface'
  | 'property.layerBlurb.confidenceGradient'
  | 'seo.truthSignalsIntro'
  | 'seo.refusalInline'
  | 'footer.quietCloser'
  | 'embed.landing.hero'
  | 'embed.landing.integrity'
  | 'embed.widget.microcopy';

export const VANTERA_PLACEMENTS: Record<PlacementId, { key: string; maxChars?: number }> = {
  // Homepage
  'home.heroUnderH1': { key: 'trust.listingsVsReality', maxChars: 120 },
  'home.belowFoldAnchor': { key: 'anchor.truthLine', maxChars: 120 },
  'home.trustStrip': { key: 'trust.truthStructured', maxChars: 120 },
  'home.refusalBlock': { key: 'refusal.title' },

  // Property page
  'property.trustProfileIntro': { key: 'trustProfile.subtitle' },
  'property.trustProfileOutro': { key: 'trust.signalNotStory', maxChars: 120 },

  'property.layerBlurb.identity': { key: 'layers.identity.blurb', maxChars: 140 },
  'property.layerBlurb.marketReality': { key: 'layers.marketReality.blurb', maxChars: 140 },
  'property.layerBlurb.liquiditySignal': { key: 'layers.liquiditySignal.blurb', maxChars: 140 },
  'property.layerBlurb.riskSurface': { key: 'layers.riskSurface.blurb', maxChars: 140 },
  'property.layerBlurb.confidenceGradient': { key: 'layers.confidenceGradient.blurb', maxChars: 140 },

  // SEO / Truth Signals page
  'seo.truthSignalsIntro': { key: 'trust.marketsMove', maxChars: 120 },
  'seo.refusalInline': { key: 'refusal.oneLiners.noUrgency', maxChars: 120 },

  // Footer
  'footer.quietCloser': { key: 'footer.observedNotFramed', maxChars: 120 },

  // Embed
  'embed.landing.hero': { key: 'agentEmbed.subline', maxChars: 120 },
  'embed.landing.integrity': { key: 'agentEmbed.integrity', maxChars: 120 },
  'embed.widget.microcopy': { key: 'short.independent', maxChars: 80 },
};
