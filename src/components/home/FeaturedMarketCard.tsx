// src/components/home/FeaturedMarketCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type FeaturedMarketCardProps = {
  // Required identity
  slug: string;
  name: string;
  country: string;
  region?: string | null;

  // Required hero
  heroImageSrc: string;
  heroImageAlt?: string | null;

  // Required time
  tz: string; // IANA tz, e.g. "Europe/Madrid"

  // Required copy
  description: string; // keep it 1-2 sentences (will clamp)

  // Required navigation
  href: string;

  // Controlled footer labels
  modeLabel?: string; // default: "OPEN MARKET"
  coverageLabel?: string; // default: "Coverage"

  // Optional override
  eyebrow?: string; // default: "FEATURED MARKET"
};

/**
 * Featured Market Design Contract - Enforced
 * - One system across all Featured Market cards
 * - Always hero image + controlled overlay stack
 * - Chips always readable
 * - Local time always includes tz + day shift (+1d/-1d)
 * - CTA never sits raw on the image
 * - Footer always present and aligned
 */

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function getDatePartsForZone(d: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const y = Number(get('year'));
  const m = Number(get('month'));
  const day = Number(get('day'));
  return { y, m, day };
}

function getDayShiftLabel(now: Date, marketTz: string) {
  const viewerTz =
    (Intl.DateTimeFormat().resolvedOptions().timeZone as string | undefined) || 'UTC';

  const a = getDatePartsForZone(now, viewerTz);
  const b = getDatePartsForZone(now, marketTz);

  // Compare calendar dates by encoding into yyyymmdd
  const ai = a.y * 10000 + a.m * 100 + a.day;
  const bi = b.y * 10000 + b.m * 100 + b.day;

  if (bi === ai) return null;
  if (bi > ai) return '+1d';
  return '-1d';
}

function formatLocalTime(now: Date, timeZone: string) {
  const timeFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // tz abbreviation (e.g. GMT, CET, BST, CEST). Browser support varies, but good enough.
  const tzFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
  });

  const time = timeFmt.format(now);
  const tzParts = tzFmt.formatToParts(now);
  const tzAbbr = tzParts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  const shift = getDayShiftLabel(now, timeZone);

  return { time, tzAbbr, shift };
}

const RING = 'ring-1 ring-inset ring-[rgba(11,12,16,0.12)]';

const FM = {
  card: cx(
    'relative overflow-hidden rounded-[28px]',
    'shadow-[0_30px_90px_rgba(11,12,16,0.10)]',
    'bg-[color:var(--surface-2)]',
    RING,
  ),

  // Hero + overlays (never raw image)
  heroWrap: 'absolute inset-0',
  overlayA:
    'pointer-events-none absolute inset-0 ' +
    'bg-[linear-gradient(110deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.70)_45%,rgba(255,255,255,0.86)_100%)]',
  overlayB:
    'pointer-events-none absolute inset-0 ' +
    'shadow-[inset_0_0_0_1px_rgba(11,12,16,0.06),inset_0_-70px_140px_rgba(11,12,16,0.08)]',
  overlayC:
    'pointer-events-none absolute inset-0 opacity-[0.035] ' +
    '[background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.26)_1px,transparent_0)] ' +
    '[background-size:26px_26px]',
  topRule:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent',

  // Content padding rhythm (consistent)
  content: 'relative p-[18px] sm:p-[22px] lg:p-[28px]',

  chipBase:
    'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase ' +
    'bg-[rgba(255,255,255,0.92)] backdrop-blur-[18px] ' +
    'shadow-[0_16px_40px_rgba(11,12,16,0.08)]',
  chipGold:
    'ring-1 ring-inset ring-[rgba(212,175,55,0.35)] text-[rgba(176,141,60,0.98)]',
  chipNeutral: 'ring-1 ring-inset ring-[rgba(11,12,16,0.10)] text-[color:var(--ink-2)]',

  title: 'text-[22px] sm:text-[26px] lg:text-[32px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]',
  subtitle: 'mt-1 text-[14px] text-[color:var(--ink-3)]',
  desc: 'mt-4 text-[15px] leading-relaxed text-[color:var(--ink-2)] line-clamp-2',

  // CTA must never sit on raw image
  ctaWrap:
    'inline-flex items-center overflow-hidden rounded-full ' +
    'bg-[rgba(255,255,255,0.92)] backdrop-blur-[18px] ' +
    'ring-1 ring-inset ring-[rgba(11,12,16,0.12)] ' +
    'shadow-[0_18px_55px_rgba(11,12,16,0.10)]',

  ctaPart:
    'px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(11,12,16,0.18)]',

  ctaEnter: 'text-[rgba(176,141,60,0.98)] hover:bg-[rgba(212,175,55,0.08)]',
  ctaMarket: 'text-[color:var(--ink-2)] hover:bg-[rgba(11,12,16,0.04)]',
  ctaDivider: 'h-6 w-px bg-[rgba(11,12,16,0.14)]',

  footerRow: 'mt-6 flex items-center gap-4',
  footerRule: 'h-px flex-1 bg-[rgba(11,12,16,0.10)]',
  footerLeft: 'text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]',
  footerRight: 'text-[13px] text-[color:var(--ink-3)]',
};

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'gold' | 'neutral';
}) {
  return (
    <span className={cx(FM.chipBase, tone === 'gold' ? FM.chipGold : FM.chipNeutral)}>
      {children}
    </span>
  );
}

