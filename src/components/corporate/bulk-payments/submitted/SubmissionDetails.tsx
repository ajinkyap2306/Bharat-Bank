import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface SubmissionDetailsProps {
  data: BulkBatchTrackingData;
}

export const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Submission Details</h3>
    <dl className="space-y-2.5 text-[13px]">
      {[
        { label: 'Submitted By', value: data.submittedBy },
        { label: 'Role', value: data.submittedRole },
        { label: 'Submitted', value: data.submittedAt },
        {
          label: 'Source Account',
          value: `${data.sourceAccount.name} ${data.sourceAccount.maskedNumber}`,
        },
        { label: 'Payment Date', value: data.paymentDate },
      ].map((row) => (
        <div key={row.label} className="flex justify-between gap-4">
          <dt className="text-slate-500 dark:text-slate-400 shrink-0">{row.label}</dt>
          <dd className="font-medium text-slate-900 dark:text-white text-right">{row.value}</dd>
        </div>
      ))}
    </dl>
  </PayCard>
);
