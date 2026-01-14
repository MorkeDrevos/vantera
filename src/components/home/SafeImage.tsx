// src/components/home/SafeImage.tsx
'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

type Props = Omit<ImageProps, 'alt'> & {
  alt: string;
  fallback?: React.ReactNode;
};

function isUnsplash(src: unknown) {
  if (typeof src !== 'string') return false;
  return (
    src.startsWith('https://images.unsplash.com/') ||
    src.startsWith('https://plus.unsplash.com/') ||
    src.startsWith('https://source.unsplash.com/')
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

  // Unsplash sometimes breaks via the Next image optimizer (403/404/502).
  // For Unsplash only, render a plain <img> so it loads directly.
  if (isUnsplash(props.src)) {
    const { src, className, style, width, height } = props as any;

    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className as string | undefined}
        style={style as React.CSSProperties | undefined}
        loading="lazy"
        onError={() => setOk(false)}
      />
    );
  }

  return <Image {...props} alt={alt} onError={() => setOk(false)} />;
}
