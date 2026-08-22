import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface StateDetailsCardProps {
  data: BulkBatchTrackingData;
}

export const StateDetailsCard: React.FC<StateDetailsCardProps> = ({ data }) => {
  if (data.status === 'rejected') {
    return (
      <PayCard className="p-4 border-rose-200">
        <dl className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Rejected By</dt>
            <dd className="font-semibold">{data.rejectedBy}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 mb-1">Reason</dt>
            <dd className="font-medium text-[#DC2626] bg-rose-50 rounded-lg p-3">{data.rejectionReason}</dd>
          </div>
        </dl>
      </PayCard>
    );
  }

  if (data.status === 'returned') {
    return (
      <PayCard className="p-4 border-amber-200">
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-1">Reviewer Comment</p>
        <p className="text-[14px] font-medium">{data.returnComment}</p>
      </PayCard>
    );
  }

  if (data.status === 'cancelled') {
    return (
      <PayCard className="p-4">
        <dl className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Cancelled By</dt>
            <dd className="font-semibold">{data.cancelledBy}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Cancellation Date</dt>
            <dd className="font-medium">{data.cancelledAt}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 mb-1">Reason</dt>
            <dd className="font-medium">{data.cancellationReason}</dd>
          </div>
        </dl>
      </PayCard>
    );
  }

  if (data.completedAt) {
    return (
      <PayCard className="p-4">
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-500 dark:text-slate-400">Completed</span>
          <span className="font-semibold">{data.completedAt}</span>
        </div>
      </PayCard>
    );
  }

  return null;
};
