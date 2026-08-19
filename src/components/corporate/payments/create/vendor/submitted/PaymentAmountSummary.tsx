import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';

interface PaymentAmountSummaryProps {
  data: VendorPaymentSubmissionData;
}

export const PaymentAmountSummary: React.FC<PaymentAmountSummaryProps> = ({ data }) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 text-center"
    aria-labelledby="submitted-amount-heading"
  >
    <p
      id="submitted-amount-heading"
      className="text-[32px] font-bold text-[#111827] dark:text-white tabular-nums leading-tight"
      aria-label={`Amount ${data.amount.toLocaleString('en-IN')} rupees`}
    >
      {formatPaymentCurrency(data.amount, data.currency)}
    </p>
    <p className="text-[14px] text-[#667085] mt-1">Vendor Payment</p>
    <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-0.5">
      {data.beneficiary.name}
    </p>
    <div className="mt-3 flex justify-center">
      <PaymentStatusBadge status={data.status} />
    </div>
  </section>
);
