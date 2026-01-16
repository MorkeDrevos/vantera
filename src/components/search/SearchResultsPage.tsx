// src/components/search/SearchResultsPage.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Search, Sparkles, MapPin, ShieldCheck } from 'lucide-react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? (v[0] ?? '') : v;
}

function asNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function formatMoney(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}

function titleCase(s: string) {
  return s
    .split(/[\s-]+/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ');
}

function pill(text: string) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[11px]',
        'bg-white/75',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'text-[color:var(--ink-2)]',
      )}
    >
      {text}
    </span>
  );
}

export default function SearchResultsPage({ searchParams }: { searchParams: SP }) {
  const model = useMemo(() => {
    const q = first(searchParams.q).trim();
    const mode = (first(searchParams.mode).trim() || 'buy') as 'buy' | 'rent' | 'sell';

    const place = first(searchParams.place).trim();
    const kw = first(searchParams.kw).trim();

    const max = asNum(first(searchParams.max));
    const beds = asNum(first(searchParams.beds));
    const type = first(searchParams.type).trim(); // villa | apartment | penthouse | plot | house
    const needs = first(searchParams.needs)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    return { q, mode, place, kw, max, beds, type, needs };
  }, [searchParams]);

  const headline = model.place
    ? `Search: ${titleCase(model.place)}`
    : model.q
      ? `Search: ${model.q}`
      : 'Search';

  const subline = model.q
    ? 'Interpreted into a dossier-ready request. Results wiring comes next.'
    : 'Type a city and a wish list. We translate it into a clean search dossier.';

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-10 sm:px-8">
      {/* Header card */}
      <div
        className={cx(
          'relative overflow-hidden rounded-[32px] p-6 sm:p-8',
          'bg-[color:var(--surface-2)]',
          'ring-1 ring-inset ring-[color:var(--hairline)]',
          'shadow-[0_30px_110px_rgba(11,12,16,0.10)]',
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_20%_-10%,rgba(231,201,130,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_10%,rgba(139,92,246,0.07),transparent_62%)]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]',
                'bg-white/75',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'text-[color:var(--ink-2)]',
              )}
            >
              <Search className="h-4 w-4 opacity-70" />
              Search dossier
            </span>

            <span
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]',
                'bg-white/75',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'text-[color:var(--ink-2)]',
              )}
            >
              <Sparkles className="h-4 w-4 opacity-70" />
              Portal output
            </span>

            <span
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]',
                'bg-white/75',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'text-[color:var(--ink-2)]',
              )}
            >
              <ShieldCheck className="h-4 w-4 opacity-70" />
              Proof-first
            </span>
          </div>

          <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[40px]">
            {headline}
          </h1>

          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[color:var(--ink-2)]">
            {subline}
          </p>

          {/* Pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {pill(`mode: ${model.mode}`)}
            {model.place ? pill(`place: ${titleCase(model.place)}`) : pill('place: any market')}
            {model.max ? pill(`max: ${formatMoney(model.max)}`) : pill('max: none')}
            {model.beds ? pill(`beds: ${model.beds}+`) : pill('beds: any')}
            {model.type ? pill(`type: ${model.type}`) : null}
            {model.needs.length ? pill(`needs: ${model.needs[0].replace('_', ' ')}`) : null}
            {model.kw ? pill(`keywords: ${model.kw}`) : null}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] text-[color:var(--ink-3)]">
              Tip: use OmniSearch on the homepage to jump straight to city intelligence.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] transition',
                  'bg-white/80 hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)]',
                  'text-[color:var(--ink)]',
                )}
              >
                <MapPin className="h-4 w-4 opacity-70" />
                Back to markets
              </Link>

              {model.place ? (
                <Link
                  href="/"
                  className={cx(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] transition',
                    'bg-white/80 hover:bg-white',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'text-[color:var(--ink)]',
                  )}
                >
                  Open city from search <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder results - until listings wiring */}
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            className={cx(
              'relative overflow-hidden rounded-[28px] p-6',
              'bg-[color:var(--surface-2)]',
              'ring-1 ring-inset ring-[color:var(--hairline)]',
              'shadow-[0_22px_80px_rgba(11,12,16,0.08)]',
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_18%_-10%,rgba(231,201,130,0.12),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
            </div>

            <div className="relative">
              <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                RESULTS
              </div>
              <div className="mt-2 text-[15px] font-semibold text-[color:var(--ink)]">
                Listings wiring is next
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                This page is live and routes cleanly from OmniSearch. Next we connect it to verified inventory,
                keyword matching and ranking.
              </p>

              <div className="mt-4 grid gap-2">
                <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    WHAT YOU WILL SEE HERE
                  </div>
                  <div className="mt-2 text-[13px] text-[color:var(--ink-2)]">
                    Ranked homes, plus a plain-language dossier summary and proof flags.
                  </div>
                </div>

                <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    FIRST ITERATION
                  </div>
                  <div className="mt-2 text-[13px] text-[color:var(--ink-2)]">
                    City match + keyword match + price and beds filters, then show cards.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div
            className={cx(
              'relative overflow-hidden rounded-[28px] p-6',
              'bg-[color:var(--surface-2)]',
              'ring-1 ring-inset ring-[color:var(--hairline)]',
              'shadow-[0_22px_80px_rgba(11,12,16,0.08)]',
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_86%_-10%,rgba(139,92,246,0.10),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
            </div>

            <div className="relative">
              <div className="text-[10px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                DOSSIER OUTPUT
              </div>
              <div className="mt-2 text-[15px] font-semibold text-[color:var(--ink)]">
                The query becomes a decision brief
              </div>

              <div className="mt-3 grid gap-2">
                <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    INTERPRETATION
                  </div>
                  <div className="mt-2 text-[13px] text-[color:var(--ink-2)]">
                    {model.q ? model.q : 'Start typing in OmniSearch to generate a dossier.'}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)]">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    NEXT
                  </div>
                  <div className="mt-2 text-[13px] text-[color:var(--ink-2)]">
                    Hook this to the listings table and show results cards.
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className={cx(
                  'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[12px] transition',
                  'bg-white/85 hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)]',
                  'text-[color:var(--ink)]',
                )}
              >
                Continue in markets <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
