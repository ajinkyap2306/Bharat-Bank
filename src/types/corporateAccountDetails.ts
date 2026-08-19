import type { CorporateAccount, CorporateAccountActivity, CorporateAccountTransaction } from './corporateAccounts';
import type { CorporateCashFlowPeriod, CorporateCashFlowPoint } from './corporateDashboard';

export interface AccountTransferLimits {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
}

export interface AccountCashFlowSummary {
  inflow: number;
  outflow: number;
  net: number;
}

export interface CorporateAccountDetailsData {
  account: CorporateAccount;
  activity: CorporateAccountActivity;
  recentTransactions: CorporateAccountTransaction[];
  cashFlow: Record<CorporateCashFlowPeriod, CorporateCashFlowPoint[]>;
  cashFlowSummary: Record<CorporateCashFlowPeriod, AccountCashFlowSummary>;
  limits?: AccountTransferLimits;
  customNickname?: string;
  corporateRelationship: string;
}
