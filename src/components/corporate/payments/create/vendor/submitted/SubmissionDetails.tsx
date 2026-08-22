import React from 'react';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';

interface SubmissionDetailsProps {
  data: VendorPaymentSubmissionData;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 last:border-0">
    <dt className="text-[13px] text-slate-500 dark:text-slate-400 shrink-0">{label}</dt>
    <dd className="text-[13px] font-medium text-slate-900 dark:text-white text-right">{value}</dd>
  </div>
);

export const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ data }) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
    aria-labelledby="submission-details-heading"
  >
    <h2 id="submission-details-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white mb-1">
      Submission Details
    </h2>
    <dl>
      <Row label="Submitted By" value={data.submittedBy} />
      <Row label="Role" value={data.submittedRole} />
      <Row label="Submitted" value={data.submittedAtDisplay} />
      <Row label="Status" value={<PaymentStatusBadge status={data.status} />} />
      <Row label="Reference" value={data.reference} />
    </dl>
  </section>
);
