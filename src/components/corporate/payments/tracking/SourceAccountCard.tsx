import React from 'react';
import type { CorporatePaymentStatus, PaymentSourceAccountInfo } from '../../../../types/corporatePaymentTracking';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface SourceAccountCardProps {
  account: PaymentSourceAccountInfo;
  status: CorporatePaymentStatus;
  hideAmounts: boolean;
  currency: string;
}

export const SourceAccountCard: React.FC<SourceAccountCardProps> = ({
  account,
  status,
  hideAmounts,
  currency,
}) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Paid From</h3>
    <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{account.name}</p>
    <p className="text-[13px] text-[#667085] font-mono mt-0.5">{account.maskedNumber}</p>
    <dl className="mt-3 space-y-2">
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Company</dt>
        <dd className="font-medium text-[#111827] dark:text-white text-right max-w-[60%]">
          {account.companyName}
        </dd>
      </div>
      {['completed', 'processing'].includes(status) && account.balanceAfter !== undefined && (
        <div className="flex justify-between text-[13px] pt-2 border-t border-[#E4E7EC] dark:border-slate-800">
          <dt className="text-[#667085]">Balance After Payment</dt>
          <dd className="font-semibold text-[#111827] dark:text-white">
            {hideAmounts ? '••••••' : formatPaymentCurrency(account.balanceAfter, currency)}
          </dd>
        </div>
      )}
    </dl>
  </PayCard>
);
