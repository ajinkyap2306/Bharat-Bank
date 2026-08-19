import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { StatementFilters } from '../../../../types/corporateAccountStatements';

const TYPES = ['all', 'credit', 'debit'] as const;
const CATEGORIES = ['all', 'Vendor Payment', 'Payroll', 'Collection', 'Transfer', 'Fee', 'Refund'];
const STATUSES = ['all', 'Completed', 'Processing', 'Failed', 'Reversed'];

interface StatementFilterSheetProps {
  isOpen: boolean;
  filters: StatementFilters;
  onChange: (f: StatementFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

const Chip: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({
  active,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
      active
        ? 'bg-[#0B5CAB] text-white'
        : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#667085] border border-[#E4E7EC] dark:border-slate-700'
    }`}
  >
    {label}
  </button>
);

export const StatementFilterSheet: React.FC<StatementFilterSheetProps> = ({
  isOpen,
  filters,
  onChange,
  onClose,
  onApply,
  onReset,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Statement">
    <div className="space-y-4 pb-2 max-h-[60vh] overflow-y-auto">
      <div>
        <p className="text-sm font-semibold text-[#111827] dark:text-white mb-2">Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Chip
              key={t}
              active={filters.type === t}
              label={t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              onClick={() => onChange({ ...filters, type: t })}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111827] dark:text-white mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={filters.category === c}
              label={c === 'all' ? 'All' : c}
              onClick={() => onChange({ ...filters, category: c })}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111827] dark:text-white mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              active={filters.status === s}
              label={s === 'all' ? 'All' : s}
              onClick={() => onChange({ ...filters, status: s })}
            />
          ))}
        </div>
      </div>
      <button type="button" onClick={onApply} className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12">
        Apply Filters
      </button>
      <button type="button" onClick={onReset} className="w-full py-3 text-sm font-semibold text-[#667085] min-h-11">
        Reset
      </button>
    </div>
  </BottomSheet>
);
