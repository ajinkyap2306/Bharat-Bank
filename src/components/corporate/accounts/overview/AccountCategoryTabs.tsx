import React from 'react';
import type { CorporateAccountCategory } from '../../../../types/corporateAccounts';
import { CATEGORY_TABS } from '../shared/CorporateAccountsUI';

interface AccountCategoryTabsProps {
  active: CorporateAccountCategory;
  onChange: (category: CorporateAccountCategory) => void;
}

export const AccountCategoryTabs: React.FC<AccountCategoryTabsProps> = ({
  active,
  onChange,
}) => (
  <div
    className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar"
    role="tablist"
    aria-label="Account categories"
  >
    {CATEGORY_TABS.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={active === tab.id}
        onClick={() => onChange(tab.id)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold min-h-9 transition-colors ${
          active === tab.id
            ? 'bg-congress-blue-700 text-white'
            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
