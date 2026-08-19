import React from 'react';
import { Calendar } from 'lucide-react';
import type { StatementPeriodPreset } from '../../../../types/corporateAccountStatements';

const PERIODS: { id: StatementPeriodPreset; label: string }[] = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'last_6_months', label: 'Last 6 Months' },
  { id: 'this_fy', label: 'This Financial Year' },
];

interface StatementPeriodSelectorProps {
  selected: StatementPeriodPreset;
  onChange: (preset: StatementPeriodPreset) => void;
  onCustom: () => void;
  customLabel?: string;
}

export const StatementPeriodSelector: React.FC<StatementPeriodSelectorProps> = ({
  selected,
  onChange,
  onCustom,
  customLabel,
}) => (
  <section className="px-4" aria-label="Statement Period">
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-3">Statement Period</h2>
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={`shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold min-h-9 transition-colors ${
            selected === p.id
              ? 'bg-[#0B5CAB] text-white'
              : 'bg-white dark:bg-slate-900 text-[#667085] border border-[#E4E7EC] dark:border-slate-800'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
    <button
      type="button"
      onClick={onCustom}
      className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-[14px] font-semibold min-h-12 ${
        selected === 'custom'
          ? 'border-[#0B5CAB] bg-[#0B5CAB]/10 text-[#0B5CAB]'
          : 'border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#667085]'
      }`}
    >
      <Calendar className="w-4 h-4" aria-hidden />
      {customLabel ?? 'Custom Date Range'}
    </button>
  </section>
);
