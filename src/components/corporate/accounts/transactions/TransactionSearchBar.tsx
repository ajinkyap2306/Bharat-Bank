import React from 'react';
import { Filter, Search } from 'lucide-react';

interface TransactionSearchBarProps {
  query: string;
  onChange: (query: string) => void;
  onFilter: () => void;
  activeFilterCount: number;
  visible: boolean;
}

export const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({
  query,
  onChange,
  onFilter,
  activeFilterCount,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="px-4 flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search transactions"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-11"
          aria-label="Search transactions"
        />
      </div>
      <button
        type="button"
        onClick={onFilter}
        className="shrink-0 px-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 min-h-11 text-[13px] font-semibold text-[#667085]"
        aria-label={`Filter transactions${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
      >
        <Filter className="w-4 h-4" />
        Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
      </button>
    </div>
  );
};
