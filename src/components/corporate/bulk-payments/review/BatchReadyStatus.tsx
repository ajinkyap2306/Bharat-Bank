import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface BatchReadyStatusProps {
  isReady: boolean;
}

export const BatchReadyStatus: React.FC<BatchReadyStatusProps> = ({ isReady }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`mx-4 rounded-2xl border p-5 text-center ${
        isReady
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900'
      }`}
      aria-live="polite"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center mb-3"
      >
        {isReady ? (
          <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" aria-hidden />
        ) : (
          <AlertTriangle className="w-12 h-12 text-[#F59E0B]" aria-hidden />
        )}
      </motion.div>
      <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">
        {isReady ? 'Batch Ready for Submission' : 'Batch Requires Attention'}
      </h2>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">
        {isReady
          ? 'All payment records have passed validation.'
          : 'Resolve all blocking issues before submitting.'}
      </p>
    </section>
  );
};