export default function FeaturedMarketCard(props: FeaturedMarketCardProps) {
  const {
    slug,
    name,
    country,
    region,
    heroImageSrc,
    heroImageAlt,
    tz,
    description,
    href,
    modeLabel = 'OPEN MARKET',
    coverageLabel = 'Coverage',
    eyebrow = 'FEATURED MARKET',
  } = props;

  // Enforce contract: Featured Markets must have a hero image.
  if (!heroImageSrc) return null;

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update once per minute, aligned-ish
    const tick = () => setNow(new Date());
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);

  const localTime = useMemo(() => formatLocalTime(now, tz), [now, tz]);

  const subtitle = useMemo(() => {
    const parts = [country, region].filter((x) => typeof x === 'string' && x.trim());
    return parts.join(' · ');
  }, [country, region]);

  const timeLabel = useMemo(() => {
    // Local time HH:MM · TZ · (+1d/-1d)
    const bits = [`Local time ${localTime.time}`];
    if (localTime.tzAbbr) bits.push(localTime.tzAbbr);
    if (localTime.shift) bits.push(localTime.shift);
    return bits.join(' · ');
  }, [localTime]);

  return (
    <article className={FM.card} data-featured-market={slug}>
      {/* HERO */}
      <div className={FM.heroWrap} aria-hidden="true">
        <Image
          src={heroImageSrc}
          alt={heroImageAlt ?? `${name} market hero`}
          fill
          priority={false}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className={FM.overlayA} />
        <div className={FM.overlayB} />
        <div className={FM.overlayC} />
        <div className={FM.topRule} />
      </div>

      {/* CONTENT */}
      <div className={FM.content}>
        {/* Chips */}
        <div className="flex flex-col items-start gap-2">
          <Chip tone="gold">{eyebrow}</Chip>
          <Chip tone="neutral">{timeLabel}</Chip>
        </div>

        {/* Title row + CTA */}
        <div className="mt-[14px] sm:mt-[16px] lg:mt-[18px] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={FM.title}>{name}</h3>
            <div className={FM.subtitle}>{subtitle}</div>
          </div>

          <div className="hidden sm:block shrink-0 pt-1">
            <Link href={href} className={FM.ctaWrap} aria-label={`Enter ${name} market`}>
              <span className={cx(FM.ctaPart, FM.ctaEnter)}>Enter</span>
              <span className={FM.ctaDivider} aria-hidden="true" />
              <span className={cx(FM.ctaPart, FM.ctaMarket, 'inline-flex items-center gap-2')}>
                market <ArrowRight className="h-4 w-4 opacity-70" />
              </span>
            </Link>
          </div>
        </div>

        {/* Description */}
        <p className={FM.desc}>{description}</p>

        {/* Mobile CTA */}
        <div className="mt-4 sm:hidden">
          <Link href={href} className={cx(FM.ctaWrap, 'w-full justify-center')} aria-label={`Enter ${name} market`}>
            <span className={cx(FM.ctaPart, FM.ctaEnter)}>Enter</span>
            <span className={FM.ctaDivider} aria-hidden="true" />
            <span className={cx(FM.ctaPart, FM.ctaMarket, 'inline-flex items-center gap-2')}>
              market <ArrowRight className="h-4 w-4 opacity-70" />
            </span>
          </Link>
        </div>

        {/* Footer */}
        <div className={FM.footerRow}>
          <div className={FM.footerLeft}>{modeLabel}</div>
          <div className={FM.footerRule} aria-hidden="true" />
          <div className={FM.footerRight}>{coverageLabel}</div>
        </div>
      </div>
    </article>
  );
}
