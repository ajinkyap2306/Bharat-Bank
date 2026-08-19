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
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white">Recipients</h3>
      <span className="text-[12px] font-semibold text-[#667085]">{data.recipientCount} beneficiaries</span>
    </div>
    <ul className="space-y-3">
      {data.recipients.map((r) => (
        <li key={r.beneficiary} className="flex justify-between gap-3">
          <span className="text-[14px] font-medium text-[#111827] dark:text-white truncate">
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
      className="mt-4 w-full py-2.5 rounded-xl border border-[#E4E7EC] text-[#0B5CAB] text-[13px] font-semibold min-h-11"
    >
      View All Payments
    </button>
  </PayCard>
);
