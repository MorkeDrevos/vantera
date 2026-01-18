// src/components/search/SearchResultsPageClient.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BedDouble,
  ChevronDown,
  Filter,
  Heart,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Waves,
  X,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export type SearchParams = Record<string, string | string[] | undefined>;

type Mode = 'buy' | 'rent' | 'sell';
type SortKey = 'price_high' | 'price_low' | 'beds' | 'sqm' | 'newest';

function asMode(v: unknown): Mode {
  return v === 'rent' || v === 'sell' ? v : 'buy';
}

export type ListingCard = {
  id: string;
  slug: string;

  title: string;
  headline?: string | null;

  price: number | null;
  currency: string;

  bedrooms: number | null;
  bathrooms: number | null;

  builtM2: number | null;
  plotM2: number | null;

  propertyType: string | null;

  city: {
    name: string;
    slug: string;
    country: string;
    region?: string | null;
  };

  cover: {
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;

  updatedAtISO: string;
};

type Props = {
  searchParams?: SearchParams;

  listings: ListingCard[];
  total: number;

  page: number;
  pageCount: number;
  take: number;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

function firstString(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? v[0] ?? '' : v;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function titleCase(s: string) {
  return s
    .trim()
    .split(/[\s-]+/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ');
}

function shortMoney(currency: string, n: number) {
  const cur = (currency || 'EUR').toUpperCase();
  const sym = cur === 'EUR' ? '€' : cur === 'USD' ? '$' : '';
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `${sym}${Math.round(n / 1_000)}k`;
  return `${sym}${n}`;
}

function buildUrl(next: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined) continue;
    const s = String(v).trim();
    if (!s) continue;
    p.set(k, s);
  }
  const qs = p.toString();
  return qs ? `/search?${qs}` : '/search';
}

function useClickOutside(
  refs: Array<React.RefObject<HTMLElement>>,
  onOutside: () => void,
  when = true,
) {
  useEffect(() => {
    if (!when) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      for (const r of refs) {
        const el = r.current;
        if (el && el.contains(t)) return;
      }

      onOutside();
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [refs, onOutside, when]);
}

function needsToString(needs: string[]) {
  return needs
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, 12)
    .join(',');
}

// Production-safe heuristic:
// if a user explicitly searched a place and we have 0 verified live results, we treat as "coverage not live yet".
function showCoverageNotLive(place: string, total: number) {
  return total === 0 && place.trim().length >= 2;
}

type LeadState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent' }
  | { status: 'error'; message: string };

async function postLead(payload: {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  honeypot?: string;
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'Unable to send right now. Please try again.';
    try {
      const j = await res.json();
      if (typeof j?.error === 'string') msg = j.error;
      if (typeof j?.message === 'string') msg = j.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
}

/* =========================================================
   Atoms (white editorial)
   ========================================================= */

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-[color:var(--hairline)]', className)} />;
}

function GoldHairline() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-2)]">
      {children}
    </span>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
      {children}
    </span>
  );
}

function IconPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
      <span className="text-[color:var(--ink-3)]">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function Field({
  icon,
  value,
  onChange,
  placeholder,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">{label}</div>
      <div className="mt-2 flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
        <span className="text-[color:var(--ink-3)]">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-3)]"
        />
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition',
        'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
        disabled && 'opacity-70 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition',
        'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* =========================================================
   Coverage panel (keep your logic, polish visuals)
   ========================================================= */

