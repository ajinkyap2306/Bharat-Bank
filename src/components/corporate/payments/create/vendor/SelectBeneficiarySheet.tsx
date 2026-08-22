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
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div
            className="w-12 h-12 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 text-[14px] font-bold shrink-0"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-slate-900 dark:text-white">
              {beneficiary.name}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums mt-1">
              {beneficiary.maskedAccountNumber}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{beneficiary.bankName}</p>
            <div className="mt-2">
              <BeneficiaryStatusBadge status={beneficiary.status} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-[14px] font-semibold text-slate-500 dark:text-slate-400 min-h-11"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11"
          >
            Continue
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
