// src/components/search/VanteraOmniSearch.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Command, MapPin, Sparkles, X } from 'lucide-react';

type PlaceKind = 'city' | 'region';

export type OmniCity = {
  slug: string;
  name: string;
  country: string;
  region?: string | null;
  tz: string;
  priority?: number;
};

export type OmniRegionCluster = {
  slug: string;
  name: string;
  country?: string;
  region?: string;
  priority?: number;
  citySlugs: string[];
};

type NeedTag =
  | 'beach'
  | 'golf'
  | 'schools'
  | 'walkable'
  | 'privacy'
  | 'gated'
  | 'sea_view'
  | 'investment'
  | 'yield'
  | 'new_build'
  | 'quiet'
  | 'waterfront'
  | 'ultra_prime';

type ParseResult = {
  raw: string;
  tokens: string[];
  placeQuery?: string;
  budgetMax?: number;
  bedroomsMin?: number;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'plot' | 'house' | 'any';
  needs: NeedTag[];
  mode: 'buy' | 'rent' | 'sell';
};

type PlaceHit = {
  kind: PlaceKind;
  slug: string;
  title: string;
  subtitle: string;
  score: number;
  reasons: string[];
  href: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function fold(s: string) {
  // remove accents/diacritics: Benahavís -> benahavis
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

function parseBudgetMax(raw: string): number | undefined {
  const s = normalize(raw).replace(/€/g, '').replace(/\s+/g, ' ');

  const m = s.match(/(?:under|max|<|<=)\s*([0-9]+(?:\.[0-9]+)?)\s*(m|k)?/);
  if (m) {
    const n = Number(m[1]);
    const unit = m[2];
    if (!Number.isFinite(n)) return undefined;
    if (unit === 'm') return Math.round(n * 1_000_000);
    if (unit === 'k') return Math.round(n * 1_000);
    return Math.round(n);
  }

  const m2 = s.match(/([0-9]+(?:\.[0-9]+)?)\s*(m|k)\b/);
  if (m2) {
    const n = Number(m2[1]);
    const unit = m2[2];
    if (!Number.isFinite(n)) return undefined;
    return unit === 'm' ? Math.round(n * 1_000_000) : Math.round(n * 1_000);
  }

  return undefined;
}

function parseBedroomsMin(tokens: string[]) {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const m = t.match(/^([0-9]{1,2})(?:br|bed|beds)$/);
    if (m) return Number(m[1]);

    if (/^[0-9]{1,2}$/.test(t)) {
      const next = tokens[i + 1] ?? '';
      if (next === 'bed' || next === 'beds' || next === 'bedroom' || next === 'bedrooms' || next === 'br') {
        return Number(t);
      }
    }
  }
  return undefined;
}

function parsePropertyType(tokens: string[]): ParseResult['propertyType'] {
  const map: Array<[string, NonNullable<ParseResult['propertyType']>]> = [
    ['villa', 'villa'],
    ['villas', 'villa'],
    ['apartment', 'apartment'],
    ['apartments', 'apartment'],
    ['penthouse', 'penthouse'],
    ['plot', 'plot'],
    ['land', 'plot'],
    ['house', 'house'],
    ['home', 'house'],
  ];

  for (const [needle, type] of map) {
    if (tokens.includes(needle)) return type;
  }
  return 'any';
}

function detectMode(tokens: string[]): ParseResult['mode'] {
  if (tokens.includes('rent') || tokens.includes('rental') || tokens.includes('lease')) return 'rent';
  if (tokens.includes('sell') || tokens.includes('selling') || tokens.includes('list')) return 'sell';
  return 'buy';
}

function extractNeeds(tokens: string[]): NeedTag[] {
  const dict: Array<[NeedTag, string[]]> = [
    ['beach', ['beach', 'beachfront']],
    ['waterfront', ['waterfront', 'seafront']],
    ['sea_view', ['seaview', 'views', 'view']],
    ['golf', ['golf']],
    ['schools', ['schools', 'school', 'international', 'kids', 'family']],
    ['walkable', ['walkable', 'walk', 'walking']],
    ['privacy', ['privacy', 'private']],
    ['gated', ['gated', 'security', 'guarded']],
    ['investment', ['investment', 'invest']],
    ['yield', ['yield', 'roi', 'cashflow']],
    ['new_build', ['newbuild', 'new', 'development', 'offplan', 'off-plan']],
    ['quiet', ['quiet', 'calm', 'low-noise', 'lownoise']],
    ['ultra_prime', ['ultraprime', 'ultra-prime', 'trophy', 'prime']],
  ];

  const found: NeedTag[] = [];
  for (const [tag, words] of dict) {
    if (words.some((w) => tokens.includes(w))) found.push(tag);
  }
  return Array.from(new Set(found));
}

function formatMoney(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}K`;
  return `€${n}`;
}

function scoreTextMatch(q: string, text: string) {
  const qq = normalize(q);
  const tt = normalize(text);
  if (!qq) return 0;

  if (tt === qq) return 140;
  if (tt.startsWith(qq)) return 110;
  if (tt.includes(qq)) return 85;

  // token overlap
  const qTokens = new Set(tokenize(qq));
  const tTokens = new Set(tokenize(tt));
  let overlap = 0;
  qTokens.forEach((x) => {
    if (tTokens.has(x)) overlap++;
  });

  return overlap > 0 ? 50 + overlap * 12 : 0;
}

function placeStopwords() {
  // Anything after these is almost never part of the place
  return new Set([
    // budget
    'under',
    'max',
    'below',
    'less',
    'over',
    'min',
    'from',
    'to',
    '<',
    '<=',
    // mode
    'buy',
    'rent',
    'sell',
    'rental',
    'lease',
    // beds
    'bed',
    'beds',
    'bedroom',
    'bedrooms',
    'br',
    // property types
    'villa',
    'villas',
    'apartment',
    'apartments',
    'penthouse',
    'plot',
    'land',
    'house',
    'home',
    // common needs words
    'beach',
    'beachfront',
    'waterfront',
    'seafront',
    'seaview',
    'view',
    'views',
    'golf',
    'school',
    'schools',
    'international',
    'kids',
    'family',
    'walk',
    'walkable',
    'walking',
    'privacy',
    'private',
    'gated',
    'security',
    'guarded',
    'investment',
    'invest',
    'yield',
    'roi',
    'cashflow',
    'new',
    'newbuild',
    'development',
    'offplan',
    'off-plan',
    'quiet',
    'calm',
    'prime',
    'trophy',
    // connectors that often introduce filters
    'near',
    'by',
    'next',
    'close',
    'around',
    'in',
    'at',
    'with',
  ]);
}

function extractPlaceQuery(raw: string) {
  // Prefer explicit separators first: "Marbella - ..." or "Marbella | ..."
  const sepParts = raw
    .split(/-|—|\||,/)
    .map((x) => x.trim())
    .filter(Boolean);

  if (sepParts.length >= 2 && sepParts[0].length >= 2) return sepParts[0];

  // Otherwise: take the first 1..4 tokens until we hit a stopword/number
  const tokens = tokenize(raw);
  if (tokens.length === 0) return undefined;

  const stop = placeStopwords();

  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (/^[0-9]+(?:\.[0-9]+)?$/.test(t)) break;
    if (stop.has(t)) break;

    out.push(t);
    if (out.length >= 4) break;
  }

  const place = out.join(' ').trim();
  return place.length >= 2 ? place : undefined;
}

function buildInterpretation(parse: ParseResult) {
  const chips: Array<{ k: string; v: string }> = [];

  chips.push({ k: 'MODE', v: parse.mode.toUpperCase() });
  chips.push({ k: 'PLACE', v: parse.placeQuery ? parse.placeQuery : 'Any market' });
  chips.push({ k: 'BUDGET', v: formatMoney(parse.budgetMax) });
  chips.push({ k: 'BEDS', v: parse.bedroomsMin ? `${parse.bedroomsMin}+` : '—' });
  chips.push({ k: 'TYPE', v: (parse.propertyType ?? 'any').toUpperCase() });

  const needs = parse.needs.length > 0 ? parse.needs.map((x) => x.replace('_', ' ')).join(' · ') : '—';

  return { chips, needs };
}

function cityMatchText(c: OmniCity) {
  // Give the matcher more hooks: name + slug + country + region + a few cheap aliases
  const slugAlias = c.slug.replace(/-/g, ' ');
  const name = c.name;
  const base = `${name} ${slugAlias} ${c.country} ${c.region ?? ''}`.trim();
  return base;
}

function clusterMatchText(r: OmniRegionCluster) {
  const slugAlias = r.slug.replace(/-/g, ' ');
  const base = `${r.name} ${slugAlias} ${r.country ?? ''} ${r.region ?? ''}`.trim();
  return base;
}

function buildPlaceHits(args: {
  parse: ParseResult;
  cities: OmniCity[];
  clusters: OmniRegionCluster[];
  limit: number;
}): PlaceHit[] {
  const { parse, cities, clusters, limit } = args;

  const placeQ = parse.placeQuery?.trim();
  const rawQ = parse.raw.trim();

  // Place-first: if we have a place chunk, score that hard.
  // Raw query becomes a weak tie-breaker, not the primary.
  const primaryQ = placeQ && placeQ.length >= 2 ? placeQ : rawQ;
  const hasPlace = Boolean(placeQ && placeQ.length >= 2);

  const hits: PlaceHit[] = [];

  for (const c of cities) {
    const placeScore = scoreTextMatch(primaryQ, cityMatchText(c));
    if (placeScore <= 0) continue;

    // Priority boost (bounded)
    const pr = typeof c.priority === 'number' ? Math.min(40, Math.round((c.priority ?? 0) / 3)) : 0;

    // Tie-breaker: if user typed a long raw query, let a city that also matches raw edges win slightly
    const rawTie = hasPlace && rawQ ? Math.min(18, Math.round(scoreTextMatch(rawQ, cityMatchText(c)) / 10)) : 0;

    // If we have a place query, discourage weak fuzzy hits
    const placeConfidenceBoost = hasPlace ? 18 : 0;

    const score = placeScore + pr + rawTie + placeConfidenceBoost;

    const reasons: string[] = [];
    if (placeScore >= 110) reasons.push('Direct match');
    else if (placeScore >= 85) reasons.push('Strong match');
    else reasons.push('Relevant');

    if (pr > 0) reasons.push('Featured market');

    hits.push({
      kind: 'city',
      slug: c.slug,
      title: c.name,
      subtitle: `${c.country}${c.region ? ` · ${c.region}` : ''}`,
      score,
      reasons,
      href: `/city/${c.slug}`,
    });
  }

  for (const r of clusters) {
    const placeScore = scoreTextMatch(primaryQ, clusterMatchText(r));
    if (placeScore <= 0) continue;

    const pr = typeof r.priority === 'number' ? Math.min(35, Math.round((r.priority ?? 0) * 4)) : 0;
    const rawTie = hasPlace && rawQ ? Math.min(14, Math.round(scoreTextMatch(rawQ, clusterMatchText(r)) / 12)) : 0;
    const score = placeScore + pr + rawTie;

    const reasons: string[] = [];
    if (placeScore >= 110) reasons.push('Direct match');
    else if (placeScore >= 85) reasons.push('Strong match');
    else reasons.push('Relevant');

    reasons.push(`${r.citySlugs.length} cities`);

    hits.push({
      kind: 'region',
      slug: r.slug,
      title: r.name,
      subtitle: `${r.country ?? 'Region'}${r.region ? ` · ${r.region}` : ''}`,
      score,
      reasons,
      href: `/coming-soon?region=${encodeURIComponent(r.name)}`,
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

export default function VanteraOmniSearch({
  cities,
  clusters,
  id = 'vantera-omni',
  placeholder = 'Try: “Marbella - 3 bed villa - near beach - under 2.5m”',
  className,
  autoFocus = false,
  limit = 8,
}: {
  cities: OmniCity[];
  clusters: OmniRegionCluster[];
  id?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  limit?: number;
}) {
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const parse = useMemo<ParseResult>(() => {
    const raw = q.trim();
    const tokens = tokenize(raw);

    const mode = detectMode(tokens);
    const bedroomsMin = parseBedroomsMin(tokens);
    const budgetMax = parseBudgetMax(raw);
    const propertyType = parsePropertyType(tokens);
    const needs = extractNeeds(tokens);

    // new: stronger place extraction
    const placeQuery = extractPlaceQuery(raw);

    return {
      raw,
      tokens,
      mode,
      bedroomsMin,
      budgetMax,
      propertyType,
      needs,
      placeQuery,
    };
  }, [q]);

  const hits = useMemo(() => {
    if (!open) return [];

    if (!q.trim()) {
      const topCities = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 6);
      const topClusters = [...clusters].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 2);

      const curated: PlaceHit[] = [
        ...topCities.map((c, i) => ({
          kind: 'city' as const,
          slug: c.slug,
          title: c.name,
          subtitle: `${c.country}${c.region ? ` · ${c.region}` : ''}`,
          score: 100 - i,
          reasons: ['Featured market'],
          href: `/city/${c.slug}`,
        })),
        ...topClusters.map((r, i) => ({
          kind: 'region' as const,
          slug: r.slug,
          title: r.name,
          subtitle: `${r.country ?? 'Region'}${r.region ? ` · ${r.region}` : ''}`,
          score: 90 - i,
          reasons: [`${r.citySlugs.length} cities`],
          href: `/coming-soon?region=${encodeURIComponent(r.name)}`,
        })),
      ];

      return curated.slice(0, limit);
    }

    return buildPlaceHits({ parse, cities, clusters, limit });
  }, [open, q, parse, cities, clusters, limit]);

  const interpretation = useMemo(() => buildInterpretation(parse), [parse]);

  function focusAndOpen() {
    inputRef.current?.focus();
    setOpen(true);
  }

  // TopBar integration: focus search from anywhere
  useEffect(() => {
    const onFocus = () => focusAndOpen();
    window.addEventListener('vantera:focus-search', onFocus as any);
    window.addEventListener('locus:focus-search', onFocus as any);
    return () => {
      window.removeEventListener('vantera:focus-search', onFocus as any);
      window.removeEventListener('locus:focus-search', onFocus as any);
    };
  }, []);

  // Hotkeys: "/" focuses, Esc closes
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isTyping =
        t &&
        (t.tagName.toLowerCase() === 'input' ||
          t.tagName.toLowerCase() === 'textarea' ||
          (t as any).isContentEditable);

      if (!isTyping && e.key === '/') {
        e.preventDefault();
        focusAndOpen();
      }

      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (autoFocus) focusAndOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      const root = rootRef.current;
      if (root && root.contains(t)) return;
      setOpen(false);
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [open]);

  // Keyboard navigation inside panel
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((v) => Math.min(hits.length - 1, v + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((v) => Math.max(0, v - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const h = hits[active];
      if (!h) return;
      setOpen(false);
      router.push(h.href);
      return;
    }
  }

  // Keep active in range
  useEffect(() => {
    if (active >= hits.length) setActive(0);
  }, [hits.length, active]);

  function clear() {
    setQ('');
    setActive(0);
    focusAndOpen();
  }

  return (
    <div ref={rootRef} className={cx('relative w-full', className)}>
      {/* Input shell */}
      <div
        className={cx(
          'relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.02]',
          'shadow-[0_34px_120px_rgba(0,0,0,0.60)]',
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-4 sm:px-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
            <Sparkles className="h-4 w-4 text-zinc-100/90" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[10px] font-semibold tracking-[0.26em] text-zinc-400">VANTERA SEARCH</div>
            <input
              id={id}
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onInputKeyDown}
              placeholder={placeholder}
              className={cx('w-full bg-transparent text-[14px] text-zinc-100 outline-none', 'placeholder:text-zinc-500')}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-zinc-300">
              <Command className="h-3.5 w-3.5 opacity-80" />
              <span className="font-mono text-zinc-100">/</span>
            </div>

            {q ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-200 hover:bg-white/[0.07] transition"
              >
                <X className="h-3.5 w-3.5 opacity-80" />
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {/* Subline: what Vantera understood */}
        <div className="relative border-t border-white/10 bg-black/25 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            {interpretation.chips.map((c) => (
              <span
                key={c.k}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-200"
              >
                <span className="text-zinc-500 tracking-[0.18em]">{c.k}</span>
                <span className="text-zinc-100">{c.v}</span>
              </span>
            ))}

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-zinc-300">
              <span className="text-zinc-500 tracking-[0.18em]">NEEDS</span>
              <span className="text-zinc-100">{interpretation.needs}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div
        className={cx(
          'absolute left-0 right-0 z-50 mt-3',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          'transition-opacity duration-150',
        )}
      >
        <div
          className={cx(
            'relative overflow-hidden rounded-[24px] border border-white/12 bg-[#04050A]',
            'shadow-[0_90px_240px_rgba(0,0,0,0.92)]',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_50%_0%,rgba(230,201,128,0.14),transparent_60%)]" />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-200/80">RESULTS</div>
              <div className="mt-1 text-xs text-zinc-400">Places ranked by match. Press Enter to open.</div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-200 hover:bg-white/[0.07] transition"
            >
              <X className="h-4 w-4 opacity-80" />
              Close
            </button>
          </div>

          <div className="relative grid gap-2 p-3 sm:p-4">
            {hits.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-300">
                No matches. Try a city, region or a phrase like “under 3m villa near beach”.
              </div>
            ) : (
              hits.map((h, idx) => (
                <Link
                  key={`${h.kind}:${h.slug}`}
                  href={h.href}
                  prefetch
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => setOpen(false)}
                  className={cx(
                    'group relative rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3',
                    'hover:bg-white/[0.05] hover:border-white/14 transition',
                    idx === active && 'bg-white/[0.06] border-white/16',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                          {h.kind === 'city' ? (
                            <MapPin className="h-4 w-4 text-zinc-100/90" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-zinc-100/90" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-zinc-100">{h.title}</div>
                          <div className="truncate text-[11px] text-zinc-400">{h.subtitle}</div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {h.reasons.slice(0, 3).map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] text-zinc-200/90"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-zinc-200 group-hover:border-white/16 transition">
                      Open <ArrowRight className="h-4 w-4 opacity-75" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="relative border-t border-white/10 px-5 py-4 text-[11px] text-zinc-500">
            Tip: press <span className="font-mono text-zinc-200">/</span> anywhere to focus search.
          </div>
        </div>
      </div>
    </div>
  );
}
