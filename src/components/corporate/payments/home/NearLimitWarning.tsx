import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

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
  <section className="px-4" aria-label="Approaching daily limit">
    <div
      className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-4"
      role="status"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
            Approaching Daily Limit
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
            {showBalances
              ? `${formatPaymentCurrency(remaining, currency)} remaining from today's transfer limit.`
              : 'You are approaching your daily payment limit.'}
          </p>
          <button
            type="button"
            onClick={onViewTransactions}
            className="mt-2 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  </section>
);
