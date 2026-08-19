import React from 'react';
import { Search } from 'lucide-react';

interface StatementSearchProps {
  query: string;
  onChange: (q: string) => void;
  onFilter: () => void;
}

export const StatementSearch: React.FC<StatementSearchProps> = ({ query, onChange, onFilter }) => (
  <div className="px-4 flex gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search statement transactions"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-11"
        aria-label="Search statement"
      />
    </div>
    <button
      type="button"
      onClick={onFilter}
      className="shrink-0 px-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[13px] font-semibold text-[#667085] min-h-11"
    >
      Filter
    </button>
  </div>
);
