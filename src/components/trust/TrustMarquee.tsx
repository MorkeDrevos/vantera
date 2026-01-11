// src/components/trust/TrustMarquee.tsx
import Image from 'next/image';

type Brand = {
  name: string;
  domain: string;
  invert?: boolean;
};

const CLIENT_ID = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;

export default function TrustMarquee({
  brands,
  eyebrow = 'Trusted reference set',
  title = "Benchmarked against the world’s leading firms",
  subtitle = 'A quiet credibility layer for clients who expect institutional standards.',
  className = '',
}: {
  brands: Brand[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const cid = CLIENT_ID || '';

  return (
    <section className={`w-full ${className}`}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#070A10]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.12),transparent_60%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
          <div className="max-w-2xl">
            <div className="text-[11px] tracking-[0.32em] text-zinc-400">{eyebrow.toUpperCase()}</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-50 sm:text-xl">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{subtitle}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brands.map((b) => (
              <div
                key={b.domain}
                className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition hover:border-white/18 hover:bg-white/[0.035]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(420px_140px_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>

                <Image
  src={`https://cdn.brandfetch.io/${b.domain}?c=${encodeURIComponent(cid)}&type=logo&format=svg`}
  alt={`${b.name} logo`}
  width={220}
  height={60}
  unoptimized
  className={`h-8 w-auto object-contain opacity-85 transition group-hover:opacity-100 ${
    b.invert ?? true ? 'invert' : ''
  }`}
/>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-zinc-500">Firms listed for market benchmarking and reference only.</p>
        </div>
      </div>
    </section>
  );
}
