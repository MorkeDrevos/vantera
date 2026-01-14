// src/components/home/SafeImage.tsx
'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

type Props = Omit<ImageProps, 'alt'> & {
  alt: string;
  fallback?: React.ReactNode;
};

function isUnsplash(src: ImageProps['src']) {
  if (typeof src !== 'string') return false;
  return (
    src.includes('images.unsplash.com') ||
    src.includes('source.unsplash.com') ||
    src.includes('plus.unsplash.com')
  );
}

export default function SafeImage({ alt, fallback, ...props }: Props) {
  const [ok, setOk] = useState(true);

  const safeFallback = useMemo(() => {
    return (
      fallback ?? (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      )
    );
  }, [fallback]);

  if (!ok) return <>{safeFallback}</>;

  // If Unsplash blocks Next's server-side optimizer, bypass optimization for Unsplash only.
  // This keeps Brandfetch/local images optimized, while making Unsplash reliable.
  const unoptimized = props.unoptimized ?? isUnsplash(props.src);

  return <Image {...props} alt={alt} unoptimized={unoptimized} onError={() => setOk(false)} />;
}
