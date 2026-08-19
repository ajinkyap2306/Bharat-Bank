import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitPaymentButtonProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export const SubmitPaymentButton: React.FC<SubmitPaymentButtonProps> = ({
  label,
  disabled,
  loading,
  onClick,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
    <div className="max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[15px] font-semibold min-h-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden />}
        {loading ? 'Submitting...' : label}
      </button>
      {loading && (
        <p className="text-center text-[12px] text-[#667085] mt-2" role="status">
          Submitting payment...
        </p>
      )}
    </div>
  </div>
);
