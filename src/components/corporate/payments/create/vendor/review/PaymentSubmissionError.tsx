import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PaymentSubmissionErrorProps {
  onRetry: () => void;
  onReview: () => void;
}

export const PaymentSubmissionError: React.FC<PaymentSubmissionErrorProps> = ({
  onRetry,
  onReview,
}) => (
  <section className="px-4" role="alert" aria-labelledby="submission-error-title">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#DC2626]/30 p-5 text-center shadow-sm">
      <div className="w-12 h-12 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-[#DC2626]" aria-hidden />
      </div>
      <h2 id="submission-error-title" className="text-[16px] font-semibold text-[#111827] dark:text-white">
        Unable to submit payment
      </h2>
      <p className="text-[13px] text-[#667085] mt-2">
        The payment was not submitted. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
      >
        <RefreshCw className="w-4 h-4" aria-hidden />
        Try Again
      </button>
      <button
        type="button"
        onClick={onReview}
        className="mt-2 block w-full py-3 text-[14px] font-semibold text-[#667085] min-h-11"
      >
        Review Payment
      </button>
    </div>
  </section>
);
