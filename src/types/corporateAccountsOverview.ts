import type { CorporateAccount, CorporateAccountCategory, CorporateAccountDisplayStatus } from '../types/corporateAccounts';

export interface AccountsOverviewBalance {
  totalBalance: number;
  availableBalance: number;
  accountCount: number;
}

export interface AccountsCategorySummary {
  total: number;
  operating: number;
  payroll: number;
  collections: number;
  savings: number;
  loan: number;
}

export interface AccountFilterState {
  categories: Exclude<CorporateAccountCategory, 'all'>[];
  statuses: CorporateAccountDisplayStatus[];
  currencies: string[];
}

export const EMPTY_ACCOUNT_FILTER: AccountFilterState = {
  categories: [],
  statuses: [],
  currencies: [],
};

export interface AccountsOverviewData {
  companyName: string;
  balance: AccountsOverviewBalance;
  summary: AccountsCategorySummary;
  accounts: CorporateAccount[];
}
