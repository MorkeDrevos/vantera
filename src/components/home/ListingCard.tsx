// src/components/home/ListingCard.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import SafeImage from './SafeImage';
import type { Listing } from './listings';

function formatEur(n: number) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `€${Math.round(n).toLocaleString()}`;
  }
}

function safeAlt(listing: Listing) {
  if (listing.image?.alt?.trim()) return listing.image.alt.trim();
  return `${listing.title} listing photo`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [imgOk, setImgOk] = useState(true);

  const src = useMemo(() => {
    const s = listing.image?.src?.trim();
    return imgOk && s ? s : '';
  }, [imgOk, listing.image?.src]);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
      prefetch
    >
      <div className="relative h-[190px] w-full sm:h-[210px]">
        {src ? (
          <SafeImage
            src={src}
            alt={safeAlt(listing)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Top-right price pill */}
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(168,85,247,0.16))] px-2.5 py-1 text-[11px] text-zinc-100 backdrop-blur">
          {formatEur(listing.priceEur)}
        </div>
      </div>

      <div className="p-5">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-zinc-50">{listing.title}</div>
          <div className="mt-0.5 truncate text-xs text-zinc-400">{listing.location}</div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Beds</div>
            <div className="mt-1 text-sm font-semibold text-zinc-100">{listing.beds ?? '-'}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Baths</div>
            <div className="mt-1 text-sm font-semibold text-zinc-100">{listing.baths ?? '-'}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Sqm</div>
            <div className="mt-1 text-sm font-semibold text-zinc-100">{listing.sqm ?? '-'}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-zinc-500">{`/listing/${listing.id}`}</div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-zinc-200 transition group-hover:border-white/20 group-hover:bg-white/10">
            View listing
          </span>
        </div>
      </div>
    </Link>
  );
}
