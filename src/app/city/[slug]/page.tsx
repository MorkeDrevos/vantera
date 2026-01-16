// src/app/city/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const city = await prisma.city.findUnique({ where: { slug } });

  if (!city) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="text-[22px] font-semibold text-zinc-900">Not found</div>
          <div className="mt-2 text-[13px] text-zinc-600">This city does not exist.</div>
          <div className="mt-6">
            <Link
              href="/search"
              className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-[12px] text-white hover:bg-zinc-800"
            >
              Back to search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { cityId: city.id, status: 'LIVE', visibility: 'PUBLIC' },
    orderBy: [{ price: 'desc' }, { updatedAt: 'desc' }],
    take: 18,
    include: { coverMedia: true },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] bg-white ring-1 ring-inset ring-zinc-200 shadow-[0_30px_110px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="relative px-8 py-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-80" />
            <div className="text-[11px] font-semibold text-zinc-500">City</div>
            <div className="mt-2 text-[34px] font-semibold text-zinc-900">{city.name}</div>
            <div className="mt-2 text-[13px] text-zinc-600">
              {city.region ? `${city.region}, ` : ''}
              {city.country}
            </div>

            {city.blurb ? (
              <div className="mt-5 max-w-2xl text-[14px] text-zinc-700 leading-relaxed">{city.blurb}</div>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href={`/search?city=${encodeURIComponent(city.slug)}`}
                className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-[12px] text-white hover:bg-zinc-800"
              >
                View all listings
              </Link>

              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[12px] text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-8 py-8">
            <div className="text-[13px] font-semibold text-zinc-900">
              Featured listings
              <span className="ml-2 text-[12px] font-medium text-zinc-500">
                {listings.length ? `${listings.length} shown` : 'No inventory yet'}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/property/${l.slug}`}
                  className="group rounded-[24px] bg-white p-3 ring-1 ring-inset ring-zinc-200 shadow-[0_20px_70px_rgba(0,0,0,0.05)] hover:shadow-[0_34px_105px_rgba(0,0,0,0.08)] transition"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                    {l.coverMedia?.url ? (
                      <Image
                        src={l.coverMedia.url}
                        alt={l.coverMedia.alt ?? l.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-zinc-100" />
                    )}
                  </div>

                  <div className="mt-3 px-1 pb-1">
                    <div className="truncate text-[13px] font-semibold text-zinc-900">{l.title}</div>
                    <div className="mt-1 text-[12px] text-zinc-600">
                      {typeof l.price === 'number' ? `€${l.price.toLocaleString()}` : 'Price on request'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={`/search?city=${encodeURIComponent(city.slug)}`}
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[12px] text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
              >
                Explore {city.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
