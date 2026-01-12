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

function splitIntoChunks<T>(items: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default function TrustMarquee({
  brands,
  eyebrow = 'Institutional benchmark',
  title = 'Measured against institutional real-estate standards',
  subtitle = 'Vantera is benchmarked against the disclosure, operating and presentation standards used by the world’s most established real-estate institutions.',
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

  // Ungrouped: stable, premium grid (no scattered collage).
  // 12 items per "band" keeps it balanced across screen sizes.
  const chunks = splitIntoChunks(brands, 12);

  return (
    <section className={cx('w-full', className)}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#05060A]">
        {/* premium ambient */}
        <div className="pointer-events-none absolute inset-0">
          {/* top museum light */}
          <div className="absolute -top-52 left-1/2 h-[620px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.12),transparent_72%)] blur-2xl" />
          {/* violet discipline */}
          <div className="absolute -top-56 right-[-320px] h-[720px] w-[980px] rounded-full bg-[radial-gradient(closest-side,rgba(120,76,255,0.18),transparent_74%)] blur-2xl" />
          {/* tiny gold warmth (quiet) */}
          <div className="absolute -top-72 left-[-260px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(255,204,115,0.055),transparent_72%)] blur-2xl" />
          {/* vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_720px_at_50%_0%,transparent_42%,rgba(0,0,0,0.62)_88%)]" />

          {/* hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* left narrative */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="text-[11px] font-semibold tracking-[0.34em] text-zinc-400">
                  {eyebrow.toUpperCase()}
                </div>
              </div>

              <h2 className="mt-4 text-balance text-[28px] font-semibold tracking-[-0.03em] text-zinc-50 sm:text-[36px]">
                {title}
              </h2>

              <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-zinc-300">
                {subtitle}
              </p>

              <div className="mt-7 space-y-3.5">
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
                    A reference framework that stays disciplined as coverage expands
                  </p>
                </div>
              </div>

              <div className="mt-9 max-w-md">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">{note}</p>
              </div>
            </div>

            {/* right premium reference plate */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.018] shadow-[0_36px_140px_rgba(0,0,0,0.68)]">
                {/* plate lighting + grid */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_340px_at_22%_0%,rgba(255,255,255,0.12),transparent_64%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_82%_10%,rgba(120,76,255,0.16),transparent_66%)]" />

                  {/* ultra-subtle grid */}
                  <div className="absolute inset-0 opacity-[0.20] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:52px_52px]" />

                  {/* vignette edges */}
                  <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_42%,transparent_36%,rgba(0,0,0,0.58)_88%)]" />

                  {/* top sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                </div>

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
                      REFERENCE PLATE
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
                      Benchmark only
                    </div>
                  </div>

                  {/* content */}
                  <div className="mt-7 space-y-7">
                    {grouped ? (
                      Object.entries(grouped).map(([groupName, groupBrands]) => (
                        <div key={groupName} className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5">
                          <div className="flex items-center gap-4">
                            <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-400">
                              {groupName.toUpperCase()}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                            {groupBrands.map((b) => (
                              <div key={`${groupName}:${b.domain}`} className="group flex items-center justify-center">
                                <Image
                                  src={brandfetchLogoUrl(b.domain)}
                                  alt={`${b.name} logo`}
                                  width={340}
                                  height={100}
                                  unoptimized
                                  className={cx(
                                    // bigger, clearer, still tasteful
                                    'h-7 w-auto max-w-[200px] object-contain opacity-80 grayscale-[0.35] transition',
                                    'group-hover:opacity-100 group-hover:grayscale-0',
                                    (b.invert ?? true) && 'invert'
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      chunks.map((chunk, idx) => (
                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5">
                          <div className="flex items-center gap-4">
                            <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-400">
                              GLOBAL REFERENCE SET
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                            {chunk.map((b) => (
                              <div key={b.domain} className="group flex items-center justify-center">
                                <Image
                                  src={brandfetchLogoUrl(b.domain)}
                                  alt={`${b.name} logo`}
                                  width={340}
                                  height={100}
                                  unoptimized
                                  className={cx(
                                    'h-7 w-auto max-w-[210px] object-contain opacity-80 grayscale-[0.35] transition',
                                    'group-hover:opacity-100 group-hover:grayscale-0',
                                    (b.invert ?? true) && 'invert'
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* bottom stamp */}
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="text-xs text-zinc-500">
                      Disclosure depth • Data discipline • Presentation rigor
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
                    <div className="text-xs text-zinc-500">Monochrome display for impartiality</div>
                  </div>
                </div>
              </div>

              {/* remove the extra outside caption - it was weakening the plate */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
