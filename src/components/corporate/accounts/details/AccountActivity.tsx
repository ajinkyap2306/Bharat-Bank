import React from 'react';
import type { CorporateAccountActivity } from '../../../../types/corporateAccounts';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface AccountActivityProps {
  activity: CorporateAccountActivity;
  currency?: string;
  showBalances: boolean;
  isLoading?: boolean;
}

export const AccountActivity: React.FC<AccountActivityProps> = ({
  activity,
  currency = '₹',
  showBalances,
  isLoading,
}) => {
  const netFlow = activity.todayInflow - activity.todayOutflow;

  if (isLoading) {
    return (
      <section className="px-4" aria-label="Today's Activity">
        <div className="h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
      </section>
    );
  }

  const maskAmount = (amount: number, prefix: string) =>
    showBalances ? `${prefix} ${formatAccountCurrency(amount, currency)}` : '••••••';

  return (
    <section className="px-4" aria-label="Today's Activity">
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-3">
        Today&apos;s Activity
      </h2>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Money In</p>
            <p className="text-[16px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
              {maskAmount(activity.todayInflow, '+')}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Money Out</p>
            <p className="text-[16px] font-semibold text-[#DC2626] tabular-nums mt-0.5">
              {maskAmount(activity.todayOutflow, '−')}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Transactions</p>
            <p className="text-[16px] font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {activity.transactionCount}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Net Flow</p>
            <p
              className={`text-[16px] font-semibold tabular-nums mt-0.5 ${
                netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'
              }`}
            >
              {showBalances
                ? `${netFlow >= 0 ? '+' : '−'} ${formatAccountCurrency(Math.abs(netFlow), currency)}`
                : '••••••'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
