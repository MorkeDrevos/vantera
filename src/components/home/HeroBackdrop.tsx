// src/components/home/HeroBackdrop.tsx
'use client';

import SafeImage from './SafeImage';

export default function HeroBackdrop({ src, alt }: { src: string; alt: string }) {
  const safeSrc = String(src || '').trim();

  const fallback = (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(245,158,11,0.25),transparent_45%),radial-gradient(circle_at_70%_0%,rgba(217,70,239,0.22),transparent_50%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.18),transparent_55%)]" />
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {safeSrc ? (
        <SafeImage
          src={safeSrc}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover opacity-70"
          priority
          fallback={fallback}
        />
      ) : (
        fallback
      )}

      {/* darken for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.35),transparent_30%,transparent_70%,rgba(0,0,0,0.35))]" />
    </div>
  );
}
