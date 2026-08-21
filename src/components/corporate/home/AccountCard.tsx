import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Eye, EyeOff, Wallet } from 'lucide-react';
import type { CorporateDashboardAccount } from '../../../types/corporateDashboard';
import { formatCorpCurrency, formatCorpCurrencyFull } from './shared/CorporateHomeUI';

interface AccountCardProps {
  account: CorporateDashboardAccount;
  isPrimary?: boolean;
  isHidden?: boolean;
  onToggleHidden: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isPrimary = false,
  isHidden = false,
  onToggleHidden,
  onClick,
}) => (
  <motion.article
    whileTap={{ scale: 0.98 }}
    className={`shrink-0 min-w-[calc(100vw-2.5rem)] max-w-[22rem] p-4.5 rounded-3xl snap-center shadow-lg transition-all ${
      isPrimary
        ? 'bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-blue-500/20'
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#111827] dark:text-white'
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isPrimary ? 'bg-white/20' : 'bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400'
          }`}
        >
          <Wallet className="w-4 h-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className={`text-xs font-bold truncate ${
              isPrimary ? 'text-white' : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {account.name}
          </p>
          {isPrimary && (
            <p className="text-[10px] font-bold text-blue-100 mt-0.5">★ Primary Account</p>
          )}
          <p
            className={`text-[10px] font-mono ${
              isPrimary ? 'text-blue-100' : 'text-slate-400'
            }`}
          >
            {account.maskedNumber}
          </p>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
          isPrimary
            ? 'bg-white/20 text-white'
            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {account.status}
      </span>
    </div>

    <div className="mt-3">
      <div className="flex items-center justify-between">
        <p
          className={`text-[10px] font-medium ${
            isPrimary ? 'text-blue-100' : 'text-slate-400'
          }`}
        >
          Available Balance
        </p>
        <button
          type="button"
          onClick={onToggleHidden}
          className={`p-1 rounded-lg transition-colors flex items-center justify-center ${
            isPrimary
              ? 'text-blue-100 hover:text-white hover:bg-white/20'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label={isHidden ? 'Show balance' : 'Hide balance'}
        >
          {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p className="text-xl font-extrabold tracking-tight mt-0.5 tabular-nums">
        {isHidden ? '••••••••' : formatCorpCurrencyFull(account.availableBalance)}
      </p>
    </div>

    <div
      className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 text-[11px] ${
        isPrimary ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800 text-slate-500'
      }`}
    >
      <span>Ledger: {isHidden ? '••••••' : formatCorpCurrency(account.balance)}</span>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-0.5 text-[11px] font-bold shrink-0 ${
          isPrimary ? 'text-white hover:underline' : 'text-congress-blue-700 dark:text-congress-blue-400 hover:underline'
        }`}
      >
        View Account
        <ChevronRight className="w-3.5 h-3.5" aria-hidden />
      </button>
    </div>
  </motion.article>
);
