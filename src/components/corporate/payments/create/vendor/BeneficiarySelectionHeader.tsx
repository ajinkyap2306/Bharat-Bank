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
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
        aria-label="Go back to payment type selection"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white leading-tight">
          Select Beneficiary
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Vendor Payment</p>
      </div>

      <button
        type="button"
        onClick={onSearch}
        className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2 ${
          searchActive
            ? 'bg-congress-blue-50 dark:bg-congress-blue-950/40 border-congress-blue-700 text-congress-blue-700 dark:text-congress-blue-400'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
        }`}
        aria-label="Search beneficiaries"
      >
        <Search className="w-5 h-5" aria-hidden />
      </button>
    </div>
  </header>
);
