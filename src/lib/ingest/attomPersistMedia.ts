// src/lib/ingest/attomPersistMedia.ts
import { prisma } from '@/lib/db';
import { fetchAttomMedia } from '@/lib/attom/attomMedia';

export async function ingestAttomMediaForListing(listingId: string, attomId: string) {
  const res = await fetchAttomMedia(attomId);

  const photos = res?.property?.media?.photos;
  if (!photos || photos.length === 0) return { inserted: 0 };

  let inserted = 0;

  for (const photo of photos) {
    if (!photo.url) continue;

    const exists = await prisma.listingMedia.findFirst({
      where: {
        listingId,
        url: photo.url,
      },
      select: { id: true },
    });

    if (exists) continue;

    await prisma.listingMedia.create({
      data: {
        listingId,
        url: photo.url,
        alt: photo.caption ?? 'Property image',
        width: photo.width ?? null,
        height: photo.height ?? null,
        source: 'ATTOM',
      },
    });

    inserted++;
  }

  return { inserted };
}
