import React from 'react';
import { Search } from 'lucide-react';

interface AccountsHeaderProps {
  onSearch: () => void;
}

export const AccountsHeader: React.FC<AccountsHeaderProps> = ({ onSearch }) => (
  <header className="px-4 pt-2 pb-1 safe-top">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-lg font-bold text-[#111827] dark:text-white tracking-tight">Accounts</h1>
      <button
        type="button"
        onClick={onSearch}
        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs shrink-0"
        aria-label="Search accounts"
      >
        <Search className="w-4 h-4 text-[#667085]" />
      </button>
    </div>
  </header>
);
