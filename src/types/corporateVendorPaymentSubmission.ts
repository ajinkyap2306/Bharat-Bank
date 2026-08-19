import type { PaymentRailMethod } from './corporateVendorPaymentDetails';

export type VendorPaymentSubmissionStatus =
  | 'submitted'
  | 'approval-in-progress'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'failed';

export type ApprovalStepState = 'completed' | 'current' | 'upcoming';

export interface ApprovalTimelineStep {
  id: string;
  label: string;
  state: ApprovalStepState;
  description?: string;
}

export type CorporatePaymentFlowKind = 'vendor' | 'internal-transfer' | 'bank-transfer';

export interface VendorPaymentSubmissionData {
  status: VendorPaymentSubmissionStatus;
  paymentId: string;
  approvalId: string;
  transactionId?: string;
  beneficiary: {
    id: string;
    name: string;
    maskedAccount: string;
    bankName: string;
  };
  sourceAccount: {
    id: string;
    name: string;
    maskedNumber: string;
  };
  amount: number;
  fee: number;
  totalDebit: number;
  currency: string;
  paymentMethod: PaymentRailMethod;
  paymentDate: string;
  reference: string;
  invoiceNumber: string;
  purposeLabel: string;
  submittedBy: string;
  submittedRole: string;
  submittedAt: string;
  submittedAtDisplay: string;
  approvalSteps: ApprovalTimelineStep[];
  completedSteps: number;
  totalSteps: number;
  currentApprovalStep: string;
  nextActionTitle: string;
  nextActionDescription: string;
  approvalRequired: boolean;
  canCancel: boolean;
  rejectionReason?: string;
  rejectedBy?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  flowKind?: CorporatePaymentFlowKind;
  createNewRoute?: string;
}

export function getSubmissionStatusLabel(status: VendorPaymentSubmissionStatus): string {
  const labels: Record<VendorPaymentSubmissionStatus, string> = {
    submitted: 'Pending Approval',
    'approval-in-progress': 'Approval in Progress',
    approved: 'Approved — Processing',
    processing: 'Payment Processing',
    completed: 'Payment Successful',
    rejected: 'Payment Rejected',
    cancelled: 'Payment Cancelled',
    failed: 'Payment Failed',
  };
  return labels[status];
}

export function getSubmissionStatusTone(
  status: VendorPaymentSubmissionStatus
): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'rejected':
    case 'failed':
    case 'cancelled':
      return 'error';
    case 'submitted':
    case 'approval-in-progress':
      return 'warning';
    case 'approved':
    case 'processing':
      return 'info';
    default:
      return 'neutral';
  }
}
