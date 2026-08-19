import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface TransactionDetailsHeaderProps {
  onBack: () => void;
  onMore: () => void;
}

export const TransactionDetailsHeader: React.FC<TransactionDetailsHeaderProps> = ({
  onBack,
  onMore,
}) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC]/80 dark:border-slate-800 px-4 py-3 safe-top">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl shrink-0"
          aria-label="Go back to transactions"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827] dark:text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white">
          Transaction Details
        </h1>
      </div>
      <button
        type="button"
        onClick={onMore}
        className="w-11 h-11 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0"
        aria-label="More options"
      >
        <MoreVertical className="w-4.5 h-4.5 text-[#667085]" />
      </button>
    </div>
  </header>
);

export const TransactionDetailsSkeleton: React.FC = () => (
  <div className="space-y-4 pt-2 pb-6">
    <div className="mx-4 h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-40 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
  </div>
);

export const TransactionDetailsError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
    <p className="text-base font-semibold text-[#111827] dark:text-white">
      Unable to load transaction
    </p>
    <p className="text-[13px] text-[#667085] mt-1.5">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 px-5 py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
    >
      Retry
    </button>
  </div>
);
