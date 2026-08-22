import React from 'react';
import { Check } from 'lucide-react';
import type { PaymentTimelineStep } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface PaymentTimelineProps {
  steps: PaymentTimelineStep[];
}

function getNodeStyles(state: PaymentTimelineStep['state']) {
  switch (state) {
    case 'completed':
      return 'bg-emerald-600 border-[#16A34A] text-white';
    case 'current':
      return 'bg-congress-blue-700 border-congress-blue-700 text-white ring-4 ring-congress-blue-500/20';
    case 'failed':
    case 'rejected':
      return 'bg-[#DC2626] border-[#DC2626] text-white';
    case 'cancelled':
    case 'returned':
      return 'bg-[#F59E0B] border-[#F59E0B] text-white';
    default:
      return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
  }
}

function isLineCompleted(state: PaymentTimelineStep['state']): boolean {
  return state === 'completed';
}

export const PaymentTimeline: React.FC<PaymentTimelineProps> = ({ steps }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-4">Payment Timeline</h3>
    <ol className="space-y-0" aria-label="Payment lifecycle timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = step.state === 'current';
        const isCompleted = step.state === 'completed';

        return (
          <li key={step.id} className="flex gap-3" aria-current={isCurrent ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${getNodeStyles(step.state)}`}
                aria-hidden
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : step.state === 'upcoming' ? (
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[28px] ${
                    isLineCompleted(step.state) ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-5 min-w-0 flex-1 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-[14px] font-medium ${
                  isCurrent || isCompleted || step.state === 'failed' || step.state === 'rejected'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                } ${isCurrent ? 'font-semibold' : ''}`}
              >
                {step.label}
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                {step.timestamp ?? (step.state === 'upcoming' ? 'Pending' : '')}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  </PayCard>
);
