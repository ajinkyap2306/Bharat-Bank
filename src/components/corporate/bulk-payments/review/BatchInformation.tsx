import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchInformationProps {
  data: BulkBatchReview;
  onEdit: () => void;
}

export const BatchInformation: React.FC<BatchInformationProps> = ({ data, onEdit }) => (
  <PayCard className="p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white">Batch Information</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-[13px] font-semibold text-[#0B5CAB] min-h-8 px-2"
      >
        Edit
      </button>
    </div>
    <dl className="space-y-2.5 text-[13px]">
      {[
        { label: 'Batch Name', value: data.name },
        { label: 'Batch Reference', value: data.reference, mono: true },
        { label: 'Payment Date', value: data.paymentDate },
        { label: 'Currency', value: data.currency },
        { label: 'Created By', value: data.createdBy },
        { label: 'Created', value: data.createdAt },
      ].map((row) => (
        <div key={row.label} className="flex justify-between gap-4">
          <dt className="text-[#667085] shrink-0">{row.label}</dt>
          <dd
            className={`font-medium text-[#111827] dark:text-white text-right ${
              row.mono ? 'font-mono' : ''
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  </PayCard>
);
