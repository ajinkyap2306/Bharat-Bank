import React from 'react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';

interface AccountHeaderCardProps {
  account: CorporateAccount;
  isPrimary: boolean;
  customNickname?: string;
  isLoading?: boolean;
}

export const AccountHeaderCard: React.FC<AccountHeaderCardProps> = ({
  account,
  isPrimary,
  customNickname,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="mx-4 h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold text-slate-900 dark:text-white">
            {account.accountType}
          </p>
          {customNickname && (
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">{customNickname}</p>
          )}
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1 truncate">{account.companyName}</p>
        </div>
        {isPrimary && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400 shrink-0">
            Primary
          </span>
        )}
      </div>

      <p className="text-[15px] font-mono text-slate-500 dark:text-slate-400 tracking-wide mt-3">{account.maskedNumber}</p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
        <AccountStatusBadge status={account.displayStatus} />
        <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{account.currencyCode}</span>
      </div>
    </div>
  );
};
