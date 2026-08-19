import React from 'react';
import { BottomSheet } from '../../../../common/BottomSheet';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { getBeneficiaryInitials } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from './BeneficiaryStatusBadge';

interface SelectBeneficiarySheetProps {
  isOpen: boolean;
  beneficiary: VendorBeneficiary | null;
  onClose: () => void;
  onContinue: () => void;
}

export const SelectBeneficiarySheet: React.FC<SelectBeneficiarySheetProps> = ({
  isOpen,
  beneficiary,
  onClose,
  onContinue,
}) => {
  if (!beneficiary) return null;

  const initials = getBeneficiaryInitials(beneficiary.name);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Beneficiary?">
      <div className="pb-2">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F9FC] dark:bg-slate-800/50 border border-[#E4E7EC] dark:border-slate-800">
          <div
            className="w-12 h-12 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center text-[#0B5CAB] text-[14px] font-bold shrink-0"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-[#111827] dark:text-white">
              {beneficiary.name}
            </p>
            <p className="text-[13px] text-[#667085] tabular-nums mt-1">
              {beneficiary.maskedAccountNumber}
            </p>
            <p className="text-[13px] text-[#667085] mt-0.5">{beneficiary.bankName}</p>
            <div className="mt-2">
              <BeneficiaryStatusBadge status={beneficiary.status} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 text-[14px] font-semibold text-[#667085] min-h-11"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
          >
            Continue
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
