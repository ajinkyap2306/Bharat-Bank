import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BulkLimitCheckProps {
  data: BulkBatchReview;
}

export const BulkLimitCheck: React.FC<BulkLimitCheckProps> = ({ data }) => {
  const exceeded = data.dailyRemaining < 0;

  return (
    <PayCard className={`p-4 ${exceeded ? 'border-rose-300' : ''}`}>
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Limit Check</h3>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Daily Bulk Payment Limit</dt>
          <dd className="font-medium">{formatPaymentCurrency(data.dailyLimit)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Used Today</dt>
          <dd className="font-medium">{formatPaymentCurrency(data.dailyUsed)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">This Batch</dt>
          <dd className="font-semibold">{formatPaymentCurrency(data.totalAmount)}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">Remaining After</dt>
          <dd className={`font-bold ${exceeded ? 'text-[#DC2626]' : ''}`}>
            {formatPaymentCurrency(Math.max(0, data.dailyRemaining))}
          </dd>
        </div>
      </dl>
      <div className="flex items-center gap-2 mt-3 text-[13px] font-semibold">
        {exceeded ? (
          <>
            <XCircle className="w-4 h-4 text-[#DC2626]" aria-hidden />
            <span className="text-[#DC2626]">Bulk payment limit exceeded</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="text-emerald-600 dark:text-emerald-400">Within Limit</span>
          </>
        )}
      </div>
    </PayCard>
  );
};
