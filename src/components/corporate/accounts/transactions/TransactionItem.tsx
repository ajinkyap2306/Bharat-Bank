import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';
import { TransactionTypeIcon, TransactionStatusBadge } from './TransactionTypeIcon';

interface TransactionItemProps {
  txn: CorporateAccountTransaction;
  currency: string;
  showBalances: boolean;
  onClick: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  txn,
  currency,
  showBalances,
  onClick,
}) => {
  const isCredit = txn.type === 'credit';
  const amountPrefix = isCredit ? '+' : '−';
  const ariaLabel = `${isCredit ? 'Credit' : 'Debit'}, ${txn.counterpartyName}, ${txn.status}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40 border-b border-[#E4E7EC]/60 dark:border-slate-800 last:border-0"
      aria-label={ariaLabel}
    >
      <TransactionTypeIcon txn={txn} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#111827] dark:text-white truncate">
          {txn.counterpartyName}
        </p>
        <p className="text-[13px] text-[#667085] mt-0.5">{txn.txnType}</p>
        <p className="text-[12px] text-[#667085] mt-0.5">
          {txn.dateGroup} • {txn.time}
        </p>
        {txn.invoiceNumber && (
          <p className="text-[11px] text-[#667085] mt-1 font-mono">REF: {txn.invoiceNumber}</p>
        )}
        {(txn.initiatedBy || txn.approvedBy) && (
          <p className="text-[11px] text-[#667085] mt-1">
            {txn.initiatedBy && <>Created by {txn.initiatedBy}</>}
            {txn.initiatedBy && txn.approvedBy && ' • '}
            {txn.approvedBy && <>Approved by {txn.approvedBy}</>}
          </p>
        )}
        {txn.rejectedBy && (
          <p className="text-[11px] text-[#DC2626] mt-1">Rejected by {txn.rejectedBy}</p>
        )}
        {txn.status === 'Failed' && txn.failureReason && (
          <p className="text-[11px] text-[#DC2626] mt-1">{txn.failureReason}</p>
        )}
        <div className="mt-2">
          <TransactionStatusBadge status={txn.status} />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p
          className={`text-[15px] font-semibold tabular-nums ${
            isCredit ? 'text-[#16A34A]' : 'text-[#111827] dark:text-white'
          }`}
        >
          {showBalances
            ? `${amountPrefix} ${formatAccountCurrency(txn.amount, currency)}`
            : '••••••'}
        </p>
        <ChevronRight className="w-4 h-4 text-[#667085] mt-1" aria-hidden />
      </div>
    </button>
  );
};
