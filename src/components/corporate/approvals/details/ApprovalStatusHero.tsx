import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Clock } from 'lucide-react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { CorporateApprovalDetail } from '../../../../types/corporateApprovalDetails';

interface ApprovalStatusHeroProps {
  detail: CorporateApprovalDetail;
  hideAmounts?: boolean;
}

export const ApprovalStatusHero: React.FC<ApprovalStatusHeroProps> = ({
  detail,
  hideAmounts = false,
}) => {
  const reduceMotion = useReducedMotion();
  const amountText =
    detail.amount !== undefined
      ? hideAmounts
        ? '₹••••••'
        : formatPaymentCurrency(detail.amount, detail.currency)
      : null;

  return (
    <section
      className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5"
      aria-labelledby="approval-hero-heading"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F59E0B]" aria-hidden />
          <p
            id="approval-hero-heading"
            className="text-[14px] font-semibold text-[#F59E0B]"
            role="status"
          >
            {detail.statusLabel}
          </p>
        </div>
        <p className="text-[12px] font-medium text-[#0B5CAB] mt-3 uppercase tracking-wide">
          {detail.typeLabel}
        </p>
        {amountText && (
          <p
            className="text-[30px] font-bold text-[#111827] dark:text-white tabular-nums mt-1"
            aria-label={`Amount ${detail.amount?.toLocaleString('en-IN')} rupees`}
          >
            {amountText}
          </p>
        )}
        {detail.beneficiary && (
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-1">
            {detail.beneficiary.name}
          </p>
        )}
        {!detail.beneficiary && (
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-1">
            {detail.title}
          </p>
        )}
        <p className="text-[12px] text-[#667085] mt-2">
          Approval {detail.currentApprover.completedSteps} of {detail.currentApprover.totalSteps}
        </p>
      </motion.div>
    </section>
  );
};
