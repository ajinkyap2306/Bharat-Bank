import React from 'react';
import { Check } from 'lucide-react';
import type { BulkApprovalStep } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface ApprovalProgressProps {
  steps: BulkApprovalStep[];
  completedStages: number;
  totalStages: number;
  currentApprover: string;
}

function nodeClass(state: BulkApprovalStep['state']) {
  switch (state) {
    case 'completed':
      return 'bg-[#16A34A] border-[#16A34A] text-white';
    case 'current':
      return 'bg-[#0B5CAB] border-[#0B5CAB] text-white ring-4 ring-[#0B5CAB]/20';
    case 'rejected':
      return 'bg-[#DC2626] border-[#DC2626] text-white';
    case 'returned':
      return 'bg-[#F59E0B] border-[#F59E0B] text-white';
    default:
      return 'bg-white dark:bg-slate-900 border-[#E4E7EC] text-[#667085]';
  }
}

export const ApprovalProgress: React.FC<ApprovalProgressProps> = ({
  steps,
  completedStages,
  totalStages,
  currentApprover,
}) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-1">Approval Progress</h3>
    <p className="text-[12px] text-[#667085] mb-4">
      {completedStages} of {totalStages} approval stages completed
    </p>
    <ol className="space-y-0" aria-label="Approval progress timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.id} className="flex gap-3" aria-current={step.state === 'current' ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${nodeClass(step.state)}`}
                aria-hidden
              >
                {step.state === 'completed' ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : step.state === 'current' ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#E4E7EC]" />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[24px] ${
                    step.state === 'completed' ? 'bg-[#16A34A]' : 'bg-[#E4E7EC]'
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-4 ${isLast ? 'pb-0' : ''}`}>
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{step.label}</p>
              <p className="text-[12px] text-[#667085] mt-0.5">
                {step.timestamp ??
                  (step.state === 'current'
                    ? 'Pending'
                    : step.state === 'completed'
                      ? 'Completed'
                      : 'Pending')}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
    <p className="text-[13px] font-semibold text-[#0B5CAB] mt-2">Waiting for {currentApprover}</p>
  </PayCard>
);
