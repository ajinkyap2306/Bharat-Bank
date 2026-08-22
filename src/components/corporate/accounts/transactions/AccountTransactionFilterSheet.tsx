import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { AccountTransactionFilters, TransactionAmountRange, TransactionSortOption } from '../../../../types/corporateAccountTransactions';
import type { CorporateTxnFilterStatus, CorporateTxnFilterType } from '../../../../types/corporateAccounts';

const TYPE_OPTIONS: { id: CorporateTxnFilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Credit' },
  { id: 'debit', label: 'Debit' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'payment', label: 'Payment' },
  { id: 'collection', label: 'Collection' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'fee', label: 'Fee' },
];

const STATUS_OPTIONS: { id: CorporateTxnFilterStatus; label: string }[] = [
  { id: 'completed', label: 'Completed' },
  { id: 'processing', label: 'Processing' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'reversed', label: 'Reversed' },
];

const DATE_OPTIONS = [
  { id: 'today' as const, label: 'Today' },
  { id: '7d' as const, label: 'Last 7 Days' },
  { id: '30d' as const, label: 'Last 30 Days' },
  { id: '90d' as const, label: 'Last 90 Days' },
];

const AMOUNT_OPTIONS: { id: TransactionAmountRange; label: string }[] = [
  { id: 'under_10k', label: 'Under ₹10,000' },
  { id: '10k_1l', label: '₹10,000–₹1 Lakh' },
  { id: '1l_5l', label: '₹1–5 Lakh' },
  { id: 'above_5l', label: 'Above ₹5 Lakh' },
];

const SORT_OPTIONS: { id: TransactionSortOption; label: string }[] = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'highest', label: 'Highest Amount' },
  { id: 'lowest', label: 'Lowest Amount' },
];

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

interface AccountTransactionFilterSheetProps {
  isOpen: boolean;
  filters: AccountTransactionFilters;
  onChange: (filters: AccountTransactionFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

const Chip: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({
  active,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
      active
        ? 'bg-congress-blue-700 text-white'
        : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
    }`}
  >
    {label}
  </button>
);

export const AccountTransactionFilterSheet: React.FC<AccountTransactionFilterSheetProps> = ({
  isOpen,
  filters,
  onChange,
  onClose,
  onApply,
  onReset,
}) => {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (isOpen) setLocal(filters);
  }, [isOpen, filters]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Transactions">
      <div className="space-y-5 pb-2 max-h-[60vh] overflow-y-auto">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <Chip
                key={opt.id}
                active={local.types.includes(opt.id)}
                label={opt.label}
                onClick={() =>
                  setLocal({
                    ...local,
                    types: opt.id === 'all' ? [] : toggleItem(local.types.filter((t) => t !== 'all'), opt.id),
                  })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <Chip
                key={opt.id}
                active={local.statuses.includes(opt.id)}
                label={opt.label}
                onClick={() =>
                  setLocal({ ...local, statuses: toggleItem(local.statuses, opt.id) })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Date</p>
          <div className="flex flex-wrap gap-2">
            {DATE_OPTIONS.map((opt) => (
              <Chip
                key={opt.id}
                active={local.date === opt.id}
                label={opt.label}
                onClick={() => setLocal({ ...local, date: opt.id })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Amount</p>
          <div className="flex flex-wrap gap-2">
            {AMOUNT_OPTIONS.map((opt) => (
              <Chip
                key={opt.id}
                active={local.amountRange === opt.id}
                label={opt.label}
                onClick={() =>
                  setLocal({
                    ...local,
                    amountRange: local.amountRange === opt.id ? 'all' : opt.id,
                  })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Sort</p>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Chip
                key={opt.id}
                active={local.sort === opt.id}
                label={opt.label}
                onClick={() => setLocal({ ...local, sort: opt.id })}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onChange(local);
            onApply();
          }}
          className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="w-full py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 min-h-11"
        >
          Reset
        </button>
      </div>
    </BottomSheet>
  );
};
