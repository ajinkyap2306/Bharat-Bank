import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchSummaryProps {
  data: BulkBatchTrackingData;
}

export const BatchSummary: React.FC<BatchSummaryProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Batch Summary</h3>
    <dl className="space-y-2 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Payments</dt>
        <dd className="font-semibold">{data.paymentCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Successful Validation</dt>
        <dd className="font-semibold text-emerald-600 dark:text-emerald-400">{data.validCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Validation Errors</dt>
        <dd className="font-medium">{data.errorCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Possible Duplicates</dt>
        <dd className="font-medium">{data.duplicateCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Total Amount</dt>
        <dd className="font-bold">{formatPaymentCurrency(data.totalAmount)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Processing Fee</dt>
        <dd className="font-medium">{formatPaymentCurrency(data.fee)}</dd>
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        <dt className="text-slate-500 dark:text-slate-400 font-medium">Total Debit</dt>
        <dd className="font-bold">{formatPaymentCurrency(data.totalDebit)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Status</dt>
        <dd className="font-semibold text-congress-blue-700 dark:text-congress-blue-400">{data.statusLabel}</dd>
      </div>
    </dl>
  </PayCard>
);
