import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';

interface BalanceCheckCardProps {
  balanceBefore: number;
  totalDebit: number;
  balanceAfter: number;
  sufficient: boolean;
  showBalances: boolean;
  currency?: string;
}

export const BalanceCheckCard: React.FC<BalanceCheckCardProps> = ({
  balanceBefore,
  totalDebit,
  balanceAfter,
  sufficient,
  showBalances,
  currency = '₹',
}) => {
  const mask = (v: number) => (showBalances ? formatPaymentCurrency(v, currency) : '••••••');

  return (
    <section className="px-4" aria-labelledby="balance-check-heading">
      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          sufficient
            ? 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-800'
            : 'bg-[#DC2626]/5 border-[#DC2626]/20'
        }`}
      >
        <h2 id="balance-check-heading" className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">
          Available Balance Check
        </h2>
        <dl className="space-y-2 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[#667085]">Available Before Payment</dt>
            <dd className="font-medium tabular-nums">{mask(balanceBefore)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#667085]">Total Debit</dt>
            <dd className="font-medium tabular-nums">{formatPaymentCurrency(totalDebit, currency)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#667085]">Balance After Payment</dt>
            <dd className="font-semibold tabular-nums">{mask(balanceAfter)}</dd>
          </div>
        </dl>
        <p
          className={`mt-3 text-[13px] font-semibold ${sufficient ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}
          role="status"
        >
          {sufficient ? '✓ Sufficient Balance' : 'Insufficient Balance'}
        </p>
        {!sufficient && (
          <p className="text-[12px] text-[#667085] mt-1">
            Please reduce the payment amount or select another account.
          </p>
        )}
      </div>
    </section>
  );
};
