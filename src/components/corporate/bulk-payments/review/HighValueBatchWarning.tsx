import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface HighValueBatchWarningProps {
  data: BulkBatchReview;
}

export const HighValueBatchWarning: React.FC<HighValueBatchWarningProps> = ({ data }) => {
  if (!data.isHighValue) return null;

  return (
    <PayCard className="p-4 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" aria-hidden />
        <div>
          <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">High-value batch</h3>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
            Additional approval may be required based on your corporate authorization policy. Batch total:{' '}
            {formatPaymentCurrency(data.totalAmount)}.
          </p>
        </div>
      </div>
    </PayCard>
  );
};
