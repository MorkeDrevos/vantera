// src/components/home/CityLocalTime.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

function formatLocalTime(tz: string, now: Date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(now);
  } catch {
    return '';
  }
}

export default function CityLocalTime({
  tz,
  className,
}: {
  tz: string;
  className?: string;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const text = useMemo(() => formatLocalTime(tz, now), [tz, now]);

  if (!text) return null;

  return (
    <span
      className={
        className ??
        'rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] text-zinc-100 backdrop-blur'
      }
    >
      {text}
    </span>
  );
}
