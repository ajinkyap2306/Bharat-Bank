export type CorporatePaymentStatus =
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'failed'
  | 'cancelled'
  | 'reversed';

export type PaymentTimelineState =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'failed'
  | 'rejected'
  | 'cancelled'
  | 'returned';

export interface PaymentTimelineStep {
  id: string;
  label: string;
  timestamp?: string;
  state: PaymentTimelineState;
}

export interface PaymentApprovalHistoryEntry {
  id: string;
  name: string;
  role: string;
  action: string;
  timestamp: string;
}

export interface PaymentBeneficiaryInfo {
  name: string;
  maskedAccount: string;
  bankName: string;
  verified: boolean;
}

export interface PaymentSourceAccountInfo {
  id: string;
  name: string;
  maskedNumber: string;
  companyName: string;
  balanceAfter?: number;
}

export interface CorporatePaymentTrackingData {
  id: string;
  approvalId: string;
  transactionId?: string;
  status: CorporatePaymentStatus;
  statusLabel: string;
  type: string;
  beneficiary: PaymentBeneficiaryInfo;
  sourceAccount: PaymentSourceAccountInfo;
  amount: number;
  fee: number;
  totalDebit: number;
  currency: string;
  purpose: string;
  invoiceNumber: string;
  reference: string;
  paymentMethod: string;
  paymentDate: string;
  channel: string;
  createdBy: string;
  createdRole: string;
  createdAt: string;
  approvalHistory: PaymentApprovalHistoryEntry[];
  timeline: PaymentTimelineStep[];
  completedApprovals: number;
  totalApprovals: number;
  nextApprover?: string;
  completionTime?: string;
  failureReason?: string;
  failureTime?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  reversalReason?: string;
  reversalDate?: string;
  reversalAmount?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  receiptAvailable: boolean;
}

export function getPaymentStatusLabel(status: CorporatePaymentStatus): string {
  const labels: Record<CorporatePaymentStatus, string> = {
    submitted: 'Submitted',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    processing: 'Payment Processing',
    completed: 'Payment Successful',
    rejected: 'Payment Rejected',
    failed: 'Payment Failed',
    cancelled: 'Payment Cancelled',
    reversed: 'Payment Reversed',
  };
  return labels[status];
}
