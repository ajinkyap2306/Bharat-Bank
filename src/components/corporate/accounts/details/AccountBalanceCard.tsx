import React from 'react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { BalanceVisibilityToggle } from '../overview/BalanceVisibilityToggle';
import { formatCorpCurrencyFull } from '../../home/shared/CorporateHomeUI';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';

interface AccountBalanceCardProps {
  account: CorporateAccount;
  isPrimary: boolean;
  showBalances: boolean;
  onToggleVisibility: () => void;
  isLoading?: boolean;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  account,
  isPrimary,
  showBalances,
  onToggleVisibility,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="mx-4 h-44 rounded-3xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  const mask = (value: string) => (showBalances ? value : '₹••••••••');

  return (
    <div
      className={`mx-4 rounded-3xl p-5 shadow-lg ${
        isPrimary
          ? 'bg-linear-to-tr from-[#0B5CAB] via-blue-600 to-indigo-700 text-white shadow-[#0B5CAB]/20'
          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-[#111827] dark:text-white shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-[15px] font-bold ${isPrimary ? 'text-white' : ''}`}>
              {account.accountType}
            </p>
            {isPrimary && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                ★ Primary
              </span>
            )}
          </div>
          <p
            className={`text-[28px] font-extrabold tabular-nums tracking-tight mt-3 ${
              isPrimary ? 'text-white' : ''
            }`}
          >
            {mask(formatCorpCurrencyFull(account.availableBalance))}
          </p>
          <p className={`text-[12px] font-medium mt-0.5 ${isPrimary ? 'text-blue-100' : 'text-[#667085]'}`}>
            Available Balance
          </p>
        </div>
        <BalanceVisibilityToggle
          visible={showBalances}
          onToggle={onToggleVisibility}
          variant={isPrimary ? 'onPrimary' : 'default'}
        />
      </div>

      <div
        className={`grid grid-cols-2 gap-3 mt-4 pt-4 border-t ${
          isPrimary ? 'border-white/20' : 'border-slate-100 dark:border-slate-800'
        }`}
      >
        <div>
          <p className={`text-[11px] ${isPrimary ? 'text-blue-100' : 'text-[#667085]'}`}>Current Balance</p>
          <p className={`text-[15px] font-bold tabular-nums mt-0.5 ${isPrimary ? 'text-white' : ''}`}>
            {mask(formatCorpCurrencyFull(account.balance))}
          </p>
        </div>
        {account.holdAmount != null && account.holdAmount > 0 && (
          <div>
            <p className={`text-[11px] ${isPrimary ? 'text-blue-100' : 'text-[#667085]'}`}>Hold Amount</p>
            <p className={`text-[15px] font-bold tabular-nums mt-0.5 ${isPrimary ? 'text-white' : ''}`}>
              {mask(formatCorpCurrencyFull(account.holdAmount))}
            </p>
          </div>
        )}
      </div>

      <div
        className={`flex items-center justify-between mt-4 pt-3 border-t ${
          isPrimary ? 'border-white/20' : 'border-slate-100 dark:border-slate-800'
        }`}
      >
        <span className={`text-[13px] font-mono ${isPrimary ? 'text-blue-100' : 'text-[#667085]'}`}>
          A/C {account.maskedNumber}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[12px] font-semibold ${isPrimary ? 'text-blue-100' : 'text-[#667085]'}`}>
            {account.currencyCode}
          </span>
          {!isPrimary && <AccountStatusBadge status={account.displayStatus} />}
          {isPrimary && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              {account.displayStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
