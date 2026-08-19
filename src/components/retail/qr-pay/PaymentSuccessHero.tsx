import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { playPaymentSuccessSound, prefersReducedMotion } from '../../../utils/paymentSuccessFeedback';
import { VerifiedBadge } from './shared/QrPayUI';

interface PaymentSuccessHeroProps {
  amount: number;
  merchantName: string;
  fromAccountLabel: string;
  timestamp: string;
  transactionId: string;
  onAnimationComplete?: () => void;
}

export const PaymentSuccessHero: React.FC<PaymentSuccessHeroProps> = ({
  amount,
  merchantName,
  fromAccountLabel,
  timestamp,
  transactionId,
  onAnimationComplete,
}) => {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    playPaymentSuccessSound();
    if (reduced) {
      onAnimationComplete?.();
      return;
    }
    const t = setTimeout(() => onAnimationComplete?.(), 700);
    return () => clearTimeout(t);
  }, [onAnimationComplete, reduced]);

  const ringTransition = reduced ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' as const };
  const contentTransition = reduced ? { duration: 0 } : { duration: 0.35, delay: 0.2 };

  return (
    <div className="flex flex-col items-center text-center px-4 pt-6" role="status" aria-live="polite">
      <motion.div
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={ringTransition}
        className="relative w-20 h-20 mb-5"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-950/50" />
        <svg viewBox="0 0 52 52" className="absolute inset-2 w-16 h-16" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="22"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={ringTransition}
          />
          <motion.path
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l7 7 16-16"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...ringTransition, delay: reduced ? 0 : 0.15 }}
          />
        </svg>
      </motion.div>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={contentTransition}
        className="text-lg font-bold text-slate-900 dark:text-white"
      >
        Payment Successful
      </motion.p>

      <motion.p
        initial={reduced ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={contentTransition}
        className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums"
      >
        ₹{amount.toLocaleString('en-IN')}
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...contentTransition, delay: reduced ? 0 : 0.28 }}
        className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2"
      >
        <p className="text-xs text-slate-500">Paid to</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{merchantName}</p>
        <VerifiedBadge />
        <div className="pt-2 space-y-1 text-sm">
          <p className="text-slate-500 text-xs">From</p>
          <p className="font-semibold">{fromAccountLabel}</p>
          <p className="text-xs text-slate-500 mt-2">{timestamp}</p>
          <p className="text-xs text-slate-500 mt-2">UPI Transaction ID</p>
          <p className="font-mono text-xs font-semibold break-all">{transactionId}</p>
        </div>
      </motion.div>
    </div>
  );
};
