import React from 'react';

export const AccountDetailsError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
    <p className="text-base font-semibold text-[#111827] dark:text-white">Unable to load account</p>
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

export const AccountDetailsSkeleton: React.FC = () => (
  <div className="space-y-4 pb-6">
    <div className="mx-4 h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-20 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-52 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
    <div className="mx-4 h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
  </div>
);
