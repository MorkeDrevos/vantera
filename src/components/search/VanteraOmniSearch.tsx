// src/components/search/VanteraOmniSearch.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Command,
  MapPin,
  Search,
  Sparkles,
  X,
  Home,
  Building2,
  Waves,
  Shield,
  Clock,
} from 'lucide-react';

type PlaceKind = 'city' | 'region' | 'search' | 'recent';

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
  icon?: 'pin' | 'sparkles' | 'search' | 'recent';
  group?: 'Action' | 'Cities' | 'Regions' | 'Recent';
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
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
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
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
      const cost = aa[i - 1] === bb[i - 1] ? 0 : 1;
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

function placeStopwords() {
  return new Set([
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
    'buy',
    'rent',
    'sell',
    'rental',
    'lease',
    'bed',
    'beds',
    'bedroom',
    'bedrooms',
    'br',
    'villa',
    'villas',
    'apartment',
    'apartments',
    'penthouse',
    'plot',
    'land',
    'house',
    'home',
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

  const a = normalize(r);
  const b = normalize(placeQuery);

  const cleaned = a.replace(new RegExp(`^${b}\\s*[-|,]?\\s*`), '').trim();
  return cleaned.length >= 2 ? cleaned : undefined;
}

function buildInterpretationLine(parse: ParseResult) {
  const bits: string[] = [];

  if (parse.placeQuery) bits.push(parse.placeQuery);
  if (parse.propertyType && parse.propertyType !== 'any') bits.push(parse.propertyType);
  if (parse.bedroomsMin) bits.push(`${parse.bedroomsMin}+ beds`);
  if (parse.budgetMax) bits.push(`under ${formatMoney(parse.budgetMax)}`);
  if (parse.needs.length) bits.push(parse.needs.map((n) => n.replace('_', ' ')).join(', '));
  if (parse.keywordQuery && parse.keywordQuery.length >= 2) bits.push(`keywords: ${parse.keywordQuery}`);

  return bits.length ? bits.join(' · ') : 'city, lifestyle, budget, keywords. typos ok.';
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
    if (placeScore >= 130) reasons.push('direct match');
    else if (placeScore >= 95) reasons.push('strong match');
    else reasons.push('relevant');
    if (pr > 0) reasons.push('featured');

    hits.push({
      kind: 'city',
      slug: c.slug,
      title: c.name,
      subtitle: `${c.country}${c.region ? ` · ${c.region}` : ''}`,
      score,
      reasons,
      href: `/city/${c.slug}`,
      icon: 'pin',
      group: 'Cities',
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
    if (placeScore >= 130) reasons.push('direct match');
    else if (placeScore >= 95) reasons.push('strong match');
    else reasons.push('relevant');
    reasons.push(`${r.citySlugs.length} cities`);

    hits.push({
      kind: 'region',
      slug: r.slug,
      title: r.name,
      subtitle: `${r.country ?? 'region'}${r.region ? ` · ${r.region}` : ''}`,
      score,
      reasons,
      href: `/coming-soon?region=${encodeURIComponent(r.name)}`,
      icon: 'sparkles',
      group: 'Regions',
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

/* =========================================================
   UI helpers (royal white, no dark)
   NOTE: no rounded corners anywhere
   ========================================================= */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-2.5 py-1 text-[11px] leading-none',
        'bg-white',
        'ring-1 ring-inset ring-[color:var(--hairline)]',
        'text-[color:var(--ink-2)]',
      )}
    >
      {children}
    </span>
  );
}

function iconFor(h: PlaceHit) {
  const cls = 'h-4 w-4 text-[color:var(--ink-2)]';
  if (h.icon === 'search') return <Search className={cls} />;
  if (h.icon === 'pin') return <MapPin className={cls} />;
  if (h.icon === 'recent') return <Clock className={cls} />;
  return <Sparkles className={cls} />;
}

function modeLabel(m: ParseResult['mode']) {
  if (m === 'rent') return 'rent';
  if (m === 'sell') return 'sell';
  return 'buy';
}

function mergeQuery(current: string, patch: string) {
  const a = current.trim();
  const b = patch.trim();
  if (!a) return b;
  if (!b) return a;

  const aN = normalize(a);
  const bN = normalize(b);
  if (aN.includes(bN)) return a;

  return `${a} ${b}`.trim();
}

type QuickAction = {
  label: string;
  hint: string;
  patch: string;
  icon: React.ReactNode;
};

const RECENTS_KEY = 'vantera.omni.recents.v1';

function readRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => String(x)).filter(Boolean).slice(0, 6);
  } catch {
    return [];
  }
}

