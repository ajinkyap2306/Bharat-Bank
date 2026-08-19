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
                  ? 'bg-[#16A34A] border-[#16A34A] text-white'
                  : isCurrent
                    ? 'bg-[#0B5CAB] border-[#0B5CAB] text-white'
                    : 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-700 text-[#667085]'
              }`}
              aria-hidden
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : isCurrent ? (
                <span className="w-2 h-2 rounded-full bg-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#E4E7EC] dark:bg-slate-600" />
              )}
            </span>
            {!isLast && (
              <span
                className={`w-0.5 flex-1 min-h-[28px] ${
                  isCompleted ? 'bg-[#16A34A]' : 'bg-[#E4E7EC] dark:bg-slate-700'
                }`}
                aria-hidden
              />
            )}
          </div>
          <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
            <p
              className={`text-[14px] font-medium ${
                isCurrent || isCompleted
                  ? 'text-[#111827] dark:text-white'
                  : 'text-[#667085]'
              }`}
            >
              {step.label}
            </p>
            <p className="text-[12px] text-[#667085] mt-0.5">
              {step.description ??
                (isCompleted ? 'Completed' : isCurrent ? 'Pending' : 'Upcoming')}
            </p>
          </div>
        </li>
      );
    })}
  </ol>
);
