import Image from 'next/image';
import Link from 'next/link';

import type { City } from './cities';

export default function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
    >
      <div className="relative aspect-[16/10] w-full">
        {city.image?.src ? (
          <Image
            src={city.image.src}
            alt={city.image.alt ?? `${city.name} photo`}
            fill
            className="object-cover opacity-80 transition duration-300 group-hover:opacity-95"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={city.slug === 'madrid'}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-100">{city.name}</div>
            <div className="mt-0.5 text-xs text-zinc-400">
              {city.country}
              {city.region ? ` · ${city.region}` : ''}
            </div>
          </div>

          <span className="mt-0.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">
            Open
          </span>
        </div>

        {city.blurb ? (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {city.blurb}
          </p>
        ) : null}

        <div className="mt-3 h-px w-full bg-white/10" />
        <div className="mt-3 text-xs text-zinc-500">/city/{city.slug}</div>
      </div>
    </Link>
  );
}
