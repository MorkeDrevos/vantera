// src/app/page.tsx
import HomePage from '@/components/home/HomePage';
import ComingSoon from '@/components/ComingSoon';

export default function Page() {
  // Set this env var ONLY in prod on Vercel if you want the coming-soon gate:
  // NEXT_PUBLIC_COMING_SOON=1
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === '1';

  if (comingSoon) return <ComingSoon />;

  return <HomePage />;
}
