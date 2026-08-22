import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle, XCircle, Ban, Loader2 } from 'lucide-react';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';
import { getSubmissionStatusLabel } from '../../../../../../types/corporateVendorPaymentSubmission';

interface PaymentStatusStateProps {
  data: VendorPaymentSubmissionData;
}

function getHeroContent(data: VendorPaymentSubmissionData): {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: 'success' | 'error' | 'warning' | 'info';
} {
  switch (data.status) {
    case 'rejected':
      return {
        icon: <XCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
        title: 'Payment Rejected',
        description: 'The payment was rejected during the approval process.',
        tone: 'error',
      };
    case 'cancelled':
      return {
        icon: <Ban className="w-12 h-12 text-[#DC2626]" aria-hidden />,
        title: 'Payment Cancelled',
        description: 'The payment request has been cancelled.',
        tone: 'error',
      };
    case 'failed':
      return {
        icon: <XCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
        title: 'Payment Failed',
        description: 'The payment could not be processed. Please contact support.',
        tone: 'error',
      };
    case 'completed':
      return {
        icon: <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" aria-hidden />,
        title: 'Payment Successful',
        description: 'Payment completed successfully.',
        tone: 'success',
      };
    case 'processing':
    case 'approved':
      return {
        icon: <Loader2 className="w-12 h-12 text-congress-blue-700 dark:text-congress-blue-400 animate-spin motion-reduce:animate-none" aria-hidden />,
        title: 'Payment Processing',
        description: 'The payment has been approved and is now being processed.',
        tone: 'info',
      };
  }

  if (!data.approvalRequired) {
    return {
      icon: <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" aria-hidden />,
      title: 'Payment Submitted',
      description: 'Your payment is being processed.',
      tone: 'success',
    };
  }

  return {
    icon: <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" aria-hidden />,
    title: 'Payment Submitted Successfully',
    description: 'Your payment request has been submitted for corporate approval.',
    tone: 'success',
  };
}

export const PaymentStatusState: React.FC<PaymentStatusStateProps> = ({ data }) => {
  const reduceMotion = useReducedMotion();
  const hero = getHeroContent(data);
  const statusLabel = getSubmissionStatusLabel(data.status);

  return (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center"
    aria-live="polite"
    aria-atomic="true"
  >
    <motion.div
      initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex justify-center mb-3"
    >
      {hero.icon}
    </motion.div>
    <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">{hero.title}</h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 max-w-[280px] mx-auto">{hero.description}</p>
    <span className="sr-only">
      Payment submitted successfully. Payment ID {data.paymentId}. Amount{' '}
      {data.amount.toLocaleString('en-IN')} rupees. Status {statusLabel}.
    </span>

    {data.status === 'rejected' && (
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-left space-y-2">
        {data.rejectedBy && (
          <div className="flex justify-between gap-4 text-[13px]">
            <span className="text-slate-500 dark:text-slate-400">Rejected By</span>
            <span className="font-medium text-slate-900 dark:text-white">{data.rejectedBy}</span>
          </div>
        )}
        {data.rejectionReason && (
          <div className="text-[13px]">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Reason</span>
            <p className="font-medium text-slate-900 dark:text-white bg-rose-50 dark:bg-rose-950/30 rounded-lg p-3 border border-rose-100 dark:border-rose-900">
              {data.rejectionReason}
            </p>
          </div>
        )}
      </div>
    )}

    {data.status === 'cancelled' && (
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-left space-y-2">
        {data.cancelledAt && (
          <div className="flex justify-between gap-4 text-[13px]">
            <span className="text-slate-500 dark:text-slate-400">Cancellation Date</span>
            <span className="font-medium text-slate-900 dark:text-white">{data.cancelledAt}</span>
          </div>
        )}
        {data.cancellationReason && (
          <div className="text-[13px]">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Cancellation Reason</span>
            <p className="font-medium text-slate-900 dark:text-white">{data.cancellationReason}</p>
          </div>
        )}
      </div>
    )}
  </section>
  );
};