function AvailabilityPanel({
  place,
  mode,
  type,
  beds,
  max,
  needs,
  kw,
  q,
}: {
  place: string;
  mode: Mode;
  type: string;
  beds?: number;
  max?: number;
  needs: string[];
  kw: string;
  q: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timeline, setTimeline] = useState<'now' | '30d' | '90d' | 'later'>('30d');
  const [notes, setNotes] = useState('');
  const [hp, setHp] = useState('');
  const [lead, setLead] = useState<LeadState>({ status: 'idle' });

  const cleanPlace = place.trim();
  const placeTitle = cleanPlace ? titleCase(cleanPlace) : 'this market';

  const brief = useMemo(() => {
    const bits: string[] = [];
    bits.push(`mode: ${mode}`);
    if (cleanPlace) bits.push(`place: ${placeTitle}`);
    if (type && normalize(type) !== 'any') bits.push(`type: ${type}`);
    if (typeof beds === 'number' && beds > 0) bits.push(`beds: ${beds}+`);
    if (typeof max === 'number' && Number.isFinite(max)) bits.push(`max: ${shortMoney('EUR', max)}`);
    if (needs.length) bits.push(`needs: ${needs.slice(0, 4).join(', ')}`);
    if (kw.trim()) bits.push(`keywords: ${kw.trim()}`);
    if (q.trim() && q.trim() !== kw.trim()) bits.push(`q: ${q.trim()}`);
    return bits;
  }, [mode, cleanPlace, placeTitle, type, beds, max, needs, kw, q]);

  async function submit() {
    if (lead.status === 'sending' || lead.status === 'sent') return;

    const e = email.trim();
    if (!e || !e.includes('@')) {
      setLead({ status: 'error', message: 'Enter a valid email address.' });
      return;
    }

    setLead({ status: 'sending' });

    const message = [
      `Search request`,
      ``,
      ...brief.map((b) => `- ${b}`),
      ``,
      `timeline: ${timeline}`,
      notes.trim() ? `` : undefined,
      notes.trim() ? `notes: ${notes.trim()}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await postLead({
        name: name.trim() || undefined,
        email: e,
        subject: cleanPlace ? `Search request - ${placeTitle}` : 'Search request',
        message,
        honeypot: hp || undefined,
      });
      setLead({ status: 'sent' });
    } catch (err: any) {
      setLead({ status: 'error', message: err?.message || 'Unable to send right now.' });
    }
  }

  return (
    <div className="border border-[color:var(--hairline)] bg-white shadow-[0_30px_90px_rgba(11,12,16,0.06)]">
      <div className="relative p-8 sm:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_25%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_85%_10%,rgba(139,92,246,0.05),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-2)]">
              <ShieldCheck className="h-4 w-4 text-[color:var(--ink-3)]" />
              coverage status
            </div>

            <div className="mt-4 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
              {placeTitle} inventory is not live yet
            </div>

            <div className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--ink-2)]">
              Vantera only shows verified live listings. When a market is not live, we capture your request and notify you
              when coverage opens.
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {brief.slice(0, 6).map((b) => (
                <TagPill key={b}>{b}</TagPill>
              ))}
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
          >
            Browse markets
            <ArrowRight className="h-4 w-4 text-[color:var(--ink-3)]" />
          </Link>
        </div>

        <div className="relative mt-8 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">REQUEST ACCESS</div>
              <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                Leave your email and we’ll contact you when this market goes live.
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">NAME</div>
                  <div className="mt-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-transparent text-[13px] text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-3)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">EMAIL</div>
                  <div className="mt-2 flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
                    <Mail className="h-4 w-4 text-[color:var(--ink-3)]" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-transparent text-[13px] text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-3)]"
                    />
                  </div>
                </div>
              </div>

              <input
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">TIMELINE</div>
                  <div className="mt-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value as any)}
                      className="w-full bg-transparent text-[13px] text-[color:var(--ink)] outline-none"
                    >
                      <option value="now">Immediately</option>
                      <option value="30d">Within 30 days</option>
                      <option value="90d">Within 90 days</option>
                      <option value="later">Later</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">NOTES</div>
                  <div className="mt-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional details"
                      className="w-full bg-transparent text-[13px] text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-3)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PrimaryButton onClick={submit} disabled={lead.status === 'sending' || lead.status === 'sent'}>
                  {lead.status === 'sent' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Request received
                    </>
                  ) : lead.status === 'sending' ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Sending
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Submit request
                    </>
                  )}
                </PrimaryButton>

                {lead.status === 'error' ? (
                  <span className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm text-[color:var(--ink-2)]">
                    <AlertTriangle className="h-4 w-4 text-[color:var(--ink-3)]" />
                    {lead.message}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 text-[12px] text-[color:var(--ink-3)]">
                We only show verified live inventory. This request helps prioritise coverage.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[color:var(--hairline)] bg-white p-5">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">
                WHAT HAPPENS NEXT
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  { k: 'VERIFICATION', v: 'We onboard real inventory and verify media and listing integrity.' },
                  { k: 'NOTIFY', v: 'When the market is live, you’ll receive access and the best matching listings.' },
                  { k: 'NO FAKE RESULTS', v: 'If a market is not live, we show availability and capture the request.' },
                ].map((x) => (
                  <div key={x.k} className="border border-[color:var(--hairline)] bg-white p-4">
                    <div className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">{x.k}</div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{x.v}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-[color:var(--hairline)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
              >
                Contact Vantera
                <ArrowRight className="h-4 w-4 text-[color:var(--ink-3)]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Listing card (catalogue grade)
   ========================================================= */

function ListingCardCatalogue({ l, hero }: { l: ListingCard; hero?: boolean }) {
  const href = `/listing/${l.slug}`;

  const priceLabel = l.price ? shortMoney(l.currency, l.price) : 'Price on request';
  const locLine = `${l.city.name}${l.city.region ? `, ${l.city.region}` : ''}, ${l.city.country}`;

  if (!l.cover?.url) return null;

  return (
    <article
      className={cx(
        'group border border-[color:var(--hairline)] bg-white',
        'shadow-[0_26px_80px_rgba(11,12,16,0.05)] hover:shadow-[0_36px_110px_rgba(11,12,16,0.08)] transition',
      )}
    >
      <div
        className={cx(
          'relative w-full overflow-hidden bg-[color:var(--paper-2)]',
          hero ? 'aspect-[16/10]' : 'aspect-[4/3]',
        )}
      >
        <Image
          src={l.cover.url}
          alt={l.cover.alt ?? l.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes={hero ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
          priority={false}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,10,12,0.14)] to-transparent" />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.08))]" />
        </div>
      </div>

      <div className={cx('p-6', hero && 'sm:p-7')}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">{locLine}</div>
            <div
              className={cx(
                'mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]',
                hero && 'sm:text-[22px]',
              )}
            >
              {l.title}
            </div>
            {l.headline ? (
              <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{l.headline}</div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]"
            aria-label="save"
            title="save"
          >
            <Heart className="h-4 w-4 text-[color:var(--ink-3)]" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <TagPill>{priceLabel}</TagPill>
          {l.bedrooms ? (
            <IconPill icon={<BedDouble className="h-4 w-4" />} label={`${l.bedrooms} beds`} />
          ) : (
            <IconPill icon={<Home className="h-4 w-4" />} label="residence" />
          )}
          {l.builtM2 ? <TagPill>{l.builtM2} m²</TagPill> : null}
          {l.propertyType ? <TagPill>{l.propertyType}</TagPill> : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
          >
            View
            <ArrowRight className="h-4 w-4 text-[color:var(--ink-3)]" />
          </Link>

          <Link
            href={`/city/${l.city.slug}`}
            className="text-[12px] text-[color:var(--ink-3)] hover:text-[color:var(--ink)]"
          >
            {l.city.name}
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   Page
   ========================================================= */

export default function SearchResultsPageClient({ searchParams, listings, total, page, pageCount, take }: Props) {
  const router = useRouter();

  const boot = useMemo(() => {
    const sp = searchParams ?? {};
    const q = firstString(sp.q);
    const kw = firstString(sp.kw);
    const place = firstString(sp.place);
    const city = firstString(sp.city);
    const mode = (firstString(sp.mode) as Mode) || 'buy';
    const max = firstString(sp.max);
    const beds = firstString(sp.beds);
    const type = firstString(sp.type) || 'any';
    const needs = firstString(sp.needs)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const sort = (firstString(sp.sort) as SortKey) || 'price_high';

    return {
      q,
      kw,
      place: city || place,
      mode: mode === 'rent' || mode === 'sell' ? mode : 'buy',
      max: max ? Number(max) : undefined,
      beds: beds ? Number(beds) : undefined,
      type,
      needs,
      sort,
    };
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>(() => asMode(boot.mode));
  const [q, setQ] = useState(boot.q);
  const [place, setPlace] = useState(boot.place);
  const [kw, setKw] = useState(boot.kw);
  const [max, setMax] = useState<number | undefined>(Number.isFinite(boot.max as number) ? boot.max : undefined);
  const [beds, setBeds] = useState<number | undefined>(Number.isFinite(boot.beds as number) ? boot.beds : undefined);
  const [type, setType] = useState<string>(boot.type || 'any');
  const [needs, setNeeds] = useState<string[]>(boot.needs ?? []);
  const [sort, setSort] = useState<SortKey>(boot.sort);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);
  const sortBtnRef = useRef<HTMLButtonElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside([sortBtnRef, sortMenuRef], () => setSortOpen(false), sortOpen);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeNeeds = new Set(needs.map((x) => normalize(x)));

  function toggleNeed(n: string) {
    setNeeds((prev) => {
      const nn = normalize(n);
      const set = new Set(prev.map((x) => normalize(x)));
      if (set.has(nn)) return prev.filter((x) => normalize(x) !== nn);
      return [...prev, n];
    });
  }

  function applyToUrl(nextPage?: number) {
    router.push(
      buildUrl({
        q: q.trim() || undefined,
        place: place.trim() || undefined,
        kw: kw.trim() || undefined,
        mode: mode !== 'buy' ? mode : undefined,
        max: typeof max === 'number' && Number.isFinite(max) ? Math.round(max) : undefined,
        beds: typeof beds === 'number' && Number.isFinite(beds) ? Math.round(beds) : undefined,
        type: type && normalize(type) !== 'any' ? type : undefined,
        needs: needs.length ? needsToString(needs) : undefined,
        sort: sort !== 'price_high' ? sort : undefined,
        page: nextPage && nextPage !== 1 ? nextPage : undefined,
        take: take !== 24 ? take : undefined,
      }),
    );
  }

  function clearAll() {
    setMode('buy');
    setQ('');
    setPlace('');
    setKw('');
    setMax(undefined);
    setBeds(undefined);
    setType('any');
    setNeeds([]);
    setSort('price_high');
    setSortOpen(false);
    router.push('/search');
  }

  const summaryBits = useMemo(() => {
    const bits: string[] = [];
    if (place.trim()) bits.push(titleCase(place.trim()));
    if (type && normalize(type) !== 'any') bits.push(type);
    if (beds) bits.push(`${beds}+ beds`);
    if (max) bits.push(`under ${shortMoney('EUR', max)}`);
    if (needs.length) bits.push(needs.slice(0, 2).join(', '));
    if (kw.trim()) bits.push(`keywords: ${kw.trim()}`);
    if (q.trim() && q.trim() !== kw.trim()) bits.push(`q: ${q.trim()}`);
    return bits;
  }, [place, type, beds, max, needs, kw, q]);

  const sortLabel =
    sort === 'price_low'
      ? 'price: low to high'
      : sort === 'beds'
        ? 'beds: most first'
        : sort === 'sqm'
          ? 'size: largest first'
          : sort === 'newest'
            ? 'newest'
            : 'price: high to low';

  const isCoverageNotLive = showCoverageNotLive(place, total);

  const cards = useMemo(() => {
    const base = listings.filter((l) => !!l.cover?.url);
    if (base.length <= 3) return base.map((l, idx) => ({ l, hero: idx === 0 }));
    return base.map((l, idx) => ({ l, hero: idx === 0 || idx === 3 }));
  }, [listings]);

  return (
    <div className="relative min-h-screen bg-white text-[color:var(--ink)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

<<<<<<< HEAD
      {/* Atelier header (full width without vw hacks to avoid horizontal overflow) */}
=======
      {/* Header */}
>>>>>>> dev
      <section className="relative overflow-hidden">
        <div className="relative border-b border-[color:var(--hairline)] bg-[color:var(--paper-2)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1400px_520px_at_20%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1400px_520px_at_85%_10%,rgba(139,92,246,0.05),transparent_66%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
          </div>

          <div className={cx('relative py-12 sm:py-14', WIDE)}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[980px]">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>SEARCH ATELIER</Chip>
                  <Chip>€2M+ ONLY</Chip>
                  <Chip>VERIFIED LIVE INVENTORY</Chip>
                </div>

                <h1 className="mt-5 text-balance text-[34px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[44px] lg:text-[54px] lg:leading-[1.02]">
                  Search and browse the marketplace
                </h1>

                <p className="mt-4 max-w-[75ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
                  Designed like a catalogue, powered like a trading terminal. Use filters sparingly, then browse with
                  taste.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
                >
                  Markets
                </Link>

                <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-5 py-3 text-sm">
                  <span className="text-[color:var(--ink-2)]">Available</span>
                  <span className="font-semibold text-[color:var(--ink)]">{total ? total.toLocaleString() : 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Hairline />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <IconPill icon={<Sparkles className="h-4 w-4" />} label={mode} />
              {summaryBits.length ? summaryBits.map((b) => <TagPill key={b}>{b}</TagPill>) : null}
              {!summaryBits.length ? <TagPill>Try: “Marbella” + “sea view”</TagPill> : null}
            </div>

            {/* PROMINENT FILTER ATELIER (2nd Filters presence - obvious, primary) */}
            <div className="mt-8 border border-[color:var(--hairline)] bg-white shadow-[0_26px_80px_rgba(11,12,16,0.05)]">
              <div className="relative px-5 py-5 sm:px-6">
                <GoldHairline />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                      FILTER ATELIER
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                      Set your intent, refine with filters, then apply.
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(['buy', 'rent', 'sell'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={cx(
                          'px-4 py-2.5 text-[12px] font-semibold transition border',
                          mode === m
                            ? 'border-[rgba(10,10,12,0.22)] bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                            : 'border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]',
                        )}
                      >
                        {m}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setFiltersOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold border border-[rgba(10,10,12,0.18)] bg-[color:var(--paper-2)] text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.28)]"
                    >
                      <Filter className="h-4 w-4 text-[color:var(--ink-3)]" />
                      Filters
                      {needs.length || (type && normalize(type) !== 'any') || max || beds ? (
                        <span className="ml-1 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
                          active
                        </span>
                      ) : null}
                    </button>

                    <div className="flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2.5">
                      <SlidersHorizontal className="h-4 w-4 text-[color:var(--ink-3)]" />
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="bg-transparent text-[12px] font-semibold text-[color:var(--ink)] outline-none"
                        aria-label="Sort"
                      >
                        <option value="price_high">price: high to low</option>
                        <option value="price_low">price: low to high</option>
                        <option value="beds">beds: most first</option>
                        <option value="sqm">size: largest first</option>
                        <option value="newest">newest</option>
                      </select>
                    </div>

                    <PrimaryButton onClick={() => applyToUrl(1)} className="px-6 py-2.5">
                      Apply
                      <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                      title="Reset"
                      aria-label="Reset"
                    >
                      <X className="h-4 w-4 text-[color:var(--ink-3)]" />
                      Reset
                    </button>
                  </div>
                </div>

                {(needs.length || (type && normalize(type) !== 'any') || max || beds) ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                      ACTIVE
                    </span>
                    {type && normalize(type) !== 'any' ? <TagPill>type: {type}</TagPill> : null}
                    {typeof beds === 'number' && beds > 0 ? <TagPill>{beds}+ beds</TagPill> : null}
                    {typeof max === 'number' && Number.isFinite(max) ? <TagPill>under {shortMoney('EUR', max)}</TagPill> : null}
                    {needs.slice(0, 6).map((n) => (
                      <TagPill key={n}>{n}</TagPill>
                    ))}
                    {needs.length > 6 ? <TagPill>+{needs.length - 6} more</TagPill> : null}
                  </div>
                ) : null}
              </div>
            </div>
            {/* /PROMINENT FILTER ATELIER */}
          </div>
        </div>
      </section>

      {/* Sticky Search Dock (compact Filters still present) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur">
        <div className={cx('relative', scrolled && 'shadow-[0_18px_60px_rgba(11,12,16,0.06)]')}>
          <GoldHairline />
          <div className={cx('py-4', WIDE)}>
            <div className="grid gap-3 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Field
                  icon={<Search className="h-4 w-4" />}
                  value={q}
                  onChange={setQ}
                  placeholder="Describe what you want"
                  label="QUERY"
                />
              </div>

              <div className="lg:col-span-3">
                <Field
                  icon={<MapPin className="h-4 w-4" />}
                  value={place}
                  onChange={setPlace}
                  placeholder="City or region"
                  label="PLACE"
                />
              </div>

              <div className="lg:col-span-3">
                <Field
                  icon={<Sparkles className="h-4 w-4" />}
                  value={kw}
                  onChange={setKw}
                  placeholder="Optional"
                  label="KEYWORDS"
                />
              </div>

<<<<<<< HEAD
              {/* IMPORTANT: this was lg:col-span-2 (too narrow) which forced horizontal overflow on many desktops.
                  Make it span full row at lg so it wraps and never pushes outside page width. */}
=======
>>>>>>> dev
              <div className="lg:col-span-12 flex flex-wrap items-end justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  {(['buy', 'rent', 'sell'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cx(
                        'px-3 py-2 text-[12px] font-semibold transition border',
                        mode === m
                          ? 'border-[rgba(10,10,12,0.22)] bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                          : 'border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]',
                      )}
                    >
                      {m}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
                  >
                    <Filter className="h-4 w-4 text-[color:var(--ink-3)]" />
                    Filters
                  </button>

                  <div className="relative">
                    <button
                      ref={sortBtnRef}
                      type="button"
                      onClick={() => setSortOpen((v) => !v)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-[color:var(--ink-3)]" />
                      <span className="hidden sm:inline">{sortLabel}</span>
                      <ChevronDown
                        className={cx('h-4 w-4 text-[color:var(--ink-3)] transition', sortOpen && 'rotate-180')}
                      />
                    </button>

                    {sortOpen ? (
                      <div
                        ref={sortMenuRef}
                        className="absolute right-0 mt-2 w-64 overflow-hidden border border-[color:var(--hairline)] bg-white shadow-[0_30px_90px_rgba(11,12,16,0.10)]"
                      >
                        {[
                          { k: 'price_high', label: 'price: high to low' },
                          { k: 'price_low', label: 'price: low to high' },
                          { k: 'beds', label: 'beds: most first' },
                          { k: 'sqm', label: 'size: largest first' },
                          { k: 'newest', label: 'newest' },
                        ].map((x) => (
                          <button
                            key={x.k}
                            type="button"
                            onClick={() => {
                              setSort(x.k as SortKey);
                              setSortOpen(false);
                              applyToUrl(1);
                            }}
                            className={cx(
                              'w-full px-4 py-3 text-left text-[12px] transition',
                              sort === x.k
                                ? 'bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                                : 'bg-white text-[color:var(--ink-2)] hover:bg-[color:var(--paper-2)]',
                            )}
                          >
                            {x.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                  <PrimaryButton onClick={() => applyToUrl(1)} className="px-5 py-2.5">
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                    title="Reset"
                    aria-label="Reset"
                  >
                    <X className="h-4 w-4 text-[color:var(--ink-3)]" />
                  </button>
                </div>
              </div>
            </div>

            {needs.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">NEEDS</span>
                {needs.slice(0, 10).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleNeed(n)}
                    className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-2 text-[12px] text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                  >
                    <X className="h-4 w-4 text-[color:var(--ink-3)]" />
                    {n}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className={cx('py-10 sm:py-12', WIDE)}>
        {isCoverageNotLive ? (
          <AvailabilityPanel place={place} mode={mode} type={type} beds={beds} max={max} needs={needs} kw={kw} q={q} />
        ) : cards.length === 0 ? (
          <div className="border border-[color:var(--hairline)] bg-white p-10 shadow-[0_30px_90px_rgba(11,12,16,0.06)]">
            <div className="text-balance text-[22px] font-semibold tracking-[-0.03em] text-[color:var(--ink)]">
              No matches
            </div>
            <div className="mt-2 text-sm text-[color:var(--ink-2)]">Your filters returned no verified live listings.</div>
            <div className="mt-6 flex flex-wrap gap-3">
              <SecondaryButton
                onClick={() => {
                  setMax(undefined);
                  applyToUrl(1);
                }}
              >
                Remove max
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  setNeeds([]);
                  applyToUrl(1);
                }}
              >
                Clear needs
              </SecondaryButton>
              <PrimaryButton onClick={clearAll}>Reset</PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">RESULTS</div>
                <div className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[32px]">
                  {total.toLocaleString()} available
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <TagPill>{sortLabel}</TagPill>
                {place.trim() ? <TagPill>{titleCase(place.trim())}</TagPill> : null}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ l, hero }) => (
                <div key={l.id} className={cx(hero && 'md:col-span-2')}>
                  <ListingCardCatalogue l={l} hero={hero} />
                </div>
              ))}
            </div>
          </>
        )}

        {!isCoverageNotLive && pageCount > 1 ? (
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--ink-2)]">
              Page <span className="font-semibold text-[color:var(--ink)]">{page}</span> of{' '}
              <span className="font-semibold text-[color:var(--ink)]">{pageCount}</span> ·{' '}
              <span className="font-semibold text-[color:var(--ink)]">{total.toLocaleString()}</span> total
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => applyToUrl(Math.max(1, page - 1))}
                className={cx(
                  'px-5 py-3 text-sm font-semibold border transition',
                  page > 1
                    ? 'border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]'
                    : 'border-[color:var(--hairline)] bg-[color:var(--paper-2)] text-[color:var(--ink-3)] cursor-not-allowed',
                )}
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => applyToUrl(Math.min(pageCount, page + 1))}
                className={cx(
                  'px-5 py-3 text-sm font-semibold border transition',
                  page < pageCount
                    ? 'border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]'
                    : 'border-[color:var(--hairline)] bg-[color:var(--paper-2)] text-[color:var(--ink-3)] cursor-not-allowed',
                )}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Filters drawer */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[rgba(10,10,12,0.20)]" onClick={() => setFiltersOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-full max-w-[560px] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.18)]">
            <div className="relative border-b border-[color:var(--hairline)] px-6 py-5">
              <GoldHairline />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">FILTERS</div>
                  <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                    Refine the catalogue
                  </div>
                  <div className="mt-2 text-sm text-[color:var(--ink-2)]">Applies to verified live inventory.</div>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm font-semibold text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                >
                  <X className="h-4 w-4 text-[color:var(--ink-3)]" />
                  Close
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-92px)] overflow-auto p-6">
              <div className="grid gap-5">
                <div className="border border-[color:var(--hairline)] bg-white p-5">
                  <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                    PROPERTY TYPE
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {['any', 'villa', 'apartment', 'penthouse', 'house', 'plot'].map((t) => {
                      const active = normalize(type) === normalize(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={cx(
                            'px-4 py-3 text-left text-sm font-semibold border transition',
                            active
                              ? 'border-[rgba(10,10,12,0.22)] bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                              : 'border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]',
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-[color:var(--hairline)] bg-white p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                        MAX BUDGET
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                        {max ? shortMoney('EUR', max) : 'No max'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMax(undefined)}
                      className="px-4 py-3 text-sm font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                    >
                      Clear
                    </button>
                  </div>

                  <input
                    type="range"
                    min={250000}
                    max={25000000}
                    step={250000}
                    value={max ?? 25000000}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMax(v >= 25000000 ? undefined : v);
                    }}
                    className="mt-4 w-full"
                  />

                  <div className="mt-3 flex items-center justify-between text-[12px] text-[color:var(--ink-3)]">
                    <span>€250k</span>
                    <span>€25m+</span>
                  </div>
                </div>

                <div className="border border-[color:var(--hairline)] bg-white p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                        BEDROOMS
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                        {beds ? `${beds}+ beds` : 'Any'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBeds(undefined)}
                      className="px-4 py-3 text-sm font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[undefined, 1, 2, 3, 4, 5, 6].map((b) => {
                      const active = (beds ?? undefined) === (b as any);
                      return (
                        <button
                          key={String(b)}
                          type="button"
                          onClick={() => setBeds(b as any)}
                          className={cx(
                            'px-4 py-3 text-sm font-semibold border transition',
                            active
                              ? 'border-[rgba(10,10,12,0.22)] bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                              : 'border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]',
                          )}
                        >
                          {typeof b === 'number' ? `${b}+` : 'any'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-[color:var(--hairline)] bg-white p-5">
                  <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">NEEDS</div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { k: 'sea view', icon: <Waves className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                      { k: 'waterfront', icon: <Waves className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                      { k: 'gated', icon: <ShieldCheck className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                      { k: 'privacy', icon: <ShieldCheck className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                      { k: 'quiet', icon: <Sparkles className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                      { k: 'new build', icon: <Sparkles className="h-4 w-4 text-[color:var(--ink-3)]" /> },
                    ].map((n) => {
                      const active = activeNeeds.has(normalize(n.k)) || activeNeeds.has(normalize(n.k).replace(' ', '_'));
                      return (
                        <button
                          key={n.k}
                          type="button"
                          onClick={() => toggleNeed(n.k)}
                          className={cx(
                            'inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border transition',
                            active
                              ? 'border-[rgba(10,10,12,0.22)] bg-[color:var(--paper-2)] text-[color:var(--ink)]'
                              : 'border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]',
                          )}
                        >
                          {n.icon}
                          {n.k}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setNeeds([])}
                      className="px-4 py-3 text-sm font-semibold border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)] hover:border-[rgba(10,10,12,0.22)]"
                    >
                      Clear
                    </button>
                    <span className="text-sm text-[color:var(--ink-3)]">
                      {needs.length ? `${needs.length} selected` : 'None selected'}
                    </span>
                  </div>
                </div>

                <div className="border border-[color:var(--hairline)] bg-white p-5">
                  <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">APPLY</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <PrimaryButton
                      onClick={() => {
                        applyToUrl(1);
                        setFiltersOpen(false);
                      }}
                    >
                      Apply filters
                      <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>

                    <SecondaryButton onClick={clearAll}>Reset</SecondaryButton>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[12px] text-[color:var(--ink-3)]">
                Filters apply to verified live inventory on the server.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
