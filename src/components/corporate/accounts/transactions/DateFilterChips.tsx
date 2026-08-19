import React from 'react';
import type { TransactionQuickDate } from '../../../../types/corporateAccountTransactions';

const CHIPS: { id: TransactionQuickDate; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
];

interface DateFilterChipsProps {
  active: TransactionQuickDate;
  onChange: (date: TransactionQuickDate) => void;
}

export const DateFilterChips: React.FC<DateFilterChipsProps> = ({ active, onChange }) => (
  <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Quick date filters">
    {CHIPS.map((chip) => (
      <button
        key={chip.id}
        type="button"
        role="tab"
        aria-selected={active === chip.id}
        onClick={() => onChange(chip.id)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold min-h-9 transition-colors ${
          active === chip.id
            ? 'bg-[#0B5CAB] text-white'
            : 'bg-white dark:bg-slate-900 text-[#667085] border border-[#E4E7EC] dark:border-slate-800'
        }`}
      >
        {chip.label}
      </button>
    ))}
  </div>
);
