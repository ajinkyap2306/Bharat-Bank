export type BulkBatchTrackingStatus =
  | 'pending_approval'
  | 'processing'
  | 'completed'
  | 'partially_completed'
  | 'rejected'
  | 'returned'
  | 'cancelled';

export type BulkApprovalStepState = 'completed' | 'current' | 'upcoming' | 'rejected' | 'returned';

export type BulkViewerRole = 'maker' | 'checker';

export interface BulkApprovalStep {
  id: string;
  label: string;
  state: BulkApprovalStepState;
  timestamp?: string;
}

export interface BulkLifecycleStep {
  id: string;
  label: string;
  state: BulkApprovalStepState;
}

export interface BulkBatchTrackingData {
  batchId: string;
  batchRef: string;
  batchName: string;
  reference: string;
  status: BulkBatchTrackingStatus;
  statusLabel: string;
  statusSupporting: string;
  paymentCount: number;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
  successfulCount: number;
  failedCount: number;
  processingCount: number;
  totalAmount: number;
  fee: number;
  totalDebit: number;
  sourceAccount: {
    name: string;
    maskedNumber: string;
  };
  paymentDate: string;
  submittedBy: string;
  submittedRole: string;
  submittedAt: string;
  approvalId: string;
  approvalSteps: BulkApprovalStep[];
  completedApprovalStages: number;
  totalApprovalStages: number;
  currentApprover: string;
  lifecycle: BulkLifecycleStep[];
  viewerRole: BulkViewerRole;
  rejectionReason?: string;
  rejectedBy?: string;
  returnComment?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  completedAt?: string;
  showPaymentResults: boolean;
}
