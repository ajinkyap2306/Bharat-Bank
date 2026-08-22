import React from 'react';
import { Check } from 'lucide-react';
import type { ApprovalTimelineEvent } from '../../../../types/corporateApprovalDetails';

interface ApprovalTimelineProps {
  events: ApprovalTimelineEvent[];
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ events }) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
    aria-labelledby="approval-timeline-heading"
  >
    <h2 id="approval-timeline-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white mb-4">
      Approval Workflow
    </h2>
    <ol className="space-y-0" aria-label="Approval workflow timeline">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isCompleted = event.state === 'completed';
        const isCurrent = event.state === 'current';

        return (
          <li key={event.id} className="flex gap-3" aria-current={isCurrent ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? 'bg-emerald-600 border-[#16A34A] text-white'
                    : isCurrent
                      ? 'bg-congress-blue-700 border-congress-blue-700 text-white ring-4 ring-congress-blue-700/15'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
                aria-hidden
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[32px] ${
                    isCompleted ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-[14px] font-medium ${
                  isCurrent ? 'text-congress-blue-700 dark:text-congress-blue-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {event.label}
              </p>
              {event.userName && (
                <p className="text-[13px] text-slate-900 dark:text-white mt-0.5">
                  {isCompleted ? '✓ ' : isCurrent ? '● ' : '○ '}
                  {event.userName}
                </p>
              )}
              {event.userRole && (
                <p className="text-[12px] text-slate-500 dark:text-slate-400">{event.userRole}</p>
              )}
              {event.timestamp && (
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{event.timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);
