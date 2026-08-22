import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CorporateApprovalRequest } from '../../../../types/corporateApprovals';

export const formatApprovalCurrency = (n: number): string => `₹${n.toLocaleString('en-IN')}`;

export const ApprovalStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    delegated: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    changes_requested: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    'Pending Approval': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  };
  const label = status === 'pending' ? 'Pending Approval' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${styles[status] || styles.pending}`}>
      {label}
    </span>
  );
};

export const ApprovalCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mx-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs ${className}`}>
    {children}
  </div>
);

export const ApprovalSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div className={`mx-3 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse ${className}`} />
);

export const StickyApprovalCTA: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  variant?: 'primary' | 'danger';
}> = ({ label, onClick, disabled, secondaryLabel, onSecondary, variant = 'primary' }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80">
    <div className="max-w-lg mx-auto flex gap-2">
      {secondaryLabel && onSecondary && (
        <button type="button" onClick={onSecondary} className="flex-1 py-3.5 rounded-2xl border font-bold text-sm text-slate-500 dark:text-slate-400 min-h-11">
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

export const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
    <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
    <span className="font-medium text-slate-900 dark:text-white text-right">{value}</span>
  </div>
);

export const ApprovalListCard: React.FC<{
  item: CorporateApprovalRequest;
  onClick: () => void;
  selected?: boolean;
  onSelect?: () => void;
  selectMode?: boolean;
}> = ({ item, onClick, selected, onSelect, selectMode }) => (
  <ApprovalCard className={`p-4 ${selected ? 'ring-2 ring-congress-blue-500/30' : ''}`}>
    <div className="flex items-start gap-3">
      {selectMode && (
        <input type="checkbox" checked={selected} onChange={onSelect} className="mt-1 rounded" />
      )}
      <button type="button" onClick={onClick} className="flex-1 text-left min-h-11">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-congress-blue-700 dark:text-congress-blue-400 uppercase">{item.categoryLabel}</span>
              {item.priority === 'high' && <span className="text-[8px] font-bold text-[#F59E0B]">HIGH</span>}
              {item.priority === 'urgent' && <span className="text-[8px] font-bold text-[#DC2626]">URGENT</span>}
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{item.title}</p>
            {item.amount !== undefined && item.amount > 0 && (
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {formatApprovalCurrency(item.amount)}
              </p>
            )}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Created by {item.createdBy}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.createdAt}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <ApprovalStatusBadge status={item.status} />
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
        {item.expiresAt && (
          <p className="text-[10px] text-[#F59E0B] font-bold mt-2">{item.expiresAt}</p>
        )}
      </button>
    </div>
  </ApprovalCard>
);

export const APPROVAL_TABS = [
  { id: 'pending' as const, label: 'Pending' },
  { id: 'approved' as const, label: 'Approved' },
  { id: 'rejected' as const, label: 'Rejected' },
  { id: 'delegated' as const, label: 'Delegated' },
  { id: 'history' as const, label: 'History' },
];
