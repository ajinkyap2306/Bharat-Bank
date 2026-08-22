import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';
import { CorpListCard } from '../../home/shared/CorporateHomeUI';

interface AccountInformationProps {
  account: CorporateAccount;
  isLoading?: boolean;
  expandKey?: number;
}

export const AccountInformation: React.FC<AccountInformationProps> = ({
  account,
  isLoading,
  expandKey = 0,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expandKey > 0) setExpanded(true);
  }, [expandKey]);

  if (isLoading) {
    return <div className="mx-4 h-16 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  const rows = [
    { label: 'Account Name', value: account.nickname || account.accountType },
    { label: 'Account Number', value: account.maskedNumber },
    { label: 'Account Type', value: account.accountType },
    { label: 'Currency', value: account.currencyCode },
    { label: 'Branch', value: account.branch },
    { label: 'IFSC', value: account.ifsc },
    { label: 'Opening Date', value: account.openingDate },
    { label: 'Status', value: account.displayStatus },
  ];

  return (
    <section className="px-4" aria-label="Account Information">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full"
        aria-expanded={expanded}
      >
        <CorpListCard className="p-4 flex items-center justify-between gap-3 text-left">
          <span className="text-[15px] font-bold text-slate-900 dark:text-white">Account Information</span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
          )}
        </CorpListCard>
      </button>

      {expanded && (
        <CorpListCard className="mt-2 p-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <span className="text-[13px] text-slate-500 dark:text-slate-400 shrink-0">{row.label}</span>
              {row.label === 'Status' ? (
                <AccountStatusBadge status={account.displayStatus} />
              ) : (
                <span className="text-[13px] font-semibold text-slate-900 dark:text-white text-right">
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </CorpListCard>
      )}
    </section>
  );
};
