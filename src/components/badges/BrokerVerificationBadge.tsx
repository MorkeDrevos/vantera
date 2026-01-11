// src/components/badges/BrokerVerificationBadge.tsx
'use client';

import { ShieldCheck, BadgeCheck, AlertTriangle } from 'lucide-react';

export type BrokerBadgeStatus = 'verified_broker' | 'verified_identity' | 'restricted';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function BrokerVerificationBadge({
  status,
  label,
  jurisdiction,
  licenseId,
  compact = false,
}: {
  status: BrokerBadgeStatus;
  label?: string;
  jurisdiction?: string;
  licenseId?: string;
  compact?: boolean;
}) {
  const cfg =
    status === 'verified_broker'
      ? {
          Icon: BadgeCheck,
          title: label ?? 'Verified broker',
          cls: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100',
        }
      : status === 'verified_identity'
        ? {
            Icon: ShieldCheck,
            title: label ?? 'Verified identity',
            cls: 'border-white/12 bg-white/[0.04] text-zinc-200',
          }
        : {
            Icon: AlertTriangle,
            title: label ?? 'Restricted',
            cls: 'border-amber-400/18 bg-amber-500/10 text-amber-100',
          };

  const Icon = cfg.Icon;

  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] leading-none backdrop-blur-xl',
        cfg.cls,
        compact && 'px-2.5 py-1.5'
      )}
    >
      <Icon className={cx('h-4 w-4 opacity-80', compact && 'h-3.5 w-3.5')} />
      <span className="font-semibold tracking-[0.18em]">{cfg.title.toUpperCase()}</span>
      {(jurisdiction || licenseId) ? <span className="text-zinc-400/80">·</span> : null}
      {jurisdiction ? <span className="text-zinc-200/90">{jurisdiction}</span> : null}
      {licenseId ? <span className="font-mono text-zinc-200/90">{licenseId}</span> : null}
    </div>
  );
}
