import type { BankTransferMode } from './retailBankTransfer';

export type JointOperatingInstruction = 'jointly_operated' | 'either_or_survivor';

export type JointTransferRequestStatus =
  | 'pending_joint_approval'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'failed';

export interface JointApprovalHistoryEntry {
  actorName: string;
  action: 'initiated' | 'approved' | 'rejected' | 'completed' | 'processing';
  timestamp: string;
}

export interface JointTransferRequest {
  id: string;
  reference: string;
  transactionId?: string;
  fromAccountId: string;
  initiatedByUserId: string;
  initiatedByName: string;
  approverUserId: string;
  approverName: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryBank: string;
  beneficiaryAccountMasked: string;
  amount: number;
  mode: BankTransferMode | 'Internal';
  note?: string;
  status: JointTransferRequestStatus;
  isSelfTransfer: boolean;
  toAccountId?: string;
  approvalHistory: JointApprovalHistoryEntry[];
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  rejectedByName?: string;
  rejectReason?: string;
}

export type JointTransferStep =
  | 'home'
  | 'self'
  | 'bank-beneficiary'
  | 'amount'
  | 'auth'
  | 'submitted'
  | 'request-detail'
  | 'processing'
  | 'success'
  | 'failed'
  | 'unavailable';

export type JointApprovalStep =
  | 'list'
  | 'detail'
  | 'approve-auth'
  | 'approved'
  | 'processing'
  | 'success'
  | 'rejected';

export interface RetailJointUser {
  id: string;
  name: string;
  customerNumber: string;
  demoPassword: string;
  demoMpin: string;
  phone: string;
  email: string;
}
