import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface StatementTransactionPreviewProps {
  transactions: CorporateAccountTransaction[];
  currency: string;
  showBalances: boolean;
  onViewFull: () => void;
}

export const StatementTransactionPreview: React.FC<StatementTransactionPreviewProps> = ({
  transactions,
  currency,
  showBalances,
  onViewFull,
}) => (
  <section className="px-4" aria-label="Transactions">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">Transactions</h2>
      <button
        type="button"
        onClick={onViewFull}
        className="text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2"
      >
        View Full Statement
      </button>
    </div>
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800/60 dark:divide-slate-800 shadow-sm overflow-hidden">
      {transactions.slice(0, 8).map((txn) => {
        const isCredit = txn.type === 'credit';
        return (
          <div key={txn.id} className="flex items-center justify-between gap-3 p-4 min-h-16">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white truncate">
                {txn.counterpartyName}
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                {txn.date.split(' ').slice(0, 2).join(' ')} • {txn.txnType}
              </p>
            </div>
            <p className={`text-[14px] font-semibold tabular-nums shrink-0 ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
              {showBalances
                ? `${isCredit ? '+' : '−'} ${formatAccountCurrency(txn.amount, currency)}`
                : '••••••'}
            </p>
          </div>
        );
      })}
    </div>
    <button
      type="button"
      onClick={onViewFull}
      className="w-full mt-3 flex items-center justify-center gap-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-12"
    >
      View Full Statement
      <ChevronRight className="w-4 h-4" />
    </button>
  </section>
);
