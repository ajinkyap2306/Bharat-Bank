import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface AccountDetailsHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onMore: () => void;
}

export const AccountDetailsHeader: React.FC<AccountDetailsHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onMore,
}) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Go back to accounts"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827] dark:text-white" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold text-[#111827] dark:text-white truncate">{title}</h1>
          {subtitle && <p className="text-[12px] text-[#667085] font-mono truncate">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onMore}
        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs"
        aria-label="More account options"
      >
        <MoreVertical className="w-4 h-4 text-[#667085]" />
      </button>
    </div>
  </header>
);
