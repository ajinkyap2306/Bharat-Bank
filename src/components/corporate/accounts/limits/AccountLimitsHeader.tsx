import React from 'react';
import { ChevronLeft, Info } from 'lucide-react';

interface AccountLimitsHeaderProps {
  accountLabel: string;
  onBack: () => void;
  onInfo: () => void;
}

export const AccountLimitsHeader: React.FC<AccountLimitsHeaderProps> = ({
  accountLabel,
  onBack,
  onInfo,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 px-4 py-3 safe-top">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Go back to account preferences"
        >
          <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white">
            Account Limits
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">{accountLabel}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onInfo}
        className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0"
        aria-label="About account limits"
      >
        <Info className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
      </button>
    </div>
  </header>
);
