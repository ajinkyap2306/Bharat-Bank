import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';

interface PaymentLimitCheckProps {
  dailyLimit: number;
  usedBefore: number;
  thisPayment: number;
  usedAfter: number;
  remaining: number;
  withinLimit: boolean;
  currency?: string;
}

export const PaymentLimitCheck: React.FC<PaymentLimitCheckProps> = ({
  dailyLimit,
  usedBefore,
  thisPayment,
  usedAfter,
  remaining,
  withinLimit,
  currency = '₹',
}) => (
  <section className="px-4" aria-labelledby="payment-limit-heading">
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        withinLimit
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          : 'bg-[#DC2626]/5 border-[#DC2626]/20'
      }`}
    >
      <h2 id="payment-limit-heading" className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
        Payment Limit
      </h2>
      <dl className="space-y-2 text-[13px]">
        {[
          { label: 'Daily Limit', value: dailyLimit },
          { label: 'Used Before', value: usedBefore },
          { label: 'This Payment', value: thisPayment },
          { label: 'Used After', value: usedAfter },
          { label: 'Remaining', value: remaining },
        ].map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
            <dd className="font-medium tabular-nums">{formatPaymentCurrency(row.value, currency)}</dd>
          </div>
        ))}
      </dl>
      <p
        className={`mt-3 text-[13px] font-semibold ${withinLimit ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'}`}
        role="status"
      >
        {withinLimit ? '✓ Within Limit' : 'Payment limit exceeded'}
      </p>
    </div>
  </section>
);
