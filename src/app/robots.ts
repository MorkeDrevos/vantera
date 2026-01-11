// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/city/',
          '/listing/',
          '/listings',
          '/luxury-real-estate',
          '/sell-luxury-property',
          '/agents',
          '/contact',
        ],
        disallow: [
          '/api/',
          '/ops/',
          '/hub/',
          '/admin/',
          '/sign-in',
          '/sign-up',
          '/account',
          '/dashboard',
          '/maintenance',
        ],
      },
    ],
    sitemap: `${SEO_CONFIG.domain}/sitemap.xml`,
    host: SEO_CONFIG.domain,
  };
}
