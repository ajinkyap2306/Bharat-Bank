import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronLeft } from 'lucide-react';
import { CORPORATE_ACCOUNTS_LIST } from '../../../../data/corporateAccountsMock';
import { CorporateAccount } from '../../../../types/corporateAccounts';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface AccountSearchOverlayProps {
  accounts: CorporateAccount[];
  onClose: () => void;
  onSelect: (accountId: string) => void;
}

export const AccountSearchOverlay: React.FC<AccountSearchOverlayProps> = ({
  accounts,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return accounts.filter(
      (a) =>
        a.nickname.toLowerCase().includes(q) ||
        a.accountType.toLowerCase().includes(q) ||
        a.maskedNumber.toLowerCase().includes(q) ||
        a.currencyCode.toLowerCase().includes(q) ||
        a.accountNumber.includes(q)
    );
  }, [accounts, query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col"
    >
      <div className="px-3 pt-3 pb-2 safe-top border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {query.trim() === '' ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">Search by account name, number, or type</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">No accounts found</p>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a.id)}
                className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {a.nickname} ••••{a.maskedNumber.slice(-4)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{a.accountType} • {formatAccountCurrency(a.availableBalance, a.currency)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
