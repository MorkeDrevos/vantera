// src/app/page.tsx
import ComingSoon from '@/components/ComingSoon';
import HomePageClient from '@/components/home/HomePageClient';

export default function Page() {
  // Set this env var ONLY in production on Vercel
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === '1';

  if (comingSoon) return <ComingSoon />;

  return <HomePageClient />;
}
