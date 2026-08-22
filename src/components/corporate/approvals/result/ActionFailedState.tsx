import React from 'react';

interface ActionFailedStateProps {
  onRetry: () => void;
  onBack: () => void;
}

export const ActionFailedState: React.FC<ActionFailedStateProps> = ({ onRetry, onBack }) => (
  <section className="mx-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-4">
    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
      Unable to complete action
    </h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">
      The request was not updated. Please try again.
    </p>
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onRetry}
        className="flex-1 py-3 rounded-xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11"
      >
        Try Again
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[14px] font-semibold min-h-11"
      >
        Back to Approval
      </button>
    </div>
  </section>
);
