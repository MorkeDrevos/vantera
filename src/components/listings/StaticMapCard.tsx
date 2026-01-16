// src/components/listings/StaticMapCard.tsx
import type { Listing } from '@prisma/client';

function buildMapUrl(lat: number, lng: number) {
  // Simple static map placeholder using OpenStreetMap tiles via a basic embed URL pattern is messy.
  // For now, we use Google Maps "q" link-style image fallback is not static.
  // We keep it calm: a button that opens map later.
  const q = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps?q=${q}`;
}

export default function StaticMapCard({ listing, cityLabel }: { listing: Listing; cityLabel: string }) {
  const hasGeo = listing.lat != null && listing.lng != null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Location</div>
      <div className="mt-2 text-sm text-white/75">{cityLabel}</div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-5">
        {hasGeo ? (
          <a
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-white/80 hover:bg-black/50"
            href={buildMapUrl(listing.lat!, listing.lng!)}
            target="_blank"
            rel="noreferrer"
          >
            Open map
          </a>
        ) : (
          <div className="text-sm text-white/65">Geo pin pending.</div>
        )}
      </div>
    </section>
  );
}
