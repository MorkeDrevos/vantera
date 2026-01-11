// src/app/page.tsx
import type { Metadata } from 'next';

import HomePage from '@/components/home/HomePage';
import ComingSoon from '@/components/ComingSoon';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

export const metadata: Metadata = (() => {
  const doc = SEO_INTENT.home();

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: doc.canonical,
    },
    robots: doc.robots,

    openGraph: {
      type: 'website',
      title: doc.title,
      description: doc.description,
      url: doc.canonical,
      siteName: 'Vantera',
      images: [doc.ogImage],
    },

    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
    },
  };
})();

export default function Page() {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  const doc = SEO_INTENT.home();

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: 'Vantera',
    description: doc.description,
    about: [
      { '@type': 'Thing', name: 'Luxury real estate' },
      { '@type': 'Thing', name: 'Property intelligence' },
      { '@type': 'Thing', name: 'Market pricing signals' },
      { '@type': 'Thing', name: 'Private asset analysis' },
    ],
  });

  if (comingSoon) return <ComingSoon />;

  return (
    <>
      {jsonLd(pageJsonLd)}
      <HomePage />
    </>
  );
}
