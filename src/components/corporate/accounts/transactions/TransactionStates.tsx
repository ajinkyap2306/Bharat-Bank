import React from 'react';
import { ArrowLeftRight, Receipt } from 'lucide-react';

export const TransactionSkeleton: React.FC = () => (
  <div className="mx-4 space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    ))}
  </div>
);

interface TransactionEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const TransactionEmptyState: React.FC<TransactionEmptyStateProps> = ({
  hasFilters,
  onClearFilters,
}) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
    <div className="w-14 h-14 rounded-2xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center mx-auto mb-3">
      {hasFilters ? (
        <Receipt className="w-7 h-7 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
      ) : (
        <ArrowLeftRight className="w-7 h-7 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
      )}
    </div>
    <p className="text-base font-semibold text-slate-900 dark:text-white">No transactions found</p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
      {hasFilters
        ? 'There are no transactions matching your current filters.'
        : 'No transactions yet'}
    </p>
    {hasFilters && (
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-4 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-4"
      >
        Clear Filters
      </button>
    )}
  </div>
);

export const TransactionErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="mx-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
    <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
      Unable to load transactions
    </p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 px-5 py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
    >
      Retry
    </button>
  </div>
);
