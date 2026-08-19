import React from 'react';
import { Check } from 'lucide-react';
import type { ApprovalWorkflowStep } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalProgressProps {
  steps: ApprovalWorkflowStep[];
  completedSteps: number;
  totalSteps: number;
  compact?: boolean;
}

export const ApprovalProgress: React.FC<ApprovalProgressProps> = ({
  steps,
  completedSteps,
  totalSteps,
  compact = true,
}) => {
  if (compact) {
    return (
      <p className="text-[12px] text-[#667085]">
        {completedSteps} of {totalSteps} completed
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1" aria-label="Approval progress">
      {steps.map((step, index) => (
        <React.Fragment key={`${step.role}-${index}`}>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#667085]">
            {step.state === 'completed' ? (
              <Check className="w-3 h-3 text-[#16A34A]" aria-hidden />
            ) : step.state === 'current' ? (
              <span className="w-2 h-2 rounded-full bg-[#0B5CAB]" aria-hidden />
            ) : (
              <span className="w-2 h-2 rounded-full border border-[#E4E7EC]" aria-hidden />
            )}
            <span className={step.state === 'current' ? 'text-[#111827] dark:text-white font-medium' : ''}>
              {step.role}
            </span>
          </span>
          {index < steps.length - 1 && <span className="text-[#E4E7EC]" aria-hidden>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
