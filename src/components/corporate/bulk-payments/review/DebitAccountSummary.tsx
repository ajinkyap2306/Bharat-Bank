import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface DebitAccountSummaryProps {
  data: BulkBatchReview;
  hideBalance: boolean;
}

export const DebitAccountSummary: React.FC<DebitAccountSummaryProps> = ({ data, hideBalance }) => {
  const sufficient = data.balanceAfter >= 0;

  return (
    <PayCard className={`p-4 ${!sufficient ? 'border-rose-300' : ''}`}>
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Debit Account</h3>
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{data.account.name}</p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{data.account.maskedNumber}</p>
      <dl className="mt-3 space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Available Balance</dt>
          <dd className="font-medium">
            {hideBalance
              ? '••••••'
              : formatPaymentCurrency(data.balanceBefore, data.account.currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Total Debit</dt>
          <dd className="font-bold">{formatPaymentCurrency(data.totalDebit, data.account.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Balance After</dt>
          <dd className={`font-semibold ${sufficient ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'}`}>
            {hideBalance
              ? '••••••'
              : formatPaymentCurrency(Math.max(0, data.balanceAfter), data.account.currency)}
          </dd>
        </div>
      </dl>
      <div className="flex items-center gap-2 mt-3 text-[13px] font-semibold">
        {sufficient ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="text-emerald-600 dark:text-emerald-400">Sufficient Balance</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-[#DC2626]" aria-hidden />
            <span className="text-[#DC2626]">Insufficient Balance</span>
          </>
        )}
      </div>
    </PayCard>
  );
};
