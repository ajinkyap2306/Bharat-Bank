import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { CorporateDashboardTransaction } from '../../../types/corporateDashboard';
import {
  CorpListCard,
  CorpListDivider,
  CorpSectionHeader,
  CorpSkeleton,
  formatCorpCurrency,
} from './shared/CorporateHomeUI';

interface RecentTransactionsProps {
  transactions: CorporateDashboardTransaction[];
  isLoading?: boolean;
  onViewAll: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading,
  onViewAll,
}) => (
  <section aria-label="Recent Activity">
    <CorpSectionHeader title="Recent Activity" action="View All" onAction={onViewAll} />
    {isLoading ? (
      <CorpSkeleton className="h-36 mx-4" />
    ) : transactions.length === 0 ? (
      <CorpListCard className="px-3 py-4 text-center">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No recent activity</p>
      </CorpListCard>
    ) : (
      <CorpListCard>
        {transactions.slice(0, 3).map((txn, index) => {
          const isCredit = txn.direction === 'credit';
          return (
            <React.Fragment key={txn.id}>
              {index > 0 && <CorpListDivider />}
              <div className="px-3 py-2.5 flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCredit
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="w-4 h-4" aria-hidden />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" aria-hidden />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                      {txn.title}
                    </p>
                    <p
                      className={`text-[13px] font-bold tabular-nums shrink-0 ${
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isCredit ? '+' : '−'}
                      {formatCorpCurrency(txn.amount)}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {txn.subtitle} · {txn.date}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </CorpListCard>
    )}
  </section>
);
