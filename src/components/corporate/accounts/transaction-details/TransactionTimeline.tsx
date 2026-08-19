import React from 'react';
import { Check, Circle } from 'lucide-react';
import type { TransactionTimelineEvent } from '../../../../types/corporateTransactionDetails';

interface TransactionTimelineProps {
  events: TransactionTimelineEvent[];
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ events }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm" aria-label="Transaction Timeline">
    <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-4">
      Transaction Timeline
    </h2>
    <ol className="space-y-0">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isCompleted = event.state === 'completed';
        const isCurrent = event.state === 'current';
        const isFailed = event.state === 'failed';

        return (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isFailed
                    ? 'bg-rose-100 text-[#DC2626] dark:bg-rose-950/40'
                    : isCompleted
                      ? 'bg-emerald-100 text-[#16A34A] dark:bg-emerald-950/40'
                      : isCurrent
                        ? 'bg-[#0B5CAB]/10 text-[#0B5CAB]'
                        : 'bg-slate-100 text-[#667085] dark:bg-slate-800'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" aria-hidden />
                ) : (
                  <Circle className="w-3 h-3" aria-hidden />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-6 my-1 ${
                    isCompleted ? 'bg-[#16A34A]/40' : 'bg-[#E4E7EC] dark:bg-slate-700'
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-4 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-[14px] font-semibold ${
                  isCurrent ? 'text-[#0B5CAB]' : 'text-[#111827] dark:text-white'
                }`}
              >
                {event.label}
              </p>
              <p className="text-[12px] text-[#667085] mt-0.5">
                {event.date} • {event.time}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);
