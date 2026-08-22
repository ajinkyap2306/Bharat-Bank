import React from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

interface ScheduledPaymentsHeaderProps {
  title?: string;
  onBack: () => void;
  onCreate?: () => void;
}

export const ScheduledPaymentsHeader: React.FC<ScheduledPaymentsHeaderProps> = ({
  title = 'Scheduled Payments',
  onBack,
  onCreate,
}) => (
  <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center gap-1 max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl shrink-0"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
      </button>
      <h1 className="text-[17px] font-bold text-slate-900 dark:text-white flex-1 truncate">{title}</h1>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-congress-blue-700 text-white shrink-0"
          aria-label="Create scheduled payment"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  </header>
);
