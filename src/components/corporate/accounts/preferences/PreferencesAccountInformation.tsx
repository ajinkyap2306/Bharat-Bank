import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';
import { PreferencesCard } from './PreferencesUI';

interface AccountInformationProps {
  account: CorporateAccount;
}

export const PreferencesAccountInformation: React.FC<AccountInformationProps> = ({ account }) => {
  const [expanded, setExpanded] = useState(false);

  const rows = [
    { label: 'Account Type', value: account.accountType },
    { label: 'Account Number', value: account.maskedNumber },
    { label: 'Currency', value: account.currencyCode },
    { label: 'Branch', value: account.branch },
    { label: 'Opened', value: account.openingDate },
    { label: 'Status', value: account.displayStatus, isStatus: true },
  ];

  return (
    <PreferencesCard ariaLabel="Account information">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 min-h-13"
        aria-expanded={expanded}
      >
        <span className="text-[16px] font-semibold text-[#111827] dark:text-white">
          Account Information
        </span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#667085]" aria-hidden />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#667085]" aria-hidden />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#E4E7EC]/80 dark:border-slate-800">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-3 py-2.5 border-b border-[#E4E7EC]/60 dark:border-slate-800 last:border-0"
            >
              <span className="text-[13px] text-[#667085] shrink-0">{row.label}</span>
              {row.isStatus ? (
                <AccountStatusBadge status={account.displayStatus} />
              ) : (
                <span className="text-[13px] font-medium text-[#111827] dark:text-white text-right">
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </PreferencesCard>
  );
};
