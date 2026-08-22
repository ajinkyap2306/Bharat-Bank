import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

interface ActionRequiredCardProps {
  count: number;
  amount: number;
  currency?: string;
  onReview: () => void;
}

export const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({
  count,
  amount,
  currency = '₹',
  onReview,
}) => {
  if (count <= 0) {
    return (
      <section className="px-4" aria-label="Action required">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
            Action Required
          </p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">You&apos;re all caught up</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4" aria-label="Action required">
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#F59E0B]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
              Action Required
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              {count} Payments Pending Approval
            </p>
            <p className="text-[18px] font-bold text-slate-900 dark:text-white tabular-nums mt-1">
              {formatPaymentCurrency(amount, currency)}
            </p>
            <button
              type="button"
              onClick={onReview}
              className="mt-3 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
            >
              Review Approvals
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
