import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';

interface PaymentAmountSummaryProps {
  amount: number;
  fee: number;
  totalDebit: number;
  currency?: string;
}

export const PaymentAmountSummary: React.FC<PaymentAmountSummaryProps> = ({
  amount,
  fee,
  totalDebit,
  currency = '₹',
}) => (
  <section className="px-4" aria-label="Payment amount summary">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Payment Amount</p>
      <p className="text-[32px] font-bold text-slate-900 dark:text-white tabular-nums mt-1">
        {formatPaymentCurrency(amount, currency)}
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">INR</p>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-slate-500 dark:text-slate-400">Transaction Fee</span>
          <span className="font-medium text-slate-900 dark:text-white tabular-nums">
            {formatPaymentCurrency(fee, currency)}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[15px] font-semibold text-slate-900 dark:text-white">Total Debit</span>
          <span className="text-[22px] font-bold text-congress-blue-700 dark:text-congress-blue-400 tabular-nums">
            {formatPaymentCurrency(totalDebit, currency)}
          </span>
        </div>
      </div>
    </div>
  </section>
);
