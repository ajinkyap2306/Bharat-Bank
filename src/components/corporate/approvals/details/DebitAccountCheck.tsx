import React from 'react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { ApprovalSourceAccount } from '../../../../types/corporateApprovalDetails';

interface DebitAccountCheckProps {
  account: ApprovalSourceAccount;
  totalDebit?: number;
  hideAmounts?: boolean;
  currency?: string;
}

export const DebitAccountCheck: React.FC<DebitAccountCheckProps> = ({
  account,
  totalDebit,
  hideAmounts = false,
  currency = '₹',
}) => {
  const mask = (v: number) =>
    hideAmounts ? '₹••••••' : formatPaymentCurrency(v, currency);

  return (
    <section
      className={`mx-4 rounded-2xl border p-4 ${
        account.sufficientBalance
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
      }`}
      aria-labelledby="debit-account-heading"
    >
      <h2 id="debit-account-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Debit Account
      </h2>
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white mt-2">
        {account.name}
      </p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400">{account.maskedNumber}</p>
      <dl className="mt-3 space-y-2 text-[13px]">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Available Balance</dt>
          <dd className="font-medium tabular-nums">{mask(account.availableBalance)}</dd>
        </div>
        {totalDebit !== undefined && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Balance After Payment</dt>
            <dd className="font-semibold tabular-nums">{mask(account.balanceAfter)}</dd>
          </div>
        )}
      </dl>
      <p
        className={`mt-3 text-[13px] font-semibold ${
          account.sufficientBalance ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'
        }`}
        role="status"
      >
        {account.sufficientBalance ? '✓ Sufficient Balance' : 'Insufficient Balance'}
      </p>
    </section>
  );
};
