import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PaymentsHomePaymentItem } from '../../../../types/corporatePaymentsHome';
import { PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard } from './PaymentsHomeUI';
import { PaymentsEmptyState } from './PaymentsStates';

interface PendingPaymentsProps {
  items: PaymentsHomePaymentItem[];
  showBalances: boolean;
  onViewAll: () => void;
  onSelect: (id: string) => void;
}

export const PendingPayments: React.FC<PendingPaymentsProps> = ({
  items,
  showBalances,
  onViewAll,
  onSelect,
}) => (
  <section className="px-4" aria-label="Pending payments">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
        Pending Payments
      </h2>
      {items.length > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-[13px] font-semibold text-[#0B5CAB] min-h-11 px-2"
        >
          View All
        </button>
      )}
    </div>
    {items.length === 0 ? (
      <PaymentsEmptyState message="You're all caught up" />
    ) : (
      <PayHomeCard className="divide-y divide-[#E4E7EC]/80 dark:divide-slate-800">
        {items.slice(0, 3).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.paymentId ?? item.id)}
            className="w-full p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#111827] dark:text-white truncate">
                  {item.beneficiary}
                </p>
                <p className="text-[12px] text-[#667085] mt-0.5">{item.type}</p>
                {item.meta && (
                  <p className="text-[11px] text-[#667085] mt-1">{item.meta}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-bold text-[#111827] dark:text-white tabular-nums">
                  {showBalances
                    ? `− ${formatPaymentCurrency(item.amount, item.currency)}`
                    : '••••••'}
                </p>
                <div className="mt-1 flex justify-end">
                  <PaymentStatusBadge status={item.status} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </PayHomeCard>
    )}
  </section>
);
