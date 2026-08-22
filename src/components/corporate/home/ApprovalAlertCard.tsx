import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import type { CorporateApprovalAlert } from '../../../types/corporateDashboard';
import { CorpSkeleton, formatCorpCurrency } from './shared/CorporateHomeUI';

interface ApprovalAlertCardProps {
  alert: CorporateApprovalAlert;
  isLoading?: boolean;
  variant: 'approver' | 'maker';
  onReviewApprovals: () => void;
}

export const ApprovalAlertCard: React.FC<ApprovalAlertCardProps> = ({
  alert,
  isLoading,
  variant,
  onReviewApprovals,
}) => {
  if (isLoading) {
    return <CorpSkeleton className="h-16 mx-4" />;
  }

  if (alert.requestCount === 0) {
    return (
      <section aria-label="Approval status" className="px-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-3 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {variant === 'maker'
                ? 'No pending requests — all submissions are up to date'
                : "You're all caught up — no approvals pending"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isMaker = variant === 'maker';
  const Icon = isMaker ? Clock : AlertCircle;
  const title = isMaker ? 'Pending Requests' : 'Approval Required';
  const suffix = isMaker ? 'submitted' : 'awaiting your review';

  return (
    <section aria-label={isMaker ? 'Pending requests' : 'Approval required'} className="px-4">
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={onReviewApprovals}
        className="w-full flex items-center gap-2.5 text-left rounded-2xl bg-white dark:bg-slate-900 border border-congress-blue-200 dark:border-congress-blue-800 dark:border-congress-blue-200 dark:border-congress-blue-800 px-3 py-2.5 shadow-xs"
      >
        <div className="w-8 h-8 rounded-lg bg-congress-blue-50 dark:bg-congress-blue-950/60 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            <span className="font-semibold text-congress-blue-700 dark:text-congress-blue-400 tabular-nums">
              {alert.requestCount} {isMaker ? 'payments' : 'pending'}
            </span>
            {' · '}
            <span className="font-semibold text-congress-blue-700 dark:text-congress-blue-400 tabular-nums">
              {formatCorpCurrency(alert.totalAmount)}
            </span>{' '}
            {suffix}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
      </motion.button>
    </section>
  );
};
