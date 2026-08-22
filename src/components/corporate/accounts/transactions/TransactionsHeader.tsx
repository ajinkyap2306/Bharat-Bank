import React from 'react';
import { ChevronLeft, MoreVertical, Search } from 'lucide-react';

interface TransactionsHeaderProps {
  accountLabel: string;
  onBack: () => void;
  onSearchToggle: () => void;
  onMore: () => void;
  showSearch: boolean;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  accountLabel,
  onBack,
  onSearchToggle,
  onMore,
  showSearch,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Go back to account details"
        >
          <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">{accountLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onSearchToggle}
          className={`w-11 h-11 rounded-xl border flex items-center justify-center ${
            showSearch
              ? 'border-congress-blue-700 bg-congress-blue-50 dark:bg-congress-blue-950/40'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
          aria-label="Search transactions"
          aria-pressed={showSearch}
        >
          <Search className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
        </button>
        <button
          type="button"
          onClick={onMore}
          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center"
          aria-label="More options"
        >
          <MoreVertical className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  </header>
);
