import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  subtitle,
  rightAction,
}) => {
  return (
    <div className="sticky top-0 z-20 -mx-4 px-4 py-2.5 safe-top bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h1>
        {subtitle && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
        )}
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
};
