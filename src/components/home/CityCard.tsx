// src/components/home/CityCard.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import type { City } from './cities';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

export default function CityCard({ city }: { city: City }) {
  const [imgOk, setImgOk] = useState(true);

  const label = useMemo(() => initials(city.name), [city.name]);

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/7"
    >
      <div className="relative h-44 w-full">
        {imgOk && city.image?.src ? (
          <Image
            src={city.image.src}
            alt={city.image.alt ?? `${city.name} image`}
            fill
            priority={city.slug === 'madrid' || city.slug === 'barcelona'}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-black/40">
            <div className="absolute inset-0 opacity-60 [background:radial-gradient(600px_280px_at_20%_20%,rgba(255,255,255,0.18),transparent_60%),radial-gradient(520px_240px_at_80%_30%,rgba(255,255,255,0.10),transparent_60%)]" />
            <div className="absolute left-4 top-4 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-zinc-200 backdrop-blur">
              {label}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-100">{city.name}</div>
            <div className="mt-1 truncate text-xs text-zinc-500">
              {city.country}
              {city.region ? ` · ${city.region}` : ''}
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
            Open
          </span>
        </div>

        {city.blurb ? (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-300">{city.blurb}</p>
        ) : null}

        <div className="mt-4 h-px w-full bg-white/10" />
        <div className="mt-3 text-xs text-zinc-500">/city/{city.slug}</div>
      </div>
    </Link>
  );
}
