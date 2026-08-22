import React from 'react';

interface ResultAlreadyProcessedProps {
  currentStatus?: string;
  onRefresh: () => void;
  onBack: () => void;
}

export const ResultAlreadyProcessed: React.FC<ResultAlreadyProcessedProps> = ({
  currentStatus = 'Approved',
  onRefresh,
  onBack,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
    <p className="text-[13px] text-slate-500 dark:text-slate-400">
      This request was already approved, rejected or returned by another authorized user.
    </p>
    <div className="mt-3 flex justify-between gap-3 text-[13px]">
      <span className="text-slate-500 dark:text-slate-400">Current Status</span>
      <span className="font-semibold text-slate-900 dark:text-white">{currentStatus}</span>
    </div>
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onRefresh}
        className="flex-1 py-3 rounded-xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11"
      >
        Refresh Status
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[14px] font-semibold min-h-11"
      >
        Back to Approvals
      </button>
    </div>
  </section>
);
