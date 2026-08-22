import React from 'react';
import type { AccountsOverviewBalance } from '../../../../types/corporateAccountsOverview';
import { BalanceVisibilityToggle } from './BalanceVisibilityToggle';
import { AccountsSkeleton } from '../shared/CorporateAccountsUI';
import { formatCorpCurrency } from '../../home/shared/CorporateHomeUI';

interface TotalBalanceCardProps {
  balance: AccountsOverviewBalance;
  showBalances: boolean;
  onToggleVisibility: () => void;
  isLoading?: boolean;
}

export const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({
  balance,
  showBalances,
  onToggleVisibility,
  isLoading,
}) => {
  if (isLoading) return <AccountsSkeleton className="h-24 mx-4 rounded-2xl" />;

  const displayAmount = showBalances
    ? formatCorpCurrency(balance.availableBalance)
    : '₹••••••';

  return (
    <div className="mx-4 rounded-2xl bg-linear-to-tr from-congress-blue-800 via-blue-600 to-indigo-700 text-white px-4 py-3 shadow-md shadow-congress-blue-700/15">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-blue-100">Total Available Balance</p>
          <p className="text-[22px] font-extrabold tabular-nums tracking-tight leading-tight mt-0.5">
            {displayAmount}
          </p>
          <p className="text-[11px] font-semibold text-blue-100/90 mt-1">
            {balance.accountCount} Account{balance.accountCount === 1 ? '' : 's'}
          </p>
        </div>
        <BalanceVisibilityToggle
          visible={showBalances}
          onToggle={onToggleVisibility}
          variant="onPrimary"
        />
      </div>
    </div>
  );
};
