import React from 'react';
import { ChevronRight, CheckCircle2, Clock, Lock, AlertCircle } from 'lucide-react';
import { CorporateAccountDisplayStatus } from '../../../../types/corporateAccounts';
import { CorporateTxnDisplayStatus } from '../../../../types/corporateDashboard';

export const formatAccountCurrency = (amount: number, currency = '₹'): string =>
  `${currency}${amount.toLocaleString('en-IN')}`;

const STATUS_CONFIG: Record<
  CorporateAccountDisplayStatus,
  { className: string; icon: React.ElementType }
> = {
  Active: { className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: CheckCircle2 },
  Restricted: { className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', icon: Lock },
  Dormant: { className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', icon: Clock },
  Closed: { className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400', icon: AlertCircle },
  Pending: { className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', icon: Clock },
};

export const AccountStatusBadge: React.FC<{ status: CorporateAccountDisplayStatus }> = ({ status }) => {
  const { className, icon: Icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${className}`}>
      <Icon className="w-3 h-3" aria-hidden />
      {status}
    </span>
  );
};

export const TxnStatusBadge: React.FC<{ status: CorporateTxnDisplayStatus }> = ({ status }) => {
  const styles: Record<CorporateTxnDisplayStatus, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    Processing: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    'Pending Approval': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Failed: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Scheduled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${styles[status]}`}>{status}</span>
  );
};

export const AccountsCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs ${className}`}
  >
    {children}
  </div>
);

export const AccountsSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div className={`mx-3 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse ${className}`} />
);

export const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-2 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
    <span className="font-medium text-slate-900 dark:text-white text-right">{value}</span>
  </div>
);

export const MenuRow: React.FC<{
  label: string;
  description?: string;
  onClick: () => void;
}> = ({ label, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 last:border-0"
  >
    <div className="min-w-0">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
    </div>
    <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
  </button>
);

export const CATEGORY_TABS = [
  { id: 'all' as const, label: 'All' },
  { id: 'operating' as const, label: 'Operating' },
  { id: 'payroll' as const, label: 'Payroll' },
  { id: 'collections' as const, label: 'Collections' },
  { id: 'savings' as const, label: 'Savings' },
  { id: 'loan' as const, label: 'Loans' },
];

export const canManageAccountSettings = (role?: string): boolean => {
  if (!role) return true;
  const r = role.toLowerCase();
  return r.includes('admin') || r.includes('cfo') || r.includes('finance manager') || r.includes('checker');
};
