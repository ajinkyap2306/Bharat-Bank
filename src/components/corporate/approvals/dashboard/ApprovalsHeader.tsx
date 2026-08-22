import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface ApprovalsHeaderProps {
  onSearch: () => void;
  onFilter: () => void;
  filterCount?: number;
}

export const ApprovalsHeader: React.FC<ApprovalsHeaderProps> = ({
  onSearch,
  onFilter,
  filterCount = 0,
}) => (
  <header className="px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center justify-between gap-3 max-w-[430px] mx-auto">
      <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Approvals</h1>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onSearch}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs"
          aria-label="Search approvals"
        >
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
        <button
          type="button"
          onClick={onFilter}
          className="relative w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs"
          aria-label={filterCount ? `Filter approvals, ${filterCount} active` : 'Filter approvals'}
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-congress-blue-700 text-white text-[9px] font-bold flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);
