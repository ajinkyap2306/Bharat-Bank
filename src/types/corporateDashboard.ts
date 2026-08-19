export interface CorporateEntity {
  id: string;
  name: string;
  cin: string;
  isPrimary?: boolean;
}

export interface CorporateCashPosition {
  totalBalance: number;
  availableBalance: number;
  todayInflow: number;
  todayOutflow: number;
}

export interface CorporateDashboardAccount {
  id: string;
  name: string;
  maskedNumber: string;
  balance: number;
  availableBalance: number;
  status: 'Active' | 'Frozen' | 'Inactive';
  isPrimary?: boolean;
}

export interface CorporateApprovalAlert {
  requestCount: number;
  totalAmount: number;
}

export interface CorporatePendingAction {
  id: string;
  label: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  tab: 'approvals' | 'payments' | 'users';
}

export interface CorporateApprovalSummary {
  total: number;
  payments: number;
  beneficiaries: number;
  payroll: number;
  userRequests: number;
}

export interface CorporatePendingApproval {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  createdBy?: string;
  employeeCount?: number;
  status: 'Pending Approval';
}

export interface CorporateCashFlowPoint {
  label: string;
  inflow: number;
  outflow: number;
}

export interface CorporateUpcomingPayment {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'Scheduled' | 'Pending Approval';
  sourceAccount?: string;
}

export interface CorporateDashboardTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  direction: 'credit' | 'debit';
  date: string;
  status: CorporateTxnDisplayStatus;
}

export interface CorporateCollectionsSnapshot {
  todayTotal: number;
  matched: number;
  unmatched: number;
}

export interface CorporatePayrollSnapshot {
  id: string;
  title: string;
  employeeCount: number;
  amount: number;
  status: 'Pending Approval' | 'Scheduled' | 'Processing';
}

export interface CorporateBulkPaymentsSnapshot {
  pendingBatches: number;
}

export interface CorporateSecurityAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

export interface CorporateDashboardNotification {
  id: string;
  type: 'payment' | 'approval' | 'payroll' | 'collections' | 'security';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface CorporateDashboardSummary {
  userName: string;
  userRole: string;
  greeting: string;
  lastLogin: string;
  cashPosition: CorporateCashPosition;
  accounts: CorporateDashboardAccount[];
  approvalAlert: CorporateApprovalAlert;
  actionRequired: CorporateApprovalSummary;
  pendingApprovals: CorporatePendingApproval[];
  upcomingPayments: CorporateUpcomingPayment[];
  recentTransactions: CorporateDashboardTransaction[];
  collections: CorporateCollectionsSnapshot;
  payroll: CorporatePayrollSnapshot | null;
  bulkPayments: CorporateBulkPaymentsSnapshot;
  securityAlert: CorporateSecurityAlert | null;
}

export type CorporateTxnDisplayStatus =
  | 'Completed'
  | 'Processing'
  | 'Pending Approval'
  | 'Failed'
  | 'Rejected'
  | 'Scheduled';

export type CorporateCashFlowPeriod = '7D' | '30D' | '90D';
