import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';

interface PaymentFeeSummaryProps {
  amount: number;
  fee: number;
  totalDebit: number;
  currency?: string;
}

export const PaymentFeeSummary: React.FC<PaymentFeeSummaryProps> = ({
  amount,
  fee,
  totalDebit,
  currency = '₹',
}) => {
  if (amount <= 0) return null;

  return (
    <section className="px-4" aria-label="Fee summary">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-[#667085]">Transaction Fee</span>
          <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
            {formatPaymentCurrency(fee, currency)}
          </span>
        </div>
        <div className="flex justify-between text-[14px] pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
          <span className="font-semibold text-[#111827] dark:text-white">Total Debit</span>
          <span className="font-bold text-[#111827] dark:text-white tabular-nums">
            {formatPaymentCurrency(totalDebit, currency)}
          </span>
        </div>
      </div>
    </section>
  );
};
