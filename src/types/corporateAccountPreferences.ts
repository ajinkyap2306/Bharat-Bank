import type { CorporateAccount } from './corporateAccounts';
import type { AccountTransferLimits } from './corporateAccountDetails';

export interface AccountPreferencesModel {
  accountId: string;
  isPrimary: boolean;
  nickname: string;
  hideBalance: boolean;
  transactionAlerts: boolean;
  largeTransactionAlerts: boolean;
  balanceAlerts: boolean;
  paymentStatusAlerts: boolean;
  statementAlerts: boolean;
  lowBalanceAlertEnabled: boolean;
  lowBalanceThreshold: number;
}

export interface AccountPreferencesScreenData {
  account: CorporateAccount;
  preferences: AccountPreferencesModel;
  limits?: AccountTransferLimits;
  currentPrimaryAccountId: string | null;
  currentPrimaryAccountLabel: string | null;
  canConfigureLowBalanceAlert: boolean;
}

export type PreferenceUpdateKey = keyof Omit<AccountPreferencesModel, 'accountId' | 'isPrimary'>;

export type AuthMethod = 'mpin' | 'biometric';

export type PrimaryAuthAction = 'set-primary' | 'remove-primary' | 'change-primary';
