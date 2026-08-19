import React from 'react';

interface AccountsErrorStateProps {
  onRetry: () => void;
}

export const AccountsErrorState: React.FC<AccountsErrorStateProps> = ({ onRetry }) => (
  <div className="mx-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
    <p className="text-base font-semibold text-[#111827] dark:text-white">Unable to load accounts</p>
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
