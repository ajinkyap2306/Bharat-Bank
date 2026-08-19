import React, { useState, useEffect } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import {
  CorporateTxnFilterDate,
  CorporateTxnFilterStatus,
  CorporateTxnFilterType,
} from '../../../../types/corporateAccounts';

export interface TransactionFilters {
  type: CorporateTxnFilterType;
  status: CorporateTxnFilterStatus;
  date: CorporateTxnFilterDate;
}

export const DEFAULT_TXN_FILTERS: TransactionFilters = {
  type: 'all',
  status: 'all',
  date: '30d',
};

interface TransactionFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
}

const Chip: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({
  active,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
      active ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#667085]'
    }`}
  >
    {label}
  </button>
);

export const TransactionFilterSheet: React.FC<TransactionFilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
}) => {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (isOpen) setLocal(filters);
  }, [isOpen, filters]);

  const apply = () => {
    onApply(local);
    onClose();
  };

  const reset = () => {
    setLocal(DEFAULT_TXN_FILTERS);
    onApply(DEFAULT_TXN_FILTERS);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Transactions" subtitle="Refine your transaction list">
      <div className="space-y-4 pb-2">
        <div>
          <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2">Type</p>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'credit', 'debit', 'transfer', 'payment', 'payroll', 'collection', 'fee'] as const).map((t) => (
              <Chip key={t} active={local.type === t} label={t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)} onClick={() => setLocal({ ...local, type: t })} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'completed', 'pending', 'processing', 'failed', 'rejected', 'reversed'] as const).map((s) => (
              <Chip key={s} active={local.status === s} label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} onClick={() => setLocal({ ...local, status: s })} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2">Date</p>
          <div className="flex flex-wrap gap-1.5">
            {([
              ['today', 'Today'],
              ['7d', '7 Days'],
              ['30d', '30 Days'],
              ['90d', '90 Days'],
              ['custom', 'Custom'],
            ] as const).map(([id, label]) => (
              <Chip key={id} active={local.date === id} label={label} onClick={() => setLocal({ ...local, date: id })} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={reset} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-[#667085]">
            Reset
          </button>
          <button type="button" onClick={apply} className="flex-1 py-3 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm">
            Apply Filters
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
