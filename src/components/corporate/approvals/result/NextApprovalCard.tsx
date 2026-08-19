import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';

interface NextApprovalCardProps {
  data: CorporateApprovalResultData;
  onViewApprovalStatus: () => void;
}

export const NextApprovalCard: React.FC<NextApprovalCardProps> = ({
  data,
  onViewApprovalStatus,
}) => (
  <section className="mx-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4">
    <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Next Approval</h2>
    <p className="text-[16px] font-semibold text-[#0B5CAB] mt-2">{data.nextApprover}</p>
    <p className="text-[13px] text-[#667085] mt-1">Status: Pending</p>
    <p className="text-[13px] text-[#111827] dark:text-white mt-3">
      Payment requires one more approval before processing.
    </p>
    <p className="text-[12px] text-[#667085] mt-2">
      {data.completedApprovals} of {data.totalApprovals} approvals completed
    </p>
    {data.nextStatusLabel && (
      <p className="text-[12px] font-medium text-[#0B5CAB] mt-1">{data.nextStatusLabel}</p>
    )}
    <button
      type="button"
      onClick={onViewApprovalStatus}
      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
    >
      View Approval Status
      <ArrowRight className="w-4 h-4" aria-hidden />
    </button>
  </section>
);
