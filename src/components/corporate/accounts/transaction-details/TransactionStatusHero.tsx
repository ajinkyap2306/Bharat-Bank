import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type { CorporateTxnDisplayStatus } from '../../../../types/corporateDashboard';
import type { CorporateTransactionDetails } from '../../../../types/corporateTransactionDetails';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

export function getStatusConfig(status: CorporateTxnDisplayStatus, direction: 'credit' | 'debit') {
  const creditCompleted = direction === 'credit' ? 'Payment Received' : 'Payment Successful';
  const map: Record<
    CorporateTxnDisplayStatus,
    { label: string; message: string; icon: React.ElementType; tone: string }
  > = {
    Completed: {
      label: creditCompleted,
      message: direction === 'credit' ? 'Funds credited to your account.' : 'Payment completed successfully.',
      icon: CheckCircle2,
      tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    },
    Processing: {
      label: 'Payment Processing',
      message: 'The bank is processing this transaction.',
      icon: RefreshCw,
      tone: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    },
    'Pending Approval': {
      label: 'Pending Approval',
      message: 'This transaction is waiting for the required corporate approval.',
      icon: Clock,
      tone: 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950/30',
    },
    Failed: {
      label: 'Payment Failed',
      message: 'This transaction could not be completed.',
      icon: XCircle,
      tone: 'text-[#DC2626] bg-rose-50 dark:bg-rose-950/30',
    },
    Rejected: {
      label: 'Payment Rejected',
      message: 'This transaction was rejected during approval.',
      icon: AlertCircle,
      tone: 'text-[#DC2626] bg-rose-50 dark:bg-rose-950/30',
    },
    Scheduled: {
      label: 'Payment Scheduled',
      message: 'This transaction is scheduled for processing.',
      icon: Clock,
      tone: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    },
  };
  return map[status];
}

interface TransactionStatusHeroProps {
  details: CorporateTransactionDetails;
  showBalances: boolean;
}

export const TransactionStatusHero: React.FC<TransactionStatusHeroProps> = ({
  details,
  showBalances,
}) => {
  const config = getStatusConfig(details.status, details.direction);
  const Icon = config.icon;
  const prefix = details.direction === 'credit' ? '+' : '−';
  const amountStr = showBalances
    ? `${prefix} ${formatAccountCurrency(details.amount, details.currency)}`
    : '••••••';

  return (
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${config.tone}`}
      >
        <Icon
          className={`w-7 h-7 ${details.status === 'Processing' ? 'animate-spin motion-reduce:animate-none' : ''}`}
          aria-hidden
        />
      </div>
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{config.label}</p>
      <p
        className={`text-[28px] font-semibold tabular-nums tracking-tight mt-2 ${
          details.direction === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
        }`}
        aria-label={`${details.direction} ${details.amount} rupees`}
      >
        {amountStr}
      </p>
      <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">{details.txnType}</p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
        {details.date} • {details.time}
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{config.message}</p>
    </div>
  );
};
