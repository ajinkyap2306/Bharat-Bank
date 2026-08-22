import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface ApprovalDetailsHeaderProps {
  onBack: () => void;
  onMore: () => void;
}

export const ApprovalDetailsHeader: React.FC<ApprovalDetailsHeaderProps> = ({
  onBack,
  onMore,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center justify-between gap-2 max-w-[430px] mx-auto">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Back to approvals"
        >
          <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 dark:text-white">Approval Details</h1>
      </div>
      <button
        type="button"
        onClick={onMore}
        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs"
        aria-label="More options"
      >
        <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </button>
    </div>
  </header>
);
