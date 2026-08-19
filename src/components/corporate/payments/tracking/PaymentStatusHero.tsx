import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  RotateCcw,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

interface PaymentStatusHeroProps {
  data: CorporatePaymentTrackingData;
  hideAmounts: boolean;
}

function getHeroConfig(status: CorporatePaymentTrackingData['status']) {
  switch (status) {
    case 'completed':
      return {
        icon: <CheckCircle className="w-12 h-12 text-white" aria-hidden />,
        title: 'Payment Successful',
        tone: 'success' as const,
        bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900',
      };
    case 'processing':
    case 'approved':
      return {
        icon: (
          <Loader2
            className="w-12 h-12 text-[#0B5CAB] animate-spin motion-reduce:animate-none"
            aria-hidden
          />
        ),
        title: 'Payment Processing',
        tone: 'info' as const,
        bg: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900',
      };
    case 'pending_approval':
    case 'submitted':
      return {
        icon: <Clock className="w-12 h-12 text-[#F59E0B]" aria-hidden />,
        title: 'Pending Approval',
        tone: 'warning' as const,
        bg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900',
      };
    case 'rejected':
      return {
        icon: <XCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
        title: 'Payment Rejected',
        tone: 'error' as const,
        bg: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900',
      };
    case 'failed':
      return {
        icon: <XCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
        title: 'Payment Failed',
        tone: 'error' as const,
        bg: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900',
      };
    case 'cancelled':
      return {
        icon: <Ban className="w-12 h-12 text-[#667085]" aria-hidden />,
        title: 'Payment Cancelled',
        tone: 'neutral' as const,
        bg: 'bg-slate-50 dark:bg-slate-900/50 border-[#E4E7EC] dark:border-slate-800',
      };
    case 'reversed':
      return {
        icon: <RotateCcw className="w-12 h-12 text-[#F59E0B]" aria-hidden />,
        title: 'Payment Reversed',
        tone: 'warning' as const,
        bg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900',
      };
    default:
      return {
        icon: <AlertCircle className="w-12 h-12 text-[#0B5CAB]" aria-hidden />,
        title: 'Payment Details',
        tone: 'info' as const,
        bg: 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-800',
      };
  }
}

function getSupportingText(data: CorporatePaymentTrackingData): string {
  switch (data.status) {
    case 'processing':
    case 'approved':
      return 'Your payment has been approved and is being processed by the bank.';
    case 'pending_approval':
    case 'submitted':
      return 'This payment is waiting for the required corporate approval.';
    case 'rejected':
      return 'Payment was not processed.';
    case 'failed':
      return data.failureReason ?? 'The payment could not be completed.';
    case 'cancelled':
      return 'The payment request was cancelled before processing.';
    case 'reversed':
      return 'The completed payment was reversed.';
    case 'completed':
      return data.completionTime ? `Completed ${data.completionTime}` : 'Payment completed successfully.';
    default:
      return '';
  }
}

function formatAmount(amount: number, hide: boolean, currency: string): string {
  if (hide) return `${currency}••••••`;
  return formatPaymentCurrency(amount, currency);
}

