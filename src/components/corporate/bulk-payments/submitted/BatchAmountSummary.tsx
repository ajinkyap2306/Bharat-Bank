import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';

interface BatchAmountSummaryProps {
  data: BulkBatchTrackingData;
}

export const BatchAmountSummary: React.FC<BatchAmountSummaryProps> = ({ data }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 text-center">
    <p className="text-[28px] font-bold text-[#111827] dark:text-white tracking-tight">
      {formatPaymentCurrency(data.totalAmount)}
    </p>
    <p className="text-[14px] font-medium text-[#667085] mt-1">{data.paymentCount} Payments</p>
    <div className="mt-4 pt-4 border-t border-[#E4E7EC] dark:border-slate-800">
      <p className="text-[12px] text-[#667085]">Total Debit</p>
      <p className="text-[22px] font-bold text-[#111827] dark:text-white mt-0.5">
        {formatPaymentCurrency(data.totalDebit)}
      </p>
    </div>
    {data.status === 'completed' || data.status === 'partially_completed' ? (
      <div className="flex justify-center gap-6 mt-3 text-[13px]">
        <span className="text-[#16A34A] font-semibold">{data.successfulCount} Successful</span>
        {data.failedCount > 0 && (
          <span className="text-[#DC2626] font-semibold">{data.failedCount} Failed</span>
        )}
      </div>
    ) : data.validCount === data.paymentCount && data.paymentCount > 0 ? (
      <p className="text-[13px] text-[#16A34A] font-semibold mt-3">{data.validCount} Valid</p>
    ) : null}
  </section>
);
