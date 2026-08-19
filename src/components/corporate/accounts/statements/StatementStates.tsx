import React from 'react';
import { FileText } from 'lucide-react';

export const StatementSkeleton: React.FC = () => (
  <div className="space-y-4 px-4 pt-2 pb-32">
    <div className="h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="h-44 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="h-16 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
  </div>
);

interface StatementEmptyStateProps {
  onChangePeriod: () => void;
  onBack: () => void;
}

export const StatementEmptyState: React.FC<StatementEmptyStateProps> = ({
  onChangePeriod,
  onBack,
}) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mx-auto mb-3">
      <FileText className="w-7 h-7 text-[#0B5CAB]" aria-hidden />
    </div>
    <p className="text-base font-semibold text-[#111827] dark:text-white">No transactions</p>
    <p className="text-[13px] text-[#667085] mt-1.5 leading-relaxed">
      There are no transactions for the selected statement period.
    </p>
    <div className="flex flex-col gap-2 mt-4">
      <button
        type="button"
        onClick={onChangePeriod}
        className="py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
      >
        Change Period
      </button>
      <button
        type="button"
        onClick={onBack}
        className="py-3 text-sm font-semibold text-[#667085] min-h-11"
      >
        Back
      </button>
    </div>
  </div>
);

export const StatementErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
    <p className="text-base font-semibold text-[#111827] dark:text-white">Unable to generate statement</p>
    <p className="text-[13px] text-[#667085] mt-1.5">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 px-5 py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
    >
      Try Again
    </button>
  </div>
);
