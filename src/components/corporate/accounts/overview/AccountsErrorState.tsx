import React from 'react';

interface AccountsErrorStateProps {
  onRetry: () => void;
}

export const AccountsErrorState: React.FC<AccountsErrorStateProps> = ({ onRetry }) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
    <p className="text-base font-semibold text-slate-900 dark:text-white">Unable to load accounts</p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 px-5 py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
    >
      Retry
    </button>
  </div>
);
