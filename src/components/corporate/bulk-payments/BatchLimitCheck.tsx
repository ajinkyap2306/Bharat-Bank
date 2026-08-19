import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency, PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BatchLimitCheckProps {
  batch: BulkBatch;
}

export const BatchLimitCheck: React.FC<BatchLimitCheckProps> = ({ batch }) => {
  const { dailyLimit, usedToday } = batch.limits;
  const remaining = dailyLimit - usedToday - batch.totalAmount;
  const exceeded = remaining < 0;

  return (
    <PayCard className={`p-4 ${exceeded ? 'border-rose-300' : ''}`}>
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Batch Limit</h3>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-[#667085]">Daily Bulk Payment Limit</dt>
          <dd className="font-medium">{formatPaymentCurrency(dailyLimit)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#667085]">Used Today</dt>
          <dd className="font-medium">{formatPaymentCurrency(usedToday)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#667085]">This Batch</dt>
          <dd className="font-semibold">{formatPaymentCurrency(batch.totalAmount)}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
          <dt className="text-[#667085]">Remaining After</dt>
          <dd className={`font-bold ${exceeded ? 'text-[#DC2626]' : 'text-[#111827] dark:text-white'}`}>
            {formatPaymentCurrency(Math.max(0, remaining))}
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
            <CheckCircle className="w-4 h-4 text-[#16A34A]" aria-hidden />
            <span className="text-[#16A34A]">Within Limit</span>
          </>
        )}
      </div>
    </PayCard>
  );
};
