import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { PaymentBeneficiaryInfo } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface BeneficiaryCardProps {
  beneficiary: PaymentBeneficiaryInfo;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ beneficiary }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Paid To</h3>
    <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{beneficiary.name}</p>
    <dl className="mt-3 space-y-2">
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Account</dt>
        <dd className="font-medium text-[#111827] dark:text-white font-mono">{beneficiary.maskedAccount}</dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-[#667085]">Bank</dt>
        <dd className="font-medium text-[#111827] dark:text-white">{beneficiary.bankName}</dd>
      </div>
      <div className="flex justify-between text-[13px] items-center">
        <dt className="text-[#667085]">Beneficiary Status</dt>
        <dd className="flex items-center gap-1 font-medium text-[#16A34A]">
          {beneficiary.verified && (
            <>
              <CheckCircle className="w-3.5 h-3.5" aria-hidden />
              <span>Verified</span>
            </>
          )}
        </dd>
      </div>
    </dl>
  </PayCard>
);
