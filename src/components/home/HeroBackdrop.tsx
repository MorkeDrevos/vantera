// src/components/home/HeroBackdrop.tsx
'use client';

import SafeImage from './SafeImage';

export default function HeroBackdrop({ src, alt }: { src: string; alt: string }) {
  const safeSrc = String(src || '').trim();

  const fallback = (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(245,158,11,0.22),transparent_48%),radial-gradient(circle_at_70%_0%,rgba(217,70,239,0.18),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.14),transparent_58%)]" />
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {safeSrc ? (
        <SafeImage
          src={safeSrc}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover opacity-[0.82] [filter:contrast(1.02)_saturate(1.02)]"
          priority
          fallback={fallback}
        />
      ) : (
        fallback
      )}

      {/* WHITE editorial veil (keeps readability without dark curtains) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.28)_28%,rgba(255,255,255,0.08)_55%,rgba(255,255,255,0.00)_78%)]" />

      {/* Bottom paper lift so text can sit cleanly */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,rgba(252,251,249,0.70)_55%,rgba(249,248,246,0.92)_100%)]" />

      {/* Subtle vignette for depth (still light) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_680px_at_50%_18%,rgba(0,0,0,0.00)_52%,rgba(11,12,16,0.06)_100%)]" />

      {/* Crown warmth (very subtle) */}
      <div className="absolute -top-36 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(231,201,130,0.16),transparent_70%)] blur-2xl" />
    </div>
  );
}
