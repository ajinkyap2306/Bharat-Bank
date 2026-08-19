import React from 'react';
import { BalanceVisibilityToggle } from '../overview/BalanceVisibilityToggle';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface TransactionBalanceSummaryProps {
  availableBalance: number;
  currentBalance: number;
  currency: string;
  showBalances: boolean;
  onToggleVisibility: () => void;
  isLoading?: boolean;
}

export const TransactionBalanceSummary: React.FC<TransactionBalanceSummaryProps> = ({
  availableBalance,
  currentBalance,
  currency,
  showBalances,
  onToggleVisibility,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="mx-4 h-24 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  const mask = (v: string) => (showBalances ? v : '••••••••');

  return (
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-6">
          <div>
            <p className="text-[11px] text-[#667085]">Available Balance</p>
            <p className="text-[18px] font-semibold text-[#111827] dark:text-white tabular-nums mt-0.5">
              {mask(formatAccountCurrency(availableBalance, currency))}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#667085]">Current Balance</p>
            <p className="text-[15px] font-semibold text-[#111827] dark:text-white tabular-nums mt-0.5">
              {mask(formatAccountCurrency(currentBalance, currency))}
            </p>
          </div>
        </div>
        <BalanceVisibilityToggle visible={showBalances} onToggle={onToggleVisibility} />
      </div>
    </div>
  );
};
