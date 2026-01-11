// src/components/sell/SellerUploadClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Lock, CreditCard, Upload, ShieldCheck } from 'lucide-react';

import { CITIES, type City } from '@/components/home/cities';
import BrokerVerificationBadge from '@/components/badges/BrokerVerificationBadge';
import type { AssetType, LocationPrivacy, SellerType } from '@/lib/truth/truth.schema';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function StepPill({ step, active, done }: { step: Step; active: boolean; done: boolean }) {
  return (
    <div
      className={cx(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
        done
          ? 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100'
          : active
            ? 'border-white/14 bg-white/[0.04] text-zinc-200'
            : 'border-white/10 bg-white/[0.02] text-zinc-400'
      )}
    >
      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="font-mono text-[11px]">{step}</span>}
      <span className="tracking-[0.14em] font-semibold">
        {step === 1
          ? 'VERIFY'
          : step === 2
            ? 'ESSENTIALS'
            : step === 3
              ? 'PROOF'
              : step === 4
                ? 'MEDIA'
                : step === 5
                  ? 'PAY'
                  : 'PUBLISH'}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number | '';
  setValue: (v: number | '') => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-500">{label.toUpperCase()}</div>
      <input
        value={value}
        onChange={(e) => {
          const v = e.target.value.trim();
          setValue(v === '' ? '' : Number(v));
        }}
        inputMode="numeric"
        className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/16"
      />
    </div>
  );
}

