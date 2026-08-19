import React from 'react';

interface ReviewPaymentButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const ReviewPaymentButton: React.FC<ReviewPaymentButtonProps> = ({
  disabled,
  onClick,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
    <div className="max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[15px] font-semibold min-h-12 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
      >
        Review Payment
      </button>
    </div>
  </div>
);
