import React from 'react';
import type { ScheduledPaymentStatus } from '../../../../types/corporateScheduledPayments';

const config: Record<ScheduledPaymentStatus, { label: string; className: string }> = {
  upcoming: {
    label: 'Scheduled',
    className: 'bg-blue-50 text-congress-blue-700 dark:text-congress-blue-400 dark:bg-blue-950/40 dark:text-blue-400',
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  processing: {
    label: 'Processing',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
};

export const ScheduledStatusBadge: React.FC<{ status: ScheduledPaymentStatus }> = ({ status }) => {
  const { label, className } = config[status];
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${className}`}>
      {label}
    </span>
  );
};
