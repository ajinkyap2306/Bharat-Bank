import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { CorporateScheduledPaymentDetail } from '../../../../types/corporateScheduledPayments';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

interface ScheduledPaymentHeroProps {
  data: CorporateScheduledPaymentDetail;
  hideAmounts: boolean;
}

function getDisplayStatus(data: CorporateScheduledPaymentDetail): { label: string; className: string } {
  if (data.status === 'pending_approval') {
    return { label: 'Pending Approval', className: 'bg-amber-500/20 text-amber-100' };
  }
  if (data.status === 'upcoming') {
    return {
      label: data.approvedBy ? 'Active' : 'Scheduled',
      className: 'bg-white/20 text-white',
    };
  }
  if (data.status === 'completed') {
    return { label: 'Completed', className: 'bg-emerald-500/20 text-emerald-100' };
  }
  if (data.status === 'cancelled') {
    return { label: 'Cancelled', className: 'bg-white/20 text-white/80' };
  }
  if (data.status === 'processing') {
    return { label: 'Processing', className: 'bg-amber-500/20 text-amber-100' };
  }
  return { label: 'Scheduled', className: 'bg-white/20 text-white' };
}

export const ScheduledPaymentHero: React.FC<ScheduledPaymentHeroProps> = ({ data, hideAmounts }) => {
  const reduceMotion = useReducedMotion();
  const isUpcoming = data.status === 'upcoming';
  const isPending = data.status === 'pending_approval';
  const isHighlight = isUpcoming || isPending;
  const status = getDisplayStatus(data);

  const nextDate = data.nextExecution?.split(' • ')[0] ?? data.scheduledDate;
  const nextTime = data.nextExecution?.split(' • ')[1] ?? data.executionTime;

  return (
    <section className="mx-4">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 shadow-lg ${
          isHighlight
            ? isPending
              ? 'bg-linear-to-tr from-amber-500 via-amber-600 to-orange-600 text-white shadow-amber-500/20'
              : 'bg-linear-to-tr from-[#0B5CAB] via-blue-600 to-indigo-700 text-white shadow-[#0B5CAB]/20'
            : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-[#111827] dark:text-white'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className={`text-[17px] font-bold leading-snug ${isHighlight ? 'text-white' : ''}`}>
            {data.beneficiary.name}
          </h2>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${status.className}`}>
            ● {status.label}
          </span>
        </div>

        <p className={`text-[28px] font-extrabold tabular-nums tracking-tight mt-4 ${isHighlight ? 'text-white' : ''}`}>
          {hideAmounts ? `${data.currency}••••••` : formatPaymentCurrency(data.amount, data.currency)}
        </p>

        {data.status !== 'cancelled' && (
          <div
            className={`mt-4 pt-4 border-t ${
              isHighlight ? 'border-white/20' : 'border-slate-100 dark:border-slate-800'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${isHighlight ? 'text-white/70' : 'text-[#667085]'}`}>
              {data.status === 'completed' ? 'Executed' : 'Next Payment'}
            </p>
            <p className={`text-[15px] font-bold mt-1 ${isHighlight ? 'text-white' : 'text-[#111827] dark:text-white'}`}>
              {data.status === 'completed' && data.lastExecutedAt
                ? data.lastExecutedAt
                : `${nextDate} • ${nextTime}`}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};
