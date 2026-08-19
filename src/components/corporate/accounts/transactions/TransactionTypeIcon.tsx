import React from 'react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Building2,
  CircleDollarSign,
  Landmark,
  Receipt,
  RefreshCw,
  RotateCcw,
  Users,
  Wallet,
} from 'lucide-react';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';

export function getTransactionTypeIcon(txn: CorporateAccountTransaction): React.ElementType {
  const type = txn.txnType.toLowerCase();
  if (type.includes('collection') || txn.type === 'credit') return ArrowDownLeft;
  if (type.includes('payroll')) return Users;
  if (type.includes('transfer')) return ArrowLeftRight;
  if (type.includes('tax')) return Landmark;
  if (type.includes('fee')) return Receipt;
  if (type.includes('interest')) return CircleDollarSign;
  if (type.includes('refund')) return RotateCcw;
  if (type.includes('deposit') || type.includes('cash')) return Banknote;
  if (type.includes('payment') || type.includes('vendor')) return Building2;
  if (txn.type === 'debit') return ArrowUpRight;
  return Wallet;
}

interface TransactionTypeIconProps {
  txn: CorporateAccountTransaction;
}

export const TransactionTypeIcon: React.FC<TransactionTypeIconProps> = ({ txn }) => {
  const Icon = getTransactionTypeIcon(txn);
  const isCredit = txn.type === 'credit';
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        isCredit ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#667085]'
      }`}
      aria-hidden
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};

interface TransactionStatusBadgeProps {
  status: CorporateAccountTransaction['status'];
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    Completed: 'text-[#16A34A] bg-emerald-50 dark:bg-emerald-950/30',
    Processing: 'text-[#667085] bg-slate-100 dark:bg-slate-800',
    'Pending Approval': 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950/30',
    Failed: 'text-[#DC2626] bg-rose-50 dark:bg-rose-950/30',
    Rejected: 'text-[#DC2626] bg-rose-50 dark:bg-rose-950/30',
    Scheduled: 'text-[#667085] bg-slate-100 dark:bg-slate-800',
  };
  const label =
    status === 'Pending Approval' ? 'Pending' : status === 'Processing' ? 'Processing' : status;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[status] ?? styles.Completed}`}
    >
      {status === 'Processing' && (
        <RefreshCw className="w-3 h-3 animate-spin motion-reduce:animate-none" aria-hidden />
      )}
      {label}
    </span>
  );
};
