// prisma/seed.ts
import {
  PrismaClient,
  CoverageTier,
  CoverageStatus,
  ListingStatus,
  ListingVisibility,
  VerificationLevel,
} from '@prisma/client';

const prisma = new PrismaClient();

function monthStartUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

async function main() {
  // -----------------------
  // Region clusters
  // -----------------------
  const clusterRows = [
    {
      slug: 'costa-del-sol',
      name: 'Costa del Sol',
      country: 'Spain',
      region: 'Europe',
      tier: CoverageTier.TIER_0,
      status: CoverageStatus.LIVE,
      priority: 10,
      headline: 'Flagship coverage',
      blurb:
        'Prime coastal markets, verified supply and the reference implementation for Vantera depth.',
    },
    {
      slug: 'french-riviera',
      name: 'French Riviera',
      country: 'France',
      region: 'Europe',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 6,
      headline: 'Coverage expanding',
      blurb:
        'A dense coastal luxury cluster. Market structure first, listings as the dataset matures.',
    },
    {
      slug: 'miami-metro',
      name: 'Miami Metro',
      country: 'United States',
      region: 'North America',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 5,
      headline: 'Coverage expanding',
      blurb:
        'Metro cluster coverage (Brickell, Miami Beach and waterfront districts) with a luxury-only lens.',
    },
    {
      slug: 'lake-como-region',
      name: 'Lake Como Region',
      country: 'Italy',
      region: 'Europe',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 2,
      headline: 'Coverage expanding',
      blurb:
        'Trophy lakefront assets. Market structure first, verified inventory later.',
    },
    {
      slug: 'swiss-alps-region',
      name: 'Swiss Alps',
      country: 'Switzerland',
      region: 'Europe',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 1,
      headline: 'Coverage expanding',
      blurb:
        'Seasonal prime markets with strict truth signals and high verification standards.',
    },
  ];

  for (const row of clusterRows) {
    await prisma.regionCluster.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        country: row.country,
        region: row.region,
        tier: row.tier,
        status: row.status,
        priority: row.priority,
        headline: row.headline,
        blurb: row.blurb,
      },
      create: row,
    });
  }

  const clusters = await prisma.regionCluster.findMany();
  const clusterBySlug = new Map(clusters.map((c) => [c.slug, c.id]));

  // -----------------------
  // Cities (ALL, including watchlist)
  // -----------------------
  const cityRows = [
    // Tier 0
    {
      slug: 'marbella',
      name: 'Marbella',
      country: 'Spain',
      region: 'Europe',
      tz: 'Europe/Madrid',
      tier: CoverageTier.TIER_0,
      status: CoverageStatus.LIVE,
      priority: 100,
      blurb: 'Prime coastal living and global luxury demand. Vantera flagship dataset.',
      clusterSlug: 'costa-del-sol',
      lat: 36.5101,
      lng: -4.8825,
    },
    {
      slug: 'benahavis',
      name: 'Benahavís',
      country: 'Spain',
      region: 'Europe',
      tz: 'Europe/Madrid',
      tier: CoverageTier.TIER_0,
      status: CoverageStatus.LIVE,
      priority: 95,
      blurb: 'Gated estates, golf corridors and hillside privacy above the coast.',
      clusterSlug: 'costa-del-sol',
      lat: 36.5230,
      lng: -5.0464,
    },
    {
      slug: 'estepona',
      name: 'Estepona',
      country: 'Spain',
      region: 'Europe',
      tz: 'Europe/Madrid',
      tier: CoverageTier.TIER_0,
      status: CoverageStatus.LIVE,
      priority: 90,
      blurb: 'Beachfront modern builds and a calmer luxury rhythm with strong value.',
      clusterSlug: 'costa-del-sol',
      lat: 36.4276,
      lng: -5.1460,
    },

    // Tier 1
    {
      slug: 'monaco',
      name: 'Monaco',
      country: 'Monaco',
      region: 'Europe',
      tz: 'Europe/Monaco',
      tier: CoverageTier.TIER_1,
      status: CoverageStatus.TRACKING,
      priority: 80,
      blurb: 'Ultra-prime density and global capital concentration.',
      lat: 43.7384,
      lng: 7.4246,
    },
    {
      slug: 'dubai',
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Middle East',
      tz: 'Asia/Dubai',
      tier: CoverageTier.TIER_1,
      status: CoverageStatus.TRACKING,
      priority: 75,
      blurb: 'Modern skyline, speed and scale. Prime districts behave like a global asset class.',
      lat: 25.2048,
      lng: 55.2708,
    },
    {
      slug: 'london',
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      tz: 'Europe/London',
      tier: CoverageTier.TIER_1,
      status: CoverageStatus.TRACKING,
      priority: 70,
      blurb: 'A global capital with deep prime neighbourhood structure and cross-border demand.',
      lat: 51.5072,
      lng: -0.1276,
    },

    // Tier 2
    {
      slug: 'new-york',
      name: 'New York',
      country: 'United States',
      region: 'North America',
      tz: 'America/New_York',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 60,
      blurb: 'Prime districts only, with a truth-first lens.',
      lat: 40.7128,
      lng: -74.006,
    },
    {
      slug: 'miami',
      name: 'Miami',
      country: 'United States',
      region: 'North America',
      tz: 'America/New_York',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 55,
      blurb: 'Waterfront prime and global buyer flow. Metro cluster coverage.',
      clusterSlug: 'miami-metro',
      lat: 25.7617,
      lng: -80.1918,
    },
    {
      slug: 'cannes',
      name: 'Cannes',
      country: 'France',
      region: 'Europe',
      tz: 'Europe/Paris',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 50,
      blurb: 'Riviera prime and yachting density. Coverage expanding.',
      clusterSlug: 'french-riviera',
      lat: 43.5528,
      lng: 7.0174,
    },
    {
      slug: 'nice',
      name: 'Nice',
      country: 'France',
      region: 'Europe',
      tz: 'Europe/Paris',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 45,
      blurb: 'Coastal lifestyle and prime districts. Coverage expanding.',
      clusterSlug: 'french-riviera',
      lat: 43.7102,
      lng: 7.262,
    },
    {
      slug: 'saint-tropez',
      name: 'Saint-Tropez',
      country: 'France',
      region: 'Europe',
      tz: 'Europe/Paris',
      tier: CoverageTier.TIER_2,
      status: CoverageStatus.EXPANDING,
      priority: 40,
      blurb: 'Ultra-prime seasonal market. Coverage expanding.',
      clusterSlug: 'french-riviera',
      lat: 43.27,
      lng: 6.64,
    },

    // Tier 3 (watchlist but included)
    {
      slug: 'paris',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      tz: 'Europe/Paris',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 30,
      blurb: 'Prime districts only. Coverage expanding.',
      clusterSlug: 'french-riviera',
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      slug: 'lake-como',
      name: 'Lake Como',
      country: 'Italy',
      region: 'Europe',
      tz: 'Europe/Rome',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 25,
      blurb: 'Trophy lakefront assets. Coverage expanding.',
      clusterSlug: 'lake-como-region',
      lat: 46.016,
      lng: 9.257,
    },
    {
      slug: 'swiss-alps',
      name: 'Swiss Alps',
      country: 'Switzerland',
      region: 'Europe',
      tz: 'Europe/Zurich',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 20,
      blurb: 'Seasonal prime with strict truth signals. Coverage expanding.',
      clusterSlug: 'swiss-alps-region',
      lat: 46.8182,
      lng: 8.2275,
    },
    {
      slug: 'ibiza',
      name: 'Ibiza',
      country: 'Spain',
      region: 'Europe',
      tz: 'Europe/Madrid',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 18,
      blurb: 'Ultra-prime seasonal market. Coverage expanding.',
      clusterSlug: 'costa-del-sol',
      lat: 38.9067,
      lng: 1.4206,
    },
    {
      slug: 'singapore',
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      tz: 'Asia/Singapore',
      tier: CoverageTier.TIER_3,
      status: CoverageStatus.EXPANDING,
      priority: 15,
      blurb: 'Global capital with prime-only coverage. Coverage expanding.',
      lat: 1.3521,
      lng: 103.8198,
    },
  ];

  for (const row of cityRows) {
    const clusterId = row.clusterSlug ? clusterBySlug.get(row.clusterSlug) ?? null : null;

    await prisma.city.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        country: row.country,
        region: row.region,
        tz: row.tz,
        tier: row.tier,
        status: row.status,
        priority: row.priority,
        blurb: row.blurb,
        clusterId,
        lat: row.lat,
        lng: row.lng,
      },
      create: {
        slug: row.slug,
        name: row.name,
        country: row.country,
        region: row.region,
        tz: row.tz,
        tier: row.tier,
        status: row.status,
        priority: row.priority,
        blurb: row.blurb,
        clusterId,
        lat: row.lat,
        lng: row.lng,
      },
    });
  }

  // -----------------------
  // Seed a CityMetric snapshot for each city (placeholder, real later)
  // -----------------------
  const asOf = monthStartUTC(new Date());
  const allCities = await prisma.city.findMany();

  for (const c of allCities) {
    // Confidence: higher for Tier 0, lower for watchlist (still real)
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

  // -----------------------
  // Seed 3 premium placeholder listings in Marbella
  // -----------------------
  const marbella = await prisma.city.findUnique({ where: { slug: 'marbella' } });

  if (marbella) {
    // Avoid duplicating on re-seed: only create if no listings exist
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
          currency: 'EUR',
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
          currency: 'EUR',
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
          currency: 'EUR',
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
            currency: s.currency,
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

  console.log('✅ Seed complete (clusters, cities, metrics, sample listings)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
