import Image from 'next/image';
import Link from 'next/link';
import type { City } from './cities';

export default function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition hover:bg-white/8"
    >
      <div className="relative h-40 w-full">
        <Image
          src={city.image.src}
          alt={city.image.alt}
          fill
          className="object-cover opacity-85 transition group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 520px"
          priority={city.slug === 'madrid' || city.slug === 'barcelona'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">{city.name}</div>
            <div className="mt-0.5 text-xs text-white/60">
              {city.region ? city.region : 'City'} {city.tz ? `- ${city.tz}` : ''}
            </div>
          </div>

          <span className="mt-0.5 rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/70">
            Open
          </span>
        </div>

        {city.blurb ? (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/70">
            {city.blurb}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
