// src/components/search/VanteraOmniSearch.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Command, MapPin, Search, Sparkles, X } from 'lucide-react';

type PlaceKind = 'city' | 'region' | 'search';

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

  // filters
  budgetMax?: number;
  bedroomsMin?: number;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'plot' | 'house' | 'any';
  needs: NeedTag[];
  mode: 'buy' | 'rent' | 'sell';

  // keyword-ish payload (everything except the detected place chunk)
  keywordQuery?: string;
};

type PlaceHit = {
  kind: PlaceKind;
  slug: string;
  title: string;
  subtitle: string;
  score: number;
  reasons: string[];
  href: string;
  icon?: 'pin' | 'sparkles' | 'search';
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

  const m = s.match(/(?:under|max|<|<=|below)\s*([0-9]+(?:\.[0-9]+)?)\s*(m|k)?/);
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
    ['sea_view', ['seaview', 'sea-view', 'views', 'view']],
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

/**
 * Very fast typo tolerance:
 * - exact/startsWith/includes still win
 * - fallback to edit-distance for "close enough"
 *
 * Note: this is intentionally lightweight for client-side usage.
 */
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
      dp[j] = Math.min(
        dp[j] + 1, // delete
        dp[j - 1] + 1, // insert
        prev + cost, // substitute
      );
      prev = tmp;
    }
  }
  return dp[n];
}

function fuzzyTokenScore(q: string, text: string) {
  const qq = normalize(q);
  const tt = normalize(text);
  if (!qq) return 0;

  // strong signals
  if (tt === qq) return 160;
  if (tt.startsWith(qq)) return 130;
  if (tt.includes(qq)) return 95;

  // token level fuzzy
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
      // tolerate small typos: 1-2 for short words, up to 3 for longer ones
      const tol = qt.length >= 9 ? 3 : qt.length >= 6 ? 2 : 1;
      if (d <= tol) {
        best = Math.max(best, 18 - d * 4);
      }
    }
    score += best;
  }

  // normalize: encourage multi-token matches
  if (score > 0) score += Math.min(24, qTokens.length * 6);
  return score;
}

