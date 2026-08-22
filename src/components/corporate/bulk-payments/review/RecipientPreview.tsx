import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface RecipientPreviewProps {
  data: BulkBatchReview;
  onViewAll: () => void;
}

export const RecipientPreview: React.FC<RecipientPreviewProps> = ({ data, onViewAll }) => (
  <PayCard className="p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">Recipients</h3>
      <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">{data.recipientCount} beneficiaries</span>
    </div>
    <ul className="space-y-3">
      {data.recipients.map((r) => (
        <li key={r.beneficiary} className="flex justify-between gap-3">
          <span className="text-[14px] font-medium text-slate-900 dark:text-white truncate">
            {r.beneficiary}
          </span>
          <span className="text-[14px] font-bold tabular-nums shrink-0">
            {formatPaymentCurrency(r.amount)}
          </span>
        </li>
      ))}
    </ul>
    <button
      type="button"
      onClick={onViewAll}
      className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-semibold min-h-11"
    >
      View All Payments
    </button>
  </PayCard>
);
