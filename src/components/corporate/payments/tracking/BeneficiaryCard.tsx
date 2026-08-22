import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { PaymentBeneficiaryInfo } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface BeneficiaryCardProps {
  beneficiary: PaymentBeneficiaryInfo;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ beneficiary }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Paid To</h3>
    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{beneficiary.name}</p>
    <dl className="mt-3 space-y-2">
      <div className="flex justify-between text-[13px]">
        <dt className="text-slate-500 dark:text-slate-400">Account</dt>
        <dd className="font-medium text-slate-900 dark:text-white font-mono">{beneficiary.maskedAccount}</dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-slate-500 dark:text-slate-400">Bank</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{beneficiary.bankName}</dd>
      </div>
      <div className="flex justify-between text-[13px] items-center">
        <dt className="text-slate-500 dark:text-slate-400">Beneficiary Status</dt>
        <dd className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
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
