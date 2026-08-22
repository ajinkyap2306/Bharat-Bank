import React from 'react';
import { CalendarClock } from 'lucide-react';
import type { PaymentsHomePaymentItem } from '../../../../types/corporatePaymentsHome';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard, PayListDivider, PaySectionHeader } from './PaymentsHomeUI';
import { PaymentsEmptyState } from './PaymentsStates';

interface ScheduledPaymentsProps {
  items: PaymentsHomePaymentItem[];
  showBalances: boolean;
  onViewSchedule: () => void;
  onSelect: (id: string) => void;
}

export const ScheduledPayments: React.FC<ScheduledPaymentsProps> = ({
  items,
  showBalances,
  onViewSchedule,
  onSelect,
}) => (
  <section className="px-4" aria-label="Upcoming payments">
    <PaySectionHeader title="Upcoming Payments" action="View Schedule" onAction={onViewSchedule} />
    {items.length === 0 ? (
      <PaymentsEmptyState message="No upcoming payments" />
    ) : (
      <PayHomeCard>
        {items.slice(0, 3).map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <PayListDivider />}
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
            >
              <div className="w-8 h-8 rounded-lg bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                    {item.beneficiary}
                  </p>
                  <p className="text-[13px] font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                    {showBalances
                      ? formatPaymentCurrency(item.amount, item.currency)
                      : '••••••'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.date}</p>
              </div>
            </button>
          </React.Fragment>
        ))}
      </PayHomeCard>
    )}
  </section>
);
