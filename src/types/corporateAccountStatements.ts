import type { CorporateAccountTransaction } from './corporateAccounts';

export type StatementPeriodPreset =
  | 'this_month'
  | 'last_month'
  | 'last_3_months'
  | 'last_6_months'
  | 'this_fy'
  | 'custom';

export type StatementStatus = 'ready' | 'preparing' | 'unavailable';

export interface StatementDateRange {
  fromDate: string;
  toDate: string;
  fromISO: string;
  toISO: string;
}

export interface AccountStatementData {
  accountId: string;
  accountName: string;
  accountNumber: string;
  companyName: string;
  currency: string;
  currencyCode: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number;
  transactionCount: number;
  creditCount: number;
  debitCount: number;
  netMovement: number;
  status: StatementStatus;
  generatedAt?: string;
  transactions: CorporateAccountTransaction[];
}

export interface StatementAccountOption {
  id: string;
  label: string;
  maskedNumber: string;
}

export interface StatementFilters {
  type: 'all' | 'credit' | 'debit';
  category: string;
  status: string;
}

export const DEFAULT_STATEMENT_FILTERS: StatementFilters = {
  type: 'all',
  category: 'all',
  status: 'all',
};
