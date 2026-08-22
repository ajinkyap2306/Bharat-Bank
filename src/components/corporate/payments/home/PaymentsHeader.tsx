import React from 'react';
import { History, Search } from 'lucide-react';

interface PaymentsHeaderProps {
  onSearch: () => void;
  onHistory: () => void;
}

export const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({ onSearch, onHistory }) => (
  <header className="px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Payments</h1>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onSearch}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs"
          aria-label="Search payments"
        >
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
        <button
          type="button"
          onClick={onHistory}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs"
          aria-label="Payment history"
        >
          <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  </header>
);
