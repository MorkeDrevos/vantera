// src/app/contact/page.tsx
import Link from 'next/link';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-14 2xl:px-20';

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
      {children}
    </span>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] px-6 py-3 text-sm font-semibold text-white hover:bg-[rgba(10,10,12,1.0)]"
    >
      {children}
    </button>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--hairline)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
    >
      {children}
    </Link>
  );
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const okRaw = searchParams?.ok;
  const ok = Array.isArray(okRaw) ? okRaw[0] === '1' : okRaw === '1';

  return (
    <main className="min-h-screen bg-white">
      {/* Quiet paper texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      {/* Header */}
      <section className="border-b border-[color:var(--hairline)] bg-[color:var(--paper-2)]">
        <div className={cx('py-12 sm:py-14', WIDE)}>
          <div className="flex flex-wrap items-center gap-2">
            <TagPill>CONTACT</TagPill>
            <TagPill>PRIVATE INQUIRY</TagPill>
            <TagPill>RESPONSE WITHIN 24H</TagPill>
          </div>

          <h1 className="mt-5 text-balance text-[34px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[44px] lg:text-[52px] lg:leading-[1.02]">
            Contact Vantera
          </h1>

          <p className="mt-4 max-w-[75ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
            Serious buyer or seller? Send a private inquiry and we’ll route it to the right team.
          </p>

          <div className="mt-8">
            <Hairline />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className={cx('py-10 sm:py-12', WIDE)}>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-[26px] border border-[color:var(--hairline)] bg-white p-6 shadow-[0_30px_90px_rgba(11,12,16,0.06)] sm:p-8">
              {ok ? (
                <div className="rounded-2xl border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--ink)]">Message received</div>
                  <div className="mt-1 text-sm text-[color:var(--ink-2)]">
                    Thank you. We’ll reply shortly.
                  </div>
                </div>
              ) : null}

              <form
                className="mt-6 space-y-4"
                action="/api/contact"
                method="POST"
              >
                {/* honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                      NAME
                    </div>
                    <input
                      name="name"
                      type="text"
                      className="mt-2 w-full rounded-2xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] outline-none focus:border-[rgba(10,10,12,0.22)]"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                      EMAIL
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-2xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] outline-none focus:border-[rgba(10,10,12,0.22)]"
                      placeholder="you@domain.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    SUBJECT
                  </div>
                  <input
                    name="subject"
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] outline-none focus:border-[rgba(10,10,12,0.22)]"
                    placeholder="Buying request, seller submission, partnership..."
                  />
                </label>

                <label className="block">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--ink-3)]">
                    MESSAGE
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    className="mt-2 w-full resize-none rounded-2xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] outline-none focus:border-[rgba(10,10,12,0.22)]"
                    placeholder="Tell us what you’re looking for, your timeline, and any preferences."
                  />
                </label>

                <div className="pt-2">
                  <PrimaryButton>Send inquiry</PrimaryButton>
                </div>

                <div className="text-[12px] text-[color:var(--ink-3)]">
                  By sending, you agree to be contacted regarding your request. No spam.
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[26px] border border-[color:var(--hairline)] bg-white p-6 shadow-[0_30px_90px_rgba(11,12,16,0.06)] sm:p-8">
              <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">
                ALSO USEFUL
              </div>

              <div className="mt-4 space-y-3">
                <SecondaryLink href="/search">Search the marketplace</SecondaryLink>
                <SecondaryLink href="/sell">Submit a property</SecondaryLink>
                <SecondaryLink href="/">Home</SecondaryLink>
              </div>

              <div className="mt-6 text-sm text-[color:var(--ink-2)]">
                For urgent high-value matters, include:
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px]">
                  <li>Budget range</li>
                  <li>Target locations</li>
                  <li>Timeframe</li>
                  <li>Must-have requirements</li>
                </ul>
              </div>

              <div className="mt-8">
                <Hairline />
              </div>

              <div className="mt-6 text-[12px] text-[color:var(--ink-3)]">
                Tip: after successful submit, redirect to <span className="font-semibold text-[color:var(--ink)]">/contact?ok=1</span>.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
