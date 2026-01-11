// src/components/trust/TrustMarquee.tsx
import Image from 'next/image';

type Brand = {
  name: string;
  domain: string;
  invert?: boolean;
};

const CLIENT_ID = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID || '';

function brandfetchLogoUrl(domain: string) {
  return `https://cdn.brandfetch.io/${domain}/${CLIENT_ID}?type=logo&format=svg`;
}

export default function TrustMarquee({
  brands,
  eyebrow = 'Trusted reference set',
  title = 'Benchmarked against leading global firms',
  subtitle = 'A credibility layer designed for clients who expect institutional standards and disciplined presentation.',
  note = 'Brand marks are shown for benchmarking and reference purposes. No affiliation or endorsement is implied.',
  className = '',
}: {
  brands: Brand[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  className?: string;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#070A10]">
        {/* ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(980px_260px_at_18%_0%,rgba(255,255,255,0.075),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_280px_at_85%_12%,rgba(120,76,255,0.14),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              <div className="text-[11px] font-semibold tracking-[0.34em] text-zinc-400">
                {eyebrow.toUpperCase()}
              </div>
            </div>

            <h2 className="mt-4 text-balance text-[22px] font-semibold tracking-[-0.01em] text-zinc-50 sm:text-[26px]">
              {title}
            </h2>

            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brands.map((b) => (
              <div
                key={b.domain}
                className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.018] px-4 shadow-[0_18px_60px_rgba(0,0,0,0.50)] transition hover:border-white/18 hover:bg-white/[0.03]"
              >
                {/* inner sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(520px_180px_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <Image
                  src={brandfetchLogoUrl(b.domain)}
                  alt={`${b.name} logo`}
                  width={260}
                  height={70}
                  unoptimized
                  className={`h-7 w-auto max-w-[150px] object-contain opacity-75 grayscale transition group-hover:opacity-100 group-hover:grayscale-0 ${
                    b.invert ?? true ? 'invert' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-7 max-w-3xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">{note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
