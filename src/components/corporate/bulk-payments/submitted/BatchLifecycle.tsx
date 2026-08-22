import React from 'react';
import { Check } from 'lucide-react';
import type { BulkLifecycleStep } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchLifecycleProps {
  steps: BulkLifecycleStep[];
}

function nodeClass(state: BulkLifecycleStep['state']) {
  switch (state) {
    case 'completed':
      return 'bg-emerald-600 border-[#16A34A] text-white';
    case 'current':
      return 'bg-congress-blue-700 border-congress-blue-700 text-white ring-4 ring-congress-blue-500/20';
    case 'rejected':
    case 'returned':
      return 'bg-[#DC2626] border-[#DC2626] text-white';
    default:
      return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
  }
}

export const BatchLifecycle: React.FC<BatchLifecycleProps> = ({ steps }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-4">Batch Lifecycle</h3>
    <ol className="flex flex-wrap gap-2" aria-label="Batch lifecycle">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold ${
            step.state === 'completed'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:text-emerald-400'
              : step.state === 'current'
                ? 'border-blue-200 bg-blue-50 text-congress-blue-700 dark:text-congress-blue-400'
                : step.state === 'rejected' || step.state === 'returned'
                  ? 'border-rose-200 bg-rose-50 text-[#DC2626]'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {step.state === 'completed' && <Check className="w-3 h-3" aria-hidden />}
          {step.label}
        </li>
      ))}
    </ol>
  </PayCard>
);
