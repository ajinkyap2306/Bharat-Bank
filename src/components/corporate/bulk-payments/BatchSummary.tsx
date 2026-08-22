import React from 'react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import type { BulkPaymentAccount } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency, PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BatchSummaryProps {
  batch: BulkBatch;
  account: BulkPaymentAccount;
  hideBalance: boolean;
}

export const BatchSummary: React.FC<BatchSummaryProps> = ({ batch, account, hideBalance }) => {
  const balanceAfter = account.availableBalance - batch.totalDebit;
  const insufficient = balanceAfter < 0;

  return (
    <PayCard className={`p-4 ${insufficient ? 'border-rose-300 dark:border-rose-900' : ''}`}>
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Batch Summary</h3>
      <dl className="space-y-2.5 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Total Payments</dt>
          <dd className="font-semibold">{batch.validCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Total Amount</dt>
          <dd className="font-bold">{formatPaymentCurrency(batch.totalAmount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Processing Fee</dt>
          <dd className="font-medium">{formatPaymentCurrency(batch.fee)}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <dt className="text-slate-500 dark:text-slate-400 font-medium">Total Debit</dt>
          <dd className="font-bold text-slate-900 dark:text-white">
            {formatPaymentCurrency(batch.totalDebit)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Available Balance</dt>
          <dd className="font-medium">
            {hideBalance ? '••••••' : formatPaymentCurrency(account.availableBalance, account.currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Balance After</dt>
          <dd className={`font-semibold ${insufficient ? 'text-[#DC2626]' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {hideBalance ? '••••••' : formatPaymentCurrency(Math.max(0, balanceAfter), account.currency)}
          </dd>
        </div>
      </dl>
      {insufficient && (
        <p className="mt-3 text-[13px] font-semibold text-[#DC2626]">Insufficient Balance</p>
      )}
    </PayCard>
  );
};
