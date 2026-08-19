import type { ApprovalItemType } from './corporateApprovalsDashboard';

export type ApprovalDetailStatus =
  | 'pending_yours'
  | 'pending_other'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'expired'
  | 'cancelled'
  | 'already_processed';

export type ApprovalWarningType = 'high_value' | 'duplicate' | 'new_beneficiary';

export interface ApprovalWarning {
  type: ApprovalWarningType;
  title: string;
  message: string;
}

export interface ApprovalDocument {
  id: string;
  name: string;
  sizeLabel: string;
  url?: string;
}

export interface ApprovalTimelineEvent {
  id: string;
  label: string;
  userName?: string;
  userRole?: string;
  timestamp?: string;
  state: 'completed' | 'current' | 'upcoming';
}

export interface ApprovalHistoryEntry {
  id: string;
  role: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface ApprovalBeneficiaryInfo {
  name: string;
  maskedAccount: string;
  bankName: string;
  type: string;
  verified: boolean;
}

export interface ApprovalSourceAccount {
  id: string;
  name: string;
  maskedNumber: string;
  availableBalance: number;
  balanceAfter: number;
  sufficientBalance: boolean;
}

export interface ApprovalLimitInfo {
  dailyLimit: number;
  usedBefore: number;
  thisPayment: number;
  remainingAfter: number;
  withinLimit: boolean;
}

export interface ApprovalPaymentDetailsInfo {
  purpose: string;
  invoiceNumber: string;
  reference: string;
  paymentMethod: string;
  paymentDate: string;
  scheduled: boolean;
  scheduleLabel?: string;
  fee: number;
  totalDebit: number;
  currency: string;
}

export interface ApprovalRequestor {
  name: string;
  role: string;
  department: string;
  createdAt: string;
}

export interface ApprovalCurrentApprover {
  name: string;
  role: string;
  completedSteps: number;
  totalSteps: number;
}

export interface CorporateApprovalDetail {
  id: string;
  approvalId: string;
  paymentId?: string;
  type: ApprovalItemType;
  typeLabel: string;
  status: ApprovalDetailStatus;
  statusLabel: string;
  title: string;
  amount?: number;
  currency: string;
  beneficiary?: ApprovalBeneficiaryInfo;
  sourceAccount?: ApprovalSourceAccount;
  paymentDetails?: ApprovalPaymentDetailsInfo;
  requestor: ApprovalRequestor;
  currentApprover: ApprovalCurrentApprover;
  timeline: ApprovalTimelineEvent[];
  previousApprovals: ApprovalHistoryEntry[];
  warnings: ApprovalWarning[];
  documents: ApprovalDocument[];
  makerComment?: string;
  canAct: boolean;
  requiresVerification: boolean;
}

export type ApprovalActionType = 'approve' | 'reject' | 'return';

export interface ApprovalActionResult {
  action: ApprovalActionType;
  title: string;
  message: string;
  secondaryMessage?: string;
  amount?: number;
  beneficiary?: string;
  reason?: string;
  comment?: string;
  awaitingNextApproval?: boolean;
  paymentId?: string;
}
