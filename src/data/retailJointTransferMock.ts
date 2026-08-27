import type { BankAccount } from '../types/banking';
import type {
  JointOperatingInstruction,
  JointRequestType,
  JointTransferRequest,
  RetailJointRole,
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
    role: 'maker',
    demoPassword: 'demo123',
    demoMpin: '582941',
    demoTpin: '481729',
    phone: '+91 98200 45821',
    email: 'rahul.sharma@email.com',
  },
  usr_joint_amit: {
    id: 'usr_joint_amit',
    name: 'Amit Sharma',
    customerNumber: 'RB-AMIT01',
    role: 'checker',
    demoPassword: 'demo123',
    demoMpin: '739582',
    demoTpin: '629384',
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

export function getRetailJointUserRole(userId: string): RetailJointRole | null {
  return getRetailJointUser(userId)?.role ?? null;
}

export function canUserInitiateJointRequest(userId: string): boolean {
  return getRetailJointUserRole(userId) === 'maker';
}

export function canUserActAsJointChecker(userId: string): boolean {
  return getRetailJointUserRole(userId) === 'checker';
}

/** Retail checkers may debit individual accounts but not joint accounts; makers may debit all held accounts. */
export function canUserInitiateJointTransaction(
  userId: string,
  account?: BankAccount
): boolean {
  if (!account?.isJointAccount) return true;
  if (canUserActAsJointChecker(userId)) return false;
  return canUserInitiateJointRequest(userId);
}

export function canUserDebitFromAccount(userId: string, account?: BankAccount): boolean {
  return canUserInitiateJointTransaction(userId, account);
}

export function verifyRetailJointUserMpin(userId: string, mpin: string): boolean {
  const user = getRetailJointUser(userId);
  if (user) return user.demoMpin === mpin;
  if (userId === 'usr_ret_001') return mpin === '123456';
  return false;
}

export function verifyRetailJointUserTpin(userId: string, tpin: string): boolean {
  const user = getRetailJointUser(userId);
  if (user) return user.demoTpin === tpin;
  if (userId === 'usr_ret_001') return tpin === '654321';
  return false;
}

/** Any jointly held account requires maker-checker approval before debit. */
export function requiresJointApproval(account: BankAccount | undefined): boolean {
  return Boolean(account?.isJointAccount);
}

/** True when a joint maker or checker user holds at least one joint account. */
export function userHasJointMakerCheckerAccess(
  accounts: BankAccount[],
  userId: string
): boolean {
  if (!getRetailJointUserRole(userId)) return false;
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

/** Retail maker-checker approvals are valid only until 11:59:59 PM on the day of submission. */
export const RETAIL_JOINT_APPROVAL_AUTO_REJECT_REASON =
  'Request expired — approval was not completed by end of day (11:59:59 PM).';

export function getRetailJointApprovalEndOfDay(fromDate: Date): Date {
  const end = new Date(fromDate);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function buildRetailJointApprovalExpiryIso(createdAt: Date = new Date()): string {
  return getRetailJointApprovalEndOfDay(createdAt).toISOString();
}

export function getJointRequestCreatedDate(request: JointTransferRequest): Date {
  if (request.createdAtIso) {
    const parsed = new Date(request.createdAtIso);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const idMatch = request.id.match(/^(?:jtr|jar)_(\d+)$/);
  if (idMatch) {
    const fromId = new Date(Number(idMatch[1]));
    if (!Number.isNaN(fromId.getTime())) return fromId;
  }

  return new Date();
}

export function getRetailJointApprovalExpiresAt(request: JointTransferRequest): Date {
  if (request.expiresAtIso) {
    const parsed = new Date(request.expiresAtIso);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return getRetailJointApprovalEndOfDay(getJointRequestCreatedDate(request));
}

export function isRetailJointApprovalExpired(
  request: JointTransferRequest,
  now = new Date()
): boolean {
  if (request.status !== 'pending_joint_approval') return false;
  return now.getTime() > getRetailJointApprovalExpiresAt(request).getTime();
}

export function formatRetailJointApprovalExpiryLabel(request: JointTransferRequest): string {
  const expiresAt = getRetailJointApprovalExpiresAt(request);
  const now = new Date();
  const timeStr = expiresAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (expiresAt.toDateString() === now.toDateString()) {
    return `Valid until ${timeStr} today`;
  }

  if (isRetailJointApprovalExpired(request, now)) {
    return `Expired on ${formatJointDate(expiresAt)} at ${timeStr}`;
  }

  return `Valid until ${formatJointDate(expiresAt)} at ${timeStr}`;
}

export function autoRejectExpiredRetailJointRequests(
  requests: JointTransferRequest[],
  now = new Date()
): JointTransferRequest[] {
  return requests.map((request) => {
    if (!isRetailJointApprovalExpired(request, now)) return request;

    const rejectTime = formatJointTimestamp(now);
    return {
      ...request,
      status: 'rejected',
      rejectedByName: 'System',
      rejectReason: RETAIL_JOINT_APPROVAL_AUTO_REJECT_REASON,
      approvalHistory: [
        ...request.approvalHistory,
        { actorName: 'System', action: 'rejected', timestamp: rejectTime },
      ],
    };
  });
}

export function getJointApproverUserId(_account: BankAccount, initiatorUserId: string): string | null {
  if (!canUserInitiateJointRequest(initiatorUserId)) return null;
  const checker = Object.values(RETAIL_JOINT_DEMO_USERS).find((u) => u.role === 'checker');
  return checker?.id ?? null;
}

export function canUserApproveJointRequest(
  request: JointTransferRequest,
  userId: string
): boolean {
  if (!canUserActAsJointChecker(userId)) return false;
  if (isRetailJointApprovalExpired(request)) return false;
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

/** Non-joint accounts held solely by Rahul (RB-RAHUL01) — transfers skip maker-checker. */
export const RAHUL_INDIVIDUAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_rahul_ind_sav',
    accountNumber: '409288771188',
    maskedNumber: '•••• •••• 7188',
    accountType: 'Savings',
    balance: 215000.0,
    availableBalance: 215000.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Personal Savings Account',
    status: 'active',
    interestRate: 6.25,
    primaryHolderUserId: 'usr_joint_rahul',
  },
  {
    id: 'acc_rahul_ind_cur',
    accountNumber: '409288772177',
    maskedNumber: '•••• •••• 2177',
    accountType: 'Current',
    balance: 78000.0,
    availableBalance: 78000.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Personal Current Account',
    status: 'active',
    primaryHolderUserId: 'usr_joint_rahul',
  },
];

/** Non-joint accounts held solely by the retail joint checker demo user (RB-AMIT01). */
export const AMIT_INDIVIDUAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_amit_ind_sav',
    accountNumber: '409288771199',
    maskedNumber: '•••• •••• 7199',
    accountType: 'Savings',
    balance: 185000.0,
    availableBalance: 185000.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Personal Savings Account',
    status: 'active',
    interestRate: 6.25,
    primaryHolderUserId: 'usr_joint_amit',
  },
  {
    id: 'acc_amit_ind_cur',
    accountNumber: '409288772288',
    maskedNumber: '•••• •••• 2288',
    accountType: 'Current',
    balance: 92000.0,
    availableBalance: 92000.0,
    currency: '₹',
    ifsc: 'APEX0001048',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Personal Current Account',
    status: 'active',
    primaryHolderUserId: 'usr_joint_amit',
  },
];
