// src/components/home/ListingsPreview.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import SafeImage from './SafeImage';
import type { Listing } from './listings';
import { LISTINGS } from './listings';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';

function goldText() {
  return 'bg-clip-text text-transparent bg-[linear-gradient(180deg,var(--gold-1)_0%,var(--gold-2)_45%,var(--gold-3)_100%)]';
}

function formatEur(n: number) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `€${Math.round(n).toLocaleString()}`;
  }
}

function safeAlt(l: Listing) {
  const a = l.image?.alt?.trim();
  return a ? a : `${l.title} listing photo`;
}

function locationLine(l: Listing) {
  const parts = [l.city, l.country].filter(Boolean) as string[];
  const base = parts.join(', ');
  if (!base) return 'Location pending';
  return l.region ? `${base} · ${l.region}` : base;
}

function metaLine(l: Listing) {
  const bits = [
    l.beds ? `${l.beds} beds` : null,
    l.baths ? `${l.baths} baths` : null,
    l.areaM2 ? `${l.areaM2} m²` : null,
  ].filter(Boolean) as string[];
  return bits.length ? bits.join(' · ') : 'Details pending';
}

function premiumFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.05),rgba(0,0,0,0.02),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_90%_12%,rgba(11,12,16,0.06),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
    </div>
  );
}

function ListingCard({ l }: { l: Listing }) {
  const [ok, setOk] = useState(true);

  const src = useMemo(() => {
    const s = l.image?.src?.trim() ?? '';
    return ok && s ? s : '';
  }, [ok, l.image?.src]);

  return (
    <div className="group relative min-w-0">
      <Link
        href={`/listing/${l.id}`}
        prefetch
        className={cx(
          'relative block overflow-hidden rounded-[28px]',
          'bg-white/70 backdrop-blur-[12px]',
          RING,
          'shadow-[0_26px_90px_rgba(11,12,16,0.10)]',
          'transition duration-500 hover:-translate-y-[2px] hover:shadow-[0_34px_120px_rgba(11,12,16,0.14)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.18)]',
        )}
        aria-label={`Open ${l.title}`}
      >
        {/* media */}
        <div className="relative h-[210px] w-full">
          {src ? (
            <SafeImage
              src={src}
              alt={safeAlt(l)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={cx(
                'object-cover transition duration-700',
                'group-hover:scale-[1.02]',
                '[filter:contrast(1.02)_saturate(1.03)]',
              )}
              fallback={premiumFallback()}
              onError={() => setOk(false)}
            />
          ) : (
            premiumFallback()
          )}

          {/* white readability veil (NOT black) */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(251,251,250,0.00)_42%,rgba(251,251,250,0.72)_88%,rgba(251,251,250,0.92)_100%)]" />

          {/* price pill */}
          <div className="absolute left-4 top-4">
            <div
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em]',
                'bg-white/82 backdrop-blur-2xl',
                RING,
                'text-[color:var(--ink-2)]',
              )}
            >
              <span className={goldText()}>{formatEur(l.priceEur)}</span>
            </div>
          </div>

          {/* bottom overlay content */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                  {l.title}
                </div>
                <div className="mt-1 truncate text-[12px] text-[color:var(--ink-2)]">{locationLine(l)}</div>

                <div
                  className={cx(
                    'mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-[11px]',
                    'bg-white/80 backdrop-blur-2xl',
                    RING,
                    'text-[color:var(--ink-2)]',
                  )}
                >
                  {metaLine(l)}
                </div>
              </div>

              {/* CTA pill */}
              <span
                className={cx(
                  'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold',
                  'bg-white/86 backdrop-blur-2xl',
                  'text-[color:var(--ink)]',
                  RING,
                  'shadow-[0_18px_50px_rgba(11,12,16,0.10)]',
                  'transition group-hover:bg-white/94',
                )}
              >
                <span className={goldText()}>Open</span>
                <span className="text-black/30">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* paper footer */}
        <div className="px-5 pb-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] tracking-[0.20em] uppercase text-[color:var(--ink-3)]">Listing dossier</div>
            <div className="h-px flex-1 bg-[rgba(11,12,16,0.10)]" />
            <div className="text-[11px] text-[color:var(--ink-3)]">{`/listing/${l.id}`}</div>
          </div>
        </div>

        {/* hover gold hairline */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-[rgba(231,201,130,0.28)]" />
        </div>
      </Link>
    </div>
  );
}

export default function ListingsPreview() {
  const featured = LISTINGS.slice(0, 6);

  return (
    <section className="w-full">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((l) => (
          <ListingCard key={l.id} l={l} />
        ))}
      </div>
    </section>
  );
}
