// prisma/seed.ts
import {
  PrismaClient,
  CoverageTier,
  CoverageStatus,
  ListingStatus,
  ListingVisibility,
  VerificationLevel,
} from '@prisma/client';

import { REGION_CLUSTERS, ALL_CITIES } from '../src/components/home/cities';

const prisma = new PrismaClient();

function monthStartUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

async function main() {
  // 1) Upsert clusters
  for (const c of REGION_CLUSTERS) {
    await prisma.regionCluster.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        country: c.country ?? null,
        region: c.region ?? null,
        tier: c.tier as CoverageTier,
        status: c.status as CoverageStatus,
        priority: c.priority,
        headline: c.headline ?? null,
        blurb: c.blurb ?? null,
      },
      create: {
        slug: c.slug,
        name: c.name,
        country: c.country ?? null,
        region: c.region ?? null,
        tier: c.tier as CoverageTier,
        status: c.status as CoverageStatus,
        priority: c.priority,
        headline: c.headline ?? null,
        blurb: c.blurb ?? null,
      },
    });
  }

  const clusters = await prisma.regionCluster.findMany();
  const clusterBySlug = new Map(clusters.map((x) => [x.slug, x.id]));

  // 2) Upsert cities (includes watchlist because we use ALL_CITIES)
  for (const city of ALL_CITIES) {
    const clusterId = city.clusterSlug ? clusterBySlug.get(city.clusterSlug) ?? null : null;

    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        country: city.country,
        region: city.region ?? null,
        tz: city.tz,
        tier: (city.tier ?? 'TIER_3') as CoverageTier,
        status: (city.status ?? 'EXPANDING') as CoverageStatus,
        priority: city.priority ?? 0,
        blurb: city.blurb ?? null,
        heroImageSrc: city.image?.src ?? null,
        heroImageAlt: city.image?.alt ?? null,
        clusterId,
      },
      create: {
        slug: city.slug,
        name: city.name,
        country: city.country,
        region: city.region ?? null,
        tz: city.tz,
        tier: (city.tier ?? 'TIER_3') as CoverageTier,
        status: (city.status ?? 'EXPANDING') as CoverageStatus,
        priority: city.priority ?? 0,
        blurb: city.blurb ?? null,
        heroImageSrc: city.image?.src ?? null,
        heroImageAlt: city.image?.alt ?? null,
        clusterId,
      },
    });
  }

  // 3) City metrics (placeholder snapshot for each city)
  const asOf = monthStartUTC(new Date());
  const dbCities = await prisma.city.findMany();

  for (const c of dbCities) {
    const base =
      c.tier === CoverageTier.TIER_0 ? 55 : c.tier === CoverageTier.TIER_1 ? 45 : c.tier === CoverageTier.TIER_2 ? 35 : 25;

    await prisma.cityMetric.upsert({
      where: { cityId_asOf: { cityId: c.id, asOf } },
      update: {
        confidenceScore: base,
        sourceNote: 'seed placeholder - replace with real signals',
        activeListingCount: 0,
      },
      create: {
        cityId: c.id,
        asOf,
        confidenceScore: base,
        sourceNote: 'seed placeholder - replace with real signals',
        activeListingCount: 0,
      },
    });
  }

  // 4) Sample Marbella listings (only if Marbella has none)
  const marbella = await prisma.city.findUnique({ where: { slug: 'marbella' } });
  if (marbella) {
    const existing = await prisma.listing.count({ where: { cityId: marbella.id } });
    if (existing === 0) {
      const samples = [
        {
          title: 'Golden Mile - Contemporary Villa',
          neighborhood: 'Golden Mile',
          propertyType: 'villa',
          bedrooms: 6,
          bathrooms: 6,
          builtM2: 620,
          plotM2: 1450,
          price: 7950000,
        },
        {
          title: 'Sierra Blanca - Estate with Panoramic Views',
          neighborhood: 'Sierra Blanca',
          propertyType: 'estate',
          bedrooms: 7,
          bathrooms: 8,
          builtM2: 980,
          plotM2: 3100,
          price: 14500000,
        },
        {
          title: 'Nueva Andalucía - Penthouse Near Golf',
          neighborhood: 'Nueva Andalucía',
          propertyType: 'penthouse',
          bedrooms: 4,
          bathrooms: 4,
          builtM2: 240,
          plotM2: null as null | number,
          price: 2950000,
        },
      ];

      for (const s of samples) {
        await prisma.listing.create({
          data: {
            cityId: marbella.id,
            status: ListingStatus.LIVE,
            visibility: ListingVisibility.PUBLIC,
            verification: VerificationLevel.SELF_REPORTED,
            title: s.title,
            headline: 'Selected prime inventory - verification improves as the dataset matures.',
            description:
              'Premium placeholder listing seeded for product build. Replace with verified inventory, agent uploads or private seller submissions.',
            neighborhood: s.neighborhood,
            addressHidden: true,
            propertyType: s.propertyType,
            bedrooms: s.bedrooms,
            bathrooms: s.bathrooms,
            builtM2: s.builtM2,
            plotM2: s.plotM2 ?? undefined,
            price: s.price,
            currency: 'EUR',
            media: {
              create: [
                {
                  url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
                  alt: 'Luxury villa exterior - placeholder media',
                  sortOrder: 0,
                  kind: 'image',
                },
                {
                  url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80',
                  alt: 'Luxury interior - placeholder media',
                  sortOrder: 1,
                  kind: 'image',
                },
              ],
            },
          },
        });
      }
    }
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
