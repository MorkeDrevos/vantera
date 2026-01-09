import Image from 'next/image';
import Link from 'next/link';
import type { City } from '@/data/cities';

export default function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition hover:border-white/20"
    >
      <div className="relative h-48 w-full">
        <Image
          src={city.image}
          alt={`${city.name} city view`}
          fill
          className="object-cover opacity-85 transition group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={city.slug === 'madrid'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">{city.name}</h3>
            <p className="text-xs text-zinc-400">
              {city.country}
            </p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            Open
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
          {city.blurb}
        </p>
      </div>
    </Link>
  );
}
