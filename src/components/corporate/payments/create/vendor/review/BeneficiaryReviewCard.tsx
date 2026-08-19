import React from 'react';
import type { VendorBeneficiary } from '../../../../../../types/corporateVendorBeneficiarySelection';
import { getBeneficiaryInitials } from '../../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from '../BeneficiaryStatusBadge';
import { ReviewEditButton } from './ReviewEditButton';

interface BeneficiaryReviewCardProps {
  beneficiary: VendorBeneficiary;
  onEdit: () => void;
  disabled?: boolean;
}

export const BeneficiaryReviewCard: React.FC<BeneficiaryReviewCardProps> = ({
  beneficiary,
  onEdit,
  disabled,
}) => {
  const initials = getBeneficiaryInitials(beneficiary.name);

  return (
    <section className="px-4" aria-labelledby="review-pay-to-heading">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 id="review-pay-to-heading" className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide">
            Pay To
          </h2>
          <ReviewEditButton onClick={onEdit} disabled={disabled} />
        </div>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center text-[#0B5CAB] text-[13px] font-bold shrink-0"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-[#111827] dark:text-white">{beneficiary.name}</p>
            <p className="text-[13px] text-[#667085] tabular-nums mt-0.5">{beneficiary.maskedAccountNumber}</p>
            <p className="text-[13px] text-[#667085]">{beneficiary.bankName}</p>
            <div className="mt-2">
              <BeneficiaryStatusBadge status={beneficiary.status} compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