export default function SellerUploadClient() {
  const sp = useSearchParams();

  const [step, setStep] = useState<Step>(1);

  // Identity
  const [email, setEmail] = useState('');

  // Essentials
  const [citySlug, setCitySlug] = useState(CITIES[0]?.slug ?? '');
  const [sellerType, setSellerType] = useState<SellerType>('owner');
  const [assetType, setAssetType] = useState<AssetType>('villa');
  const [beds, setBeds] = useState<number | ''>('');
  const [baths, setBaths] = useState<number | ''>('');
  const [builtSqm, setBuiltSqm] = useState<number | ''>('');
  const [plotSqm, setPlotSqm] = useState<number | ''>('');
  const [geoPrecision, setGeoPrecision] = useState<LocationPrivacy>('area');

  // Proof / integrity
  const [isBroker, setIsBroker] = useState(false);
  const [pricingAuthority, setPricingAuthority] = useState(false);

  // Stub: you’ll wire these later
  const [uploadedProofCount] = useState(0);
  const [uploadedImageCount] = useState(0);
  const [paid] = useState(false);

  useEffect(() => {
    const qCity = sp?.get('city')?.trim();
    if (!qCity) return;
    if (CITIES.some((c) => c.slug === qCity)) setCitySlug(qCity);
  }, [sp]);

  const city = useMemo<City | undefined>(() => CITIES.find((c) => c.slug === citySlug), [citySlug]);

  const canNext =
    step === 1
      ? email.includes('@')
      : step === 2
        ? Boolean(citySlug && assetType && sellerType && beds !== '' && baths !== '' && builtSqm !== '')
        : step === 3
          ? pricingAuthority
          : step === 4
            ? true
            : step === 5
              ? true
              : true;

  const headerState =
    step < 6
      ? 'Listings locked until verified'
      : 'Submitted for verification';

  return (
    <div className="min-h-[100dvh] bg-[#0B0E13] text-zinc-100">
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-10 sm:px-8">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SELLERS</div>
                <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-50">
                  Publish one verified listing
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                  Vantera is verified supply only. No brochure theatre. No inflated pricing. Just truth.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-300">
                  <Lock className="h-4 w-4 opacity-80" />
                  {headerState}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-300">
                  <ShieldCheck className="h-4 w-4 opacity-80" />
                  Verified supply only
                </div>

                {isBroker ? <BrokerVerificationBadge status="pending" compact /> : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <StepPill key={n} step={n as Step} active={step === n} done={step > n} />
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-black/20 p-5">
              {step === 1 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Verify your identity</div>
                  <div className="text-xs text-zinc-500">Email OTP is the fast path. We add deeper verification in Phase 2.</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/16"
                  />
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Property essentials</div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-500">CITY</div>
                      <select
                        value={citySlug}
                        onChange={(e) => setCitySlug(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/16"
                      >
                        {CITIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name} - {c.country}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 text-xs text-zinc-500">
                        Coverage tier: <span className="text-zinc-300">{city?.tier ?? 'TIER_3'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-500">SELLER TYPE</div>
                      <select
                        value={sellerType}
                        onChange={(e) => setSellerType(e.target.value as SellerType)}
                        className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/16"
                      >
                        <option value="owner">Owner</option>
                        <option value="agent">Agent / broker</option>
                        <option value="developer">Developer</option>
                      </select>
                    </div>

                    <div>
                      <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-500">ASSET TYPE</div>
                      <select
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value as AssetType)}
                        className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/16"
                      >
                        <option value="villa">Villa</option>
                        <option value="apartment">Apartment</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="estate">Estate</option>
                        <option value="plot">Plot</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <Field label="Beds" value={beds} setValue={setBeds} />
                    <Field label="Baths" value={baths} setValue={setBaths} />
                    <Field label="Built sqm" value={builtSqm} setValue={setBuiltSqm} />
                    <Field label="Plot sqm" value={plotSqm} setValue={setPlotSqm} />
                  </div>

                  <div className="mt-2">
                    <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-500">LOCATION PRIVACY</div>
                    <div className="flex flex-wrap gap-2">
                      {(['exact', 'area', 'redacted'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setGeoPrecision(p)}
                          className={cx(
                            'rounded-full border px-3 py-2 text-xs',
                            geoPrecision === p
                              ? 'border-white/16 bg-white/[0.06] text-zinc-100'
                              : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04]'
                          )}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      Exact address is never public by default. Vantera supports area-level publishing.
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Proof + integrity gate</div>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={pricingAuthority}
                      onChange={(e) => setPricingAuthority(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm text-zinc-200">I confirm pricing authority</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        You are authorised to publish this property and set its asking price.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isBroker}
                      onChange={(e) => setIsBroker(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm text-zinc-200">I am a broker/agent</div>
                      <div className="mt-1 text-xs text-zinc-500">Broker badge appears after review and verification.</div>
                    </div>
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-200">
                        <Upload className="h-4 w-4 opacity-80" />
                        Upload proof of control
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                        {uploadedProofCount}/2
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Stub UI. Next: S3 upload + reviewer pipeline.</div>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Media</div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-200">
                        <Upload className="h-4 w-4 opacity-80" />
                        Upload at least 8 images
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                        {uploadedImageCount}/8
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Stub UI. Next: multi-upload, ordering, hero select.</div>
                  </div>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Payment</div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-200">
                        <CreditCard className="h-4 w-4 opacity-80" />
                        Stripe Checkout
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                        {paid ? 'PAID' : 'NOT PAID'}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Next: create checkout session server-side and redirect.</div>
                  </div>
                </div>
              ) : null}

              {step === 6 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium text-zinc-100">Publish</div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                    Your listing enters <span className="text-zinc-100">verification</span>. Once approved, it appears under{' '}
                    <span className="text-zinc-100">Verified supply only</span> for {city?.name ?? 'your city'}.
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, (s - 1) as Step) as Step)}
                className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-300 hover:bg-white/[0.04]"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => Math.min(6, (s + 1) as Step) as Step)}
                className={cx(
                  'rounded-full border px-5 py-2 text-xs font-semibold tracking-[0.14em] transition',
                  canNext
                    ? 'border-white/12 bg-white/[0.06] text-zinc-100 hover:bg-white/[0.09]'
                    : 'border-white/10 bg-white/[0.02] text-zinc-500 cursor-not-allowed'
                )}
              >
                {step < 6 ? 'NEXT' : 'DONE'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-zinc-500">
          Note: The moment Phase 2 verification + publish is live, cities flip automatically from{' '}
          <span className="text-zinc-300">Intelligence active · Listings locked</span> to{' '}
          <span className="text-zinc-300">Verified supply only</span>.
        </div>
      </div>
    </div>
  );
}