export const PaymentStatusHero: React.FC<PaymentStatusHeroProps> = ({ data, hideAmounts }) => {
  const reduceMotion = useReducedMotion();
  const hero = getHeroConfig(data.status);
  const supporting = getSupportingText(data);

  const ariaSummary = `${hero.title}. ${data.type} of ${hideAmounts ? 'hidden amount' : `${data.amount.toLocaleString('en-IN')} rupees`} to ${data.beneficiary.name}.`;

  return (
    <section
      className={`mx-4 rounded-3xl border p-5 text-center shadow-xs ${
        data.status === 'completed'
          ? 'bg-linear-to-tr from-[#0B5CAB] via-blue-600 to-indigo-700 text-white border-transparent shadow-lg shadow-[#0B5CAB]/20'
          : hero.bg
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center mb-3"
      >
        {hero.icon}
      </motion.div>
      <h2
        className={`text-[17px] font-bold ${
          data.status === 'completed' ? 'text-white' : 'text-[#111827] dark:text-white'
        }`}
      >
        {hero.title}
      </h2>
      <p
        className={`text-[26px] font-extrabold tabular-nums tracking-tight mt-2 ${
          data.status === 'completed' ? 'text-white' : 'text-[#111827] dark:text-white'
        }`}
      >
        {formatAmount(data.amount, hideAmounts, data.currency)}
      </p>
      <p
        className={`text-[14px] font-medium mt-1 ${
          data.status === 'completed' ? 'text-blue-100' : 'text-[#667085]'
        }`}
      >
        {data.beneficiary.name}
      </p>
      {supporting && (
        <p
          className={`text-[13px] mt-3 max-w-[300px] mx-auto leading-relaxed ${
            data.status === 'completed' ? 'text-blue-100' : 'text-[#667085]'
          }`}
        >
          {supporting}
        </p>
      )}
      <span className="sr-only">{ariaSummary}</span>

      {data.status === 'pending_approval' && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC]/80 dark:border-slate-700 text-left space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Approval Progress</span>
            <span className="font-semibold text-[#111827] dark:text-white">
              {data.completedApprovals} of {data.totalApprovals} completed
            </span>
          </div>
          {data.nextApprover && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Next Approver</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.nextApprover}</span>
            </div>
          )}
        </div>
      )}

      {data.status === 'rejected' && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC]/80 dark:border-slate-700 text-left space-y-2">
          {data.rejectionReason && (
            <div className="text-[13px]">
              <span className="text-[#667085] block mb-1">Reason</span>
              <p className="font-medium text-[#111827] dark:text-white bg-rose-50 dark:bg-rose-950/30 rounded-lg p-3 border border-rose-100 dark:border-rose-900">
                {data.rejectionReason}
              </p>
            </div>
          )}
          {data.rejectedBy && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Rejected By</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.rejectedBy}</span>
            </div>
          )}
          {data.rejectedAt && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Date</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.rejectedAt}</span>
            </div>
          )}
        </div>
      )}

      {data.status === 'failed' && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC]/80 dark:border-slate-700 text-left space-y-2">
          {data.failureReason && (
            <div className="text-[13px]">
              <span className="text-[#667085] block mb-1">Failure Reason</span>
              <p className="font-medium text-[#111827] dark:text-white">{data.failureReason}</p>
            </div>
          )}
          {data.failureTime && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Failure Time</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.failureTime}</span>
            </div>
          )}
        </div>
      )}

      {data.status === 'cancelled' && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC]/80 dark:border-slate-700 text-left space-y-2">
          {data.cancelledBy && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Cancelled By</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.cancelledBy}</span>
            </div>
          )}
          {data.cancelledAt && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Cancellation Date</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.cancelledAt}</span>
            </div>
          )}
          {data.cancellationReason && (
            <div className="text-[13px]">
              <span className="text-[#667085] block mb-1">Cancellation Reason</span>
              <p className="font-medium text-[#111827] dark:text-white">{data.cancellationReason}</p>
            </div>
          )}
        </div>
      )}

      {data.status === 'reversed' && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC]/80 dark:border-slate-700 text-left space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Original Amount</span>
            <span className="font-semibold text-[#111827] dark:text-white">
              {formatAmount(data.amount, hideAmounts, data.currency)}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Reversal Amount</span>
            <span className="font-semibold text-[#111827] dark:text-white">
              {formatAmount(data.reversalAmount ?? data.amount, hideAmounts, data.currency)}
            </span>
          </div>
          {data.reversalDate && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#667085]">Reversal Date</span>
              <span className="font-medium text-[#111827] dark:text-white">{data.reversalDate}</span>
            </div>
          )}
          {data.reversalReason && (
            <div className="text-[13px]">
              <span className="text-[#667085] block mb-1">Reason</span>
              <p className="font-medium text-[#111827] dark:text-white">{data.reversalReason}</p>
            </div>
          )}
        </div>
      )}

      {data.status === 'completed' && data.transactionId && (
        <div className="mt-4 pt-4 border-t border-white/20 text-left space-y-2">
          <div className="flex justify-between text-[13px] gap-3">
            <span className="text-blue-100 shrink-0">Transaction ID</span>
            <span className="font-mono font-semibold text-white text-right break-all">
              {data.transactionId}
            </span>
          </div>
          {data.completionTime && (
            <div className="flex justify-between text-[13px]">
              <span className="text-blue-100">Completion Time</span>
              <span className="font-medium text-white">{data.completionTime}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
