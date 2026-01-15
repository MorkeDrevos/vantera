// src/components/home/HeroGoldCrown.tsx
'use client';

export default function HeroGoldCrown() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* subtle gold crown glow */}
      <div className="absolute -top-24 left-1/2 h-[420px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(231,201,130,0.16),transparent_70%)] blur-2xl" />

      {/* thin premium highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/20 to-transparent" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
    </div>
  );
}
