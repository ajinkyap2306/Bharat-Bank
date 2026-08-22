import React from 'react';
import type { PaymentsHomePaymentItem } from '../../../../types/corporatePaymentsHome';
import { PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard } from './PaymentsHomeUI';
import { PaymentsEmptyState } from './PaymentsStates';

interface RecentPaymentsProps {
  items: PaymentsHomePaymentItem[];
  showBalances: boolean;
  onSelect: (id: string) => void;
}

export const RecentPayments: React.FC<RecentPaymentsProps> = ({
  items,
  showBalances,
  onSelect,
}) => (
  <section className="px-4" aria-label="Recent payments">
    <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
      Recent Payments
    </h2>
    {items.length === 0 ? (
      <PaymentsEmptyState message="No recent payment activity" />
    ) : (
      <PayHomeCard className="divide-y divide-slate-200 dark:divide-slate-800/80 dark:divide-slate-800">
        {items.slice(0, 4).map((item) => {
          const isCredit = item.type === 'Internal Transfer' && item.beneficiary.includes('Internal');
          const prefix = isCredit ? '' : '− ';
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.paymentId ?? item.id)}
              className="w-full p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-white truncate">
                    {item.beneficiary}
                  </p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{item.type}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-[14px] font-bold tabular-nums ${
                      isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {showBalances
                      ? `${prefix}${formatPaymentCurrency(item.amount, item.currency)}`
                      : '••••••'}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <PaymentStatusBadge status={item.status} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </PayHomeCard>
    )}
  </section>
);
