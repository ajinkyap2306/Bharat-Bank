import React from 'react';
import type { SourceAccountDetails } from '../../../../types/corporateTransactionDetails';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface SourceAccountCardProps {
  account: SourceAccountDetails;
  currency: string;
  showBalances: boolean;
}

export const SourceAccountCard: React.FC<SourceAccountCardProps> = ({
  account,
  currency,
  showBalances,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm" aria-label="From Account">
    <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">From Account</h2>
    <p className="text-[16px] font-semibold text-[#111827] dark:text-white">{account.accountType}</p>
    <p className="text-[13px] text-[#667085] mt-0.5">{account.companyName}</p>
    <p className="text-[14px] font-mono text-[#667085] mt-2">{account.maskedNumber}</p>
    <div className="flex justify-between gap-3 mt-3 pt-3 border-t border-[#E4E7EC]/80 dark:border-slate-800 text-[13px]">
      <span className="text-[#667085]">Available Balance</span>
      <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
        {showBalances ? formatAccountCurrency(account.availableBalance, currency) : '••••••••'}
      </span>
    </div>
  </section>
);
