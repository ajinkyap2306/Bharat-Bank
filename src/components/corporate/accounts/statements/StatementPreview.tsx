import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { AccountStatementData } from '../../../../types/corporateAccountStatements';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface StatementPreviewProps {
  isOpen: boolean;
  statement: AccountStatementData;
  transactions: CorporateAccountTransaction[];
  showBalances: boolean;
  onClose: () => void;
}

export const StatementPreview: React.FC<StatementPreviewProps> = ({
  isOpen,
  statement,
  transactions,
  showBalances,
  onClose,
}) => {
  const mask = (v: string) => (showBalances ? v : '••••••');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex flex-col justify-end sm:justify-center"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="bg-slate-50 dark:bg-slate-950 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col mx-auto w-full max-w-lg"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">Statement Preview</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Company</p>
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{statement.companyName}</p>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3">Account</p>
                <p className="text-[14px] font-medium text-slate-900 dark:text-white">
                  {statement.accountName} {statement.accountNumber}
                </p>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3">Period</p>
                <p className="text-[14px] font-medium text-slate-900 dark:text-white">
                  {statement.fromDate} – {statement.toDate}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 text-[13px]">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Opening Balance</p>
                    <p className="font-semibold tabular-nums mt-0.5">{mask(formatAccountCurrency(statement.openingBalance, statement.currency))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Closing Balance</p>
                    <p className="font-semibold tabular-nums mt-0.5">{mask(formatAccountCurrency(statement.closingBalance, statement.currency))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Credits</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">{mask(formatAccountCurrency(statement.totalCredits, statement.currency))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Debits</p>
                    <p className="font-semibold text-[#DC2626] tabular-nums mt-0.5">{mask(formatAccountCurrency(statement.totalDebits, statement.currency))}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800/60 dark:divide-slate-800">
                {transactions.slice(0, 20).map((txn) => (
                  <div key={txn.id} className="p-3 flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{txn.counterpartyName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{txn.date} • {txn.txnType}</p>
                    </div>
                    <p className={`text-[13px] font-semibold tabular-nums shrink-0 ${txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {showBalances
                        ? `${txn.type === 'credit' ? '+' : '−'} ${formatAccountCurrency(txn.amount, statement.currency)}`
                        : '••••••'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
