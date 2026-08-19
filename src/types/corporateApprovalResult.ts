export type ApprovalResultStatus =
  | 'approved_next'
  | 'approved_final'
  | 'rejected'
  | 'returned'
  | 'already_processed'
  | 'failed';

export type ApprovalResultAction = 'approve' | 'reject' | 'return';

export type ResultTimelineState =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'rejected'
  | 'returned';

export interface ResultTimelineStep {
  id: string;
  label: string;
  state: ResultTimelineState;
  sublabel?: string;
}

export interface CorporateApprovalResultData {
  status: ApprovalResultStatus;
  action: ApprovalResultAction;
  approvalId: string;
  paymentId?: string;
  requestType: string;
  beneficiary: string;
  amount?: number;
  currency: string;
  performedBy: string;
  performedByRole: string;
  performedAt: string;
  comment?: string;
  rejectionReason?: string;
  returnComment?: string;
  nextApprover?: string;
  nextStatusLabel?: string;
  completedApprovals: number;
  totalApprovals: number;
  currentWorkflowStatus?: string;
  timeline: ResultTimelineStep[];
}

export function getResultStatusLabel(status: ApprovalResultStatus): string {
  const labels: Record<ApprovalResultStatus, string> = {
    approved_next: 'Approved',
    approved_final: 'Approved',
    rejected: 'Rejected',
    returned: 'Returned for Changes',
    already_processed: 'Already Processed',
    failed: 'Action Failed',
  };
  return labels[status];
}
