import React from 'react';
import type { AccountFilterState } from '../../../../types/corporateAccountsOverview';
import type { CorporateAccountCategory, CorporateAccountDisplayStatus } from '../../../../types/corporateAccounts';
import { BottomSheet } from '../../../common/BottomSheet';

const CATEGORY_OPTIONS: { id: Exclude<CorporateAccountCategory, 'all'>; label: string }[] = [
  { id: 'operating', label: 'Operating' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'collections', label: 'Collections' },
  { id: 'savings', label: 'Savings' },
  { id: 'loan', label: 'Loans' },
];

const STATUS_OPTIONS: CorporateAccountDisplayStatus[] = [
  'Active',
  'Restricted',
  'Dormant',
];

const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR'];

interface AccountFilterSheetProps {
  isOpen: boolean;
  filters: AccountFilterState;
  onChange: (filters: AccountFilterState) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export const AccountFilterSheet: React.FC<AccountFilterSheetProps> = ({
  isOpen,
  filters,
  onChange,
  onClose,
  onApply,
  onReset,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Accounts">
    <div className="space-y-5 pb-2">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Account Type</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({ ...filters, categories: toggleItem(filters.categories, opt.id) })
              }
              className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
                filters.categories.includes(opt.id)
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                onChange({ ...filters, statuses: toggleItem(filters.statuses, status) })
              }
              className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
                filters.statuses.includes(status)
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Currency</p>
        <div className="flex flex-wrap gap-2">
          {CURRENCY_OPTIONS.map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() =>
                onChange({ ...filters, currencies: toggleItem(filters.currencies, currency) })
              }
              className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
                filters.currencies.includes(currency)
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
      >
        Apply Filters
      </button>
      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 min-h-11"
      >
        Reset
      </button>
    </div>
  </BottomSheet>
);
