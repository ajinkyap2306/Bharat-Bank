import React from 'react';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';
import { getResultStatusLabel } from '../../../../types/corporateApprovalResult';

interface ActionDetailsProps {
  data: CorporateApprovalResultData;
}

export const ActionDetails: React.FC<ActionDetailsProps> = ({ data }) => {
  if (data.status === 'already_processed' || data.status === 'failed') {
    return null;
  }

  const actionLabel =
    data.action === 'approve'
      ? 'Approved'
      : data.action === 'reject'
        ? 'Rejected'
        : 'Returned for Changes';

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-2">
        Action Details
      </h2>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between gap-3">
          <dt className="text-[#667085]">Action</dt>
          <dd className="font-medium text-[#111827] dark:text-white">{actionLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#667085]">Status</dt>
          <dd>
            <ApprovalStatusBadge status={data.status} label={getResultStatusLabel(data.status)} />
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#667085]">
            {data.action === 'reject' ? 'Rejected By' : data.action === 'return' ? 'Returned By' : 'Approved By'}
          </dt>
          <dd className="font-medium text-[#111827] dark:text-white">{data.performedBy}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#667085]">Role</dt>
          <dd className="font-medium text-[#111827] dark:text-white">{data.performedByRole}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#667085]">Date</dt>
          <dd className="font-medium text-[#111827] dark:text-white">{data.performedAt}</dd>
        </div>
        {data.comment && data.action === 'approve' && (
          <div className="pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
            <dt className="text-[#667085] mb-1">Comment</dt>
            <dd className="font-medium text-[#111827] dark:text-white">
              &ldquo;{data.comment}&rdquo;
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
};
