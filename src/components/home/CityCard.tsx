// src/components/home/CityCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { CityMeta } from './cities';

function safeAlt(city: CityMeta) {
  if (city.image?.alt?.trim()) return city.image.alt.trim();
  return `${city.name} city view`;
}

export default function CityCard({ city }: { city: CityMeta }) {
  const [imgOk, setImgOk] = useState(true);

  const hasImg = useMemo(() => {
    const src = city.image?.src?.trim();
    return Boolean(imgOk && src);
  }, [imgOk, city.image?.src]);

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
    >
      <div className="relative h-[160px] w-full sm:h-[180px]">
        {hasImg ? (
          <Image
            src={city.image!.src}
            alt={safeAlt(city)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            priority={city.slug === 'madrid'}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-zinc-50">{city.name}</div>
            <div className="mt-0.5 truncate text-xs text-zinc-400">
              {city.country}
              {city.region ? ` · ${city.region}` : ''}
            </div>
          </div>

          <span className="mt-0.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
            Open
          </span>
        </div>

        {city.blurb ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-300">{city.blurb}</p>
        ) : null}

        <div className="mt-4 h-px w-full bg-white/10" />
        <div className="mt-4 text-xs text-zinc-400">{`/city/${city.slug}`}</div>
      </div>
    </Link>
  );
}
