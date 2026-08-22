import React from 'react';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';

interface ReturnCommentProps {
  data: CorporateApprovalResultData;
}

export const ReturnComment: React.FC<ReturnCommentProps> = ({ data }) => {
  if (data.status !== 'returned' || !data.returnComment) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Reviewer Comment
      </h2>
      <p className="text-[14px] text-slate-900 dark:text-white mt-2 font-medium">
        &ldquo;{data.returnComment}&rdquo;
      </p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-3">
        The maker needs to update the request before it can be submitted again.
      </p>
      <dl className="mt-3 space-y-2 text-[13px] border-t border-slate-200 dark:border-slate-800 pt-3">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Returned By</dt>
          <dd className="font-medium">{data.performedBy}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Role</dt>
          <dd className="font-medium">{data.performedByRole}</dd>
        </div>
      </dl>
    </section>
  );
};
