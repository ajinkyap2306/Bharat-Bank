import React from 'react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { TransactionItem } from './TransactionItem';

interface TransactionGroupProps {
  title: string;
  subtitle?: string;
  transactions: CorporateAccountTransaction[];
  currency: string;
  showBalances: boolean;
  onSelect: (txnId: string) => void;
}

export const TransactionGroup: React.FC<TransactionGroupProps> = ({
  title,
  subtitle,
  transactions,
  currency,
  showBalances,
  onSelect,
}) => {
  if (transactions.length === 0) return null;

  return (
    <section aria-label={`${title} transactions`}>
      <div className="px-4 mb-2">
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {transactions.map((txn) => (
          <TransactionItem
            key={txn.id}
            txn={txn}
            currency={currency}
            showBalances={showBalances}
            onClick={() => onSelect(txn.id)}
          />
        ))}
      </div>
    </section>
  );
};
