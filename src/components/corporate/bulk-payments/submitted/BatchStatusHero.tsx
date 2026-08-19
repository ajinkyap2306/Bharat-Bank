import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { BatchStatusBadge } from './BatchStatusBadge';

interface BatchStatusHeroProps {
  data: BulkBatchTrackingData;
  showSuccess: boolean;
}

export const BatchStatusHero: React.FC<BatchStatusHeroProps> = ({ data, showSuccess }) => {
  const reduceMotion = useReducedMotion();
  const isCompleted = data.status === 'completed';

  return (
    <section className="mx-4 space-y-3" aria-live="polite">
      {showSuccess && (
        <div className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-5 text-center">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex justify-center mb-3"
          >
            <CheckCircle className="w-12 h-12 text-[#16A34A]" aria-hidden />
          </motion.div>
          <h2 className="text-[17px] font-semibold text-[#111827] dark:text-white">
            {isCompleted ? 'Bulk Payment Completed' : 'Batch Submitted Successfully'}
          </h2>
          <p className="text-[13px] text-[#667085] mt-2">
            {isCompleted
              ? 'All payments in this batch have been processed.'
              : 'Your bulk payment batch has been submitted for corporate approval.'}
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 text-center">
        <BatchStatusBadge status={data.status} />
        <p className="text-[18px] font-semibold text-[#111827] dark:text-white mt-3">{data.statusLabel}</p>
        <p className="text-[13px] text-[#667085] mt-1">{data.statusSupporting}</p>
      </div>

      <span className="sr-only">
        Bulk payment batch {showSuccess ? 'submitted successfully' : ''}. {data.paymentCount} payments.
        Status {data.statusLabel}. {data.statusSupporting}
      </span>
    </section>
  );
};
