import React from 'react';
import type { ApprovalWorkflowStep } from '../../../../../../types/corporateVendorPaymentReview';

interface ApprovalWorkflowProps {
  createdBy: string;
  currentRole: string;
  nextStep: string;
  steps: ApprovalWorkflowStep[];
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  createdBy,
  currentRole,
  nextStep,
  steps,
}) => (
  <section className="px-4" aria-labelledby="approval-workflow-heading">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <h2 id="approval-workflow-heading" className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
        Approval Workflow
      </h2>
      <dl className="space-y-2 text-[13px] mb-4">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Created By</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{createdBy}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Current Role</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{currentRole}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Next Step</dt>
          <dd className="font-medium text-congress-blue-700 dark:text-congress-blue-400">{nextStep}</dd>
        </div>
      </dl>
      <ul className="space-y-2" aria-label="Approval steps">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 text-[13px]"
          >
            <span className="font-medium text-slate-900 dark:text-white">{step.label}</span>
            <span
              className={
                step.status === 'completed'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : step.status === 'pending'
                    ? 'text-[#F59E0B] font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
              }
            >
              {step.status === 'completed' && '✓ Payment Created'}
              {step.status === 'pending' && '○ Approval Required'}
              {step.status === 'optional' && '○ If applicable'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
