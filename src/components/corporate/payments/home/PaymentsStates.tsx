import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PayHomeSkeleton } from './PaymentsHomeUI';

export const PaymentsSkeleton: React.FC = () => (
  <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading payments">
    <PayHomeSkeleton className="h-20" />
    <PayHomeSkeleton className="h-20" />
    <PayHomeSkeleton className="h-16" />
    <PayHomeSkeleton className="h-28" />
    <PayHomeSkeleton className="h-32" />
    <PayHomeSkeleton className="h-36" />
    <PayHomeSkeleton className="h-40" />
    <PayHomeSkeleton className="h-32" />
    <PayHomeSkeleton className="h-28" />
  </div>
);

interface PaymentsErrorStateProps {
  onRetry: () => void;
}

interface PaymentsEmptyStateProps {
  message: string;
}

export const PaymentsEmptyState: React.FC<PaymentsEmptyStateProps> = ({ message }) => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-6 text-center shadow-sm">
    <p className="text-[13px] text-[#667085]">{message}</p>
  </div>
);

export const PaymentsErrorState: React.FC<PaymentsErrorStateProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-[#DC2626]" aria-hidden />
    </div>
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
      Unable to load payments
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
    >
      <RefreshCw className="w-4 h-4" aria-hidden />
      Retry
    </button>
  </div>
);
