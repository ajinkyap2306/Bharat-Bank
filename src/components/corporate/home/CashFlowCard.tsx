import React from 'react';
import type { CorporateCashFlowPeriod, CorporateCashFlowPoint } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton } from './shared/CorporateHomeUI';

interface CashFlowCardProps {
  period: CorporateCashFlowPeriod;
  data: CorporateCashFlowPoint[];
  isLoading?: boolean;
  onPeriodChange: (period: CorporateCashFlowPeriod) => void;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({
  period,
  data,
  isLoading,
  onPeriodChange,
}) => {
  const netInflow = data.reduce((s, p) => s + p.inflow, 0);
  const netOutflow = data.reduce((s, p) => s + p.outflow, 0);
  const netFlow = netInflow - netOutflow;
  const max = Math.max(...data.flatMap((d) => [d.inflow, d.outflow]), 1);

  return (
    <section aria-label="Cash Flow">
      <CorpSectionHeader title="Cash Flow" />
      {isLoading ? (
        <CorpSkeleton className="h-44 mx-4" />
      ) : (
        <CorpCard className="mx-4! p-4 border-slate-200 dark:border-slate-800">
          <div className="flex gap-1.5 mb-4" role="tablist" aria-label="Cash flow period">
            {(['7D', '30D', '90D'] as CorporateCashFlowPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={period === p}
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold min-h-8 transition-colors ${
                  period === p
                    ? 'bg-congress-blue-700 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-1 h-20 mb-4" aria-hidden>
            {data.map((point) => (
              <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-0.5 h-16">
                  <div
                    className="w-[42%] rounded-t-md bg-emerald-600/75 min-h-1"
                    style={{ height: `${(point.inflow / max) * 100}%` }}
                  />
                  <div
                    className="w-[42%] rounded-t-md bg-[#DC2626]/55 min-h-1"
                    style={{ height: `${(point.outflow / max) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{point.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Inflow</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{netInflow.toFixed(2)}L</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Outflow</p>
              <p className="text-sm font-semibold text-[#DC2626] tabular-nums">₹{netOutflow.toFixed(2)}L</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Net Flow</p>
              <p className={`text-sm font-semibold tabular-nums ${netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'}`}>
                {netFlow >= 0 ? '+' : ''}₹{netFlow.toFixed(2)}L
              </p>
            </div>
          </div>
        </CorpCard>
      )}
    </section>
  );
};
