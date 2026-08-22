import React from 'react';

interface ApprovalErrorStateProps {
  onRetry: () => void;
  onBack: () => void;
  message?: string;
}

export const ApprovalErrorState: React.FC<ApprovalErrorStateProps> = ({
  onRetry,
  onBack,
  message = 'Unable to load approval details.',
}) => (
  <div className="max-w-[430px] mx-auto px-4 py-12 text-center">
    <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
      {message}
    </h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">Please try again.</p>
    <div className="mt-8 space-y-2">
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
      >
        Retry
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold min-h-12"
      >
        Back to Approvals
      </button>
    </div>
  </div>
);
