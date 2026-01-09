'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import SafeImage from './SafeImage';
import type { Listing } from './listings';
import { LISTINGS } from './listings';

function formatEur(n: number) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `€${Math.round(n).toLocaleString()}`;
  }
}

function ListingCard({ l }: { l: Listing }) {
  const [ok, setOk] = useState(true);

  const src = useMemo(() => {
    const s = l.image?.src?.trim() ?? '';
    return ok && s ? s : '';
  }, [ok, l.image?.src]);

  const meta = [
    l.beds ? `${l.beds} bd` : null,
    l.baths ? `${l.baths} ba` : null,
    l.areaM2 ? `${l.areaM2} m²` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/listing/${l.id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
      prefetch
    >
      <div className="relative h-[180px] w-full">
        {src ? (
          <SafeImage
            src={src}
            alt={l.image?.alt?.trim() || l.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
            onError={() => setOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-amber-300/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur">
          {formatEur(l.priceEur)}
        </div>
      </div>

      <div className="p-5">
        <div className="text-base font-semibold text-zinc-50">{l.title}</div>
        <div className="mt-1 text-xs text-zinc-400">
          {l.city}, {l.country}
          {l.region ? ` · ${l.region}` : ''}
        </div>

        {meta.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200"
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 h-px w-full bg-white/10" />
        <div className="mt-4 text-xs text-zinc-400">{`/listing/${l.id}`}</div>
      </div>
    </Link>
  );
}

export default function ListingsPreview() {
  const featured = LISTINGS.slice(0, 6);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((l) => (
        <ListingCard key={l.id} l={l} />
      ))}
    </div>
  );
}
