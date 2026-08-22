import React, { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { getAccountById, getTransactionsForAccount } from '../../../../data/corporateAccountsMock';
import { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { AccountsCard, TxnStatusBadge, formatAccountCurrency } from '../shared/CorporateAccountsUI';
import {
  TransactionFilterSheet,
  DEFAULT_TXN_FILTERS,
  TransactionFilters,
} from '../components/TransactionFilterSheet';

interface TransactionHistoryScreenProps {
  accountId: string;
  onBack: () => void;
  onOpenTransaction: (txnId: string) => void;
}

const matchesFilter = (txn: CorporateAccountTransaction, filters: TransactionFilters): boolean => {
  if (filters.type !== 'all') {
    const t = filters.type;
    if (t === 'credit' && txn.type !== 'credit') return false;
    if (t === 'debit' && txn.type !== 'debit') return false;
    if (t !== 'credit' && t !== 'debit' && !txn.txnType.toLowerCase().includes(t)) return false;
  }
  if (filters.status !== 'all') {
    const s = txn.status.toLowerCase().replace(' ', '');
    if (!s.includes(filters.status.replace('pending', 'pending'))) {
      const map: Record<string, string> = {
        completed: 'completed',
        pending: 'pending',
        processing: 'processing',
        failed: 'failed',
        rejected: 'rejected',
        reversed: 'reversed',
      };
      if (!txn.status.toLowerCase().includes(map[filters.status] || filters.status)) return false;
    }
  }
  return true;
};

export const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  accountId,
  onBack,
  onOpenTransaction,
}) => {
  const account = getAccountById(accountId);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_TXN_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const txns = useMemo(() => {
    let list = getTransactionsForAccount(accountId);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.counterpartyName.toLowerCase().includes(q) ||
          t.referenceNumber.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }
    list = list.filter((t) => matchesFilter(t, filters));
    return list;
  }, [accountId, query, filters]);

  const grouped = useMemo(() => {
    const map = new Map<string, CorporateAccountTransaction[]>();
    txns.forEach((t) => {
      const g = map.get(t.dateGroup) || [];
      g.push(t);
      map.set(t.dateGroup, g);
    });
    return map;
  }, [txns]);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Transaction History" subtitle={account?.nickname} onBack={onBack} edgeToEdge={false} />
      <div className="px-3 mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beneficiary, reference, amount..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <button type="button" onClick={() => setShowFilters(true)} className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      {isLoading ? (
        <div className="mx-3 h-40 rounded-2xl bg-slate-200/60 animate-pulse" />
      ) : txns.length === 0 ? (
        <AccountsCard className="p-6 text-center mx-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white">No transactions found</p>
          <button type="button" onClick={() => { setQuery(''); setFilters(DEFAULT_TXN_FILTERS); }} className="mt-3 text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400">
            Clear filters
          </button>
        </AccountsCard>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([group, items]) => (
            <div key={group}>
              <p className="px-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{group}</p>
              <AccountsCard className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((txn) => (
                  <button
                    key={txn.id}
                    type="button"
                    onClick={() => onOpenTransaction(txn.id)}
                    className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{txn.counterpartyName}</p>
                        <p className={`text-sm font-mono font-bold mt-0.5 ${txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {txn.type === 'credit' ? '+' : '-'} {formatAccountCurrency(txn.amount, account?.currency || '₹')}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{txn.date} • {txn.time}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{txn.txnType}</p>
                      </div>
                      <TxnStatusBadge status={txn.status} />
                    </div>
                  </button>
                ))}
              </AccountsCard>
            </div>
          ))}
        </div>
      )}

      <TransactionFilterSheet isOpen={showFilters} onClose={() => setShowFilters(false)} filters={filters} onApply={setFilters} />
    </div>
  );
};
