import React from 'react';
import { CalendarClock } from 'lucide-react';
import type { CorporateUpcomingPayment } from '../../../types/corporateDashboard';
import {
  CorpListCard,
  CorpListDivider,
  CorpSectionHeader,
  CorpSkeleton,
  CorpTxnStatus,
  formatCorpCurrency,
} from './shared/CorporateHomeUI';

interface UpcomingPaymentsProps {
  payments: CorporateUpcomingPayment[];
  isLoading?: boolean;
  onViewAll: () => void;
  onPaymentClick?: (paymentId: string) => void;
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({
  payments,
  isLoading,
  onViewAll,
  onPaymentClick,
}) => (
  <section aria-label="Upcoming Payments">
    <CorpSectionHeader title="Upcoming Payments" action="View All" onAction={onViewAll} />
    {isLoading ? (
      <CorpSkeleton className="h-28 mx-4" />
    ) : payments.length === 0 ? (
      <CorpListCard className="px-3 py-4 text-center">
        <p className="text-xs font-medium text-[#667085]">No upcoming payments</p>
      </CorpListCard>
    ) : (
      <CorpListCard>
        {payments.slice(0, 2).map((payment, index) => (
          <React.Fragment key={payment.id}>
            {index > 0 && <CorpListDivider />}
            <button
              type="button"
              onClick={() => onPaymentClick?.(payment.id)}
              className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#111827] dark:text-white truncate">
                    {payment.title}
                  </p>
                  <p className="text-[13px] font-bold text-[#111827] dark:text-white tabular-nums shrink-0">
                    {formatCorpCurrency(payment.amount)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[11px] text-[#667085] truncate">
                    {payment.dueDate}
                    {payment.sourceAccount ? ` · ${payment.sourceAccount}` : ''}
                  </p>
                  <CorpTxnStatus
                    compact
                    status={payment.status === 'Scheduled' ? 'Scheduled' : 'Pending Approval'}
                  />
                </div>
              </div>
            </button>
          </React.Fragment>
        ))}
      </CorpListCard>
    )}
  </section>
);
