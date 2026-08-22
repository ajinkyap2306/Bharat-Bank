import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface PaymentInformationProps {
  data: CorporatePaymentTrackingData;
}

export const PaymentInformation: React.FC<PaymentInformationProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">
      Payment Information
    </h3>
    <dl className="space-y-2.5">
      {[
        { label: 'Purpose', value: data.purpose },
        { label: 'Invoice', value: data.invoiceNumber },
        { label: 'Reference', value: data.reference },
        { label: 'Payment Method', value: data.paymentMethod },
        { label: 'Payment Date', value: data.paymentDate },
        { label: 'Channel', value: data.channel },
      ].map((row) => (
        <div key={row.label} className="flex justify-between gap-4 text-[13px]">
          <dt className="text-slate-500 dark:text-slate-400 shrink-0">{row.label}</dt>
          <dd className="font-medium text-slate-900 dark:text-white text-right">{row.value}</dd>
        </div>
      ))}
    </dl>
  </PayCard>
);
