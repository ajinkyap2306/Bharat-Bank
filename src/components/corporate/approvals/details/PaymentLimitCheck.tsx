import React from 'react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { ApprovalLimitInfo } from '../../../../types/corporateApprovalDetails';

interface PaymentLimitCheckProps {
  limit: ApprovalLimitInfo;
  currency?: string;
}

export const PaymentLimitCheck: React.FC<PaymentLimitCheckProps> = ({
  limit,
  currency = '₹',
}) => (
  <section
    className={`mx-4 rounded-2xl border p-4 ${
      limit.withinLimit
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
    }`}
    aria-labelledby="limit-check-heading"
  >
    <h2 id="limit-check-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
      Limit Check
    </h2>
    <dl className="mt-3 space-y-2 text-[13px]">
      {[
        { label: 'Daily Payment Limit', value: limit.dailyLimit },
        { label: 'Used Before', value: limit.usedBefore },
        { label: 'This Payment', value: limit.thisPayment },
        { label: 'Remaining After', value: limit.remainingAfter },
      ].map((row) => (
        <div key={row.label} className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
          <dd className="font-medium tabular-nums">
            {formatPaymentCurrency(row.value, currency)}
          </dd>
        </div>
      ))}
    </dl>
    <p
      className={`mt-3 text-[13px] font-semibold ${
        limit.withinLimit ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'
      }`}
      role="status"
    >
      {limit.withinLimit ? '✓ Within Limit' : 'Limit Exceeded'}
    </p>
  </section>
);
