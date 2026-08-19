import React from 'react';
import { Star } from 'lucide-react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountStatusBadge, formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface AccountSummaryProps {
  account: CorporateAccount;
  isPrimary: boolean;
  showBalances: boolean;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({
  account,
  isPrimary,
  showBalances,
}) => {
  const balance = showBalances
    ? formatAccountCurrency(account.availableBalance, account.currency)
    : '₹••••••••';

  return (
    <section className="px-4" aria-label="Account summary">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
              {account.accountType}
            </p>
            <p className="text-[12px] text-[#667085] mt-0.5 truncate">{account.companyName}</p>
            <p className="text-[13px] font-medium text-[#667085] mt-1 tabular-nums">
              {account.maskedNumber}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <AccountStatusBadge status={account.displayStatus} />
            {isPrimary && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0B5CAB]/10 text-[#0B5CAB]">
                <Star className="w-3 h-3 fill-[#0B5CAB]" aria-hidden />
                Primary
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#E4E7EC]/80 dark:border-slate-800">
          <p className="text-[12px] text-[#667085]">Available Balance</p>
          <p className="text-[20px] font-bold text-[#111827] dark:text-white tabular-nums mt-0.5">
            {balance}
          </p>
        </div>
      </div>
    </section>
  );
};
