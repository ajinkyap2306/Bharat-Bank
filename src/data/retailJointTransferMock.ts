import type { BankAccount } from '../types/banking';
import type {
  JointOperatingInstruction,
  JointRequestType,
  JointTransferRequest,
  RetailJointUser,
} from '../types/retailJointTransfer';

export const JOINT_ACCOUNT_ID = 'acc_joint_sav_4582';
export const JOINT_EOS_ACCOUNT_ID = 'acc_joint_eos_8834';
export const JOINT_DEMO_BENEFICIARY_ID = 'ben_ret_05';

export const RETAIL_JOINT_DEMO_USERS: Record<string, RetailJointUser> = {
  usr_joint_rahul: {
    id: 'usr_joint_rahul',
    name: 'Rahul Sharma',
    customerNumber: 'RB-RAHUL01',
    demoPassword: 'demo123',
    demoMpin: '582941',
    phone: '+91 98200 45821',
    email: 'rahul.sharma@email.com',
  },
  usr_joint_amit: {
    id: 'usr_joint_amit',
    name: 'Amit Sharma',
    customerNumber: 'RB-AMIT01',
    demoPassword: 'demo123',
    demoMpin: '739582',
    phone: '+91 98190 33456',
    email: 'amit.sharma@email.com',
  },
};

export const JOINT_TRANSFER_STORAGE_KEY = 'bharat_retail_joint_transfer_requests';
export const RETAIL_SESSION_USER_KEY = 'bharat_retail_active_user_id';

export function getRetailJointUserByCustomerNumber(customerNumber: string): RetailJointUser | null {
  const normalized = customerNumber.trim().toUpperCase();
  return (
    Object.values(RETAIL_JOINT_DEMO_USERS).find(
      (u) => u.customerNumber.toUpperCase() === normalized
    ) ?? null
  );
}

export function getRetailJointUser(userId: string): RetailJointUser | null {
  return RETAIL_JOINT_DEMO_USERS[userId] ?? null;
}

export function verifyRetailJointUserMpin(userId: string, mpin: string): boolean {
  const user = getRetailJointUser(userId);
  if (user) return user.demoMpin === mpin;
  if (userId === 'usr_ret_001') return mpin === '123456';
  return false;
}

export function requiresJointApproval(account: BankAccount | undefined): boolean {
  return account?.operatingInstruction === 'jointly_operated';
}

/** True when the logged-in retail user holds a jointly operated account (maker-checker applies). */
export function userHasJointMakerCheckerAccess(
  accounts: BankAccount[],
  userId: string
): boolean {
  return accounts.some(
    (account) =>
      canUserAccessJointAccount(account, userId) && requiresJointApproval(account)
  );
}

export function getOperatingInstructionLabel(instruction?: JointOperatingInstruction): string {
  if (instruction === 'jointly_operated') return 'Jointly Operated';
  if (instruction === 'either_or_survivor') return 'Either or Survivor';
  return 'Individual';
}

export function canUserAccessJointAccount(account: BankAccount, userId: string): boolean {
  if (!account.primaryHolderUserId) return true;
  return (
    account.primaryHolderUserId === userId ||
    (account.jointHolderUserIds?.includes(userId) ?? false)
  );
}

export function buildJointTransferReference(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `FT-${y}${m}${day}-0012`;
}

export function buildJointTransactionId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `TXN-${y}${m}${day}-0012`;
}

