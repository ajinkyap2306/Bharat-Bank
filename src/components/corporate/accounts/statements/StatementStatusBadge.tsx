import React from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { StatementStatus } from '../../../../types/corporateAccountStatements';

interface StatementStatusBadgeProps {
  status: StatementStatus;
  generatedAt?: string;
  periodLabel: string;
}

export const StatementStatusBadge: React.FC<StatementStatusBadgeProps> = ({
  status,
  generatedAt,
  periodLabel,
}) => {
  const config = {
    ready: {
      label: 'Statement Ready',
      icon: CheckCircle2,
      className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    },
    preparing: {
      label: 'Preparing Statement',
      icon: Loader2,
      className: 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950/30',
    },
    unavailable: {
      label: 'Statement Unavailable',
      icon: XCircle,
      className: 'text-[#DC2626] bg-rose-50 dark:bg-rose-950/30',
    },
  }[status];

  const Icon = config.icon;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.className}`}>
          <Icon className={`w-5 h-5 ${status === 'preparing' ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{config.label}</p>
          {status === 'ready' && generatedAt && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Generated: {generatedAt}</p>
          )}
          {status === 'preparing' && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Preparing your statement...</p>
          )}
        </div>
      </div>
      {status === 'ready' && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800 grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Statement Period</p>
            <p className="font-medium text-slate-900 dark:text-white mt-0.5">{periodLabel}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Format</p>
            <p className="font-medium text-slate-900 dark:text-white mt-0.5">PDF</p>
          </div>
        </div>
      )}
    </section>
  );
};
