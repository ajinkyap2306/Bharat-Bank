import type { CorporateTxnDisplayStatus } from './corporateDashboard';

export type TimelineEventState = 'completed' | 'current' | 'pending' | 'failed';

export interface TransactionTimelineEvent {
  id: string;
  label: string;
  date: string;
  time: string;
  state: TimelineEventState;
}

export interface ApprovalLevel {
  level: number;
  name: string;
  role: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date?: string;
  time?: string;
}

export interface CorporateUserRef {
  name: string;
  role: string;
  date?: string;
  time?: string;
}

export interface CounterpartyDetails {
  name: string;
  maskedAccount: string;
  bank: string;
  ifsc: string;
}

export interface SourceAccountDetails {
  accountType: string;
  companyName: string;
  maskedNumber: string;
  availableBalance: number;
}

export interface PendingApprovalInfo {
  currentLevel: number;
  requiredLevel: number;
  message: string;
}

export interface CorporateTransactionDetails {
  id: string;
  accountId: string;
  direction: 'credit' | 'debit';
  txnType: string;
  category: string;
  amount: number;
  fee: number;
  currency: string;
  currencyCode: string;
  status: CorporateTxnDisplayStatus;
  date: string;
  time: string;
  reference: string;
  transactionId: string;
  purpose: string;
  channel: string;
  paymentDate: string;
  processingDate?: string;
  counterparty: CounterpartyDetails;
  sourceAccount: SourceAccountDetails;
  createdBy?: CorporateUserRef;
  approvedBy?: CorporateUserRef;
  approvalLevels?: ApprovalLevel[];
  timeline: TransactionTimelineEvent[];
  balanceAfter?: number;
  failureReason?: string;
  failureDate?: string;
  failureTime?: string;
  rejectionReason?: string;
  rejectedBy?: CorporateUserRef;
  pendingApproval?: PendingApprovalInfo;
}
