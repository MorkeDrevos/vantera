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

  // Ungrouped fallback: 3 clean rows (legible + premium)
  const rows = splitIntoRows(brands, 3);

  return (
    <section className={cx('w-full', className)}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#05060A]">
        {/* premium ambient */}
        <div className="pointer-events-none absolute inset-0">
          {/* top museum light */}
          <div className="absolute -top-48 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.11),transparent_72%)] blur-2xl" />
          {/* violet discipline */}
          <div className="absolute -top-40 right-[-260px] h-[620px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgba(120,76,255,0.18),transparent_72%)] blur-2xl" />
          {/* subtle gold hint (very light) */}
          <div className="absolute -top-56 left-[-220px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(255,204,115,0.06),transparent_70%)] blur-2xl" />
          {/* deep vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_680px_at_50%_0%,transparent_42%,rgba(0,0,0,0.60)_88%)]" />
          {/* hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
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

            {/* right "wow" reference wall */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.018] shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
                {/* glass + grid */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_25%_0%,rgba(255,255,255,0.10),transparent_64%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_380px_at_80%_10%,rgba(120,76,255,0.16),transparent_66%)]" />

                  {/* subtle technical grid */}
                  <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

                  {/* top sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                  {/* vignette edges */}
                  <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_40%,transparent_38%,rgba(0,0,0,0.55)_88%)]" />
                </div>

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
                      REFERENCE WALL
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
                    <div className="text-[11px] font-medium text-zinc-400">
                      Comparable disclosure depth • Comparable presentation rigor
                    </div>
                  </div>

                  {/* If groups exist, render grouped blocks. If not, render clean rows. */}
                  {grouped ? (
                    <div className="mt-7 space-y-7">
                      {Object.entries(grouped).map(([groupName, groupBrands]) => (
                        <div
                          key={groupName}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-400">
                              {groupName.toUpperCase()}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
                            {groupBrands.map((b) => (
                              <div key={`${groupName}:${b.domain}`} className="group flex items-center justify-center">
                                <Image
                                  src={brandfetchLogoUrl(b.domain)}
                                  alt={`${b.name} logo`}
                                  width={320}
                                  height={90}
                                  unoptimized
                                  className={cx(
                                    'h-7 w-auto max-w-[190px] object-contain opacity-70 grayscale transition',
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
                    <div className="mt-8 space-y-7">
                      {rows.map((row, i) => (
                        <div key={i} className="relative">
                          {i !== 0 && (
                            <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          )}

                          <div
                            className={cx(
                              'flex flex-wrap items-center gap-x-12 gap-y-7',
                              i === 0 && 'justify-center sm:justify-start',
                              i === 1 && 'justify-center',
                              i === 2 && 'justify-center sm:justify-end'
                            )}
                          >
                            {row.map((b) => (
                              <div key={b.domain} className="group flex items-center justify-center">
                                <Image
                                  src={brandfetchLogoUrl(b.domain)}
                                  alt={`${b.name} logo`}
                                  width={320}
                                  height={90}
                                  unoptimized
                                  className={cx(
                                    'h-7 w-auto max-w-[200px] object-contain opacity-70 grayscale transition',
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
                  )}

                  {/* bottom quiet stamp */}
                  <div className="mt-10 flex items-center justify-between gap-4">
                    <div className="text-xs text-zinc-500">
                      Benchmarked for clarity, discipline and client confidence
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
                      Reference only
                    </div>
                  </div>
                </div>
              </div>

              {/* tiny outside caption for extra polish */}
              <div className="mt-4 text-right text-xs text-zinc-500">
                Logos are displayed in monochrome to keep the reference frame quiet and impartial
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
