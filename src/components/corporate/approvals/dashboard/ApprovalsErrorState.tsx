import React from 'react';

interface ApprovalsErrorStateProps {
  onRetry: () => void;
}

export const ApprovalsErrorState: React.FC<ApprovalsErrorStateProps> = ({ onRetry }) => (
  <div className="mx-4 py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800">
    <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white">
      Unable to load approvals
    </h3>
    <p className="text-[13px] text-[#667085] mt-1">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 px-6 py-3 rounded-xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
    >
      Retry
    </button>
  </div>
);
