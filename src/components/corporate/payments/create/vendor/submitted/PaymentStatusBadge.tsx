import React from 'react';
import type { VendorPaymentSubmissionStatus } from '../../../../../../types/corporateVendorPaymentSubmission';
import {
  getSubmissionStatusLabel,
  getSubmissionStatusTone,
} from '../../../../../../types/corporateVendorPaymentSubmission';

interface PaymentStatusBadgeProps {
  status: VendorPaymentSubmissionStatus;
  className?: string;
}

const toneStyles: Record<ReturnType<typeof getSubmissionStatusTone>, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  error: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className = '' }) => {
  const tone = getSubmissionStatusTone(status);
  const label = getSubmissionStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold border ${toneStyles[tone]} ${className}`}
      role="status"
      aria-label={`Payment status: ${label}`}
    >
      {label}
    </span>
  );
};
