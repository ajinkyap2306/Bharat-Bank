import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { CorpListCard, CorpListDivider, CorpSectionHeader } from '../../home/shared/CorporateHomeUI';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface RecentTransactionsProps {
  transactions: CorporateAccountTransaction[];
  currency?: string;
  showBalances: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onViewAll: () => void;
  onSelect: (transactionId: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currency = '₹',
  showBalances,
  isLoading,
  hasError,
  onRetry,
  onViewAll,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <section aria-label="Recent Transactions">
        <CorpSectionHeader title="Recent Transactions" />
        <div className="mx-4 h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
      </section>
    );
  }

  const preview = transactions.slice(0, 3);

  return (
    <section aria-label="Recent Transactions">
      <CorpSectionHeader title="Recent Transactions" action="View All" onAction={onViewAll} />

      {hasError ? (
        <CorpListCard className="p-4 text-center">
          <p className="text-[14px] font-medium text-slate-900 dark:text-white">
            Unable to load recent transactions
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
          >
            Retry
          </button>
        </CorpListCard>
      ) : preview.length === 0 ? (
        <CorpListCard className="p-6 text-center">
          <p className="text-[14px] text-slate-500 dark:text-slate-400">No recent transactions</p>
        </CorpListCard>
      ) : (
        <CorpListCard>
          {preview.map((txn, index) => {
            const isCredit = txn.type === 'credit';
            const amountPrefix = isCredit ? '+' : '−';
            return (
              <React.Fragment key={txn.id}>
                {index > 0 && <CorpListDivider />}
                <button
                  type="button"
                  onClick={() => onSelect(txn.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
                  aria-label={`${txn.counterpartyName}, ${txn.txnType}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                        {txn.counterpartyName}
                      </p>
                      <p
                        className={`text-[14px] font-extrabold tabular-nums shrink-0 ${
                          isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {showBalances
                          ? `${amountPrefix} ${formatAccountCurrency(txn.amount, currency)}`
                          : '••••••'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">{txn.txnType}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">{txn.dateGroup}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
                </button>
              </React.Fragment>
            );
          })}
        </CorpListCard>
      )}
    </section>
  );
};
