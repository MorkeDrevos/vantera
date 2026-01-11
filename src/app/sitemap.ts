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

  const staticRoutes: MetadataRoute.Sitemap = [
    entry(abs('/'), { lastModified: now, changeFrequency: 'daily', priority: 1 }),
    entry(abs('/luxury-real-estate'), { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    entry(abs('/listings'), { lastModified: now, changeFrequency: 'daily', priority: 0.8 }),
    entry(abs('/sell-luxury-property'), { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),
    entry(abs('/agents'), { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),
    entry(abs('/contact'), { lastModified: now, changeFrequency: 'yearly', priority: 0.4 }),
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((c) => {
    return [
      entry(abs(`/city/${c.slug}`), { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
      entry(abs(`/city/${c.slug}/luxury-real-estate`), { lastModified: now, changeFrequency: 'weekly', priority: 0.85 }),
    ];
  });

  return [...staticRoutes, ...cityRoutes];
}
