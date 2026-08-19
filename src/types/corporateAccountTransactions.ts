import type { CorporateTxnFilterStatus, CorporateTxnFilterType } from './corporateAccounts';

export type TransactionAmountRange =
  | 'all'
  | 'under_10k'
  | '10k_1l'
  | '1l_5l'
  | 'above_5l'
  | 'custom';

export type TransactionQuickDate = 'today' | '7d' | '30d' | '90d' | 'all';

export type TransactionSortOption =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest';

export interface AccountTransactionFilters {
  types: CorporateTxnFilterType[];
  statuses: CorporateTxnFilterStatus[];
  date: TransactionQuickDate;
  amountRange: TransactionAmountRange;
  sort: TransactionSortOption;
}

export const EMPTY_TRANSACTION_FILTERS: AccountTransactionFilters = {
  types: [],
  statuses: [],
  date: 'all',
  amountRange: 'all',
  sort: 'newest',
};

export interface AccountTransactionsSummary {
  transactionCount: number;
  todayCount: number;
  moneyIn: number;
  moneyOut: number;
  netFlow: number;
}

export interface AccountTransactionsPage {
  items: import('./corporateAccounts').CorporateAccountTransaction[];
  total: number;
  hasMore: boolean;
  page: number;
}

export interface AccountTransactionsData {
  accountId: string;
  availableBalance: number;
  currentBalance: number;
  currency: string;
  accountLabel: string;
  summary: AccountTransactionsSummary;
}
