/*
  Warnings:

  - Added the required column `updatedAt` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CoverageTier" AS ENUM ('TIER_0', 'TIER_1', 'TIER_2', 'TIER_3');

-- CreateEnum
CREATE TYPE "CoverageStatus" AS ENUM ('LIVE', 'TRACKING', 'EXPANDING');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'LIVE', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ListingVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('SELF_REPORTED', 'VERIFIED_DOCS', 'VERIFIED_ON_SITE');

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RegionCluster" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "CoverageTier" NOT NULL DEFAULT 'TIER_3',
    "status" "CoverageStatus" NOT NULL DEFAULT 'EXPANDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "headline" TEXT,
    "blurb" TEXT,
    "country" TEXT,
    "region" TEXT,

    CONSTRAINT "RegionCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "tz" TEXT NOT NULL,
    "tier" "CoverageTier" NOT NULL DEFAULT 'TIER_3',
    "status" "CoverageStatus" NOT NULL DEFAULT 'EXPANDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "heroImageSrc" TEXT,
    "heroImageAlt" TEXT,
    "blurb" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "clusterId" TEXT,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityMetric" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cityId" TEXT NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "medianPricePerSqm" INTEGER,
    "primePricePerSqm" INTEGER,
    "medianRentPerSqm" INTEGER,
    "yoyPriceChangePct" DOUBLE PRECISION,
    "yoyRentChangePct" DOUBLE PRECISION,
    "daysOnMarketMedian" INTEGER,
    "activeListingCount" INTEGER,
    "confidenceScore" INTEGER,
    "sourceNote" TEXT,

    CONSTRAINT "CityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cityId" TEXT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "ListingVisibility" NOT NULL DEFAULT 'PUBLIC',
    "verification" "VerificationLevel" NOT NULL DEFAULT 'SELF_REPORTED',
    "title" TEXT NOT NULL,
    "headline" TEXT,
    "description" TEXT,
    "neighborhood" TEXT,
    "address" TEXT,
    "addressHidden" BOOLEAN NOT NULL DEFAULT false,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "propertyType" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "builtM2" INTEGER,
    "plotM2" INTEGER,
    "price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "communityFeesMonthly" INTEGER,
    "ibiYearly" INTEGER,
    "garbageTaxYearly" INTEGER,
    "yearBuilt" INTEGER,
    "renovationYear" INTEGER,
    "energyRating" TEXT,
    "coverMediaId" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingMedia" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "kind" TEXT NOT NULL DEFAULT 'image',

    CONSTRAINT "ListingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionCluster_slug_key" ON "RegionCluster"("slug");

-- CreateIndex
CREATE INDEX "RegionCluster_tier_priority_idx" ON "RegionCluster"("tier", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_country_idx" ON "City"("country");

-- CreateIndex
CREATE INDEX "City_tier_priority_idx" ON "City"("tier", "priority");

-- CreateIndex
CREATE INDEX "City_clusterId_idx" ON "City"("clusterId");

-- CreateIndex
CREATE INDEX "CityMetric_cityId_asOf_idx" ON "CityMetric"("cityId", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "CityMetric_cityId_asOf_key" ON "CityMetric"("cityId", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_coverMediaId_key" ON "Listing"("coverMediaId");

-- CreateIndex
CREATE INDEX "Listing_cityId_status_idx" ON "Listing"("cityId", "status");

-- CreateIndex
CREATE INDEX "Listing_status_visibility_idx" ON "Listing"("status", "visibility");

-- CreateIndex
CREATE INDEX "Listing_cityId_price_idx" ON "Listing"("cityId", "price");

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_sortOrder_idx" ON "ListingMedia"("listingId", "sortOrder");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "RegionCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityMetric" ADD CONSTRAINT "CityMetric_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "ListingMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingMedia" ADD CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