export function formatJointTimestamp(date = new Date()): string {
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatJointDate(date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getJointApproverUserId(account: BankAccount, initiatorUserId: string): string | null {
  if (account.primaryHolderUserId === initiatorUserId) {
    return account.jointHolderUserIds?.[0] ?? null;
  }
  if (account.jointHolderUserIds?.includes(initiatorUserId)) {
    return account.primaryHolderUserId ?? null;
  }
  return account.jointHolderUserIds?.find((id) => id !== initiatorUserId) ?? null;
}

export function canUserApproveJointRequest(
  request: JointTransferRequest,
  userId: string
): boolean {
  return (
    request.status === 'pending_joint_approval' &&
    request.approverUserId === userId &&
    request.initiatedByUserId !== userId
  );
}

export function getPendingJointRequestsInitiatedByUser(
  requests: JointTransferRequest[],
  userId: string
): JointTransferRequest[] {
  return requests.filter(
    (r) => r.initiatedByUserId === userId && r.status === 'pending_joint_approval'
  );
}

export function getJointStatusLabel(status: JointTransferRequest['status']): string {
  const labels: Record<JointTransferRequest['status'], string> = {
    pending_joint_approval: 'Pending Joint Approval',
    approved: 'Approved',
    processing: 'Processing',
    completed: 'Completed',
    rejected: 'Rejected',
    failed: 'Failed',
  };
  return labels[status];
}

export function getJointRequestType(request: JointTransferRequest): JointRequestType {
  return request.requestType ?? 'transfer';
}

export function getJointRequestTypeLabel(type: JointRequestType): string {
  const labels: Record<JointRequestType, string> = {
    transfer: 'Fund Transfer',
    deposit_fd: 'Open Fixed Deposit',
    deposit_rd: 'Open Recurring Deposit',
    stop_cheque: 'Stop Cheque',
    positive_pay: 'Positive Pay',
    cheque_book: 'Cheque Book Request',
  };
  return labels[type];
}

export function getJointRequestListTitle(request: JointTransferRequest): string {
  const type = getJointRequestType(request);
  if (type === 'transfer') return request.beneficiaryName;
  if (type === 'stop_cheque' && request.payload && 'chequeNumber' in request.payload) {
    return `Stop Cheque #${request.payload.chequeNumber}`;
  }
  if (type === 'positive_pay' && request.payload && 'chequeNumber' in request.payload) {
    return `Positive Pay #${request.payload.chequeNumber}`;
  }
  if (type === 'cheque_book') return 'Cheque Book Request';
  return getJointRequestTypeLabel(type);
}

export function getJointRequestListAmount(request: JointTransferRequest): string {
  const type = getJointRequestType(request);
  if (type === 'cheque_book') return `${(request.payload as { leaves?: number })?.leaves ?? 0} leaves`;
  if (type === 'stop_cheque') return '—';
  if (request.amount > 0) return `₹${request.amount.toLocaleString('en-IN')}`;
  return '—';
}

export function getJointRequestSuccessTitle(request: JointTransferRequest): string {
  const type = getJointRequestType(request);
  const labels: Record<JointRequestType, string> = {
    transfer: 'Transfer Successful',
    deposit_fd: 'Fixed Deposit Created',
    deposit_rd: 'Recurring Deposit Created',
    stop_cheque: 'Cheque Stopped',
    positive_pay: 'Positive Pay Registered',
    cheque_book: 'Cheque Book Requested',
  };
  return labels[type];
}

export function getJointRequestProcessingTitle(request: JointTransferRequest): string {
  const type = getJointRequestType(request);
  if (type === 'transfer') return 'Processing Transfer';
  if (type.startsWith('deposit_')) return 'Creating Deposit';
  return 'Processing Request';
}

export const INITIAL_JOINT_ACCOUNTS: BankAccount[] = [
  {
    id: JOINT_ACCOUNT_ID,
    accountNumber: '409288194582',
    maskedNumber: '•••• •••• 4582',
    accountType: 'Savings',
    balance: 482450.0,
    availableBalance: 482450.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Joint Savings Account',
    jointAccountLabel: 'Joint Savings Account',
    isJointAccount: true,
    status: 'active',
    interestRate: 6.25,
    operatingInstruction: 'jointly_operated',
    primaryHolderUserId: 'usr_joint_rahul',
    jointHolderUserIds: ['usr_joint_amit'],
    jointHolders: [{ name: 'Amit Sharma', relationship: 'Joint Holder', panMasked: 'AMITS1234P' }],
  },
  {
    id: JOINT_EOS_ACCOUNT_ID,
    accountNumber: '409288198834',
    maskedNumber: '•••• •••• 8834',
    accountType: 'Savings',
    balance: 125000.0,
    availableBalance: 125000.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Joint Savings (Either or Survivor)',
    jointAccountLabel: 'Joint Savings Account',
    isJointAccount: true,
    status: 'active',
    interestRate: 6.0,
    operatingInstruction: 'either_or_survivor',
    primaryHolderUserId: 'usr_joint_rahul',
    jointHolderUserIds: ['usr_joint_amit'],
    jointHolders: [{ name: 'Amit Sharma', relationship: 'Joint Holder' }],
  },
];
