import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SubmitErrorStateProps {
  onRetry: () => void;
  onReview: () => void;
}

export const SubmitErrorState: React.FC<SubmitErrorStateProps> = ({ onRetry, onReview }) => (
  <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center">
    <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-3" aria-hidden />
    <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">Unable to Submit Batch</h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">The batch was not submitted. Please try again.</p>
    <div className="flex gap-2 mt-5">
      <button
        type="button"
        onClick={onReview}
        className="flex-1 py-3 rounded-2xl border font-semibold text-sm min-h-11"
      >
        Review Batch
      </button>
      <button
        type="button"
        onClick={onRetry}
        className="flex-1 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11"
      >
        Try Again
      </button>
    </div>
  </div>
);
