import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchSizeCheckProps {
  data: BulkBatchReview;
}

export const BatchSizeCheck: React.FC<BatchSizeCheckProps> = ({ data }) => {
  const exceeded = data.paymentCount > data.maxBatchSize;

  return (
    <PayCard className={`p-4 ${exceeded ? 'border-rose-300' : ''}`}>
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Batch Size</h3>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Payments</dt>
          <dd className="font-semibold">{data.paymentCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Maximum</dt>
          <dd className="font-medium">{data.maxBatchSize}</dd>
        </div>
      </dl>
      <div className="flex items-center gap-2 mt-3 text-[13px] font-semibold">
        {exceeded ? (
          <>
            <XCircle className="w-4 h-4 text-[#DC2626]" aria-hidden />
            <span className="text-[#DC2626]">Batch exceeds maximum allowed payments.</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="text-emerald-600 dark:text-emerald-400">Within Batch Limit</span>
          </>
        )}
      </div>
    </PayCard>
  );
};
