/*
  Warnings:

  - A unique constraint covering the columns `[source,sourceId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ImportRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- DropIndex
DROP INDEX "Listing_sourceId_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "builtSqft" INTEGER,
ADD COLUMN     "dataCompleteness" INTEGER,
ADD COLUMN     "plotSqft" INTEGER,
ADD COLUMN     "priceConfidence" INTEGER;

-- CreateTable
CREATE TABLE "ImportRun" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "region" TEXT,
    "market" TEXT,
    "params" JSONB NOT NULL,
    "status" "ImportRunStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "scanned" INTEGER NOT NULL DEFAULT 0,
    "created" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "errorSamples" JSONB,
    "message" TEXT,

    CONSTRAINT "ImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportRun_source_scope_createdAt_idx" ON "ImportRun"("source", "scope", "createdAt");

-- CreateIndex
CREATE INDEX "ImportRun_status_createdAt_idx" ON "ImportRun"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Listing_priceConfidence_idx" ON "Listing"("priceConfidence");

-- CreateIndex
CREATE INDEX "Listing_dataCompleteness_idx" ON "Listing"("dataCompleteness");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_source_sourceId_key" ON "Listing"("source", "sourceId");
