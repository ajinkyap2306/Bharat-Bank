import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface BulkPaymentsHeaderProps {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  onMore?: () => void;
  showMore?: boolean;
}

export const BulkPaymentsHeader: React.FC<BulkPaymentsHeaderProps> = ({
  title = 'Bulk Payments',
  subtitle,
  onBack,
  onMore,
  showMore = true,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14 max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>
      <div className="flex-1 min-w-0 text-center">
        <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>}
      </div>
      {showMore && onMore ? (
        <button
          type="button"
          onClick={onMore}
          className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" aria-hidden />
        </button>
      ) : (
        <div className="w-11 shrink-0" aria-hidden />
      )}
    </div>
  </header>
);
