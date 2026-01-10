import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-black text-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/vantera-logo-light.png"
            alt="Vantera"
            width={120}
            height={120}
            priority
            className="opacity-95"
          />

          <div className="text-left">
            <div className="text-3xl font-semibold tracking-tight">Vantera</div>
            <div className="text-sm text-white/70">Global Property Intelligence</div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">
            Launching soon
          </div>
          <div className="mt-2 text-lg text-white/90">
            Intelligence for the world’s most valuable assets.
          </div>
        </div>

        <div className="mt-12 text-xs text-white/45">
          © {new Date().getFullYear()} Vantera
        </div>
      </div>
    </main>
  );
}
