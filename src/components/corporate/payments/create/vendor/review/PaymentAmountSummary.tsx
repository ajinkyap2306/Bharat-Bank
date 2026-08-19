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
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 shadow-sm">
      <p className="text-[13px] font-medium text-[#667085]">Payment Amount</p>
      <p className="text-[32px] font-bold text-[#111827] dark:text-white tabular-nums mt-1">
        {formatPaymentCurrency(amount, currency)}
      </p>
      <p className="text-[11px] text-[#667085] mt-1">INR</p>

      <div className="mt-4 pt-4 border-t border-[#E4E7EC] dark:border-slate-800 space-y-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#667085]">Transaction Fee</span>
          <span className="font-medium text-[#111827] dark:text-white tabular-nums">
            {formatPaymentCurrency(fee, currency)}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[15px] font-semibold text-[#111827] dark:text-white">Total Debit</span>
          <span className="text-[22px] font-bold text-[#0B5CAB] tabular-nums">
            {formatPaymentCurrency(totalDebit, currency)}
          </span>
        </div>
      </div>
    </div>
  </section>
);
