import React from 'react';
import { ChevronLeft, Search } from 'lucide-react';

interface BeneficiarySelectionHeaderProps {
  onBack: () => void;
  onSearch: () => void;
  searchActive?: boolean;
}

export const BeneficiarySelectionHeader: React.FC<BeneficiarySelectionHeaderProps> = ({
  onBack,
  onSearch,
  searchActive = false,
}) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center text-[#111827] dark:text-white active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        aria-label="Go back to payment type selection"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white leading-tight">
          Select Beneficiary
        </h1>
        <p className="text-[13px] text-[#667085] mt-0.5">Vendor Payment</p>
      </div>

      <button
        type="button"
        onClick={onSearch}
        className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2 ${
          searchActive
            ? 'bg-[#0B5CAB]/10 border-[#0B5CAB] text-[#0B5CAB]'
            : 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-800 text-[#667085]'
        }`}
        aria-label="Search beneficiaries"
      >
        <Search className="w-5 h-5" aria-hidden />
      </button>
    </div>
  </header>
);
