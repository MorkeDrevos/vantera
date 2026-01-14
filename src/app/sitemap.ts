// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { CITIES } from '@/components/home/cities';

type Freq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

function abs(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.domain}${p}`;
}

function entry(
  url: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: Freq;
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /**
   * Core strategic surfaces
   * These pages define authority and intent clusters
   */
  const staticRoutes: MetadataRoute.Sitemap = [
    entry(abs('/'), { lastModified: now, changeFrequency: 'daily', priority: 1.0 }),

    // Global money keyword hub
    entry(abs('/luxury-real-estate'), { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),

    // Functional + acquisition
    entry(abs('/listings'), { lastModified: now, changeFrequency: 'daily', priority: 0.8 }),
    entry(abs('/sell-luxury-property'), { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),
    entry(abs('/agents'), { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),

    // Low-priority utility
    entry(abs('/contact'), { lastModified: now, changeFrequency: 'yearly', priority: 0.4 }),
  ];

  /**
   * City hubs + city luxury clusters
   * This is where long-tail dominance happens
   */
  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((c) => [
    entry(abs(`/city/${c.slug}`), {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
    entry(abs(`/city/${c.slug}/luxury-real-estate`), {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }),
  ]);

  /**
   * NOTE (intentional omissions):
   * - Individual listings are excluded until verified + stable
   * - Keyword pillar pages will be added when launched
   */

  return [...staticRoutes, ...cityRoutes];
}
