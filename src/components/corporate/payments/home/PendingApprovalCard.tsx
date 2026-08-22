import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

interface PendingApprovalCardProps {
  count: number;
  amount: number;
  currency?: string;
  title?: string;
  subtitle?: string;
  onViewPayments: () => void;
}

export const PendingApprovalCard: React.FC<PendingApprovalCardProps> = ({
  count,
  amount,
  currency = '₹',
  title = 'Pending Approval',
  subtitle,
  onViewPayments,
}) => {
  if (count <= 0) return null;

  return (
    <section className="px-4" aria-label="Pending approval">
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={onViewPayments}
        className="w-full flex items-center gap-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-congress-blue-700/15 px-3 py-2.5 text-left shadow-xs"
      >
        <div className="w-8 h-8 rounded-lg bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-900 dark:text-white">{title}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle ?? (
              <>
                <span className="font-semibold text-congress-blue-700 dark:text-congress-blue-400 tabular-nums">{count} payments</span>
                {' · '}
                <span className="font-semibold text-congress-blue-700 dark:text-congress-blue-400 tabular-nums">
                  {formatPaymentCurrency(amount, currency)}
                </span>
              </>
            )}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
      </motion.button>
    </section>
  );
};
