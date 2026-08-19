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
        className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 text-left shadow-sm min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 shrink-0 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center text-[#0B5CAB] text-[13px] font-bold"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#667085] uppercase tracking-wide">
                Pay To
              </p>
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-1 truncate">
                {beneficiary.name}
              </p>
              <p className="text-[13px] text-[#667085] tabular-nums">
                {beneficiary.maskedAccountNumber}
              </p>
              <p className="text-[13px] text-[#667085] mt-0.5">{beneficiary.bankName}</p>
              <div className="mt-2">
                <BeneficiaryStatusBadge status={beneficiary.status} compact />
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#667085] shrink-0" aria-hidden />
        </div>
      </button>
    </section>
  );
};
