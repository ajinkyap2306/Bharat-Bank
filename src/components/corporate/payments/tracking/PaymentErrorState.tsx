import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PaymentErrorStateProps {
  onRetry: () => void;
}

export const PaymentErrorState: React.FC<PaymentErrorStateProps> = ({ onRetry }) => (
  <div className="mx-4 mt-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
    <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-4" aria-hidden />
    <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">Unable to load payment</h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
    >
      <RefreshCw className="w-4 h-4" aria-hidden />
      Retry
    </button>
  </div>
);
