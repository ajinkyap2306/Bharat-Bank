import React from 'react';
import type { CorporateScheduledPaymentDetail } from '../../../../types/corporateScheduledPayments';
import { formatPaymentCurrency, PayCard } from '../shared/CorporatePaymentsUI';
import { CopyField } from '../tracking/CopyField';

interface ScheduledPaymentSummaryProps {
  data: CorporateScheduledPaymentDetail;
  hideAmounts: boolean;
  onCopy: (value: string) => void;
}

export const ScheduledPaymentSummary: React.FC<ScheduledPaymentSummaryProps> = ({
  data,
  hideAmounts,
  onCopy,
}) => (
  <>
    <PayCard className="p-4">
      <CopyField label="Schedule ID" value={data.scheduleRef} onCopy={onCopy} />
      {data.linkedPaymentId && (
        <CopyField label="Payment ID" value={data.linkedPaymentId} onCopy={onCopy} />
      )}
    </PayCard>

    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Amount Summary</h3>
      <dl className="space-y-2.5">
        <div className="flex justify-between text-[13px]">
          <dt className="text-[#667085]">Amount</dt>
          <dd className="font-semibold text-[#111827] dark:text-white">
            {hideAmounts ? `${data.currency}••••••` : formatPaymentCurrency(data.amount, data.currency)}
          </dd>
        </div>
        <div className="flex justify-between text-[13px]">
          <dt className="text-[#667085]">Transaction Fee</dt>
          <dd className="font-medium text-[#111827] dark:text-white">
            {hideAmounts ? `${data.currency}••••••` : formatPaymentCurrency(data.fee, data.currency)}
          </dd>
        </div>
        <div className="flex justify-between text-[13px] pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
          <dt className="text-[#667085] font-medium">Total Debit</dt>
          <dd className="font-bold text-[#111827] dark:text-white">
            {hideAmounts
              ? `${data.currency}••••••`
              : formatPaymentCurrency(data.totalDebit, data.currency)}
          </dd>
        </div>
      </dl>
    </PayCard>
  </>
);
