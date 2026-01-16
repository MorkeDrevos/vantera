// src/components/listings/RoyalListingPage.tsx
import type { City, Listing, ListingMedia } from '@prisma/client';

import PremiumBadgeRow from './PremiumBadgeRow';
import RoyalHero from './RoyalHero';
import FactsRow from './FactsRow';
import MediaStrip from './MediaStrip';
import IntelligencePanel from './IntelligencePanel';
import StaticMapCard from './StaticMapCard';
import ListingActions from './ListingActions';

type ListingWithRelations = Listing & {
  city: City;
  media: ListingMedia[];
  coverMedia: ListingMedia | null;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function RoyalListingPage({ listing }: { listing: ListingWithRelations }) {
  const cityLabel = [listing.city?.name, listing.city?.region, listing.city?.country].filter(Boolean).join(' · ');

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6 sm:px-10">
        <RoyalHero listing={listing} cityLabel={cityLabel} />

        <section className="mt-8">
          <PremiumBadgeRow listing={listing} />
        </section>

        <section className="mt-8 grid grid-cols-12 gap-8">
          {/* Left column */}
          <div className="col-span-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-start justify-between gap-8">
                <div className="min-w-0">
                  <h1 className="text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.02em]">
                    {listing.title}
                  </h1>

                  <div className="mt-3 text-sm text-white/70">
                    {listing.addressHidden || !listing.address ? (
                      <span>{cityLabel}</span>
                    ) : (
                      <span className="truncate">{listing.address}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Indicative</div>
                  <div className="mt-1 text-[30px] font-semibold tracking-[-0.02em]">
                    <PriceBlock listing={listing} />
                  </div>
                  <div className="mt-2 text-xs text-white/55">
                    {listing.priceConfidence ? `Confidence ${listing.priceConfidence}/100` : 'Confidence pending'}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <FactsRow listing={listing} />
              </div>

              {listing.description ? (
                <div className="mt-8">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Overview</div>
                  <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-white/80">{listing.description}</p>
                </div>
              ) : null}

              <div className="mt-10">
                <MediaStrip media={listing.media} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="col-span-4">
            <div className={cx('sticky top-6 space-y-8')}>
              <IntelligencePanel listing={listing} />

              <StaticMapCard listing={listing} cityLabel={cityLabel} />

              <ListingActions listing={listing} />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function PriceBlock({ listing }: { listing: Listing }) {
  const currency = (listing.currency || 'EUR').toUpperCase();

  if (!listing.price || (listing.priceConfidence != null && listing.priceConfidence < 45)) {
    return <span className="text-white/85">Price on request</span>;
  }

  const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  return (
    <span className="text-white">
      {currency} {fmt.format(listing.price)}
    </span>
  );
}
