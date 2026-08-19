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
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden />
            <p className="text-xs font-semibold text-[#111827] dark:text-white">
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
        className="w-full flex items-center gap-2.5 text-left rounded-2xl bg-white dark:bg-slate-900 border border-[#0B5CAB]/15 dark:border-[#0B5CAB]/25 px-3 py-2.5 shadow-xs"
      >
        <div className="w-8 h-8 rounded-lg bg-[#0B5CAB]/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#111827] dark:text-white leading-tight">
            {title}
          </p>
          <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
            <span className="font-semibold text-[#0B5CAB] tabular-nums">
              {alert.requestCount} {isMaker ? 'payments' : 'pending'}
            </span>
            {' · '}
            <span className="font-semibold text-[#0B5CAB] tabular-nums">
              {formatCorpCurrency(alert.totalAmount)}
            </span>{' '}
            {suffix}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-[#667085] shrink-0" aria-hidden />
      </motion.button>
    </section>
  );
};
