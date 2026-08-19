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
        className="w-full flex items-center gap-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0B5CAB]/15 px-3 py-2.5 text-left shadow-xs"
      >
        <div className="w-8 h-8 rounded-lg bg-[#0B5CAB]/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#111827] dark:text-white">{title}</p>
          <p className="text-[11px] text-[#667085] mt-0.5">
            {subtitle ?? (
              <>
                <span className="font-semibold text-[#0B5CAB] tabular-nums">{count} payments</span>
                {' · '}
                <span className="font-semibold text-[#0B5CAB] tabular-nums">
                  {formatPaymentCurrency(amount, currency)}
                </span>
              </>
            )}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#667085] shrink-0" aria-hidden />
      </motion.button>
    </section>
  );
};
