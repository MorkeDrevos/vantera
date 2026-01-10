// src/app/page.tsx
import HomePage from '@/components/home/HomePage';
import ComingSoon from '@/components/ComingSoon';

export default function Page() {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  if (comingSoon) return <ComingSoon />;

  return <HomePage />;
}
