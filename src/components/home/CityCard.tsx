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

function regionLine(city: City) {
  const a: string[] = [];
  if (city.country) a.push(city.country);
  if (city.region) a.push(city.region);
  return a.join(' · ');
}

function hasVerified(stats?: CityListingsStats) {
  const n = stats?.verifiedCount ?? 0;
  return n > 0;
}

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';

function goldText() {
  return 'bg-clip-text text-transparent bg-[linear-gradient(180deg,var(--gold-1)_0%,var(--gold-2)_45%,var(--gold-3)_100%)]';
}

function premiumFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_90%_10%,rgba(11,12,16,0.06),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.14)_1px,transparent_0)] [background-size:32px_32px]" />
    </div>
  );
}

function SignalChip({
  label,
  tone = 'neutral',
  value = '—',
}: {
  label: string;
  value?: string;
  tone?: 'neutral' | 'gold' | 'violet' | 'emerald';
}) {
  const toneCls =
    tone === 'gold'
      ? 'ring-[rgba(231,201,130,0.32)] text-[color:var(--ink)]'
      : tone === 'emerald'
        ? 'ring-[rgba(16,185,129,0.22)] text-[color:var(--ink)]'
        : tone === 'violet'
          ? 'ring-[rgba(139,92,246,0.18)] text-[color:var(--ink)]'
          : 'ring-[color:var(--hairline)] text-[color:var(--ink)]';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]',
        'bg-white/82 backdrop-blur-2xl',
        'ring-1 ring-inset',
        toneCls,
      )}
    >
      <span className="tracking-[0.18em] uppercase text-[10px] text-[color:var(--ink-3)]">{label}</span>
      <span className="h-3 w-px bg-black/10" />
      <span className="font-semibold tracking-[-0.01em]">{value}</span>
    </span>
  );
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

  const verified = stats?.verifiedCount ?? 0;
  const showVerified = hasVerified(stats);

  const isFeatured =
    city.slug === 'miami' ||
    city.slug === 'new-york' ||
    city.slug === 'monaco' ||
    city.slug === 'dubai' ||
    city.slug === 'marbella';

  return (
    <div className="group relative min-w-0">
      <Link
        href={`/city/${city.slug}`}
        prefetch
        className={cx(
          'relative block overflow-hidden rounded-[30px]',
          // white editorial card shell
          'bg-white/72 backdrop-blur-[14px]',
          RING,
          'shadow-[0_26px_90px_rgba(11,12,16,0.10)]',
          'transition duration-500 hover:-translate-y-[2px] hover:shadow-[0_34px_120px_rgba(11,12,16,0.14)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.18)]',
        )}
        aria-label={`Open ${city.name}`}
      >
        {/* Media */}
        <div className={cx('relative w-full', isWall ? 'h-[360px]' : 'h-[310px] sm:h-[360px]')}>
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(city)}
              fill
              sizes={isWall ? '(max-width: 1024px) 100vw, 720px' : '(max-width: 768px) 100vw, 50vw'}
              className={cx(
                'object-cover transition duration-700',
                'group-hover:scale-[1.03]',
                // normalize photos for a premium white UI
                '[filter:contrast(1.03)_saturate(1.04)]',
              )}
              priority={isFeatured}
              fallback={premiumFallback()}
            />
          ) : (
            premiumFallback()
          )}

          {/* Photo finishing: highlight edge + grain + calm vignette */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_20%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.16)_1px,transparent_0)] [background-size:34px_34px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,251,250,0.00)_38%,rgba(251,251,250,0.70)_86%,rgba(251,251,250,0.92)_100%)]" />
          </div>

          {/* Premium refractor sweep on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
            <div className="absolute -left-[40%] top-[-30%] h-[180%] w-[55%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.18),transparent)] blur-xl" />
          </div>

          {/* Top-left micro badge (only when featured) */}
          {isFeatured ? (
            <div className="absolute left-4 top-4">
              <div
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase',
                  'bg-white/82 backdrop-blur-2xl',
                  RING,
                  'text-[color:var(--ink-3)]',
                )}
              >
                <span className={cx('font-semibold', goldText())}>Featured market</span>
              </div>
            </div>
          ) : null}

          {/* Bottom overlay content */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-[20px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                  {city.name}
                </div>
                <div className="mt-1 truncate text-[12px] text-[color:var(--ink-2)]">{regionLine(city)}</div>

                {/* Signal row */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {showVerified ? (
                    <SignalChip label="Verified" value={`${verified}`} tone="gold" />
                  ) : (
                    <SignalChip label="Coverage" value="City dossier" tone="neutral" />
                  )}
                  <SignalChip label="Liquidity" value="Weekly" tone="emerald" />
                  <SignalChip label="Risk" value="Tracked" tone="violet" />
                </div>
              </div>

              {/* CTA pill (luxury control) */}
              <span
                className={cx(
                  'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold',
                  'bg-white/86 backdrop-blur-2xl',
                  'text-[color:var(--ink)]',
                  RING,
                  'shadow-[0_18px_50px_rgba(11,12,16,0.10)]',
                  'transition group-hover:bg-white',
                )}
              >
                <span className={cx('tracking-[-0.01em]', goldText())}>Enter</span>
                <span className="h-4 w-px bg-black/10" />
                <span className="text-[color:var(--ink-2)]">dossier</span>
              </span>
            </div>
          </div>
        </div>

        {/* Editorial footer (paper) */}
        <div className="px-5 pb-5 pt-4">
          {city.blurb?.trim() ? (
            <p className="text-[13px] leading-relaxed text-[color:var(--ink-2)] line-clamp-2">{city.blurb.trim()}</p>
          ) : (
            <p className="text-[13px] leading-relaxed text-[color:var(--ink-2)] line-clamp-2">
              Private market coverage with proof-first signals, not portal theatre.
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-[11px] tracking-[0.20em] uppercase text-[color:var(--ink-3)]">Open dossier</div>
            <div className="h-px flex-1 bg-[rgba(11,12,16,0.10)]" />
            <div className="text-[11px] text-[color:var(--ink-3)]">Updated weekly</div>
          </div>
        </div>

        {/* hover ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-[rgba(231,201,130,0.26)]" />
        </div>
      </Link>
    </div>
  );
}
