// src/app/coming-soon/page.tsx
import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-black text-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10">
            <Image
              src="/brand/vantera-icon.png"
              alt="Vantera"
              width={44}
              height={44}
              className="opacity-95"
              priority
            />
          </div>

          <div className="text-left">
            <div className="text-3xl font-semibold tracking-tight">Vantera</div>
            <div className="text-sm text-white/70">Intelligence</div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">Coming soon</div>
          <div className="mt-2 text-lg text-white/90">
            Luxury real estate intelligence, rebuilt from zero.
          </div>
        </div>

        <div className="mt-12 text-xs text-white/45">© {new Date().getFullYear()} Vantera</div>
      </div>
    </main>
  );
}
