// src/components/home/RoyalPortalBackdrop.tsx

export default function RoyalPortalBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft gold crown glow - TOP ONLY */}
      <div
        className="
          absolute
          top-[-220px]
          left-1/2
          h-[420px]
          w-[820px]
          -translate-x-1/2
          rounded-full
          bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.18),transparent_70%)]
        "
      />

      {/* Ultra-subtle editorial lift (no blur) */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[180px]
          bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent)]
        "
      />

      {/* Precision divider line */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-black/10
          to-transparent
        "
      />
    </div>
  );
}
