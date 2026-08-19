import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PaymentsHomePaymentItem } from '../../../../types/corporatePaymentsHome';
import { PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard, PayListDivider, PaySectionHeader } from './PaymentsHomeUI';

interface PaymentHistoryPreviewProps {
  items: PaymentsHomePaymentItem[];
  showBalances: boolean;
  onViewAll: () => void;
  onSelect: (id: string) => void;
}

export const PaymentHistoryPreview: React.FC<PaymentHistoryPreviewProps> = ({
  items,
  showBalances,
  onViewAll,
  onSelect,
}) => (
  <section className="px-4" aria-label="Payment history">
    <PaySectionHeader title="Payment History" action="View All" onAction={onViewAll} />
    <PayHomeCard>
      {items.slice(0, 4).map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <PayListDivider />}
          <button
            type="button"
            onClick={() => onSelect(item.paymentId ?? item.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 text-[#667085]" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-[#111827] dark:text-white truncate">
                  {item.beneficiary}
                </p>
                <p className="text-[13px] font-bold text-[#111827] dark:text-white tabular-nums shrink-0">
                  {showBalances
                    ? `− ${formatPaymentCurrency(item.amount, item.currency)}`
                    : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-[11px] text-[#667085] truncate">{item.date}</p>
                <PaymentStatusBadge status={item.status} />
              </div>
            </div>
          </button>
        </React.Fragment>
      ))}
    </PayHomeCard>
  </section>
);
