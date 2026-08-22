import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface PaymentBreakdownProps {
  data: BulkBatchReview;
}

export const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Payment Breakdown</h3>
    <ul className="space-y-3">
      {data.categories.map((cat) => (
        <li
          key={cat.label}
          className="flex justify-between items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
        >
          <div>
            <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{cat.label}</p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.count} payments</p>
          </div>
          <p className="text-[14px] font-bold tabular-nums">{formatPaymentCurrency(cat.amount)}</p>
        </li>
      ))}
    </ul>
  </PayCard>
);
