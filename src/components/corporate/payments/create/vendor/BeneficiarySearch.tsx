import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface BeneficiarySearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilter: () => void;
  activeFilterCount: number;
  isSearching?: boolean;
  autoFocus?: boolean;
}

export const BeneficiarySearch: React.FC<BeneficiarySearchProps> = ({
  value,
  onChange,
  onFilter,
  activeFilterCount,
  isSearching = false,
  autoFocus = false,
}) => (
  <section className="px-4" aria-label="Search beneficiaries">
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search beneficiary"
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
          aria-label="Search beneficiary by name, account, bank, nickname or ID"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <div
            className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-congress-blue-700 border-t-transparent rounded-full animate-spin motion-reduce:animate-none"
            aria-hidden
          />
        )}
      </div>

      <button
        type="button"
        onClick={onFilter}
        className="relative w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
        aria-label={`Filter beneficiaries${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
      >
        <SlidersHorizontal className="w-4 h-4" aria-hidden />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-congress-blue-700 text-white text-[10px] font-bold flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  </section>
);
