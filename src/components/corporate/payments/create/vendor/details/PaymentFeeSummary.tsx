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
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-500 dark:text-slate-400">Transaction Fee</span>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {formatPaymentCurrency(fee, currency)}
          </span>
        </div>
        <div className="flex justify-between text-[14px] pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="font-semibold text-slate-900 dark:text-white">Total Debit</span>
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
            {formatPaymentCurrency(totalDebit, currency)}
          </span>
        </div>
      </div>
    </section>
  );
};