function writeRecents(next: string[]) {
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next.slice(0, 6)));
  } catch {
    // ignore
  }
}

function pushRecent(q: string) {
  const s = q.trim();
  if (!s) return;
  const existing = readRecents();
  const n = normalize(s);
  const next = [s, ...existing.filter((x) => normalize(x) !== n)];
  writeRecents(next);
}

const DEFAULT_CITY_SLUGS: string[] = [
  // Keep this aligned with the "Countries" strip / site navigation priorities
  'marbella',
  'miami',
  'new-york',
  'dubai',
  'london',
  'monaco',
];

function pickCuratedCities(cities: OmniCity[], limit = 6): OmniCity[] {
  const bySlug = new Map(cities.map((c) => [c.slug, c] as const));
  const picked: OmniCity[] = [];

  for (const slug of DEFAULT_CITY_SLUGS) {
    const c = bySlug.get(slug);
    if (c) picked.push(c);
    if (picked.length >= limit) return picked;
  }

  // fallback: highest priority
  const remaining = [...cities]
    .filter((c) => !picked.some((p) => p.slug === c.slug))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const c of remaining) {
    if (picked.length >= limit) break;
    picked.push(c);
  }

  return picked.slice(0, limit);
}

export default function VanteraOmniSearch({
  cities,
  clusters,
  id = 'vantera-omni',
  placeholder = 'search city, lifestyle, budget, keywords (typos ok)',
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
  const [recents, setRecents] = useState<string[]>([]);

  const listboxId = `${id}-listbox`;

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

  const interpretationLine = useMemo(() => buildInterpretationLine(parse), [parse]);

  const quick: QuickAction[] = useMemo(
    () => [
      { label: 'villa', hint: 'private, space, gardens', patch: 'villa', icon: <Home className="h-4 w-4" /> },
      { label: 'apartment', hint: 'lock up and go', patch: 'apartment', icon: <Building2 className="h-4 w-4" /> },
      { label: 'penthouse', hint: 'views, terraces, privacy', patch: 'penthouse', icon: <Building2 className="h-4 w-4" /> },
      { label: 'sea view', hint: 'primary view filter', patch: 'sea view', icon: <Waves className="h-4 w-4" /> },
      { label: 'waterfront', hint: 'on the water line', patch: 'waterfront', icon: <Waves className="h-4 w-4" /> },
      { label: 'gated', hint: 'controlled access', patch: 'gated', icon: <Shield className="h-4 w-4" /> },
      { label: 'privacy', hint: 'low exposure', patch: 'privacy', icon: <Shield className="h-4 w-4" /> },
      { label: 'new build', hint: 'modern stock', patch: 'new build', icon: <Sparkles className="h-4 w-4" /> },
      { label: 'golf', hint: 'near courses', patch: 'golf', icon: <Sparkles className="h-4 w-4" /> },
      { label: 'schools', hint: 'family safe', patch: 'schools', icon: <Sparkles className="h-4 w-4" /> },
    ],
    [],
  );

  function focusAndOpen() {
    inputRef.current?.focus();
    setOpen(true);
  }

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

  useEffect(() => {
    if (!open) return;

    setRecents(readRecents());

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

  const hits = useMemo(() => {
    if (!open) return [];

    const raw = q.trim();
    const searchHit: PlaceHit = {
      kind: 'search',
      slug: 'search',
      title: raw ? 'search properties' : 'start a property search',
      subtitle: raw ? `open results for “${raw}”` : 'type a city + wishline like “sea view villa under €5m”',
      score: 1000,
      reasons: [
        `${modeLabel(parse.mode)} mode`,
        parse.placeQuery ? `place: ${parse.placeQuery}` : 'any market',
        parse.budgetMax ? `max ${formatMoney(parse.budgetMax)}` : 'no max',
      ],
      href: raw ? buildSearchHref(parse) : '/search',
      icon: 'search',
      group: 'Action',
    };

    if (!raw) {
      const topCities = pickCuratedCities(cities, 6);
      const topClusters = [...clusters].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 2);

      const recentHits: PlaceHit[] = recents.map((rq, i) => ({
        kind: 'recent',
        slug: `recent-${i}`,
        title: rq,
        subtitle: 'recent search',
        score: 900 - i,
        reasons: ['continue'],
        href: `/search?q=${encodeURIComponent(rq)}`,
        icon: 'recent',
        group: 'Recent',
      }));

      const curated: PlaceHit[] = [
        searchHit,
        ...recentHits,
        ...topCities.map((c, i) => ({
          kind: 'city' as const,
          slug: c.slug,
          title: c.name,
          subtitle: `${c.country}${c.region ? ` · ${c.region}` : ''}`,
          score: 200 - i,
          reasons: ['featured'],
          href: `/city/${c.slug}`,
          icon: 'pin' as const,
          group: 'Cities' as const,
        })),
        ...topClusters.map((r, i) => ({
          kind: 'region' as const,
          slug: r.slug,
          title: r.name,
          subtitle: `${r.country ?? 'region'}${r.region ? ` · ${r.region}` : ''}`,
          score: 150 - i,
          reasons: [`${r.citySlugs.length} cities`],
          href: `/coming-soon?region=${encodeURIComponent(r.name)}`,
          icon: 'sparkles' as const,
          group: 'Regions' as const,
        })),
      ];

      return curated.slice(0, limit + 10);
    }

    const placeHits = buildPlaceHits({ parse, cities, clusters, limit });
    return [searchHit, ...placeHits].slice(0, limit + 1);
  }, [open, q, parse, cities, clusters, limit, recents]);

  const groupedHits = useMemo(() => {
    const order: Array<NonNullable<PlaceHit['group']>> = ['Action', 'Recent', 'Cities', 'Regions'];
    const buckets = new Map<string, PlaceHit[]>();
    for (const h of hits) {
      const g = h.group ?? 'Cities';
      if (!buckets.has(g)) buckets.set(g, []);
      buckets.get(g)!.push(h);
    }
    return order
      .filter((g) => (buckets.get(g)?.length ?? 0) > 0)
      .map((g) => ({ group: g, items: buckets.get(g)! }));
  }, [hits]);

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
      if (h.kind === 'search' || h.kind === 'recent') pushRecent(q.trim() || (h.kind === 'recent' ? h.title : ''));
      router.push(h.href);
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

  function applyQuick(patch: string) {
    setQ((cur) => mergeQuery(cur, patch));
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function setMode(next: ParseResult['mode']) {
    setQ((cur) => {
      const tokens = tokenize(cur);
      const filtered = tokens.filter(
        (t) =>
          t !== 'rent' &&
          t !== 'rental' &&
          t !== 'lease' &&
          t !== 'sell' &&
          t !== 'selling' &&
          t !== 'list',
      );
      if (next === 'rent') filtered.unshift('rent');
      if (next === 'sell') filtered.unshift('sell');
      return filtered.join(' ').trim();
    });
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  const activeId = hits[active] ? `${id}-opt-${active}` : undefined;

  return (
    <div ref={rootRef} className={cx('relative w-full', className)}>
      {/* input (pure white, royal hairlines) */}
      <div
        className={cx(
          'relative w-full overflow-hidden rounded-full',
          'bg-white',
          'ring-1 ring-inset ring-[color:var(--hairline)]',
          'shadow-[0_26px_80px_rgba(11,12,16,0.10)]',
        )}
      >
        {/* gold crown hairline, super subtle */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.60)] to-transparent opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_220px_at_18%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-[color:var(--hairline)]">
            <Sparkles className="h-4 w-4 text-[color:var(--ink-2)]" />
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
                'w-full bg-transparent outline-none',
                'text-[15px] text-[color:var(--ink)]',
                'placeholder:text-[color:rgba(11,12,16,0.38)]',
              )}
              autoComplete="off"
              spellCheck={false}
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-activedescendant={activeId}
            />

            {open ? (
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[color:var(--ink-3)]">
                <span className="truncate">{interpretationLine}</span>
              </div>
            ) : null}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-inset ring-[color:var(--hairline)] text-[11px] text-[color:var(--ink-3)]">
              <Command className="h-3.5 w-3.5 opacity-70" />
              <span className="font-mono text-[color:var(--ink-2)]">/</span>
            </div>

            {q ? (
              <button
                type="button"
                onClick={clear}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] transition',
                  'bg-white hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
                  'text-[color:var(--ink-2)]',
                )}
              >
                <X className="h-3.5 w-3.5 opacity-70" />
                clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* dropdown */}
      <div
        className={cx(
          'absolute left-0 right-0 z-50 mt-3',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          'transition-opacity duration-150',
        )}
      >
        <div
          className={cx(
            'relative overflow-hidden rounded-[24px]',
            'bg-[color:var(--paper)]',
            'ring-1 ring-inset ring-[color:var(--hairline)]',
            'shadow-[0_44px_160px_rgba(11,12,16,0.16)]',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_340px_at_50%_0%,rgba(231,201,130,0.12),transparent_60%)]" />

          {/* header */}
          <div className="relative border-b border-[color:var(--hairline)] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">search</div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Chip>{modeLabel(parse.mode)}</Chip>
                  {parse.placeQuery ? <Chip>place: {parse.placeQuery}</Chip> : <Chip>any market</Chip>}
                  {parse.budgetMax ? <Chip>max {formatMoney(parse.budgetMax)}</Chip> : <Chip>no max</Chip>}
                  {parse.bedroomsMin ? <Chip>{parse.bedroomsMin}+ beds</Chip> : <Chip>any beds</Chip>}
                  {parse.propertyType && parse.propertyType !== 'any' ? <Chip>type: {parse.propertyType}</Chip> : null}
                  {parse.needs.length ? <Chip>need: {parse.needs[0].replace('_', ' ')}</Chip> : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] transition',
                  'bg-white hover:bg-white',
                  'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
                  'text-[color:var(--ink-2)]',
                )}
              >
                <X className="h-4 w-4 opacity-70" />
                close
              </button>
            </div>

            {/* mode pills */}
            <div className="mt-3 inline-flex rounded-full bg-white/80 p-1 ring-1 ring-inset ring-[color:var(--hairline)]">
              {(['buy', 'rent', 'sell'] as const).map((m) => {
                const activeMode = parse.mode === m;
                const icon =
                  m === 'buy' ? (
                    <Sparkles className="h-4 w-4 opacity-75" />
                  ) : m === 'rent' ? (
                    <Home className="h-4 w-4 opacity-75" />
                  ) : (
                    <ArrowRight className="h-4 w-4 opacity-75" />
                  );

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] transition',
                      activeMode
                        ? 'bg-white ring-1 ring-inset ring-[color:var(--hairline-2)]'
                        : 'bg-transparent hover:bg-white',
                      'text-[color:var(--ink-2)]',
                    )}
                  >
                    {icon}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* body */}
          <div className="relative p-2.5 sm:p-3">
            {/* quick actions */}
            <div className="mb-2.5 rounded-[18px] bg-white/70 p-3 ring-1 ring-inset ring-[color:var(--hairline)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold tracking-[0.14em] text-[color:var(--ink-3)]">
                  quick filters
                </div>
                <button
                  type="button"
                  onClick={() => inputRef.current?.focus()}
                  className="text-[11px] text-[color:var(--ink-3)] hover:text-[color:var(--ink-2)]"
                >
                  keep typing
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {quick.map((x) => (
                  <button
                    key={x.label}
                    type="button"
                    onClick={() => applyQuick(x.patch)}
                    className={cx(
                      'group flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left transition',
                      'bg-white hover:bg-white',
                      'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[color:var(--hairline-2)]',
                    )}
                    title={x.hint}
                  >
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[color:var(--ink-2)]">
                      <span className="opacity-70">{x.icon}</span>
                      {x.label}
                    </span>
                    <span className="text-[11px] text-[color:var(--ink-3)] opacity-0 transition group-hover:opacity-100">
                      add
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div id={listboxId} role="listbox" className="max-h-[420px] overflow-auto p-0.5">
              {hits.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-inset ring-[color:var(--hairline)] text-sm text-[color:var(--ink-2)]">
                  no matches yet. try a city, region or keywords like “sea view modern villa”.
                </div>
              ) : (
                <div className="grid gap-2">
                  {groupedHits.map(({ group, items }) => (
                    <div
                      key={group}
                      className="rounded-2xl bg-white/60 p-2 ring-1 ring-inset ring-[color:var(--hairline)]"
                    >
                      <div className="px-2 pb-2 pt-1 text-[10px] font-semibold tracking-[0.20em] text-[color:var(--ink-3)]">
                        {group}
                      </div>

                      <div className="grid gap-1.5">
                        {items.map((h) => {
                          const idx = hits.findIndex((x) => x === h);
                          const selected = idx === active;
                          const optId = `${id}-opt-${idx}`;

                          return (
                            <Link
                              key={`${h.kind}:${h.slug}:${h.href}`}
                              href={h.href}
                              prefetch
                              id={optId}
                              role="option"
                              aria-selected={selected}
                              onMouseEnter={() => setActive(idx)}
                              onMouseDown={() => {
                                setOpen(true);
                              }}
                              onClick={() => {
                                if (h.kind === 'search') pushRecent(q.trim());
                                if (h.kind === 'recent') pushRecent(h.title);
                                setOpen(false);
                              }}
                              className={cx(
                                'group relative rounded-2xl px-4 py-3 transition',
                                'bg-white hover:bg-white',
                                'ring-1 ring-inset ring-[color:var(--hairline)]',
                                selected &&
                                  'ring-[color:var(--hairline-2)] shadow-[0_18px_60px_rgba(11,12,16,0.08)]',
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-3">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white ring-1 ring-inset ring-[color:var(--hairline)]">
                                      {iconFor(h)}
                                    </span>

                                    <div className="min-w-0">
                                      <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">
                                        {h.title}
                                      </div>
                                      <div className="truncate text-[11px] text-[color:var(--ink-3)]">{h.subtitle}</div>
                                    </div>
                                  </div>

                                  {h.reasons.length ? (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {h.reasons.slice(0, 3).map((r) => (
                                        <span
                                          key={r}
                                          className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]"
                                        >
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>

                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] group-hover:ring-[color:var(--hairline-2)] transition">
                                  open <ArrowRight className="h-4 w-4 opacity-70" />
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative border-t border-[color:var(--hairline)] px-5 py-4 text-[11px] text-[color:var(--ink-3)]">
            tip: press <span className="font-mono text-[color:var(--ink-2)]">/</span> anywhere to focus. typos are fine.
          </div>
        </div>
      </div>
    </div>
  );
}
