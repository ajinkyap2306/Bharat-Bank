import React from 'react';
import type { ApprovalDisplayStatus } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalStatusBadgeProps {
  status: ApprovalDisplayStatus;
  label: string;
}

const styles: Record<ApprovalDisplayStatus, string> = {
  pending_yours: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  pending_other: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400',
  returned: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status, label }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]}`}
    role="status"
  >
    {label}
  </span>
);
