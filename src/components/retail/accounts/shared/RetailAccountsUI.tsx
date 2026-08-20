import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { BankAccount, Transaction } from '../../../../types/banking';

export const ACCOUNTS_CARD_GRADIENT =
  'bg-linear-to-br from-congress-blue-800 via-congress-blue-900 to-congress-blue-950';

export function formatInr(amount: number, fractionDigits = 2): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export const AccountsScreenLayout: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  rightAction?: React.ReactNode;
}> = ({ title, subtitle, onBack, children, footer, rightAction }) => (
  <div className="pb-6">
    <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} rightAction={rightAction} />
    <div className="pt-3 space-y-4">{children}</div>
    {footer}
  </div>
);

export const AccountsStickyCTA: React.FC<{
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'danger';
  disabled?: boolean;
  hideBottomNav?: boolean;
}> = ({ label, onClick, variant = 'primary', disabled, hideBottomNav = true }) => (
  <div
    className={`fixed bottom-0 left-0 right-0 z-30 px-3 pt-2 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 ${
      hideBottomNav ? 'pb-4' : 'pb-24'
    }`}
  >
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-colors ${
        variant === 'danger'
          ? 'bg-rose-600 hover:bg-rose-700 text-white'
          : 'bg-congress-blue-700 hover:bg-congress-blue-800 text-white'
      } disabled:opacity-50`}
    >
      {label}
    </button>
  </div>
);

export const AccountCarouselCard: React.FC<{
  account: BankAccount;
  isPrimary: boolean;
  isSelected?: boolean;
  showBalance: boolean;
  onClick: () => void;
  compact?: boolean;
}> = ({ account, isPrimary, isSelected, showBalance, onClick, compact }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`text-left rounded-2xl text-white shadow-lg shrink-0 snap-center ${ACCOUNTS_CARD_GRADIENT} ${
      compact ? 'min-w-[calc(100vw-3rem)] max-w-[19rem] p-4' : 'w-full p-4'
    } ${isSelected ? 'ring-2 ring-congress-blue-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''}`}
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="text-[13px] font-bold truncate">{account.accountType}</p>
        {isPrimary && (
          <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/20 mt-1 inline-block">
            Primary Account
          </span>
        )}
        {account.status === 'frozen' && (
          <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 mt-1 inline-block ml-1">
            🔒 Account Frozen
          </span>
        )}
      </div>
      <span className="text-[10px] font-mono text-white/80 shrink-0">{account.maskedNumber.slice(-4)}</span>
    </div>
    <p className="text-[10px] text-white/70 uppercase tracking-wide">Available Balance</p>
    <p className="text-2xl font-extrabold tabular-nums tracking-tight mt-0.5">
      {showBalance ? formatInr(account.availableBalance) : '••••••••'}
    </p>
    {account.accountType === 'Fixed Deposit' && account.interestRate && (
      <p className="text-[10px] text-white/75 mt-2">{account.interestRate}% p.a.</p>
    )}
  </motion.button>
);

export const AccountHeroCard: React.FC<{
  account: BankAccount;
  isPrimary: boolean;
  showBalance: boolean;
  onToggleBalance: () => void;
  onCopyAccount: () => void;
  onShare?: () => void;
  copied?: boolean;
  showShare?: boolean;
}> = ({
  account,
  isPrimary,
  showBalance,
  onToggleBalance,
  onCopyAccount,
  onShare,
  copied,
  showShare = true,
}) => (
  <div className={`p-5 rounded-3xl text-white shadow-xl border border-congress-blue-700/30 ${ACCOUNTS_CARD_GRADIENT}`}>
    <div className="flex items-start justify-between gap-2 mb-4">
      <div className="min-w-0">
        {isPrimary && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-congress-blue-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
            PRIMARY ACCOUNT
          </span>
        )}
        <p className="text-sm font-bold mt-1">{account.accountType}</p>
        <p className="text-xs text-white/70 font-mono mt-0.5">{account.maskedNumber}</p>
        {account.status === 'frozen' && (
          <span className="text-[9px] uppercase font-bold text-amber-300 mt-1 inline-block">
            🔒 ACCOUNT FROZEN
          </span>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onCopyAccount}
          className="flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 px-2.5 py-1 rounded-xl"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[10px]">Copy</span>
        </button>
        {showShare && onShare && (
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 px-2.5 py-1 rounded-xl"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Share</span>
          </button>
        )}
      </div>
    </div>

    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-xs text-white/70">Available Balance</p>
        <button
          type="button"
          onClick={onToggleBalance}
          className="text-white/60 hover:text-white p-0.5 rounded"
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        {showBalance ? formatInr(account.availableBalance) : '••••••••'}
      </h2>
    </div>

    <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
      <div>
        <span className="text-white/50 text-[10px]">IFSC</span>
        <p className="font-mono font-bold text-white/90">{account.ifsc}</p>
      </div>
      <div>
        <span className="text-white/50 text-[10px]">Interest Rate</span>
        <p className="font-bold text-white/90">
          {account.interestRate ? `${account.interestRate}% p.a.` : 'N/A'}
        </p>
      </div>
      <div>
        <span className="text-white/50 text-[10px]">Branch</span>
        <p className="font-semibold text-white/90 truncate">{account.branch}</p>
      </div>
      <div>
        <span className="text-white/50 text-[10px]">Nominee</span>
        <p className="font-semibold text-emerald-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          {account.nominees?.length ? '✓ Registered' : 'Not Registered'}
        </p>
      </div>
    </div>
  </div>
);

export const TransactionActivitySection: React.FC<{
  transactions: Transaction[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterType: 'all' | 'debit' | 'credit';
  onFilterChange: (f: 'all' | 'debit' | 'credit') => void;
  onSelectTxn?: (txn: Transaction) => void;
}> = ({
  transactions,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onSelectTxn,
}) => {
  const filtered = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.description.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      t.counterpartyName.toLowerCase().includes(q);
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Transaction Activity ({filtered.length})
      </h3>

      <div className="space-y-2.5 mb-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by payee, reference, or description..."
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-congress-blue-500"
        />
        <div className="flex gap-1.5 text-xs font-semibold">
          {(['all', 'credit', 'debit'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === f
                  ? f === 'credit'
                    ? 'bg-emerald-600 text-white'
                    : f === 'debit'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-congress-blue-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f === 'all' ? 'All' : f === 'credit' ? 'Money In (Credits)' : 'Money Out (Debits)'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-slate-400 text-xs">No transactions match your search.</p>
        ) : (
          filtered.map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <button
                key={txn.id}
                type="button"
                onClick={() => onSelectTxn?.(txn)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.99] transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCredit
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {txn.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {txn.date} • {txn.paymentMode} • Ref: {txn.referenceNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-xs font-extrabold ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </p>
                  {txn.balanceAfter && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Bal: ₹{txn.balanceAfter.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export const AccountsMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
    {children}
  </div>
);

export const AccountsMenuItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon, title, description, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/60"
  >
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
        danger
          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
          : 'bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700'
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-semibold ${danger ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
        {title}
      </p>
      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{description}</p>
      )}
    </div>
    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export const AccountsInfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs ${className}`}
  >
    {children}
  </div>
);
