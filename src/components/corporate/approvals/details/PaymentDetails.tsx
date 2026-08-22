import React from 'react';
import type { CorporateApprovalDetail } from '../../../../types/corporateApprovalDetails';

interface PaymentDetailsProps {
  detail: CorporateApprovalDetail;
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 last:border-0">
    <dt className="text-[13px] text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="text-[13px] font-medium text-slate-900 dark:text-white text-right">{value}</dd>
  </div>
);

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ detail }) => {
  const pd = detail.paymentDetails;
  if (!pd) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-1">
        Payment Details
      </h2>
      <dl>
        <Row label="Payment Purpose" value={pd.purpose} />
        <Row label="Invoice Number" value={pd.invoiceNumber} />
        <Row label="Reference" value={pd.reference} />
        <Row label="Payment Method" value={pd.paymentMethod} />
        <Row label="Payment Date" value={pd.paymentDate} />
        <Row label="Schedule" value={pd.scheduled ? pd.scheduleLabel ?? 'Scheduled' : 'Immediate'} />
        {pd.scheduled && pd.scheduleLabel && (
          <Row label="Scheduled Date" value={pd.scheduleLabel} />
        )}
      </dl>
    </section>
  );
};
