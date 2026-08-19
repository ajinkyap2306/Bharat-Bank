import React from 'react';
import type { AccountsCategorySummary } from '../../../../types/corporateAccountsOverview';
import { AccountsCard, AccountsSkeleton } from '../shared/CorporateAccountsUI';

interface AccountSummaryProps {
  summary: AccountsCategorySummary;
  isLoading?: boolean;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) return <AccountsSkeleton className="h-20 mx-4" />;

  const items = [
    { label: 'Total Accounts', value: summary.total },
    { label: 'Operating', value: summary.operating },
    { label: 'Payroll', value: summary.payroll },
    { label: 'Collections', value: summary.collections },
    { label: 'Savings', value: summary.savings },
  ].filter((item) => item.value > 0 || item.label === 'Total Accounts');

  return (
    <AccountsCard className="!mx-4 p-3 border-[#E4E7EC]">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <div key={item.label} className="shrink-0 min-w-18 text-center">
            <p className="text-[11px] text-[#667085]">{item.label}</p>
            <p className="text-[15px] font-semibold text-[#111827] dark:text-white tabular-nums mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </AccountsCard>
  );
};
