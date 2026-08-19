import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { Transaction, BankAccount } from '../../types/banking';

interface MiniStatementSheetProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
  transactions: Transaction[];
}

export const MiniStatementSheet: React.FC<MiniStatementSheetProps> = ({
  isOpen,
  onClose,
  account,
  transactions,
}) => {
  const recent = transactions.slice(0, 8);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Mini Statement"
      subtitle={`${account.accountType} ${account.maskedNumber}`}
    >
      <div className="space-y-1 pb-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase px-1 mb-2">
          <span>Last {recent.length} transactions</span>
          <span>Bal: ₹{account.availableBalance.toLocaleString('en-IN')}</span>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No recent transactions.</p>
        ) : (
          recent.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                {txn.type === 'debit' ? (
                  <ArrowUpRight className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{txn.counterpartyName}</p>
                  <p className="text-[10px] text-slate-400">{txn.date}</p>
                </div>
              </div>
              <p className={`text-xs font-bold shrink-0 ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-800 dark:text-white'}`}>
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
              </p>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
};
