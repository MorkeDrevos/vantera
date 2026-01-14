// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';

import type { City } from './cities';
import SafeImage from '@/components/home/SafeImage';

export type CityListingsStats = {
  verifiedCount: number;
  pendingCount?: number;
};

function safeAlt(city: City) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function hasVerified(stats?: CityListingsStats) {
  const n = stats?.verifiedCount ?? 0;
  return n > 0;
}

function regionLine(city: City) {
  const a: string[] = [];
  if (city.country) a.push(city.country);
  if (city.region) a.push(city.region);
  return a.join(' · ');
}

export default function CityCard({
  city,
  stats,
  variant = 'default',
  showLockedCta = false,
}: {
  city: City;
  stats?: CityListingsStats;
  variant?: 'default' | 'wall';
  showLockedCta?: boolean;
}) {
  void showLockedCta;

  const src = city.image?.src?.trim() ?? '';
  const isWall = variant === 'wall';

  // JamesEdition: keep the surface clean.
  // If verified inventory exists, show a subtle count. Otherwise show nothing.
  const verified = stats?.verifiedCount ?? 0;
  const showVerified = hasVerified(stats);

  return (
    <div className="group relative min-w-0">
      <Link
        href={`/city/${city.slug}`}
        prefetch
        className={cx(
          'relative block overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02]',
          // calmer shadow and less glass
          'shadow-[0_18px_70px_rgba(0,0,0,0.45)]',
          'transition duration-500 hover:-translate-y-[2px] hover:border-white/16 hover:shadow-[0_26px_92px_rgba(0,0,0,0.55)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        )}
        aria-label={`Open ${city.name}`}
      >
        {/* Image */}
        <div className={cx('relative w-full', isWall ? 'h-[320px]' : 'h-[290px] sm:h-[320px]')}>
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(city)}
              fill
              sizes={isWall ? '(max-width: 1024px) 100vw, 520px' : '(max-width: 768px) 100vw, 33vw'}
              className={cx(
                'object-cover transition duration-700',
                'group-hover:scale-[1.03]',
                // Slightly editorial, not punchy
                '[filter:contrast(1.03)_saturate(1.03)]',
              )}
              priority={city.slug === 'marbella'}
              fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          )}

          {/* Editorial scrim like luxury portals */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-[20px] font-semibold tracking-tight text-zinc-50">
                  {city.name}
                </div>
                <div className="mt-1 truncate text-[12px] text-zinc-200/85">
                  {regionLine(city)}
                </div>

                {showVerified ? (
                  <div className="mt-3 inline-flex items-center rounded-full border border-white/14 bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-100/90 backdrop-blur-2xl">
                    Verified homes
                    <span className="text-zinc-500"> · </span>
                    <span className="font-medium text-zinc-100">{verified}</span>
                  </div>
                ) : null}
              </div>

              {/* Minimal action cue (no button soup) */}
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/14 bg-white/[0.06] px-3 py-1.5 text-[11px] text-zinc-100/90 backdrop-blur-2xl transition group-hover:border-white/22 group-hover:bg-white/[0.08]">
                <span className="opacity-90">View</span>
                <span className="translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-100">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Optional small description - keep it tight and calm */}
        {city.blurb?.trim() ? (
          <div className="px-5 pb-5 pt-4">
            <p className="text-[13px] leading-relaxed text-zinc-300 line-clamp-2">{city.blurb.trim()}</p>
          </div>
        ) : (
          <div className="px-5 pb-5 pt-4">
            <p className="text-[13px] leading-relaxed text-zinc-400 line-clamp-2">
              Private market coverage, presented with a truth-first lens.
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-0 ring-white/10 transition group-hover:ring-1" />
      </Link>
    </div>
  );
}
