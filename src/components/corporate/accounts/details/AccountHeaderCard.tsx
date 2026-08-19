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
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold text-[#111827] dark:text-white">
            {account.accountType}
          </p>
          {customNickname && (
            <p className="text-[14px] text-[#667085] mt-0.5">{customNickname}</p>
          )}
          <p className="text-[14px] text-[#667085] mt-1 truncate">{account.companyName}</p>
        </div>
        {isPrimary && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0B5CAB]/10 text-[#0B5CAB] shrink-0">
            Primary
          </span>
        )}
      </div>

      <p className="text-[15px] font-mono text-[#667085] tracking-wide mt-3">{account.maskedNumber}</p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E4E7EC]/80 dark:border-slate-800">
        <AccountStatusBadge status={account.displayStatus} />
        <span className="text-[13px] font-medium text-[#667085]">{account.currencyCode}</span>
      </div>
    </div>
  );
};