function placeStopwords() {
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
    'sea-view',
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
  const sepParts = raw
    .split(/-|—|\||,/)
    .map((x) => x.trim())
    .filter(Boolean);

  if (sepParts.length >= 2 && sepParts[0].length >= 2) return sepParts[0];

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

function extractKeywordQuery(raw: string, placeQuery?: string) {
  const r = raw.trim();
  if (!r) return undefined;

  if (!placeQuery) return r;

  // Remove the first occurrence of placeQuery from the start-ish
  const a = normalize(r);
  const b = normalize(placeQuery);

  // common patterns: "Marbella - ..." | "Marbella ..." | "Marbella, ..."
  const cleaned = a
    .replace(new RegExp(`^${b}\\s*[-|,]?\\s*`), '')
    .trim();

  return cleaned.length >= 2 ? cleaned : undefined;
}

function buildInterpretationLine(parse: ParseResult) {
  const bits: string[] = [];

  if (parse.placeQuery) bits.push(parse.placeQuery);
  if (parse.propertyType && parse.propertyType !== 'any') bits.push(parse.propertyType);
  if (parse.bedroomsMin) bits.push(`${parse.bedroomsMin}+ beds`);
  if (parse.budgetMax) bits.push(`under ${formatMoney(parse.budgetMax)}`);
  if (parse.needs.length) bits.push(parse.needs.map((n) => n.replace('_', ' ')).join(', '));

  return bits.length ? bits.join(' · ') : 'Type anything: city, lifestyle, budget, keywords.';
}

function cityMatchText(c: OmniCity) {
  const slugAlias = c.slug.replace(/-/g, ' ');
  return `${c.name} ${slugAlias} ${c.country} ${c.region ?? ''}`.trim();
}

function clusterMatchText(r: OmniRegionCluster) {
  const slugAlias = r.slug.replace(/-/g, ' ');
  return `${r.name} ${slugAlias} ${r.country ?? ''} ${r.region ?? ''}`.trim();
}

function buildSearchHref(parse: ParseResult) {
  const params = new URLSearchParams();
  if (parse.raw) params.set('q', parse.raw);

  if (parse.mode && parse.mode !== 'buy') params.set('mode', parse.mode);
  if (parse.placeQuery) params.set('place', parse.placeQuery);
  if (parse.keywordQuery) params.set('kw', parse.keywordQuery);

  if (parse.budgetMax) params.set('max', String(parse.budgetMax));
  if (parse.bedroomsMin) params.set('beds', String(parse.bedroomsMin));
  if (parse.propertyType && parse.propertyType !== 'any') params.set('type', parse.propertyType);
  if (parse.needs.length) params.set('needs', parse.needs.join(','));

  // You can later implement /search page using these params.
  return `/search?${params.toString()}`;
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

  const primaryQ = placeQ && placeQ.length >= 2 ? placeQ : rawQ;
  const hasPlace = Boolean(placeQ && placeQ.length >= 2);

  const hits: PlaceHit[] = [];

  for (const c of cities) {
    const t = cityMatchText(c);
    const placeScore = fuzzyTokenScore(primaryQ, t);
    if (placeScore <= 0) continue;

    const pr = typeof c.priority === 'number' ? Math.min(42, Math.round((c.priority ?? 0) / 3)) : 0;
    const rawTie = hasPlace && rawQ ? Math.min(16, Math.round(fuzzyTokenScore(rawQ, t) / 12)) : 0;
    const score = placeScore + pr + rawTie + (hasPlace ? 14 : 0);

    const reasons: string[] = [];
    if (placeScore >= 130) reasons.push('Direct match');
    else if (placeScore >= 95) reasons.push('Strong match');
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
      icon: 'pin',
    });
  }

  for (const r of clusters) {
    const t = clusterMatchText(r);
    const placeScore = fuzzyTokenScore(primaryQ, t);
    if (placeScore <= 0) continue;

    const pr = typeof r.priority === 'number' ? Math.min(38, Math.round((r.priority ?? 0) * 4)) : 0;
    const rawTie = hasPlace && rawQ ? Math.min(14, Math.round(fuzzyTokenScore(rawQ, t) / 14)) : 0;
    const score = placeScore + pr + rawTie;

    const reasons: string[] = [];
    if (placeScore >= 130) reasons.push('Direct match');
    else if (placeScore >= 95) reasons.push('Strong match');
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
      icon: 'sparkles',
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

export default function VanteraOmniSearch({
  cities,
  clusters,
  id = 'vantera-omni',
  placeholder = 'Search cities, lifestyles, keywords (typos ok)',
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

    const placeQuery = extractPlaceQuery(raw);
    const keywordQuery = extractKeywordQuery(raw, placeQuery);

    return {
      raw,
      tokens,
      mode,
      bedroomsMin,
      budgetMax,
      propertyType,
      needs,
      placeQuery,
      keywordQuery,
    };
  }, [q]);

  const hits = useMemo(() => {
    if (!open) return [];

    // curated when empty
    if (!q.trim()) {
      const topCities = [...cities].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 6);
      const topClusters = [...clusters].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 2);

      const curated: PlaceHit[] = [
        {
          kind: 'search',
          slug: 'search',
          title: 'Search all listings',
          subtitle: 'Type anything - keywords, lifestyle, budget, typos',
          score: 999,
          reasons: ['Global search'],
          href: '/search',
          icon: 'search',
        },
        ...topCities.map((c, i) => ({
          kind: 'city' as const,
          slug: c.slug,
          title: c.name,
          subtitle: `${c.country}${c.region ? ` · ${c.region}` : ''}`,
          score: 200 - i,
          reasons: ['Featured market'],
          href: `/city/${c.slug}`,
          icon: 'pin' as const,
        })),
        ...topClusters.map((r, i) => ({
          kind: 'region' as const,
          slug: r.slug,
          title: r.name,
          subtitle: `${r.country ?? 'Region'}${r.region ? ` · ${r.region}` : ''}`,
          score: 150 - i,
          reasons: [`${r.citySlugs.length} cities`],
          href: `/coming-soon?region=${encodeURIComponent(r.name)}`,
          icon: 'sparkles' as const,
        })),
      ];

      return curated.slice(0, limit + 1);
    }

    const placeHits = buildPlaceHits({ parse, cities, clusters, limit });

    // Always provide a "Search everything" route for keyword search.
    const searchHit: PlaceHit = {
      kind: 'search',
      slug: 'search',
      title: 'Search all listings',
      subtitle: parse.keywordQuery ? `Keywords: “${parse.keywordQuery}”` : 'Keyword + semantic matching (coming live fast)',
      score: 1000,
      reasons: [
        parse.placeQuery ? `Place: ${parse.placeQuery}` : 'Any market',
        parse.budgetMax ? `Max ${formatMoney(parse.budgetMax)}` : 'No max',
        parse.bedroomsMin ? `${parse.bedroomsMin}+ beds` : 'Any beds',
      ],
      href: buildSearchHref(parse),
      icon: 'search',
    };

    // Put search first, then best places.
    return [searchHit, ...placeHits].slice(0, limit + 1);
  }, [open, q, parse, cities, clusters, limit]);

  const interpretationLine = useMemo(() => buildInterpretationLine(parse), [parse]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (e.key === 'Escape') setOpen(false);
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

  useEffect(() => {
    if (active >= hits.length) setActive(0);
  }, [hits.length, active]);

  function clear() {
    setQ('');
    setActive(0);
    focusAndOpen();
  }

  function iconFor(h: PlaceHit) {
    if (h.icon === 'search') return <Search className="h-4 w-4 text-zinc-100/85" />;
    if (h.icon === 'pin') return <MapPin className="h-4 w-4 text-zinc-100/85" />;
    return <Sparkles className="h-4 w-4 text-zinc-100/85" />;
  }

  return (
    <div ref={rootRef} className={cx('relative w-full', className)}>
      {/* Royal minimal input */}
      <div
        className={cx(
          'relative overflow-hidden rounded-full border border-white/10 bg-white/[0.02]',
          'shadow-[0_24px_90px_rgba(0,0,0,0.55)]',
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_84%_0%,rgba(231,201,130,0.10),transparent_55%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/22 to-transparent" />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/25">
            <Sparkles className="h-4 w-4 text-zinc-100/90" />
          </div>

          <div className="min-w-0 flex-1">
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
              className={cx(
                'w-full bg-transparent text-[14px] text-zinc-100 outline-none',
                'placeholder:text-zinc-500',
              )}
              autoComplete="off"
              spellCheck={false}
            />

            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="truncate">{interpretationLine}</span>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300">
              <Command className="h-3.5 w-3.5 opacity-80" />
              <span className="font-mono text-zinc-100">/</span>
            </div>

            {q ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-white/[0.07] transition"
              >
                <X className="h-3.5 w-3.5 opacity-80" />
                Clear
              </button>
            ) : null}
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
            'relative overflow-hidden rounded-3xl border border-white/12 bg-[#05060B]',
            'shadow-[0_80px_220px_rgba(0,0,0,0.92)]',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_50%_0%,rgba(230,201,128,0.14),transparent_60%)]" />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-200/80">SEARCH</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {parse.placeQuery ? <Pill>Place: {parse.placeQuery}</Pill> : <Pill>Any market</Pill>}
                {parse.budgetMax ? <Pill>Max {formatMoney(parse.budgetMax)}</Pill> : <Pill>No max</Pill>}
                {parse.bedroomsMin ? <Pill>{parse.bedroomsMin}+ beds</Pill> : <Pill>Any beds</Pill>}
                {parse.propertyType && parse.propertyType !== 'any' ? <Pill>Type: {parse.propertyType}</Pill> : null}
                {parse.needs.length ? <Pill>Needs: {parse.needs[0].replace('_', ' ')}</Pill> : null}
              </div>
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
                No matches yet. Try a city, region or keywords like “sea view modern villa”.
              </div>
            ) : (
              hits.map((h, idx) => (
                <Link
                  key={`${h.kind}:${h.slug}:${h.href}`}
                  href={h.href}
                  prefetch
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => setOpen(false)}
                  className={cx(
                    'group relative rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3',
                    'hover:bg-white/[0.05] hover:border-white/15 transition',
                    idx === active && 'bg-white/[0.06] border-white/18',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                          {iconFor(h)}
                        </span>

                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-semibold text-zinc-100">{h.title}</div>
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
            Tip: press <span className="font-mono text-zinc-200">/</span> anywhere to focus. Typos are fine.
          </div>
        </div>
      </div>
    </div>
  );
}
