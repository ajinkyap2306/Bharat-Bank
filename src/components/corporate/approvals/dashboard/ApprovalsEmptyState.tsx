import React from 'react';
import { CircleCheck, SearchX } from 'lucide-react';

interface ApprovalsEmptyStateProps {
  variant: 'no_pending' | 'no_results';
  onClearFilters?: () => void;
}

export const ApprovalsEmptyState: React.FC<ApprovalsEmptyStateProps> = ({
  variant,
  onClearFilters,
}) => {
  if (variant === 'no_results') {
    return (
      <div className="mx-4 py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <SearchX className="w-10 h-10 text-slate-500 dark:text-slate-400 mx-auto" aria-hidden />
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mt-3">
          No approvals found
        </h3>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 px-6">
          Try changing your search or filters.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 text-[14px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-4"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-4 py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <CircleCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" aria-hidden />
      <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mt-3">
        You&apos;re all caught up
      </h3>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 px-6">
        There are no requests waiting for your approval.
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3">Last checked just now</p>
    </div>
  );
};
