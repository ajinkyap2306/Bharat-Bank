import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface PaymentResultSummaryProps {
  data: BulkBatchTrackingData;
  onViewResults: () => void;
}

export const PaymentResultSummary: React.FC<PaymentResultSummaryProps> = ({ data, onViewResults }) => {
  if (!data.showPaymentResults) return null;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Payment Results</h3>
      <dl className="grid grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-xl bg-emerald-50/50 p-3 text-center">
          <dt className="text-slate-500 dark:text-slate-400">Successful</dt>
          <dd className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{data.successfulCount}</dd>
        </div>
        <div className="rounded-xl bg-blue-50/50 p-3 text-center">
          <dt className="text-slate-500 dark:text-slate-400">Processing</dt>
          <dd className="text-[18px] font-bold text-congress-blue-700 dark:text-congress-blue-400 mt-0.5">{data.processingCount}</dd>
        </div>
        <div className="rounded-xl bg-rose-50/50 p-3 text-center">
          <dt className="text-slate-500 dark:text-slate-400">Failed</dt>
          <dd className="text-[18px] font-bold text-[#DC2626] mt-0.5">{data.failedCount}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center">
          <dt className="text-slate-500 dark:text-slate-400">Total</dt>
          <dd className="text-[18px] font-bold mt-0.5">{data.paymentCount}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onViewResults}
        className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-congress-blue-700 dark:text-congress-blue-400 font-semibold text-[13px] min-h-11"
      >
        View Payment Results
      </button>
    </PayCard>
  );
};
