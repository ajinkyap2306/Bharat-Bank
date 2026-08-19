import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';
import { formatSubmissionDisplayDate } from '../../../../../../data/corporateVendorPaymentSubmissionMock';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';

interface PaymentSummaryProps {
  data: VendorPaymentSubmissionData;
}

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#E4E7EC]/80 dark:border-slate-800 last:border-0">
    <dt className="text-[13px] text-[#667085] shrink-0">{label}</dt>
    <dd
      className={`text-[13px] text-right text-[#111827] dark:text-white ${
        bold ? 'font-semibold' : 'font-medium'
      }`}
    >
      {value}
    </dd>
  </div>
);

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ data }) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4"
    aria-labelledby="payment-summary-heading"
  >
    <h2 id="payment-summary-heading" className="text-[14px] font-semibold text-[#111827] dark:text-white mb-1">
      Payment Summary
    </h2>
    <dl>
      <Row label="Pay To" value={data.beneficiary.name} />
      <Row label="Account" value={data.beneficiary.maskedAccount} />
      <Row label="Bank" value={data.beneficiary.bankName} />
      <Row label="Pay From" value={data.sourceAccount.name} />
      <Row label="" value={data.sourceAccount.maskedNumber} />
      <Row label="Amount" value={formatPaymentCurrency(data.amount, data.currency)} />
      <Row label="Fee" value={formatPaymentCurrency(data.fee, data.currency)} />
      <Row
        label="Total Debit"
        value={formatPaymentCurrency(data.totalDebit, data.currency)}
        bold
      />
      <Row label="Payment Method" value={data.paymentMethod.toUpperCase()} />
      <Row label="Payment Date" value={formatSubmissionDisplayDate(data.paymentDate)} />
    </dl>
  </section>
);
