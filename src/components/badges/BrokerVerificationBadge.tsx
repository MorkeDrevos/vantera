// src/components/badges/BrokerVerificationBadge.tsx
'use client';

import { ShieldCheck } from 'lucide-react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function BrokerVerificationBadge({
  status,
  brokerName,
  compact = false,
}: {
  status: 'verified' | 'pending' | 'unverified';
  brokerName?: string;
  compact?: boolean;
}) {
  const cfg =
    status === 'verified'
      ? {
          label: 'Verified broker',
          cls: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100',
          sub: brokerName ? brokerName : 'Identity confirmed',
        }
      : status === 'pending'
      ? {
          label: 'Broker verification pending',
          cls: 'border-white/12 bg-white/[0.04] text-zinc-200',
          sub: brokerName ? brokerName : 'Review in progress',
        }
      : {
          label: 'Unverified broker',
          cls: 'border-amber-400/18 bg-amber-500/10 text-amber-100',
          sub: brokerName ? brokerName : 'No verification',
        };

  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border backdrop-blur-xl',
        compact ? 'px-3 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs',
        cfg.cls
      )}
      title={cfg.sub}
    >
      <ShieldCheck className={cx('opacity-85', compact ? 'h-4 w-4' : 'h-4 w-4')} />
      <span className="font-semibold tracking-[0.14em]">{cfg.label.toUpperCase()}</span>
      {!compact ? <span className="text-zinc-400/80">·</span> : null}
      {!compact ? <span className="text-zinc-200/90">{cfg.sub}</span> : null}
    </div>
  );
}
