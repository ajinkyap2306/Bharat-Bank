import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { VendorBeneficiary } from '../../../../../../types/corporateVendorBeneficiarySelection';
import { getBeneficiaryInitials } from '../../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from '../BeneficiaryStatusBadge';

interface SelectedBeneficiaryCardProps {
  beneficiary: VendorBeneficiary;
  onChange: () => void;
}

export const SelectedBeneficiaryCard: React.FC<SelectedBeneficiaryCardProps> = ({
  beneficiary,
  onChange,
}) => {
  const initials = getBeneficiaryInitials(beneficiary.name);

  return (
    <section className="px-4" aria-label="Selected beneficiary">
      <button
        type="button"
        onClick={onChange}
        className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-sm min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 shrink-0 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-bold"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Pay To
              </p>
              <p className="text-[15px] font-semibold text-slate-900 dark:text-white mt-1 truncate">
                {beneficiary.name}
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">
                {beneficiary.maskedAccountNumber}
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{beneficiary.bankName}</p>
              <div className="mt-2">
                <BeneficiaryStatusBadge status={beneficiary.status} compact />
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
        </div>
      </button>
    </section>
  );
};
