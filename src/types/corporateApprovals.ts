export type ApprovalRequestCategory = 'payment' | 'beneficiary' | 'payroll' | 'user' | 'other';

export type ApprovalTab = 'pending' | 'approved' | 'rejected' | 'delegated' | 'history';

export type ApprovalPriority = 'normal' | 'high' | 'urgent';

export type CorporateApprovalsScreen =
  | 'home'
  | 'details'
  | 'approve-confirm'
  | 'auth'
  | 'approve-success'
  | 'reject-reason'
  | 'reject-confirm'
  | 'reject-success'
  | 'changes-request'
  | 'changes-success'
  | 'bulk-review'
  | 'bulk-result'
  | 'delegation'
  | 'delegation-create'
  | 'delegation-detail'
  | 'audit';

export type ApprovalAction = 'approve' | 'reject' | 'changes' | 'bulk-approve' | 'revoke-delegation' | null;

export interface ApprovalLevel {
  level: number;
  role: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected' | 'waiting';
  date?: string;
}

export interface ApprovalTimelineEvent {
  id: string;
  label: string;
  user: string;
  role?: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'waiting';
  comments?: string;
}

export interface CorporateApprovalRequest {
  id: string;
  requestId: string;
  category: ApprovalRequestCategory;
  categoryLabel: string;
  requestType: string;
  title: string;
  amount?: number;
  charges?: number;
  beneficiaryName?: string;
  debitAccount?: string;
  paymentDate?: string;
  purpose?: string;
  reference?: string;
  createdBy: string;
  createdByRole: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'delegated' | 'changes_requested';
  priority?: ApprovalPriority;
  expiresAt?: string;
  requiredApprovals: number;
  currentApprovals: number;
  approvalLevels: ApprovalLevel[];
  timeline: ApprovalTimelineEvent[];
  notes?: string;
  rejectionReason?: string;
  approvedBy?: string;
  rejectedBy?: string;
  batchId?: string;
}

export interface ApprovalDelegation {
  id: string;
  delegateTo: string;
  delegateToRole: string;
  startDate: string;
  endDate: string;
  categories: string[];
  status: 'active' | 'expired' | 'revoked';
}

export interface ApprovalSummary {
  payments: number;
  beneficiaries: number;
  payroll: number;
  userRequests: number;
  total: number;
}
