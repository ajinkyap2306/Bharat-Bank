import React from 'react';
import { Check, X } from 'lucide-react';
import type { ResultTimelineStep } from '../../../../types/corporateApprovalResult';

interface ResultTimelineProps {
  steps: ResultTimelineStep[];
}

export const ResultTimeline: React.FC<ResultTimelineProps> = ({ steps }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
    <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-4">
      Approval Timeline
    </h2>
    <ol className="space-y-0" aria-label="Approval result timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = step.state === 'completed';
        const isCurrent = step.state === 'current';
        const isRejected = step.state === 'rejected';
        const isReturned = step.state === 'returned';

        return (
          <li key={step.id} className="flex gap-3" aria-current={isCurrent ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? 'bg-emerald-600 border-[#16A34A] text-white'
                    : isRejected
                      ? 'bg-[#DC2626] border-[#DC2626] text-white'
                      : isReturned
                        ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                        : isCurrent
                          ? 'bg-congress-blue-700 border-congress-blue-700 text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
                aria-hidden
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isRejected ? (
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isReturned ? (
                  <span className="text-[10px] font-bold">↩</span>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
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
              <p className="text-[14px] font-medium text-slate-900 dark:text-white">{step.label}</p>
              {step.sublabel && (
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{step.sublabel}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);
