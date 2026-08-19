import React from 'react';
import type { BulkBatchTrackingStatus } from '../../../../types/corporateBulkBatchStatus';

const config: Record<BulkBatchTrackingStatus, { label: string; className: string }> = {
  pending_approval: { label: 'Pending Approval', className: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Processing', className: 'bg-blue-50 text-[#0B5CAB]' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-[#16A34A]' },
  partially_completed: { label: 'Partially Completed', className: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'Batch Rejected', className: 'bg-rose-50 text-[#DC2626]' },
  returned: { label: 'Returned for Changes', className: 'bg-amber-50 text-amber-700' },
  cancelled: { label: 'Batch Cancelled', className: 'bg-slate-100 text-slate-600' },
};

export const BatchStatusBadge: React.FC<{ status: BulkBatchTrackingStatus }> = ({ status }) => {
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${className}`}>{label}</span>
  );
};
