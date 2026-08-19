import React from 'react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BatchSizeIndicatorProps {
  batch: BulkBatch;
}

export const BatchSizeIndicator: React.FC<BatchSizeIndicatorProps> = ({ batch }) => {
  const { maxBatchSize } = batch.limits;
  const current = batch.paymentCount;
  const remaining = maxBatchSize - current;
  const exceeded = current > maxBatchSize;

  return (
    <PayCard className={`p-4 ${exceeded ? 'border-rose-300' : ''}`}>
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Batch Size</h3>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-[#667085]">Current</dt>
          <dd className="font-semibold">{current} payments</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#667085]">Maximum</dt>
          <dd className="font-medium">{maxBatchSize} payments</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#667085]">Remaining</dt>
          <dd className={`font-semibold ${exceeded ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {Math.max(0, remaining)}
          </dd>
        </div>
      </dl>
      {exceeded && (
        <p className="mt-3 text-[13px] font-semibold text-[#DC2626]">Maximum batch size exceeded.</p>
      )}
    </PayCard>
  );
};
