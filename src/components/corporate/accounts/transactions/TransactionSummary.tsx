import React from 'react';
import type { AccountTransactionsSummary } from '../../../../types/corporateAccountTransactions';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface TransactionSummaryProps {
  summary: AccountTransactionsSummary;
  currency: string;
  showBalances: boolean;
  isLoading?: boolean;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  summary,
  currency,
  showBalances,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="mx-4 h-16 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  const mask = (amount: number, prefix: string) =>
    showBalances ? `${prefix} ${formatAccountCurrency(amount, currency)}` : '••••••';

  const items = [
    { label: 'Today', value: `${summary.todayCount} Transactions` },
    { label: 'Money In', value: mask(summary.moneyIn, '+'), className: 'text-[#16A34A]' },
    { label: 'Money Out', value: mask(summary.moneyOut, '−'), className: 'text-[#DC2626]' },
    {
      label: 'Net',
      value: showBalances
        ? `${summary.netFlow >= 0 ? '+' : '−'} ${formatAccountCurrency(Math.abs(summary.netFlow), currency)}`
        : '••••••',
      className: summary.netFlow >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]',
    },
  ];

  return (
    <div className="px-4">
      <div className="flex gap-3 overflow-x-auto no-scrollbar rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-3 shadow-sm">
        {items.map((item) => (
          <div key={item.label} className="shrink-0 min-w-22">
            <p className="text-[11px] text-[#667085]">{item.label}</p>
            <p className={`text-[13px] font-semibold tabular-nums mt-0.5 ${item.className ?? 'text-[#111827] dark:text-white'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
