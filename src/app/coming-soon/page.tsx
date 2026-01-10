// src/app/coming-soon/page.tsx
import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-[100dvh] w-full bg-black text-white">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <Image
            src="/brand/vantera-logo-dark.png"
            alt="Vantera"
            width={180}
            height={180}
            priority
            className="opacity-95"
          />

          <div className="mt-4 text-xs uppercase tracking-[0.28em] text-white/60">
            Global Property Intelligence
          </div>
        </div>

        {/* Statement */}
        <div className="mt-14 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-6">
          <div className="text-lg font-medium text-white/90">
            Intelligence for the world’s most valuable assets.
          </div>

          <div className="mt-3 text-xs uppercase tracking-[0.22em] text-white/50">
            Launching soon
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-[11px] tracking-wide text-white/40">
          © {new Date().getFullYear()} Vantera
        </div>
      </div>
    </main>
  );
}
