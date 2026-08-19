import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { ApprovalsDashboardSummary } from '../../../../types/corporateApprovalsDashboard';

interface ActionRequiredCardProps {
  summary: ApprovalsDashboardSummary;
  hideAmounts?: boolean;
  onReviewNow: () => void;
}

export const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({
  summary,
  hideAmounts = false,
  onReviewNow,
}) => {
  if (summary.actionRequiredCount === 0) {
    return (
      <section className="mx-4" aria-labelledby="action-required-heading">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
          <h2 id="action-required-heading" className="text-[14px] font-bold text-[#111827] dark:text-white">
            All caught up
          </h2>
          <p className="text-[13px] text-[#667085] mt-1">No approvals require your attention.</p>
        </div>
      </section>
    );
  }

  const amountLabel = hideAmounts
    ? '₹••••••'
    : formatPaymentCurrency(summary.actionRequiredAmount);

  return (
    <section className="mx-4" aria-labelledby="action-required-heading">
      <div className="rounded-3xl bg-linear-to-tr from-[#0B5CAB] via-blue-600 to-indigo-700 text-white p-4 shadow-lg shadow-[#0B5CAB]/20">
        <p
          id="action-required-heading"
          className="text-[11px] font-bold uppercase tracking-wider text-blue-100"
        >
          Action Required
        </p>
        <p className="text-[15px] font-bold mt-2 leading-snug">
          {summary.actionRequiredCount} payment{summary.actionRequiredCount === 1 ? '' : 's'} require
          your approval
        </p>
        <p className="text-[24px] font-extrabold tabular-nums tracking-tight mt-1">{amountLabel}</p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onReviewNow}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-[#0B5CAB] text-[14px] font-bold min-h-11"
        >
          Review Now
          <ArrowRight className="w-4 h-4" aria-hidden />
        </motion.button>
      </div>
    </section>
  );
};
