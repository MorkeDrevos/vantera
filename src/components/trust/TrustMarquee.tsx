// src/components/trust/TrustMarquee.tsx
import Image from 'next/image';

type Brand = {
  name: string;
  domain: string;
  invert?: boolean;
  group?: string; // optional: "Brokerage", "Advisory", "Investment", etc
};

const CLIENT_ID = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID || '';

function brandfetchLogoUrl(domain: string) {
  return `https://cdn.brandfetch.io/${domain}/${CLIENT_ID}?type=logo&format=svg`;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function splitIntoRows<T>(items: T[], rows: number) {
  const out: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((it, i) => out[i % rows].push(it));
  return out;
}

export default function TrustMarquee({
  brands,
  eyebrow = 'Institutional benchmark',
  title = 'Measured against institutional real-estate standards',
  subtitle = 'Vantera is evaluated against the operating, disclosure and presentation standards used by the world’s most established real-estate institutions.',
  note = 'Brand marks are used solely to illustrate reference standards. No affiliation or endorsement is implied.',
  className = '',
}: {
  brands: Brand[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  className?: string;
}) {
  const hasGroups = brands.some((b) => (b.group ?? '').trim().length > 0);

  const grouped = hasGroups
    ? brands.reduce<Record<string, Brand[]>>((acc, b) => {
        const k = (b.group ?? 'Reference').trim() || 'Reference';
        acc[k] = acc[k] || [];
        acc[k].push(b);
        return acc;
      }, {})
    : null;

  // If not grouped, build a "wow" logo field: 3 gentle rows with staggered spacing.
  const rows = splitIntoRows(brands, 3);

  return (
    <section className={cx('w-full', className)}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#06070B]">
        {/* premium ambient */}
        <div className="pointer-events-none absolute inset-0">
          {/* museum-light sweep */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.10),transparent_72%)] blur-2xl" />
          {/* violet discipline */}
          <div className="absolute -top-28 right-[-220px] h-[520px] w-[740px] rounded-full bg-[radial-gradient(closest-side,rgba(120,76,255,0.18),transparent_70%)] blur-2xl" />
          {/* deep vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_0%,transparent_40%,rgba(0,0,0,0.55)_86%)]" />
          {/* hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* narrative column */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="text-[11px] font-semibold tracking-[0.34em] text-zinc-400">
                  {eyebrow.toUpperCase()}
                </div>
              </div>

              <h2 className="mt-4 text-balance text-[26px] font-semibold tracking-[-0.02em] text-zinc-50 sm:text-[32px]">
                {title}
              </h2>

              <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-zinc-300">
                {subtitle}
              </p>

              {/* credibility bullets (quiet, not salesy) */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/35" />
                  <p className="text-sm leading-relaxed text-zinc-300">
                    Comparable disclosure depth across pricing signals, provenance and data confidence
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/35" />
                  <p className="text-sm leading-relaxed text-zinc-300">
                    Comparable presentation rigor for clients who expect institutional clarity
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/35" />
                  <p className="text-sm leading-relaxed text-zinc-300">
                    A reference framework that keeps Vantera disciplined as coverage expands
                  </p>
                </div>
              </div>

              <div className="mt-8 max-w-md">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">{note}</p>
              </div>
            </div>

            {/* logo field */}
            <div className="lg:col-span-7">
              {grouped ? (
                <div className="space-y-8">
                  {Object.entries(grouped).map(([groupName, groupBrands]) => (
                    <div key={groupName} className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
                          {groupName.toUpperCase()}
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                        {groupBrands.map((b) => (
                          <div
                            key={`${groupName}:${b.domain}`}
                            className="group flex items-center justify-center"
                            aria-label={b.name}
                          >
                            <Image
                              src={brandfetchLogoUrl(b.domain)}
                              alt={`${b.name} logo`}
                              width={260}
                              height={70}
                              unoptimized
                              className={cx(
                                'h-6 w-auto max-w-[160px] object-contain opacity-55 grayscale transition',
                                'group-hover:opacity-100 group-hover:grayscale-0',
                                (b.invert ?? true) && 'invert'
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  {/* subtle inner light */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_30%_0%,rgba(255,255,255,0.09),transparent_65%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* staggered rows = "wow" without being loud */}
                  <div className="relative space-y-6">
                    {rows.map((row, i) => (
                      <div
                        key={i}
                        className={cx(
                          'flex flex-wrap items-center justify-center gap-x-10 gap-y-6',
                          i === 0 && 'sm:justify-start',
                          i === 1 && 'sm:justify-center',
                          i === 2 && 'sm:justify-end'
                        )}
                      >
                        {row.map((b) => (
                          <div key={b.domain} className="group flex items-center justify-center">
                            <Image
                              src={brandfetchLogoUrl(b.domain)}
                              alt={`${b.name} logo`}
                              width={260}
                              height={70}
                              unoptimized
                              className={cx(
                                'h-6 w-auto max-w-[180px] object-contain opacity-55 grayscale transition',
                                'group-hover:opacity-100 group-hover:grayscale-0',
                                (b.invert ?? true) && 'invert'
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* micro-caption */}
                  <div className="relative mt-8 text-center text-xs text-zinc-400 sm:text-right">
                    Comparable disclosure depth • Comparable presentation rigor
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
