import React from 'react';
import type { BulkBatchStatus } from '../../../types/corporateBulkPayments';

const config: Record<BulkBatchStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  validating: { label: 'Validating', className: 'bg-blue-50 text-congress-blue-700 dark:text-congress-blue-400' },
  validation_errors: { label: 'Validation Errors', className: 'bg-rose-50 text-[#DC2626]' },
  ready_for_review: { label: 'Ready for Review', className: 'bg-emerald-50 text-emerald-600 dark:text-emerald-400' },
  pending_approval: { label: 'Pending Approval', className: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Processing', className: 'bg-blue-50 text-congress-blue-700 dark:text-congress-blue-400' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-600 dark:text-emerald-400' },
  partially_completed: { label: 'Partially Completed', className: 'bg-amber-50 text-amber-700' },
  failed: { label: 'Failed', className: 'bg-rose-50 text-[#DC2626]' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-600' },
};

export const BatchStatusBadge: React.FC<{ status: BulkBatchStatus }> = ({ status }) => {
  const { label, className } = config[status];
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${className}`}>{label}</span>
  );
};
