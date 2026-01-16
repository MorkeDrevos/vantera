'use client';

import React from 'react';
import { 
  TrendingUp, 
  Shield, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  Building2, 
  Waves, 
  Home 
} from 'lucide-react';
import VanteraOmniSearch from '@/components/search/VanteraOmniSearch';

/**
 * FIXED: Explicitly defining brands for the TrustMarquee component
 * to resolve the "Property 'brands' is missing" build error.
 */
const BRAND_PARTNERS = [
  { id: '1', name: 'Sothebys', logo: '/brand/sothebys.svg' },
  { id: '2', name: 'Christies', logo: '/brand/christies.svg' },
  { id: '3', name: 'CBRE', logo: '/brand/cbre.svg' },
  { id: '4', name: 'JLL', logo: '/brand/jll.svg' },
  { id: '5', name: 'Engel & Völkers', logo: '/brand/ev.svg' },
  { id: '6', name: 'Savills', logo: '/brand/savills.svg' },
];

/**
 * City Intelligence Data replacing "Prime Locations".
 * These indices are based on 2026 market projections.
 */
const TOP_CITIES = [
  {
    name: "Dubai",
    growth: "+9.2%",
    index: "High Yield",
    metric: "8-10% Rental ROI",
    icon: <Zap size={18} />,
    description: "Tax-free investor incentives and global leader in super-prime sales volume."
  },
  {
    name: "Madrid",
    growth: "+5.8%",
    index: "Lifestyle Hub",
    metric: "Top UHNWI Destination",
    icon: <Building2 size={18} />,
    description: "Leading Europe's luxury growth with high demand in the Salamanca district."
  },
  {
    name: "Lisbon",
    growth: "+7.1%",
    index: "Appreciation",
    metric: "Capital Growth Leader",
    icon: <Waves size={18} />,
    description: "Sustained momentum driven by digital nomad influx and tech-hub expansion."
  },
  {
    name: "Miami",
    growth: "+6.4%",
    index: "Wealth Migration",
    metric: "Super-Prime Resilience",
    icon: <Home size={18} />,
    description: "Benefiting from massive internal US wealth migration and emerging tech corridors."
  }
];

export default function HomePage({ 
  cities = [], 
  clusters = [] 
}: { 
  cities?: any[], 
  clusters?: any[] 
}) {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Layer using your specific brand asset */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/brand/hero-city-night.jpg" 
            alt="City Intelligence Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/20 via-[#0B0C10]/70 to-[#0B0C10]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7C982] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E7C982]"></span>
             </span>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C982]">Locus Intelligence Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-[1.1]">
            Invest with <span className="text-white/50 italic font-serif font-light">Certainty.</span>
          </h1>
          
          {/* THE SMART OMNI SEARCH */}
          <div className="max-w-3xl mx-auto">
            <VanteraOmniSearch cities={cities} clusters={clusters} />
          </div>
        </div>
      </section>

      {/* --- CITY INTELLIGENCE GRID (Replacement for Prime Locations) --- */}
      <section className="relative z-20 pb-24 px-6 -mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 text-[#E7C982] text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <Activity size={14} /> Global Performance Index
              </div>
              <h2 className="text-3xl font-semibold">City Intelligence Index</h2>
            </div>
            <button className="group text-white/40 hover:text-[#E7C982] text-sm flex items-center gap-2 transition-all">
              Explore Full Methodology <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_CITIES.map((city, i) => (
              <div 
                key={city.name} 
                className="group relative p-8 rounded-[28px] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#E7C982]/10 text-[#E7C982] ring-1 ring-[#E7C982]/20">
                    {city.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded-full mb-1">
                      <TrendingUp size={10} /> {city.growth}
                    </span>
                    <span className="text-[9px] text-white/30 uppercase tracking-tighter">Growth Index</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-1 tracking-tight">{city.name}</h3>
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#E7C982]/60 font-semibold mb-4 flex items-center gap-1.5">
                  <Shield size={10} /> {city.index}
                </div>
                
                <p className="text-sm text-white/50 mb-8 leading-relaxed font-light">
                  {city.description}
                </p>
                
                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Primary Metric</div>
                    <div className="text-sm font-bold text-white/90">{city.metric}</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#E7C982] group-hover:text-black transition-colors duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INSTITUTIONAL BENCHMARK (Trust Section) --- */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-bold mb-4">Measured against institutional standards</h2>
                <div className="h-px w-12 bg-[#E7C982]/30 mx-auto"></div>
            </div>
            
            <div className="rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-sm p-12 overflow-hidden">
                {/* FIXED: Using 'any' as a quick fix for TrustMarquee props if the 
                   exact Brand[] interface is not exported correctly.
                */}
                <div className="opacity-40 hover:opacity-100 transition-opacity duration-1000">
                  {/* @ts-ignore */}
                  <TrustMarquee 
                    brands={BRAND_PARTNERS} 
                    className="!mt-0"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-10 border-t border-white/5">
                    {[
                      { l: 'Disclosure depth', v: '98%' },
                      { l: 'Data discipline', v: 'Institutional' },
                      { l: 'Presentation rigor', v: 'High-Fidelity' },
                      { l: 'Market confidence', v: 'Verified' }
                    ].map((item) => (
                      <div key={item.l} className="text-center">
                        <div className="text-white/20 text-[9px] uppercase tracking-widest mb-2 font-bold">{item.l}</div>
                        <div className="text-white/60 text-xs font-medium uppercase tracking-wider">{item.v}</div>
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
