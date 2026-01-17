// src/components/home/VanteraSignatureBackdrop.tsx
import React from 'react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Vantera Signature Backdrop
 * - No stock imagery
 * - "Truth Layer" grid + atlas contour lines
 * - Editorial paper + subtle royal gold energy
 * - Safe on white, readable under your hero content
 */
export default function VanteraSignatureBackdrop({ className }: { className?: string }) {
  return (
    <div className={cx('absolute inset-0', className)} aria-hidden="true">
      {/* Base paper */}
      <div className="absolute inset-0 bg-white" />

      {/* Editorial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_18%_8%,rgba(10,10,12,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_70%_18%,rgba(10,10,12,0.05),transparent_62%)]" />

      {/* Royal gold energy (must be visible but restrained) */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_10%,rgba(206,160,74,0.20),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(860px_420px_at_86%_22%,rgba(231,201,130,0.16),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_52%_0%,rgba(206,160,74,0.10),transparent_62%)]" />

      {/* Truth Layer micro grid (fine) */}
      <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.35)_1px,transparent_0)] [background-size:26px_26px]" />
      <div className="absolute inset-0 opacity-[0.020] [background-image:linear-gradient(to_right,rgba(10,10,12,0.26)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.26)_1px,transparent_1px)] [background-size:160px_160px]" />

      {/* Soft paper veil for readability */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.92),rgba(255,255,255,0.58),rgba(255,255,255,0.20))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22),rgba(255,255,255,0.08),rgba(255,255,255,0.92))]" />

      {/* Atlas contour lines (SVG) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.22]"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="vanteraContour" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(10,10,12,0.00)" />
            <stop offset="0.25" stopColor="rgba(10,10,12,0.14)" />
            <stop offset="0.6" stopColor="rgba(10,10,12,0.10)" />
            <stop offset="1" stopColor="rgba(10,10,12,0.00)" />
          </linearGradient>

          <linearGradient id="vanteraGoldTrace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(206,160,74,0.00)" />
            <stop offset="0.35" stopColor="rgba(206,160,74,0.16)" />
            <stop offset="0.75" stopColor="rgba(231,201,130,0.10)" />
            <stop offset="1" stopColor="rgba(231,201,130,0.00)" />
          </linearGradient>
        </defs>

        {/* Left atlas field */}
        <g transform="translate(-40,40)">
          <path
            d="M0,210 C140,140 280,260 420,190 C560,120 700,230 840,170"
            fill="none"
            stroke="url(#vanteraContour)"
            strokeWidth="1"
          />
          <path
            d="M0,260 C160,210 300,300 460,240 C620,180 760,260 900,210"
            fill="none"
            stroke="url(#vanteraContour)"
            strokeWidth="1"
          />
          <path
            d="M0,310 C150,290 320,330 470,300 C640,260 760,320 920,285"
            fill="none"
            stroke="url(#vanteraContour)"
            strokeWidth="1"
          />
          <path
            d="M0,360 C190,350 330,390 510,350 C690,310 800,380 980,340"
            fill="none"
            stroke="url(#vanteraContour)"
            strokeWidth="1"
          />
          <path
            d="M0,410 C190,410 360,450 540,410 C720,370 840,450 1020,410"
            fill="none"
            stroke="url(#vanteraContour)"
            strokeWidth="1"
          />
        </g>

        {/* Gold trace accent */}
        <path
          d="M120,120 C260,80 380,140 520,110 C700,70 820,150 1040,120"
          fill="none"
          stroke="url(#vanteraGoldTrace)"
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Subtle ring / locus */}
        <circle cx="860" cy="190" r="120" fill="none" stroke="rgba(10,10,12,0.10)" strokeWidth="1" />
        <circle cx="860" cy="190" r="170" fill="none" stroke="rgba(10,10,12,0.06)" strokeWidth="1" />
        <circle cx="860" cy="190" r="220" fill="none" stroke="rgba(206,160,74,0.07)" strokeWidth="1" />

        {/* Tiny “signal points” */}
        <g opacity="0.35">
          <circle cx="180" cy="160" r="2" fill="rgba(10,10,12,0.28)" />
          <circle cx="240" cy="210" r="1.6" fill="rgba(10,10,12,0.22)" />
          <circle cx="320" cy="140" r="1.8" fill="rgba(206,160,74,0.22)" />
          <circle cx="940" cy="140" r="2" fill="rgba(206,160,74,0.22)" />
          <circle cx="980" cy="240" r="1.6" fill="rgba(10,10,12,0.20)" />
          <circle cx="820" cy="280" r="1.8" fill="rgba(10,10,12,0.18)" />
        </g>
      </svg>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.96))]" />

      {/* Crisp editorial frame */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[rgba(15,23,42,0.10)]" />

      {/* Double crown line */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.95)] to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.60)] to-transparent" />
      </div>
    </div>
  );
}
