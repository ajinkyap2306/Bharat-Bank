import React from 'react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { ApprovalsDashboardSummary } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalSummaryProps {
  summary: ApprovalsDashboardSummary;
  hideAmounts?: boolean;
}

export const ApprovalSummary: React.FC<ApprovalSummaryProps> = ({
  summary,
  hideAmounts = false,
}) => {
  const amountLabel = hideAmounts
    ? '₹••••••'
    : formatPaymentCurrency(summary.totalPendingAmount);

  const stats = [
    { label: 'Pending', value: String(summary.pendingCount) },
    { label: 'Total Amount', value: amountLabel },
    { label: 'Urgent', value: String(summary.urgentCount), urgent: summary.urgentCount > 0 },
    { label: 'Due Today', value: String(summary.dueTodayCount) },
  ];

  return (
    <section className="mx-4" aria-labelledby="approval-summary-heading">
      <h2 id="approval-summary-heading" className="sr-only">
        Approval summary
      </h2>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-[#F7F9FC] dark:bg-slate-800/50 px-3 py-2.5"
            >
              <p className="text-[11px] font-medium text-[#667085]">{stat.label}</p>
              <p
                className={`text-[16px] font-extrabold tabular-nums mt-0.5 ${
                  stat.urgent ? 'text-[#DC2626]' : 'text-[#111827] dark:text-white'
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
