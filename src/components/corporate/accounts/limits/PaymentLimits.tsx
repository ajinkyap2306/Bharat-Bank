import React from 'react';
import type { PaymentLimitItem } from '../../../../types/corporateAccountLimits';
import { LimitsCard, LimitsRow, maskAmount } from './LimitsUI';

interface PaymentLimitsProps {
  items: PaymentLimitItem[];
  currency?: string;
  showBalances: boolean;
}

export const PaymentLimits: React.FC<PaymentLimitsProps> = ({
  items,
  currency = '₹',
  showBalances,
}) => (
  <section className="px-4" aria-label="Payment limits">
    <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
      Payment Limits
    </h2>
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800/80 dark:divide-slate-800 shadow-sm">
      {items.map((item) => (
        <div key={item.id} className="p-4">
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white mb-2">
            {item.label}
          </p>
          <LimitsRow
            label="Daily"
            value={maskAmount(item.dailyLimit, currency, showBalances)}
          />
          <LimitsRow
            label="Single"
            value={maskAmount(item.singleLimit, currency, showBalances)}
          />
        </div>
      ))}
    </div>
  </section>
);
