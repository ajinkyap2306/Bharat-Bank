import React from 'react';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { LimitsSkeleton } from './LimitsUI';

export const LimitsScreenSkeleton: React.FC = () => (
  <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading account limits">
    <LimitsSkeleton className="h-32" />
    <LimitsSkeleton className="h-44" />
    <LimitsSkeleton className="h-28" />
    <LimitsSkeleton className="h-36" />
    <LimitsSkeleton className="h-40" />
    <LimitsSkeleton className="h-36" />
    <LimitsSkeleton className="h-32" />
  </div>
);

interface LimitsErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const LimitsErrorState: React.FC<LimitsErrorStateProps> = ({
  message = 'Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-[#DC2626]" aria-hidden />
    </div>
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
      Unable to load account limits
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">{message}</p>
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

interface NearLimitWarningProps {
  remaining: number;
  currency?: string;
  showBalances: boolean;
  onViewTransactions: () => void;
}

export const NearLimitWarning: React.FC<NearLimitWarningProps> = ({
  remaining,
  currency = '₹',
  showBalances,
  onViewTransactions,
}) => (
  <div
    className="mx-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4"
    role="status"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
          Approaching Daily Limit
        </p>
        <p className="text-[12px] text-[#667085] mt-1">
          {showBalances
            ? `${currency}${remaining.toLocaleString('en-IN')} remaining from today's transfer limit.`
            : 'You are approaching your daily transfer limit.'}
        </p>
        <button
          type="button"
          onClick={onViewTransactions}
          className="mt-2 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
        >
          View Transactions
        </button>
      </div>
    </div>
  </div>
);

interface LimitExceededBannerProps {
  onDismiss?: () => void;
}

export const LimitExceededBanner: React.FC<LimitExceededBannerProps> = () => (
  <div
    className="mx-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4"
    role="alert"
  >
    <p className="text-[14px] font-semibold text-[#DC2626]">Transaction limit exceeded</p>
    <p className="text-[12px] text-[#667085] mt-1">
      The requested amount is above the configured limit for this account.
    </p>
  </div>
);
