import React from 'react';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';

interface FinalApprovalCardProps {
  data: CorporateApprovalResultData;
  onViewPayment: () => void;
}

export const FinalApprovalCard: React.FC<FinalApprovalCardProps> = ({
  data,
  onViewPayment,
}) => (
  <section className="mx-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-4">
    <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">
      All Approvals Completed
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">
      The payment has passed the required corporate approval workflow.
    </p>
    <p className="text-[14px] font-semibold text-[#16A34A] mt-3">
      Next status: {data.nextStatusLabel ?? 'Payment Processing'}
    </p>
    <button
      type="button"
      onClick={onViewPayment}
      className="mt-4 w-full py-3 rounded-xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
    >
      View Payment
    </button>
  </section>
);
