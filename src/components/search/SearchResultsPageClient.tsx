// src/components/search/SearchResultsPageClient.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react';

import { CITIES, REGION_CLUSTERS } from '@/components/home/cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type SP = Record<string, string | string[] | undefined>;

function pick1(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

function n(v: string) {
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function fold(s: string) {
  // eslint-disable-next-line no-control-regex
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(s: string) {
  return fold(s).trim().toLowerCase();
}

function tokenize(input: string) {
  return normalize(input)
    .replace(/[·,]/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

function editDistance(a: string, b: string) {
  const aa = normalize(a);
  const bb = normalize(b);
  if (aa === bb) return 0;
  if (!aa || !bb) return Math.max(aa.length, bb.length);

  const m = aa.length;
  const n = bb.length;
  const dp = new Array(n + 1).fill(0).map((_, j) => j);

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[n];
}

function fuzzyTokenScore(q: string, text: string) {
  const qq = normalize(q);
  const tt = normalize(text);
  if (!qq) return 0;

  if (tt === qq) return 160;
  if (tt.startsWith(qq)) return 130;
  if (tt.includes(qq)) return 95;

  const qTokens = tokenize(qq);
  const tTokens = tokenize(tt);
  if (qTokens.length === 0 || tTokens.length === 0) return 0;

  let score = 0;

  for (const qt of qTokens) {
    let best = 0;
    for (const ttok of tTokens) {
      if (ttok === qt) {
        best = Math.max(best, 40);
        continue;
      }
      if (ttok.startsWith(qt) || qt.startsWith(ttok)) {
        best = Math.max(best, 26);
        continue;
      }
      const d = editDistance(qt, ttok);
      const tol = qt.length >= 9 ? 3 : qt.length >= 6 ? 2 : 1;
      if (d <= tol) best = Math.max(best, 18 - d * 4);
    }
    score += best;
  }

  if (score > 0) score += Math.min(24, qTokens.length * 6);
  return score;
}

function formatMoney(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}

function Chip({
  children,
  tone = 'paper',
}: {
  children: React.ReactNode;
  tone?: 'paper' | 'gold' | 'dark';
}) {
  const cls =
    tone === 'gold'
      ? 'bg-[linear-gradient(180deg,rgba(251,240,214,0.92),rgba(231,201,130,0.40))] ring-[rgba(183,134,58,0.26)] text-[color:var(--ink)]'
      : tone === 'dark'
        ? 'bg-[rgba(9,11,15,0.62)] ring-white/[0.12] text-white/80'
        : 'bg-white/92 ring-[color:var(--hairline)] text-[color:var(--ink-2)]';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] leading-none',
        'ring-1 ring-inset',
        cls,
      )}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[26px]',
        'bg-[color:var(--surface-1)] backdrop-blur-[14px]',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'shadow-[0_28px_90px_rgba(10,12,16,0.12)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_360px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(10,12,16,0.10)] to-transparent" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default function SearchResultsPageClient({
  searchParams,
}: {
  searchParams: SP;
}) {
  const q = pick1(searchParams.q);
  const place = pick1(searchParams.place);
  const kw = pick1(searchParams.kw);
  const mode = (pick1(searchParams.mode) as 'buy' | 'rent' | 'sell') || 'buy';
  const max = n(pick1(searchParams.max));
  const beds = n(pick1(searchParams.beds));
  const type = pick1(searchParams.type);
  const needs = pick1(searchParams.needs);

  const queryLabel = useMemo(() => {
    const raw = (q || '').trim();
    if (raw) return raw;
    const bits: string[] = [];
    if (place) bits.push(place);
    if (kw) bits.push(kw);
    return bits.join(' · ') || 'Search';
  }, [q, place, kw]);

  const matchedCities = useMemo(() => {
    const primary = (place || q || '').trim();
    if (!primary) return [];

    const list = CITIES.map((c) => {
      const t = `${c.name} ${c.slug.replace(/-/g, ' ')} ${c.country} ${c.region ?? ''}`.trim();
      const s = fuzzyTokenScore(primary, t) + (typeof c.priority === 'number' ? Math.min(24, c.priority / 2) : 0);
      return { c, s };
    })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.c);

    return list;
  }, [place, q]);

  const matchedRegions = useMemo(() => {
    const primary = (place || q || '').trim();
    if (!primary) return [];

    const list = REGION_CLUSTERS.map((r) => {
      const t = `${r.name} ${r.slug.replace(/-/g, ' ')} ${r.country ?? ''} ${r.region ?? ''}`.trim();
      const s = fuzzyTokenScore(primary, t) + (typeof r.priority === 'number' ? Math.min(18, r.priority * 3) : 0);
      return { r, s };
    })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.r);

    return list;
  }, [place, q]);

  const filters = useMemo(() => {
    const out: Array<{ k: string; v: string; tone?: 'paper' | 'gold' | 'dark' }> = [];
    out.push({ k: 'mode', v: mode, tone: 'gold' });
    if (place) out.push({ k: 'place', v: place });
    if (kw) out.push({ k: 'keywords', v: kw });
    if (type && type !== 'any') out.push({ k: 'type', v: type });
    if (beds) out.push({ k: 'beds', v: `${beds}+` });
    if (max) out.push({ k: 'max', v: formatMoney(max) });
    if (needs) out.push({ k: 'needs', v: needs.replace(/_/g, ' ') });
    return out;
  }, [mode, place, kw, type, beds, max, needs]);

  return (
    <div className="min-h-[100dvh]">
      <main className="mx-auto w-full max-w-[1480px] px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)] uppercase">
              Search results
            </div>
            <h1 className="mt-2 text-balance text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--ink)] sm:text-[34px]">
              {queryLabel}
            </h1>
            <p className="mt-2 max-w-[88ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
              City-first intelligence now. Listing inventory plugs in next (DB + ingestion). This page stays premium and useful meanwhile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="dark">
              <ShieldCheck className="h-4 w-4 opacity-80" />
              proof-first
            </Chip>
            <Chip tone="paper">
              <Search className="h-4 w-4 opacity-70" />
              typos ok
            </Chip>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.length ? (
            filters.map((f) => (
              <Chip key={`${f.k}:${f.v}`} tone={f.tone ?? 'paper'}>
                <span className="opacity-70">{f.k}</span>
                <span className="opacity-60">·</span>
                <span className="font-semibold">{f.v}</span>
              </Chip>
            ))
          ) : (
            <Chip>
              <Sparkles className="h-4 w-4 opacity-70" />
              Start with a city + wishline like “sea view villa under €5m”
            </Chip>
          )}
        </div>

        {/* Matched markets */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)] uppercase">
                  Matched cities
                </div>
                <div className="mt-2 text-[16px] font-semibold text-[color:var(--ink)]">
                  Open a market intelligence page
                </div>
                <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                  Fast path: go city-first while inventory wiring completes.
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 ring-1 ring-inset ring-[color:var(--hairline)]">
                <MapPin className="h-4 w-4 opacity-70" />
                <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">CITY FIRST</div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {matchedCities.length ? (
                matchedCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className={cx(
                      'group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition',
                      'bg-white/92 hover:bg-white',
                      'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(10,12,16,0.18)]',
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">
                        {c.name}
                      </div>
                      <div className="truncate text-[11px] text-[color:var(--ink-3)]">
                        {c.country}
                        {c.region ? ` · ${c.region}` : ''}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] transition group-hover:ring-[rgba(10,12,16,0.20)]">
                      open <ArrowRight className="h-4 w-4 opacity-70" />
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl bg-white/92 px-4 py-4 ring-1 ring-inset ring-[color:var(--hairline)] text-sm text-[color:var(--ink-2)]">
                  No city matches yet. Try “Monaco”, “Marbella”, “Dubai” or add a place token.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)] uppercase">
              Regions
            </div>
            <div className="mt-2 text-[16px] font-semibold text-[color:var(--ink)]">
              Clusters (preview)
            </div>
            <div className="mt-1 text-sm text-[color:var(--ink-2)]">
              Region pages can land on “Coming Soon” until you want them live.
            </div>

            <div className="mt-4 grid gap-2">
              {matchedRegions.length ? (
                matchedRegions.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/coming-soon?region=${encodeURIComponent(r.name)}`}
                    className={cx(
                      'group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition',
                      'bg-white/92 hover:bg-white',
                      'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(10,12,16,0.18)]',
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">
                        {r.name}
                      </div>
                      <div className="truncate text-[11px] text-[color:var(--ink-3)]">
                        {r.country ?? 'region'}
                        {r.region ? ` · ${r.region}` : ''} · {r.citySlugs.length} cities
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] transition group-hover:ring-[rgba(10,12,16,0.20)]">
                      open <ArrowRight className="h-4 w-4 opacity-70" />
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl bg-white/92 px-4 py-4 ring-1 ring-inset ring-[color:var(--hairline)] text-sm text-[color:var(--ink-2)]">
                  No region matches yet. Add a place token (e.g. “Costa del Sol”, “French Riviera”).
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[22px] bg-white/70 p-4 ring-1 ring-inset ring-[color:var(--hairline)]">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)] uppercase">
                Next wiring
              </div>
              <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                Plug your listings source into <span className="font-mono text-[12px] text-[color:var(--ink)]">/search</span>:
                results grid, sort, filters, and “verified only”.
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
