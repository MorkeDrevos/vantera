// src/components/home/RoyalPortalBackdrop.tsx
'use client';

export default function RoyalPortalBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* soft luxury haze */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_78%_18%,rgba(168,85,247,0.10),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(520px_220px_at_45%_75%,rgba(34,211,238,0.06),transparent_60%)]" />

      {/* subtle vignette for premium contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/65" />
    </div>
  );
}
