import React from 'react';
import type { ApprovalResultStatus } from '../../../../types/corporateApprovalResult';

interface ApprovalStatusBadgeProps {
  status: ApprovalResultStatus;
  label: string;
}

const styles: Record<ApprovalResultStatus, string> = {
  approved_next: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved_final: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  returned: 'bg-amber-50 text-amber-700 border-amber-200',
  already_processed: 'bg-slate-100 text-slate-600 border-slate-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status, label }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]}`}
    role="status"
  >
    {label}
  </span>
);
