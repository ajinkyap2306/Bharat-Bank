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
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
      {message}
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">Please try again.</p>
    <div className="mt-8 space-y-2">
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-semibold min-h-12"
      >
        Retry
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full py-3.5 rounded-2xl border border-[#E4E7EC] text-[#667085] font-semibold min-h-12"
      >
        Back to Approvals
      </button>
    </div>
  </div>
);
