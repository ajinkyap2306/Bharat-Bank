import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchSummaryProps {
  data: BulkBatchTrackingData;
}

export const BatchSummary: React.FC<BatchSummaryProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Batch Summary</h3>
    <dl className="space-y-2 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-[#667085]">Payments</dt>
        <dd className="font-semibold">{data.paymentCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Successful Validation</dt>
        <dd className="font-semibold text-[#16A34A]">{data.validCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Validation Errors</dt>
        <dd className="font-medium">{data.errorCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Possible Duplicates</dt>
        <dd className="font-medium">{data.duplicateCount}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Total Amount</dt>
        <dd className="font-bold">{formatPaymentCurrency(data.totalAmount)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Processing Fee</dt>
        <dd className="font-medium">{formatPaymentCurrency(data.fee)}</dd>
      </div>
      <div className="flex justify-between pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
        <dt className="text-[#667085] font-medium">Total Debit</dt>
        <dd className="font-bold">{formatPaymentCurrency(data.totalDebit)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[#667085]">Status</dt>
        <dd className="font-semibold text-[#0B5CAB]">{data.statusLabel}</dd>
      </div>
    </dl>
  </PayCard>
);
