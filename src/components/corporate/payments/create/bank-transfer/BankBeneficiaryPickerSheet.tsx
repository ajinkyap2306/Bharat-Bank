import React from 'react';
import { BottomSheet } from '../../../../common/BottomSheet';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { getBeneficiaryInitials } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from '../vendor/BeneficiaryStatusBadge';

interface BankBeneficiaryPickerSheetProps {
  isOpen: boolean;
  beneficiaries: VendorBeneficiary[];
  selectedId: string;
  onClose: () => void;
  onSelect: (beneficiaryId: string) => void;
}

export const BankBeneficiaryPickerSheet: React.FC<BankBeneficiaryPickerSheetProps> = ({
  isOpen,
  beneficiaries,
  selectedId,
  onClose,
  onSelect,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Beneficiary">
    <div className="space-y-2 pb-2 max-h-[60vh] overflow-y-auto">
      {beneficiaries.map((beneficiary) => {
        const selected = beneficiary.id === selectedId;
        return (
          <button
            key={beneficiary.id}
            type="button"
            onClick={() => onSelect(beneficiary.id)}
            className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left min-h-14 ${
              selected
                ? 'border-congress-blue-700 bg-congress-blue-700/5'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <div
              className="w-11 h-11 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-bold shrink-0"
              aria-hidden
            >
              {getBeneficiaryInitials(beneficiary.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-slate-900 dark:text-white">
                {beneficiary.name}
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">{beneficiary.maskedAccountNumber}</p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">{beneficiary.bankName}</p>
              <div className="mt-1.5">
                <BeneficiaryStatusBadge status={beneficiary.status} compact />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </BottomSheet>
);
