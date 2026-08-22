import React from 'react';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';

interface RejectionReasonProps {
  data: CorporateApprovalResultData;
}

export const RejectionReason: React.FC<RejectionReasonProps> = ({ data }) => {
  if (data.status !== 'rejected' || !data.rejectionReason) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Rejection Reason
      </h2>
      <p className="text-[14px] text-slate-900 dark:text-white mt-2 font-medium">
        &ldquo;{data.rejectionReason}&rdquo;
      </p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-3">
        The payment will not be processed.
      </p>
      <dl className="mt-3 space-y-2 text-[13px] border-t border-slate-200 dark:border-slate-800 pt-3">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Rejected By</dt>
          <dd className="font-medium">{data.performedBy}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Date</dt>
          <dd className="font-medium">{data.performedAt}</dd>
        </div>
      </dl>
    </section>
  );
};
