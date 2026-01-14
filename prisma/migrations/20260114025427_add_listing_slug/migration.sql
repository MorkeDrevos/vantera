/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

  Note:
  - `slug` is added NULLable first, backfilled, then made NOT NULL to support existing rows.
*/

-- 1) Add new columns safely
ALTER TABLE "Listing"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "source" TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN "sourceId" TEXT,
  ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "sourceUrl" TEXT;

-- 2) Backfill slug for existing rows (use id as stable unique slug)
UPDATE "Listing"
SET "slug" = "id"
WHERE "slug" IS NULL;

-- 3) Enforce NOT NULL after backfill
ALTER TABLE "Listing"
ALTER COLUMN "slug" SET NOT NULL;

-- 4) Indexes / constraints
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");
CREATE UNIQUE INDEX "Listing_sourceId_key" ON "Listing"("sourceId");
CREATE INDEX "Listing_source_idx" ON "Listing"("source");