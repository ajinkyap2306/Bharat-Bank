import React from 'react';
import { ApprovalTimeline } from './ApprovalTimeline';
import type { VendorPaymentSubmissionData } from '../../../../../../types/corporateVendorPaymentSubmission';

interface ApprovalProgressProps {
  data: VendorPaymentSubmissionData;
}

function getProgressLabel(data: VendorPaymentSubmissionData): string {
  const workflowSteps = data.approvalSteps.filter((s) => s.id !== 'created' && s.id !== 'processing' && s.id !== 'completed' && s.id !== 'cancelled');
  const completed = workflowSteps.filter((s) => s.state === 'completed').length;
  const total = workflowSteps.length;

  if (total > 0) {
    return `${completed} of ${total} steps completed`;
  }

  return `${data.completedSteps} of ${data.totalSteps} steps completed`;
}

function getSupportingText(data: VendorPaymentSubmissionData): string {
  if (data.status === 'rejected') {
    return 'The payment was rejected during the approval process.';
  }
  if (data.status === 'cancelled') {
    return 'The payment request has been cancelled.';
  }
  if (data.status === 'processing' || data.status === 'approved') {
    return 'The payment has been approved and is now being processed.';
  }
  if (data.status === 'completed') {
    return 'Payment completed successfully.';
  }
  if (!data.approvalRequired) {
    return 'Your payment is being processed.';
  }
  return `Waiting for ${data.currentApprovalStep} approval.`;
}

export const ApprovalProgress: React.FC<ApprovalProgressProps> = ({ data }) => {
  if (data.status === 'cancelled') {
    return null;
  }

  return (
    <section
      className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
      aria-labelledby="approval-progress-heading"
    >
      <h2 id="approval-progress-heading" className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Approval Progress
      </h2>
      <div className="mt-4">
        <ApprovalTimeline steps={data.approvalSteps} />
      </div>
      <div className="mt-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[13px] font-medium text-slate-900 dark:text-white">{getProgressLabel(data)}</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{getSupportingText(data)}</p>
      </div>
    </section>
  );
};
