import React from 'react';
import type { LimitStatus } from '../../../../types/corporateAccountLimits';

const STATUS_CONFIG: Record<
  LimitStatus,
  { label: string; className: string; icon?: string }
> = {
  within_limit: {
    label: 'Within Limit',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  near_limit: {
    label: 'Near Limit',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  exceeded: {
    label: 'Limit Exceeded',
    className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  },
  restricted: {
    label: 'Restricted',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
};

interface LimitStatusBadgeProps {
  status: LimitStatus;
  message?: string;
}

export const LimitStatusBadge: React.FC<LimitStatusBadgeProps> = ({ status, message }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.className}`}
      >
        {config.label}
      </span>
      {message && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 text-right max-w-45">{message}</span>
      )}
    </div>
  );
};

export function getStatusMessage(
  status: LimitStatus,
  remaining: number,
  currency: string,
  showBalances: boolean
): string {
  if (status === 'restricted') return 'Transactions temporarily restricted';
  if (status === 'exceeded') return 'Daily limit reached';
  if (status === 'near_limit') {
    return showBalances
      ? `Only ${currency}${remaining.toLocaleString('en-IN')} remaining`
      : 'Approaching limit';
  }
  return showBalances
    ? `${currency}${remaining.toLocaleString('en-IN')} remaining`
    : 'Within limit';
}
