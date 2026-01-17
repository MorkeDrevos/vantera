// src/lib/ingest/realtorPersistMedia.ts

import { prisma } from '@/lib/prisma';

export type RealtorPhoto = {
  url: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export async function ingestRealtorMediaForListing(listingId: string, photos: RealtorPhoto[]) {
  if (!photos || photos.length === 0) return { inserted: 0 };

  let inserted = 0;

  for (const photo of photos) {
    const url = (photo?.url || '').trim();
    if (!url) continue;

    const exists = await prisma.listingMedia.findFirst({
      where: { listingId, url },
      select: { id: true },
    });

    if (exists) continue;

    await prisma.listingMedia.create({
      data: {
        listingId,
        url,
        alt: (photo.caption || 'Property image').trim(),
        width: photo.width ?? null,
        height: photo.height ?? null,
      },
    });

    inserted += 1;
  }

  return { inserted };
}
