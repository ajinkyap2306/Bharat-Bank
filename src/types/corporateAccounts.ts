import { CorporateTxnDisplayStatus } from './corporateDashboard';

export type CorporateAccountCategory =
  | 'all'
  | 'operating'
  | 'payroll'
  | 'collections'
  | 'savings'
  | 'loan';

export type CorporateAccountDisplayStatus =
  | 'Active'
  | 'Restricted'
  | 'Dormant'
  | 'Closed'
  | 'Pending';

export interface CorporateAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  accountType: string;
  category: Exclude<CorporateAccountCategory, 'all'>;
  balance: number;
  availableBalance: number;
  currency: string;
  currencyCode: string;
  ifsc: string;
  branch: string;
  nickname: string;
  displayStatus: CorporateAccountDisplayStatus;
  companyName: string;
  openingDate: string;
  accountIdentifier: string;
  relationshipManager?: string;
  isPrimary?: boolean;
  holdAmount?: number;
}

export interface CorporateAccountActivity {
  todayInflow: number;
  todayOutflow: number;
  transactionCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface CorporateAccountTransaction {
  id: string;
  accountId: string;
  referenceNumber: string;
  transactionId: string;
  counterpartyName: string;
  amount: number;
  type: 'credit' | 'debit';
  txnType: string;
  date: string;
  time: string;
  dateGroup: string;
  description: string;
  status: CorporateTxnDisplayStatus;
  paymentMode: string;
  initiatedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  batchId?: string;
  remarks?: string;
  failureReason?: string;
  counterpartyAccount?: string;
  invoiceNumber?: string;
  rejectedBy?: string;
}

export interface CorporateStatementPeriod {
  id: string;
  label: string;
  accountId: string;
  status: 'Available' | 'Generating' | 'Unavailable';
}

export interface CorporateStatementPreview {
  accountId: string;
  periodLabel: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number;
  transactions: CorporateAccountTransaction[];
}

export type CorporateTxnFilterType =
  | 'all'
  | 'credit'
  | 'debit'
  | 'transfer'
  | 'payment'
  | 'payroll'
  | 'collection'
  | 'fee';

export type CorporateTxnFilterStatus =
  | 'all'
  | 'completed'
  | 'pending'
  | 'processing'
  | 'failed'
  | 'rejected'
  | 'reversed';

export type CorporateTxnFilterDate = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface CorporateAccountNotificationPrefs {
  balanceAlerts: boolean;
  largeTransactionAlerts: boolean;
  paymentAlerts: boolean;
  collectionAlerts: boolean;
  securityAlerts: boolean;
  statementAlerts: boolean;
  lowBalanceAlerts: boolean;
}

export type CorporateAccountsScreen =
  | 'overview'
  | 'account-details'
  | 'transactions'
  | 'transaction-detail'
  | 'statements'
  | 'statement-preview'
  | 'custom-statement'
  | 'preferences'
  | 'set-primary'
  | 'nickname'
  | 'hide-account'
  | 'notifications'
  | 'documents'
  | 'auth'
  | 'success';
