import React from 'react';
import { CorporateBeneficiaryDisplayStatus } from '../../../../types/corporateBeneficiaries';

export const formatBenCurrency = (n: number): string => `₹${n.toLocaleString('en-IN')}`;

export const BenStatusBadge: React.FC<{ status: CorporateBeneficiaryDisplayStatus | string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    'Pending Approval': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Approved: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    'Cooling Period': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    Blocked: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Deleted: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${styles[status] || styles.Draft}`}>
      {status}
    </span>
  );
};

export const BenCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mx-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs ${className}`}>
    {children}
  </div>
);

export const BenSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div className={`mx-3 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse ${className}`} />
);

export const StickyBenCTA: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  variant?: 'primary' | 'danger';
}> = ({ label, onClick, disabled, secondaryLabel, onSecondary, variant = 'primary' }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800">
    <div className="max-w-lg mx-auto flex gap-2">
      {secondaryLabel && onSecondary && (
        <button type="button" onClick={onSecondary} className="flex-1 py-3.5 rounded-2xl border border-slate-200 font-bold text-sm text-slate-500 dark:text-slate-400 min-h-11">
          {secondaryLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 min-h-11 ${
          variant === 'danger' ? 'bg-[#DC2626] text-white' : 'bg-congress-blue-700 text-white'
        }`}
      >
        {label}
      </button>
    </div>
  </div>
);

export const ReviewBenRow: React.FC<{ label: string; value: string; onEdit?: () => void }> = ({
  label,
  value,
  onEdit,
}) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="min-w-0">
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-white">{value || '—'}</p>
    </div>
    {onEdit && (
      <button type="button" onClick={onEdit} className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 shrink-0">Edit</button>
    )}
  </div>
);

export const BEN_TABS = [
  { id: 'all' as const, label: 'All' },
  { id: 'active' as const, label: 'Active' },
  { id: 'pending' as const, label: 'Pending' },
  { id: 'blocked' as const, label: 'Blocked' },
];
