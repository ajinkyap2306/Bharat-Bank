import React from 'react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';
import { maskAmount } from './LimitsUI';

interface LimitsAccountSummaryProps {
  account: CorporateAccount;
  showBalances: boolean;
}

export const LimitsAccountSummary: React.FC<LimitsAccountSummaryProps> = ({
  account,
  showBalances,
}) => (
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
        <AccountStatusBadge status={account.displayStatus} />
      </div>
      <div className="mt-3 pt-3 border-t border-[#E4E7EC]/80 dark:border-slate-800">
        <p className="text-[12px] text-[#667085]">Available Balance</p>
        <p className="text-[20px] font-bold text-[#111827] dark:text-white tabular-nums mt-0.5">
          {maskAmount(account.availableBalance, account.currency, showBalances)}
        </p>
      </div>
    </div>
  </section>
);
