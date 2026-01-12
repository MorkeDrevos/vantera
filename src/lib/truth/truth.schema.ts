// src/lib/truth/truth.schema.ts
export type TruthCardStatus = 'verified' | 'pending' | 'restricted';
export type PricingSignal = 'undervalued' | 'fair' | 'overpriced';
export type DemandPressure = 'low' | 'medium' | 'high';

export type AssetType = 'villa' | 'apartment' | 'penthouse' | 'townhouse' | 'plot' | 'finca' | 'estate' | 'other';

export type SellerType = 'owner' | 'agent' | 'developer';

export type BrokerVerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type BrokerBadgeLevel = 'verified-broker' | 'verified-agency' | 'developer-verified';

export type ListingStatus = 'draft' | 'submitted' | 'verified' | 'published' | 'locked';

export type LocationPrivacy = 'exact' | 'area' | 'redacted';

export type TruthPhase2RequiredFields = {
  // Identity (required)
  citySlug: string;
  assetType: AssetType;

  // Seller + compliance (required)
  sellerType: SellerType;
  sellerEmail: string;
  termsAcceptedAtISO: string;
  gdprAcceptedAtISO: string;

  // Listing core (required for Phase 2 publish)
  headline: string;
  description: string;

  price: number;
  currency: string;

  bedrooms: number;
  bathrooms: number;
  builtAreaSqm: number;

  // Required for villas/plots - optional for apartments
  plotAreaSqm?: number;

  // Location privacy (required)
  locationPrivacy: LocationPrivacy;

  // Media (required)
  photos: Array<{ url: string; width?: number; height?: number }>;
  heroPhotoIndex: number;

  // Proof of control (required but private)
  proofOfControl: Array<{
    url: string;
    kind: 'mandate' | 'deed' | 'utility' | 'id' | 'other';
  }>;
};

export type TruthListing = TruthPhase2RequiredFields & {
  id: string;

  // Publish/verification state
  listingStatus: ListingStatus;
  verificationStatus: TruthCardStatus;

  brokerVerificationStatus: BrokerVerificationStatus;
  brokerBadgeLevel?: BrokerBadgeLevel;

  createdAtISO: string;
  updatedAtISO: string;
  verifiedAtISO?: string;
  publishedAtISO?: string;

  // Truth layer (computed after verified)
  truth?: {
    dataConfidence: number; // 0-100
    lastUpdatedISO: string;

    fairValueBand: { low: number; mid: number; high: number };
    pricingSignal: PricingSignal;
    deviationPct: number;

    liquidityScore: number; // 0-100
    estimatedTimeToSellDays: { low: number; high: number };
    demandPressure: DemandPressure;
    buyerPoolDepth: 'thin' | 'normal' | 'deep';

    reductionProbabilityPct?: number;
    anomalyFlags?: string[];
    primeAttributes?: string[];
  };
};

// The exact Truth Card payload your UI renders today
export type TruthCardData = {
  propertyId: string;
  cityName: string;
  assetType: string;
  verificationStatus: TruthCardStatus;
  dataConfidence: number;
  lastUpdatedISO: string;

  askingPrice?: number;
  currency: string;
  fairValueBand: { low: number; mid: number; high: number };
  pricingSignal: PricingSignal;
  deviationPct: number;

  estimatedTimeToSellDays: { low: number; high: number };
  liquidityScore: number;
  demandPressure: DemandPressure;
  buyerPoolDepth: 'thin' | 'normal' | 'deep';

  reductionProbabilityPct?: number;
  anomalyFlags?: string[];

  bedrooms?: number;
  bathrooms?: number;
  builtAreaSqm?: number;
  plotAreaSqm?: number;
  primeAttributes?: string[];
};
