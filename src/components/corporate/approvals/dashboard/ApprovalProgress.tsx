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
      <p className="text-[12px] text-slate-500 dark:text-slate-400">
        {completedSteps} of {totalSteps} completed
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1" aria-label="Approval progress">
      {steps.map((step, index) => (
        <React.Fragment key={`${step.role}-${index}`}>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            {step.state === 'completed' ? (
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ) : step.state === 'current' ? (
              <span className="w-2 h-2 rounded-full bg-congress-blue-700" aria-hidden />
            ) : (
              <span className="w-2 h-2 rounded-full border border-slate-200 dark:border-slate-800" aria-hidden />
            )}
            <span className={step.state === 'current' ? 'text-slate-900 dark:text-white font-medium' : ''}>
              {step.role}
            </span>
          </span>
          {index < steps.length - 1 && <span className="text-slate-200" aria-hidden>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
