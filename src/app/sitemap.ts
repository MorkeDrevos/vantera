// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { CITIES } from '@/components/home/cities';

function abs(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.domain}${p}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: abs('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: abs('/luxury-real-estate'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: abs('/listings'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: abs('/sell-luxury-property'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: abs('/agents'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: abs('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((c) => {
    const cityHub = { url: abs(`/city/${c.slug}`), lastModified: now, changeFrequency: 'weekly', priority: 0.8 };
    const cityLuxury = {
      url: abs(`/city/${c.slug}/luxury-real-estate`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    };
    // You can add more city subpages later here: /supply, /truth, etc.
    return [cityHub, cityLuxury];
  });

  return [...staticRoutes, ...cityRoutes];
}
