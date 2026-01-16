// src/components/listings/RoyalHero.tsx
import Image from 'next/image';
import type { City, Listing, ListingMedia } from '@prisma/client';

type ListingWithRelations = Listing & {
  city: City;
  media: ListingMedia[];
  coverMedia: ListingMedia | null;
};

function pickHeroMedia(listing: ListingWithRelations) {
  if (listing.coverMedia?.url) return listing.coverMedia;
  const first = listing.media?.find((m) => m.kind === 'image' && !!m.url) || listing.media?.[0] || null;
  return first;
}

export default function RoyalHero({ listing, cityLabel }: { listing: ListingWithRelations; cityLabel: string }) {
  const hero = pickHeroMedia(listing);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
      <div className="relative h-[68vh] min-h-[520px] w-full">
        {hero?.url ? (
          <Image
            src={hero.url}
            alt={hero.alt || listing.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_30%_10%,rgba(255,255,255,0.08),transparent)]" />
        )}

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.78))]" />

        {/* overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between gap-10">
            <div className="min-w-0">
              <div className="text-[12px] uppercase tracking-[0.16em] text-white/70">{cityLabel}</div>
              <div className="mt-2 text-[14px] text-white/80">
                {(listing.propertyType || 'Property').toUpperCase()}
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-xl">
                {listing.status} · {listing.verification}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
