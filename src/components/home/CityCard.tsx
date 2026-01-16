// src/components/home/CityCard.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

// Light UI ring token (do not depend on CSS vars)
const RING = 'ring-1 ring-inset ring-black/[0.08]';

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

function Chip({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'gold';
}) {
  const ringCls = tone === 'gold' ? 'ring-[rgba(231,201,130,0.28)]' : 'ring-black/[0.08]';
  const bgCls = tone === 'gold' ? 'bg-[rgba(231,201,130,0.10)]' : 'bg-white/90';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 px-3 py-1.5 text-[11px]',
        bgCls,
        'backdrop-blur-2xl',
        'ring-1 ring-inset',
        ringCls,
        'shadow-[0_10px_30px_rgba(11,12,16,0.06)]',
        'text-slate-900',
      )}
    >
      {label}
    </span>
  );
}

function formatLocalTime(tz?: string, nowMs?: number) {
  if (!tz) return null;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
    }).format(new Date(nowMs ?? Date.now()));
  } catch {
    return null;
  }
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
    city.slug === 'marbella' ||
    city.slug === 'london';

  // Local time (real signal)
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  const localTime = useMemo(() => formatLocalTime((city as any)?.tz, nowMs), [city, nowMs]);

  return (
    <div className="group relative min-w-0 h-full">
      <Link
        href={`/city/${city.slug}`}
        prefetch
        className={cx(
          'relative block overflow-hidden',
          'bg-white/78 backdrop-blur-[14px]',
          RING,
          'shadow-[0_26px_90px_rgba(11,12,16,0.10)]',
          'transition duration-500 hover:-translate-y-[2px] hover:shadow-[0_34px_120px_rgba(11,12,16,0.14)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20',
          'h-full flex flex-col',
        )}
        aria-label={`Open ${city.name}`}
      >
        {/* Media */}
        <div className={cx('relative w-full shrink-0', isWall ? 'h-[260px] sm:h-[300px]' : 'h-[220px] sm:h-[260px]')}>
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(city)}
              fill
              sizes={isWall ? '(max-width: 1024px) 100vw, 720px' : '(max-width: 768px) 100vw, 50vw'}
              className={cx(
                'object-cover transition duration-700',
                'group-hover:scale-[1.03]',
                '[filter:contrast(1.03)_saturate(1.04)]',
              )}
              priority={isFeatured}
              fallback={premiumFallback()}
            />
          ) : (
            premiumFallback()
          )}

          {/* Photo finishing */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_20%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.16)_1px,transparent_0)] [background-size:34px_34px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_34%,rgba(255,255,255,0.62)_78%,rgba(255,255,255,0.90)_100%)]" />
          </div>

          {/* Premium sweep */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
            <div className="absolute -left-[40%] top-[-30%] h-[180%] w-[55%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.18),transparent)] blur-xl" />
          </div>

          {/* Top-left badge */}
          {isFeatured ? (
            <div className="absolute left-4 top-4">
              <div
                className={cx(
                  'inline-flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase',
                  'bg-white/90 backdrop-blur-2xl',
                  RING,
                  'text-slate-600',
                )}
              >
                <span className={cx('font-semibold', goldText())}>Featured market</span>
              </div>
            </div>
          ) : null}

          {/* Real signals row (only real data) */}
          <div className="absolute left-4 right-4 top-4 mt-9 flex flex-wrap items-center gap-2">
            {localTime ? <Chip label={`Local time ${localTime}`} /> : null}
            {showVerified ? <Chip label={`Verified ${verified}`} tone="gold" /> : null}
          </div>

          {/* Bottom overlay content */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-[20px] font-semibold tracking-[-0.02em] text-slate-950">{city.name}</div>
                <div className="mt-1 truncate text-[12px] text-slate-600">{regionLine(city)}</div>
              </div>

              {/* CTA chip (no fake words) */}
              <span
                className={cx(
                  'inline-flex shrink-0 items-center gap-2 px-4 py-2.5 text-[12px] font-semibold',
                  'bg-white/92 backdrop-blur-2xl',
                  'text-slate-900',
                  RING,
                  'shadow-[0_18px_50px_rgba(11,12,16,0.10)]',
                  'transition group-hover:bg-white',
                )}
              >
                <span className={cx('tracking-[-0.01em]', goldText())}>Enter</span>
                <span className="h-4 w-px bg-black/10" />
                <span className="text-slate-600">market</span>
              </span>
            </div>
          </div>
        </div>

        {/* Editorial footer (no fake “Updated weekly”) */}
        <div className="px-5 pb-5 pt-4 flex-1 flex flex-col">
          <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-2">
            {city.blurb?.trim()
              ? city.blurb.trim()
              : 'Private market coverage with proof-first signals, presented like a catalogue.'}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between gap-3">
            <div className="text-[11px] tracking-[0.20em] uppercase text-slate-500">Open market</div>
            <div className="h-px flex-1 bg-black/10" />
            <div className="text-[11px] text-slate-500">{showVerified ? 'Verified' : 'Coverage'}</div>
          </div>
        </div>

        {/* hover ring */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 ring-1 ring-inset ring-[rgba(231,201,130,0.26)]" />
        </div>
      </Link>
    </div>
  );
}
