import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';

interface NextActionCardProps {
  data: VendorPaymentSubmissionData;
  onViewApprovalStatus: () => void;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  data,
  onViewApprovalStatus,
}) => {
  if (
    data.status === 'rejected' ||
    data.status === 'cancelled' ||
    data.status === 'completed' ||
    data.status === 'failed'
  ) {
    return null;
  }

  if (!data.approvalRequired) {
    return (
      <section
        className="mx-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4"
        aria-labelledby="next-action-heading"
      >
        <h2 id="next-action-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
          Next Action
        </h2>
        <p className="text-[13px] text-slate-900 dark:text-white mt-2 font-medium">
          Your payment is being processed.
        </p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
          You will be notified once processing is complete.
        </p>
      </section>
    );
  }

  if (data.status === 'processing' || data.status === 'approved') {
    return (
      <section
        className="mx-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4"
        aria-labelledby="next-action-heading"
      >
        <h2 id="next-action-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
          Next Action
        </h2>
        <p className="text-[13px] text-slate-900 dark:text-white mt-2 font-medium">
          Payment is being processed by the bank.
        </p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
          Processing typically completes within the estimated timeframe.
        </p>
      </section>
    );
  }

  return (
    <section
      className="mx-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 p-4"
      aria-labelledby="next-action-heading"
    >
      <h2 id="next-action-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Next Action
      </h2>
      <p className="text-[13px] text-slate-900 dark:text-white mt-2 font-medium">
        {data.nextActionTitle}
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{data.nextActionDescription}</p>
      <button
        type="button"
        onClick={onViewApprovalStatus}
        className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11 active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
      >
        View Approval Status
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>
    </section>
  );
};
