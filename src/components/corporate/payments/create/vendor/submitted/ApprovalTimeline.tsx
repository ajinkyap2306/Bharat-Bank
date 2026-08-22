import React from 'react';
import { Check } from 'lucide-react';
import type { ApprovalTimelineStep } from '../../../../../../types/corporateVendorPaymentSubmission';

interface ApprovalTimelineProps {
  steps: ApprovalTimelineStep[];
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ steps }) => (
  <ol className="space-y-0" aria-label="Approval progress timeline">
    {steps.map((step, index) => {
      const isLast = index === steps.length - 1;
      const isCompleted = step.state === 'completed';
      const isCurrent = step.state === 'current';

      return (
        <li key={step.id} className="flex gap-3" aria-current={isCurrent ? 'step' : undefined}>
          <div className="flex flex-col items-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                isCompleted
                  ? 'bg-emerald-600 border-[#16A34A] text-white'
                  : isCurrent
                    ? 'bg-congress-blue-700 border-congress-blue-700 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
              aria-hidden
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : isCurrent ? (
                <span className="w-2 h-2 rounded-full bg-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
              )}
            </span>
            {!isLast && (
              <span
                className={`w-0.5 flex-1 min-h-[28px] ${
                  isCompleted ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
                aria-hidden
              />
            )}
          </div>
          <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
            <p
              className={`text-[14px] font-medium ${
                isCurrent || isCompleted
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {step.label}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              {step.description ??
                (isCompleted ? 'Completed' : isCurrent ? 'Pending' : 'Upcoming')}
            </p>
          </div>
        </li>
      );
    })}
  </ol>
);
