// src/components/badges/BrokerVerificationBadge.tsx
'use client';

import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { BrokerVerificationStatus, BrokerBadgeLevel } from '@/lib/truth/truth.schema';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function BrokerVerificationBadge({
  status,
  level,
  compact = false,
}: {
  status: BrokerVerificationStatus;
  level?: BrokerBadgeLevel;
  compact?: boolean;
}) {
  const cfg =
    status === 'verified'
      ? {
          icon: ShieldCheck,
          label:
            level === 'verified-agency'
              ? 'Verified agency'
              : level === 'developer-verified'
                ? 'Developer verified'
                : 'Verified broker',
          cls: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100',
        }
      : status === 'pending'
        ? {
            icon: ShieldQuestion,
            label: 'Verification pending',
            cls: 'border-white/12 bg-white/[0.04] text-zinc-200',
          }
        : status === 'rejected'
          ? {
              icon: ShieldAlert,
              label: 'Verification rejected',
              cls: 'border-amber-400/18 bg-amber-500/10 text-amber-100',
            }
          : {
              icon: ShieldQuestion,
              label: 'Not verified',
              cls: 'border-white/10 bg-white/[0.03] text-zinc-300',
            };

  const Icon = cfg.icon;

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] leading-none backdrop-blur-xl',
        cfg.cls,
        compact && 'px-2.5 py-1'
      )}
    >
      <Icon className={cx('h-3.5 w-3.5 opacity-80', compact && 'h-3 w-3')} />
      <span className="font-semibold tracking-[0.18em]">{cfg.label.toUpperCase()}</span>
    </span>
  );
}
