import React from 'react';
import type { CorporatePaymentStatus } from '../../../../types/corporatePaymentTracking';

const labels: Record<CorporatePaymentStatus, string> = {
  submitted: 'Submitted',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
  failed: 'Failed',
  cancelled: 'Cancelled',
  reversed: 'Reversed',
};

const styles: Record<CorporatePaymentStatus, string> = {
  submitted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  pending_approval: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  approved: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  processing: 'bg-blue-50 text-[#0B5CAB] dark:bg-blue-950/40 dark:text-blue-400',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  failed: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  reversed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
};

export const PaymentStatusBadge: React.FC<{ status: CorporatePaymentStatus }> = ({ status }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[status]}`}>
    {labels[status]}
  </span>
);
