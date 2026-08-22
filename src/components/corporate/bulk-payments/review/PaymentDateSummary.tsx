import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface PaymentDateSummaryProps {
  data: BulkBatchReview;
}

export const PaymentDateSummary: React.FC<PaymentDateSummaryProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Execution Date</h3>
    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{data.paymentDate}</p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
      {data.paymentDateLabel === 'Today'
        ? 'Scheduled for processing today'
        : data.paymentDateLabel === 'Scheduled'
          ? 'Scheduled'
          : 'Scheduled for processing'}
    </p>
  </PayCard>
);
