import React from 'react';
import { Check } from 'lucide-react';
import type { ApprovalTimelineEvent } from '../../../../types/corporateApprovalDetails';

interface ApprovalTimelineProps {
  events: ApprovalTimelineEvent[];
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ events }) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4"
    aria-labelledby="approval-timeline-heading"
  >
    <h2 id="approval-timeline-heading" className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">
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
                    ? 'bg-[#16A34A] border-[#16A34A] text-white'
                    : isCurrent
                      ? 'bg-[#0B5CAB] border-[#0B5CAB] text-white ring-4 ring-[#0B5CAB]/15'
                      : 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-700'
                }`}
                aria-hidden
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#E4E7EC]" />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[32px] ${
                    isCompleted ? 'bg-[#16A34A]' : 'bg-[#E4E7EC] dark:bg-slate-700'
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-[14px] font-medium ${
                  isCurrent ? 'text-[#0B5CAB]' : 'text-[#111827] dark:text-white'
                }`}
              >
                {event.label}
              </p>
              {event.userName && (
                <p className="text-[13px] text-[#111827] dark:text-white mt-0.5">
                  {isCompleted ? '✓ ' : isCurrent ? '● ' : '○ '}
                  {event.userName}
                </p>
              )}
              {event.userRole && (
                <p className="text-[12px] text-[#667085]">{event.userRole}</p>
              )}
              {event.timestamp && (
                <p className="text-[12px] text-[#667085] mt-0.5">{event.timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);
