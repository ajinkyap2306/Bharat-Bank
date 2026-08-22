import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchFinancialSummaryProps {
  data: BulkBatchReview;
}

export const BatchFinancialSummary: React.FC<BatchFinancialSummaryProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Batch Summary</h3>
    <dl className="space-y-2.5 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Total Payments</dt>
        <dd className="font-semibold">{data.validCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Total Amount</dt>
        <dd className="font-bold">{formatPaymentCurrency(data.totalAmount)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Processing Fee</dt>
        <dd className="font-medium">{formatPaymentCurrency(data.fee)}</dd>
      </div>
      <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
        <dt className="text-slate-500 dark:text-slate-400 font-medium">Total Debit</dt>
        <dd className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">
          {formatPaymentCurrency(data.totalDebit)}
        </dd>
      </div>
    </dl>
  </PayCard>
);
