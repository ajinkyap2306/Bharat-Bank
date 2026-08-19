import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface PaymentAmountSummaryProps {
  data: CorporatePaymentTrackingData;
  hideAmounts: boolean;
}

function maskAmount(currency: string): string {
  return `${currency}••••••`;
}

export const PaymentAmountSummary: React.FC<PaymentAmountSummaryProps> = ({ data, hideAmounts }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Payment Summary</h3>
    <dl className="space-y-2.5">
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Amount</dt>
        <dd className="font-semibold text-[#111827] dark:text-white">
          {hideAmounts ? maskAmount(data.currency) : formatPaymentCurrency(data.amount, data.currency)}
        </dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Transaction Fee</dt>
        <dd className="font-medium text-[#111827] dark:text-white">
          {hideAmounts ? maskAmount(data.currency) : formatPaymentCurrency(data.fee, data.currency)}
        </dd>
      </div>
      <div className="flex justify-between text-[13px] pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
        <dt className="text-[#667085] font-medium">Total Debit</dt>
        <dd className="font-bold text-[#111827] dark:text-white">
          {hideAmounts ? maskAmount(data.currency) : formatPaymentCurrency(data.totalDebit, data.currency)}
        </dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Currency</dt>
        <dd className="font-medium text-[#111827] dark:text-white">INR</dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Payment Type</dt>
        <dd className="font-medium text-[#111827] dark:text-white">{data.type}</dd>
      </div>
    </dl>
  </PayCard>
);
