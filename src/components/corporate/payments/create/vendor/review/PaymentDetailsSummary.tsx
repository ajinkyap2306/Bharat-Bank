import React from 'react';
import { formatPaymentDisplayDate } from '../../../../../../data/corporateVendorPaymentDetailsMock';
import { ReviewEditButton } from './ReviewEditButton';

interface PaymentDetailsSummaryProps {
  purposeLabel: string;
  invoiceNumber: string;
  reference: string;
  paymentMethod: string;
  paymentDate: string;
  scheduled: boolean;
  scheduleLabel: string;
  processingEstimate: string;
  onEdit: () => void;
  disabled?: boolean;
}

export const PaymentDetailsSummary: React.FC<PaymentDetailsSummaryProps> = ({
  purposeLabel,
  invoiceNumber,
  reference,
  paymentMethod,
  paymentDate,
  scheduled,
  scheduleLabel,
  processingEstimate,
  onEdit,
  disabled,
}) => {
  const rows = [
    { label: 'Purpose', value: purposeLabel },
    { label: 'Invoice', value: invoiceNumber },
    { label: 'Reference', value: reference },
    { label: 'Payment Method', value: paymentMethod },
    { label: 'Payment Date', value: formatPaymentDisplayDate(paymentDate) },
    { label: 'Schedule', value: scheduleLabel },
    ...(scheduled ? [{ label: 'Status', value: 'Scheduled' }] : []),
    { label: 'Estimated Processing', value: processingEstimate },
  ];

  return (
    <section className="px-4" aria-labelledby="payment-details-summary-heading">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 id="payment-details-summary-heading" className="text-[15px] font-semibold text-[#111827] dark:text-white">
            Payment Details
          </h2>
          <ReviewEditButton onClick={onEdit} disabled={disabled} />
        </div>
        <dl className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3 text-[13px]">
              <dt className="text-[#667085] shrink-0">{row.label}</dt>
              <dd className="text-right font-medium text-[#111827] dark:text-white">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] text-[#667085] mt-3 italic">Processing times are estimates only.</p>
      </div>
    </section>
  );
};
