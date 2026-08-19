import React, { useMemo } from 'react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { TransactionGroup } from './TransactionGroup';
import { TransactionSkeleton } from './TransactionStates';

interface TransactionListProps {
  transactions: CorporateAccountTransaction[];
  currency: string;
  showBalances: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onSelect: (txnId: string) => void;
}

function groupTransactions(transactions: CorporateAccountTransaction[]) {
  const order = ['Today', 'Yesterday'];
  const groups = new Map<string, CorporateAccountTransaction[]>();

  transactions.forEach((txn) => {
    const key = txn.dateGroup;
    const list = groups.get(key) || [];
    list.push(txn);
    groups.set(key, list);
  });

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b.localeCompare(a);
  });

  return sortedKeys.map((key) => ({
    title: key === 'Today' || key === 'Yesterday' ? key : 'Older',
    subtitle: key !== 'Today' && key !== 'Yesterday' ? key : key === 'Today' ? '18 Aug 2026' : '17 Aug 2026',
    transactions: groups.get(key) || [],
  }));
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currency,
  showBalances,
  isLoading,
  isLoadingMore,
  onSelect,
}) => {
  const grouped = useMemo(() => groupTransactions(transactions), [transactions]);

  if (isLoading) {
    return <TransactionSkeleton />;
  }

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <TransactionGroup
          key={group.title + group.subtitle}
          title={group.title}
          subtitle={group.subtitle}
          transactions={group.transactions}
          currency={currency}
          showBalances={showBalances}
          onSelect={onSelect}
        />
      ))}
      {isLoadingMore && (
        <p className="text-center text-[13px] text-[#667085] py-4" aria-live="polite">
          Loading more transactions...
        </p>
      )}
    </div>
  );
};
