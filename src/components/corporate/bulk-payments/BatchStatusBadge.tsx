import React from 'react';
import type { BulkBatchStatus } from '../../../types/corporateBulkPayments';

const config: Record<BulkBatchStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  validating: { label: 'Validating', className: 'bg-blue-50 text-[#0B5CAB]' },
  validation_errors: { label: 'Validation Errors', className: 'bg-rose-50 text-[#DC2626]' },
  ready_for_review: { label: 'Ready for Review', className: 'bg-emerald-50 text-[#16A34A]' },
  pending_approval: { label: 'Pending Approval', className: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Processing', className: 'bg-blue-50 text-[#0B5CAB]' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-[#16A34A]' },
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
