import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface SubmissionSuccessHeaderProps {
  onBack: () => void;
  onMore: () => void;
}

export const SubmissionSuccessHeader: React.FC<SubmissionSuccessHeaderProps> = ({
  onBack,
  onMore,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14 max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
        aria-label="Back to payments"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>
      <h1 className="flex-1 text-[17px] font-semibold text-slate-900 dark:text-white text-center pr-11">
        Payment Submitted
      </h1>
      <button
        type="button"
        onClick={onMore}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5" aria-hidden />
      </button>
    </div>
  </header>
);
