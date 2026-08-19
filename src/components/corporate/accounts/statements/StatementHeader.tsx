import React from 'react';
import { ChevronLeft, Filter, RefreshCw } from 'lucide-react';

interface StatementHeaderProps {
  accountLabel: string;
  lastUpdated?: string;
  onBack: () => void;
  onAccountSelect: () => void;
}

export const StatementHeader: React.FC<StatementHeaderProps> = ({
  accountLabel,
  lastUpdated,
  onBack,
  onAccountSelect,
}) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC]/80 dark:border-slate-800 px-4 py-3 safe-top">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827] dark:text-white" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white">Statements</h1>
          <p className="text-[13px] text-[#667085] truncate">{accountLabel}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAccountSelect}
        className="w-11 h-11 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0"
        aria-label="Select account"
      >
        <Filter className="w-4.5 h-4.5 text-[#667085]" />
      </button>
    </div>
    {lastUpdated && (
      <p className="text-[11px] text-[#667085] mt-2 ml-9 flex items-center gap-1">
        <RefreshCw className="w-3 h-3" aria-hidden />
        {lastUpdated}
      </p>
    )}
  </header>
);
