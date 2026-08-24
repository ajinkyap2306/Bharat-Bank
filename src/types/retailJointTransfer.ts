import type { FixedDeposit } from './banking';
import type { BankTransferMode } from './retailBankTransfer';

export type JointOperatingInstruction = 'jointly_operated' | 'either_or_survivor';

export type JointRequestType =
  | 'transfer'
  | 'deposit_fd'
  | 'deposit_rd'
  | 'stop_cheque'
  | 'positive_pay'
  | 'cheque_book';

export interface JointDepositPayload {
  tenureMonths: number;
  payout?: FixedDeposit['payoutFrequency'];
  maturityInstruction?: FixedDeposit['maturityInstruction'];
}

export interface JointChequeStopPayload {
  chequeNumber: string;
  reason: string;
}

export interface JointPositivePayPayload {
  chequeNumber: string;
  payeeName: string;
  issueDate: string;
}

export interface JointChequeBookPayload {
  leaves: number;
}

export type JointRequestPayload =
  | JointDepositPayload
  | JointChequeStopPayload
  | JointPositivePayPayload
  | JointChequeBookPayload;

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
  requestType?: JointRequestType;
  payload?: JointRequestPayload;
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
  mode: BankTransferMode | 'Internal' | 'UPI';
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
  demoTpin: string;
  phone: string;
  email: string;
}
