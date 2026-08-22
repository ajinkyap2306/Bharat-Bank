import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface NextApproverCardProps {
  data: BulkBatchTrackingData;
  onViewApproval: () => void;
}

export const NextApproverCard: React.FC<NextApproverCardProps> = ({ data, onViewApproval }) => {
  if (['completed', 'cancelled', 'rejected', 'returned'].includes(data.status)) return null;

  const isChecker = data.viewerRole === 'checker' && data.status === 'pending_approval';

  return (
    <PayCard className="p-4 border-congress-blue-700/30 bg-blue-50/40 dark:bg-blue-950/20">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">
        {isChecker ? 'Action Required' : 'Next Approval'}
      </h3>
      {isChecker ? (
        <p className="text-[14px] font-semibold text-slate-900 dark:text-white mt-2">
          {data.paymentCount} payments require your approval.
        </p>
      ) : (
        <>
          <p className="text-[15px] font-bold text-congress-blue-700 dark:text-congress-blue-400 mt-2">{data.currentApprover}</p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
            Status: Waiting for {data.currentApprover}
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
            The batch will proceed after the required approval is completed.
          </p>
        </>
      )}
      <button
        type="button"
        onClick={onViewApproval}
        className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11"
      >
        {isChecker ? 'Review Batch' : 'View Approval Status'}
      </button>
    </PayCard>
  );
};

interface MakerStatusCardProps {
  data: BulkBatchTrackingData;
}

export const MakerStatusCard: React.FC<MakerStatusCardProps> = ({ data }) => {
  if (data.viewerRole !== 'maker' || data.status !== 'pending_approval') return null;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-2">Approval Status</h3>
      <p className="text-[14px] font-medium text-slate-900 dark:text-white">
        Pending {data.currentApprover}
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
        You will be notified when the batch moves to the next stage.
      </p>
    </PayCard>
  );
};
