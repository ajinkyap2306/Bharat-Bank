import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CorporateTxnDisplayStatus } from '../../../../types/corporateDashboard';
import {
  CORP_ACCENT_BADGE,
  CORP_ACCENT_LINK,
  CORP_QUICK_ACTION_ICON,
  SERVICE_ICON_BOX,
} from './corporateTheme';

export { CORP_ACCENT_BADGE, CORP_QUICK_ACTION_ICON, SERVICE_ICON_BOX } from './corporateTheme';

export const formatCorpCurrency = (n: number, compact = false): string => {
  if (compact && n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (compact && n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

export const formatCorpCurrencyFull = (n: number): string =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const CorpSectionHeader: React.FC<{
  title: string;
  badge?: string;
  action?: string;
  onAction?: () => void;
  uppercase?: boolean;
}> = ({ title, badge, action, onAction, uppercase }) => (
  <div className="flex items-center justify-between px-4 mb-2.5">
    <div className="flex items-center gap-2 min-w-0">
      <h2
        className={`text-sm font-extrabold text-[#111827] dark:text-white tracking-tight ${
          uppercase ? 'uppercase text-xs text-slate-500 dark:text-slate-400 tracking-wider' : ''
        }`}
      >
        {title}
      </h2>
      {badge && (
        <span className={`${CORP_ACCENT_BADGE} shrink-0`}>
          {badge}
        </span>
      )}
    </div>
    {action && onAction && (
      <button
        type="button"
        onClick={onAction}
        className={`text-[11px] font-semibold ${CORP_ACCENT_LINK} flex items-center gap-0.5 py-1 shrink-0`}
      >
        {action} <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

export const CorpCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs ${className}`}
  >
    {children}
  </div>
);

export const CorpTxnStatus: React.FC<{ status: CorporateTxnDisplayStatus; compact?: boolean }> = ({
  status,
  compact,
}) => {
  const styles: Record<CorporateTxnDisplayStatus, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    Processing: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    'Pending Approval': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Failed: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Scheduled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };
  return (
    <span
      className={`font-semibold rounded-full whitespace-nowrap ${styles[status]} ${
        compact ? 'text-[9px] px-1.5 py-0.5' : 'text-[9px] font-bold px-1.5 py-0.5'
      }`}
    >
      {status}
    </span>
  );
};

export const CorpListCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs ${className}`}
  >
    {children}
  </div>
);

export const CorpListDivider: React.FC = () => (
  <div className="mx-3 border-t border-slate-100 dark:border-slate-800" aria-hidden />
);

export const CorpSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div className={`rounded-3xl bg-slate-200/60 dark:bg-slate-800 animate-pulse ${className}`} />
);

export const mapTxnStatus = (status: string): CorporateTxnDisplayStatus => {
  if (status === 'completed') return 'Completed';
  if (status === 'pending') return 'Pending Approval';
  if (status === 'failed') return 'Failed';
  if (status === 'rejected') return 'Rejected';
  return 'Processing';
};

export const mapTxnType = (category: string): string => {
  const map: Record<string, string> = {
    vendor: 'Payment',
    payroll: 'Payroll',
    collection: 'Collection',
    tax: 'Tax',
    transfer: 'Transfer',
  };
  return map[category] || 'Payment';
};
