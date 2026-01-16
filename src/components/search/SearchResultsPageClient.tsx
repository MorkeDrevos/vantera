// src/components/search/SearchResultsPageClient.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? (v[0] ?? '') : v;
}

function parseIntSafe(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function formatMoney(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] leading-none',
        'bg-white/90',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'text-[color:var(--ink-2)]',
      )}
    >
      {children}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[22px] p-5',
        'bg-[color:var(--surface-2)] backdrop-blur-[12px]',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'shadow-[0_26px_90px_rgba(11,12,16,0.10)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(820px_260px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default function SearchResultsPageClient({ searchParams }: { searchParams: SP }) {
  const model = useMemo(() => {
    const q = first(searchParams.q).trim();
    const mode = (first(searchParams.mode).trim() || 'buy') as 'buy' | 'rent' | 'sell';

    const place = first(searchParams.place).trim();
    const kw = first(searchParams.kw).trim();

    const max = parseIntSafe(first(searchParams.max));
    const beds = parseIntSafe(first(searchParams.beds));

    const typeRaw = first(searchParams.type).trim();
    const type =
      typeRaw === 'villa' ||
      typeRaw === 'apartment' ||
      typeRaw === 'penthouse' ||
      typeRaw === 'plot' ||
      typeRaw === 'house'
        ? typeRaw
        : '';

    const needsRaw = first(searchParams.needs).trim();
    const needs = needsRaw
      ? needsRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6)
      : [];

    return { q, mode, place, kw, max, beds, type, needs };
  }, [searchParams]);

  const hasFilters =
    Boolean(model.q) ||
    Boolean(model.place) ||
    Boolean(model.kw) ||
    Boolean(model.max) ||
    Boolean(model.beds) ||
    Boolean(model.type) ||
    model.needs.length > 0 ||
    model.mode !== 'buy';

  const titleLine = model.q
    ? model.q
    : model.place || model.kw
      ? [model.place, model.kw].filter(Boolean).join(' · ')
      : 'Search';

  const subtitleBits: string[] = [];
  subtitleBits.push(model.mode);
  if (model.place) subtitleBits.push(model.place);
  if (model.type) subtitleBits.push(model.type);
  if (model.beds) subtitleBits.push(`${model.beds}+ beds`);
  if (model.max) subtitleBits.push(`under ${formatMoney(model.max)}`);
  if (model.needs.length) subtitleBits.push(model.needs.map((n) => n.replace('_', ' ')).join(', '));
  if (model.kw && model.kw !== model.q) subtitleBits.push(`keywords: ${model.kw}`);

  const subtitle = subtitleBits.length ? subtitleBits.join(' · ') : 'city, lifestyle, budget, keywords. typos ok.';

  // NOTE:
  // This page is “production-grade UI” but intentionally shows a high-end empty state
  // until real inventory is wired (DB / API). That’s the correct behaviour vs fake listings.

  const clearHref = '/search';

  return (
    <div className="mx-auto w-full max-w-[1480px] px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)] uppercase">
            Results
          </div>
          <h1 className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">
            {titleLine}
          </h1>
          <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{subtitle}</div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip>
              <Search className="mr-2 h-3.5 w-3.5 opacity-70" />
              query: {model.q ? `“${model.q}”` : '—'}
            </Chip>

            {model.place ? (
              <Chip>
                <MapPin className="mr-2 h-3.5 w-3.5 opacity-70" />
                place: {model.place}
              </Chip>
            ) : null}

            {model.max ? <Chip>max {formatMoney(model.max)}</Chip> : null}
            {model.beds ? <Chip>{model.beds}+ beds</Chip> : null}
            {model.type ? <Chip>type: {model.type}</Chip> : null}
            {model.needs.map((n) => (
              <Chip key={n}>need: {n.replace('_', ' ')}</Chip>
            ))}

            <Chip>
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5 opacity-70" />
              mode: {model.mode}
            </Chip>

            {hasFilters ? (
              <Link
                href={clearHref}
                className={cx(
                  'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] transition',
                  'bg-white/90 hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)]',
                  'text-[color:var(--ink-2)]',
                )}
              >
                <X className="mr-2 h-3.5 w-3.5 opacity-70" />
                clear
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cx(
              'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[12px] font-semibold transition',
              'bg-white hover:bg-white',
              'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.18)]',
              'text-[color:var(--ink)]',
              'shadow-[0_18px_50px_rgba(11,12,16,0.10)]',
            )}
          >
            Back to index
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)] uppercase">
                  Inventory
                </div>
                <div className="mt-2 text-[15px] font-semibold text-[color:var(--ink)]">
                  Real listings will appear here
                </div>
                <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  This page is wired for your OmniSearch params. Next step is connecting verified inventory and returning
                  ranked results (value, liquidity, integrity).
                </div>
              </div>

              <span
                className={cx(
                  'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[11px]',
                  'bg-white/90',
                  'ring-1 ring-inset ring-[color:var(--hairline)]',
                  'text-[color:var(--ink-2)]',
                )}
              >
                status <span className="text-[color:var(--ink-3)]">·</span> pending data
              </span>
            </div>

            <div className="mt-5 grid gap-2">
              {[
                { k: 'Ranking', v: 'Sort by signal, not by ad spend.' },
                { k: 'Proof', v: 'Each claim links to a traceable trail.' },
                { k: 'Output', v: 'A dossier you can act on before you fly in.' },
              ].map((x) => (
                <div
                  key={x.k}
                  className={cx(
                    'rounded-2xl px-4 py-3',
                    'bg-white/88',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                  )}
                >
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    {x.k.toUpperCase()}
                  </div>
                  <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--ink-2)]">{x.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card>
            <div className="text-[12px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)] uppercase">
              Next wiring
            </div>

            <div className="mt-2 text-[14px] font-semibold text-[color:var(--ink)]">Connect inventory source</div>
            <div className="mt-1 text-sm leading-relaxed text-[color:var(--ink-2)]">
              When you’re ready, this page will call your listings API and render premium cards (JamesEdition vibe, but
              cleaner).
            </div>

            <div className="mt-4 grid gap-2">
              {[
                'Add /api/search that returns listings + scoring',
                'Render ListingCard grid (same typography system)',
                'Filters panel (beds, max, type, needs) + URL sync',
              ].map((t) => (
                <div
                  key={t}
                  className={cx(
                    'rounded-2xl px-4 py-3 text-[13px]',
                    'bg-white/88',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'text-[color:var(--ink-2)]',
                  )}
                >
                  {t}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/"
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition',
                  'bg-white hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.18)]',
                  'text-[color:var(--ink)]',
                )}
              >
                Explore cities <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
