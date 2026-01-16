// src/app/listing/[slug]/page.tsx
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import RoyalListingPage from '@/components/listings/RoyalListingPage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export default async function ListingSlugPage({ params }: Props) {
  const slug = (params?.slug || '').trim();
  if (!slug) return notFound();

  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      city: true,
      media: { orderBy: { sortOrder: 'asc' } },
      coverMedia: true,
    },
  });

  if (!listing) return notFound();

  return <RoyalListingPage listing={listing} />;
}
