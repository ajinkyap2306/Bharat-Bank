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
      return 'bg-[#16A34A] border-[#16A34A] text-white';
    case 'current':
      return 'bg-[#0B5CAB] border-[#0B5CAB] text-white ring-4 ring-[#0B5CAB]/20';
    case 'rejected':
    case 'returned':
      return 'bg-[#DC2626] border-[#DC2626] text-white';
    default:
      return 'bg-white dark:bg-slate-900 border-[#E4E7EC] text-[#667085]';
  }
}

export const BatchLifecycle: React.FC<BatchLifecycleProps> = ({ steps }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-4">Batch Lifecycle</h3>
    <ol className="flex flex-wrap gap-2" aria-label="Batch lifecycle">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold ${
            step.state === 'completed'
              ? 'border-emerald-200 bg-emerald-50 text-[#16A34A]'
              : step.state === 'current'
                ? 'border-blue-200 bg-blue-50 text-[#0B5CAB]'
                : step.state === 'rejected' || step.state === 'returned'
                  ? 'border-rose-200 bg-rose-50 text-[#DC2626]'
                  : 'border-[#E4E7EC] text-[#667085]'
          }`}
        >
          {step.state === 'completed' && <Check className="w-3 h-3" aria-hidden />}
          {step.label}
        </li>
      ))}
    </ol>
  </PayCard>
);
