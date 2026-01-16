// src/components/search/VanteraOmniSearch.tsx
'use client';

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
  Compass,
  Zap
} from 'lucide-react';

/* =========================================================
    TYPES & LOGIC (The "Brain")
   ========================================================= */

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

type ParseResult = {
  raw: string;
  tokens: string[];
  placeQuery?: string;
  budgetMax?: number;
  bedroomsMin?: number;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'plot' | 'house' | 'any';
  needs: string[];
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
  icon?: 'pin' | 'sparkles' | 'search' | 'recent' | 'zap';
  group?: 'Action' | 'Cities' | 'Regions' | 'Recent';
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* =========================================================
    UTILITIES
   ========================================================= */

const normalize = (s: string) => s.toLowerCase().trim();
const tokenize = (s: string) => normalize(s).replace(/[·,]/g, ' ').split(/\s+/).filter(Boolean);

function formatMoney(n?: number) {
  if (!n) return '';
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}

/* =========================================================
    COMPONENT
   ========================================================= */

export default function VanteraOmniSearch({
  cities,
  clusters,
  id = 'vantera-omni',
  placeholder = 'Try "Sea view villa in Marbella under 5m"',
  className,
  autoFocus = false,
}: {
  cities: OmniCity[];
  clusters: OmniRegionCluster[];
  id?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  // 1. Natural Language Parser
  const parse = useMemo<ParseResult>(() => {
    const tokens = tokenize(q);
    const raw = q.toLowerCase();

    // Budget extraction (supports 5m, 500k, 5,000,000)
    const budgetMatch = raw.match(/(?:under|max|below|<)\s*(\d+(?:\.\d+)?)\s*(m|k)?/);
    let budgetMax;
    if (budgetMatch) {
      const num = parseFloat(budgetMatch[1]);
      const unit = budgetMatch[2];
      budgetMax = unit === 'm' ? num * 1_000_000 : unit === 'k' ? num * 1_000 : num;
    }

    return {
      raw: q,
      tokens,
      mode: raw.includes('rent') ? 'rent' : raw.includes('sell') ? 'sell' : 'buy',
      propertyType: raw.includes('villa') ? 'villa' : raw.includes('apartment') ? 'apartment' : 'any',
      budgetMax,
      needs: ['sea_view', 'gated', 'modern'].filter(n => raw.includes(n.replace('_', ' '))),
      placeQuery: tokens[0], // Simplified for UI logic
    };
  }, [q]);

  // 2. Result Engine
  const hits = useMemo(() => {
    if (!q.trim()) return [];
    
    // Logic to filter cities and regions based on `parse.placeQuery`
    const cityHits = cities
      .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(c => ({
        kind: 'city' as const,
        slug: c.slug,
        title: c.name,
        subtitle: c.country,
        href: `/city/${c.slug}`,
        group: 'Cities' as const,
        icon: 'pin' as const,
        score: 100
      }));

    const actionHit: PlaceHit = {
      kind: 'search',
      slug: 'exec',
      title: `Search for ${q}`,
      subtitle: `Find ${parse.propertyType}s ${parse.budgetMax ? `under ${formatMoney(parse.budgetMax)}` : ''}`,
      href: `/search?q=${encodeURIComponent(q)}`,
      group: 'Action',
      icon: 'zap',
      score: 1000,
      reasons: ['Smart Search']
    };

    return [actionHit, ...cityHits];
  }, [q, cities, parse]);

  return (
    <div ref={rootRef} className={cx('relative w-full transition-all duration-500', className)}>
      {/* THE INPUT WRAPPER */}
      <div className={cx(
        'group relative flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all duration-300',
        'bg-white ring-1 ring-black/5 shadow-2xl shadow-black/5',
        open && 'ring-black/10 shadow-black/10'
      )}>
        <Search className={cx('h-5 w-5 transition-colors', q ? 'text-black' : 'text-gray-400')} />
        
        <div className="relative flex-1 flex flex-col">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-[17px] font-light text-black placeholder:text-gray-300"
              autoComplete="off"
            />
            
            {/* REAL-TIME INTERPRETATION TAGS */}
            {q && (
                <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/30">Intelligence:</span>
                    {parse.budgetMax && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">{formatMoney(parse.budgetMax)}</span>}
                    {parse.propertyType !== 'any' && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{parse.propertyType}</span>}
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{parse.mode}</span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-3">
            {q && (
                <button onClick={() => setQ('')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-4 w-4 text-gray-400" />
                </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                <Command className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400">K</span>
            </div>
        </div>
      </div>

      {/* INTELLIGENT DROPDOWN */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-[0_30px_100px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            
            {/* Zero State / Suggestions */}
            {!q && (
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Trending Intelligence</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Off-market villas in Saint-Tropez', icon: <Shield /> },
                            { label: 'New penthouses in Dubai Marina', icon: <Building2 /> },
                            { label: 'Waterfront properties under 10m', icon: <Waves /> },
                            { label: 'Quiet family homes in London', icon: <Home /> }
                        ].map((s, i) => (
                            <button 
                                key={i}
                                onClick={() => setQ(s.label)}
                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-left group"
                            >
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    {React.cloneElement(s.icon as React.ReactElement, { className: 'h-4 w-4 text-gray-400' })}
                                </div>
                                <div>
                                    <div className="text-[14px] font-medium text-black">{s.label}</div>
                                    <div className="text-[11px] text-gray-400">Smart Filter</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results */}
            {q && (
                <div className="p-2">
                    {hits.map((hit, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(hit.href)}
                            className={cx(
                                'w-full flex items-center justify-between p-4 rounded-2xl transition-all',
                                i === active ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cx(
                                    'h-11 w-11 flex items-center justify-center rounded-full',
                                    hit.kind === 'search' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                                )}>
                                    {hit.icon === 'zap' ? <Zap className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                </div>
                                <div className="text-left">
                                    <div className="text-[15px] font-semibold text-black">{hit.title}</div>
                                    <div className="text-[12px] text-gray-400">{hit.subtitle}</div>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px]">ESC</kbd> to close
                    </div>
                </div>
                <div className="text-[11px] font-serif italic text-gray-400">Powered by Vantera Locus Intelligence</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
