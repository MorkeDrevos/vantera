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
  // matches your current Brandfetch usage pattern
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

function titleCase(s: string) {
  const t = (s ?? '').trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
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

  // Ungrouped: stable, premium grid (no collage).
  const chunks = splitIntoChunks(brands, 12);

  const RING = 'ring-1 ring-inset ring-[color:var(--hairline)]';

  return (
    <section className={cx('w-full', className)}>
      <div className="relative overflow-hidden border-y border-[color:var(--hairline)] bg-[color:var(--paper)]">
        {/* paper-first ambient */}
        <div className="pointer-events-none absolute inset-0">
          {/* warm crown halo */}
          <div className="absolute -top-56 left-1/2 h-[680px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(231,201,130,0.16),transparent_70%)] blur-3xl" />
          {/* cool discipline */}
          <div className="absolute -top-64 right-[-320px] h-[720px] w-[980px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.08),transparent_74%)] blur-3xl" />
          {/* subtle paper grain */}
          <div className="absolute inset-0 opacity-[0.028] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
          {/* hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.08)] to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* left narrative */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.16)] to-transparent" />
                <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                  {eyebrow}
                </div>
              </div>

              <h2 className="mt-4 text-balance text-[28px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[36px]">
                {title}
              </h2>

              <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)]">
                {subtitle}
              </p>

              <div className="mt-7 space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.32)]" />
                  <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">
                    Comparable disclosure depth across pricing signals, provenance and data confidence
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.32)]" />
                  <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">
                    Comparable presentation rigor for clients who expect institutional clarity
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[rgba(11,12,16,0.32)]" />
                  <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">
                    A reference framework that stays disciplined as coverage expands
                  </p>
                </div>
              </div>

              <div className="mt-9 max-w-md">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
                <p className="mt-3 text-xs leading-relaxed text-[color:var(--ink-3)]">{note}</p>
              </div>
            </div>

            {/* right reference plate */}
            <div className="lg:col-span-7">
              <div
                className={cx(
                  'relative overflow-hidden rounded-[30px]',
                  'bg-white/70 backdrop-blur-[14px]',
                  RING,
                  'shadow-[0_36px_140px_rgba(11,12,16,0.12)]',
                )}
              >
                {/* plate lighting */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_10%,rgba(139,92,246,0.08),transparent_66%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),transparent_44%,rgba(0,0,0,0.04))]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
                </div>

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--ink-3)]">
                      Reference plate
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent sm:block" />
                    <div className={cx('rounded-full bg-white/80 px-3 py-1 text-[11px] text-[color:var(--ink-3)]', RING)}>
                      Benchmark only
                    </div>
                  </div>

                  <div className="mt-7 space-y-7">
                    {grouped ? (
                      Object.entries(grouped).map(([groupName, groupBrands]) => (
                        <div key={groupName} className={cx('rounded-2xl bg-white/78 px-5 py-5', RING)}>
                          <div className="flex items-center gap-4">
                            <div className="text-[11px] font-semibold tracking-[0.16em] text-[color:var(--ink-3)]">
                              {titleCase(groupName)}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                            {groupBrands.map((b) => (
                              <div key={`${groupName}:${b.domain}`} className="group flex items-center justify-center">
                                <div
                                  className={cx(
                                    'flex items-center justify-center',
                                    'h-10 w-full',
                                    'rounded-2xl bg-white/65',
                                    'px-4',
                                    RING,
                                    'transition',
                                    'group-hover:bg-white/85',
                                  )}
                                >
                                  <Image
                                    src={brandfetchLogoUrl(b.domain)}
                                    alt={`${b.name} logo`}
                                    width={320}
                                    height={96}
                                    unoptimized
                                    loading="lazy"
                                    decoding="async"
                                    className={cx(
                                      'h-6 w-auto max-w-[210px] object-contain',
                                      'opacity-80 grayscale-[0.55] transition',
                                      'group-hover:opacity-100 group-hover:grayscale-0',
                                      (b.invert ?? false) && 'invert',
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      chunks.map((chunk, idx) => (
                        <div key={idx} className={cx('rounded-2xl bg-white/78 px-5 py-5', RING)}>
                          <div className="flex items-center gap-4">
                            <div className="text-[11px] font-semibold tracking-[0.16em] text-[color:var(--ink-3)]">
                              Global reference set
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                            {chunk.map((b) => (
                              <div key={b.domain} className="group flex items-center justify-center">
                                <div
                                  className={cx(
                                    'flex items-center justify-center',
                                    'h-10 w-full',
                                    'rounded-2xl bg-white/65',
                                    'px-4',
                                    RING,
                                    'transition',
                                    'group-hover:bg-white/85',
                                  )}
                                >
                                  <Image
                                    src={brandfetchLogoUrl(b.domain)}
                                    alt={`${b.name} logo`}
                                    width={320}
                                    height={96}
                                    unoptimized
                                    loading="lazy"
                                    decoding="async"
                                    className={cx(
                                      'h-6 w-auto max-w-[210px] object-contain',
                                      'opacity-80 grayscale-[0.55] transition',
                                      'group-hover:opacity-100 group-hover:grayscale-0',
                                      (b.invert ?? false) && 'invert',
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="text-xs text-[color:var(--ink-3)]">Disclosure depth • Data discipline • Presentation rigor</div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent sm:block" />
                    <div className="text-xs text-[color:var(--ink-3)]">Monochrome display for impartiality</div>
                  </div>
                </div>
              </div>

              {/* no outside caption */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
