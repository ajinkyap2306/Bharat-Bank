import type { AccountPreferencesModel } from '../types/corporateAccountPreferences';

const DEFAULT_PREFS: Omit<AccountPreferencesModel, 'accountId' | 'isPrimary' | 'nickname'> = {
  hideBalance: false,
  transactionAlerts: true,
  largeTransactionAlerts: true,
  balanceAlerts: true,
  paymentStatusAlerts: true,
  statementAlerts: true,
  lowBalanceAlertEnabled: false,
  lowBalanceThreshold: 100000,
};

export const CORPORATE_ACCOUNT_PREFERENCES: Record<string, AccountPreferencesModel> = {
  acc_corp_op_01: {
    accountId: 'acc_corp_op_01',
    isPrimary: true,
    nickname: 'Main Operations Account',
    ...DEFAULT_PREFS,
  },
  acc_corp_pay_02: {
    accountId: 'acc_corp_pay_02',
    isPrimary: false,
    nickname: 'Payroll Account',
    ...DEFAULT_PREFS,
    lowBalanceAlertEnabled: true,
    lowBalanceThreshold: 200000,
  },
  acc_corp_col_03: {
    accountId: 'acc_corp_col_03',
    isPrimary: false,
    nickname: 'Collection Account',
    ...DEFAULT_PREFS,
  },
  acc_corp_sav_04: {
    accountId: 'acc_corp_sav_04',
    isPrimary: false,
    nickname: 'Business Savings',
    ...DEFAULT_PREFS,
  },
  acc_corp_op_05: {
    accountId: 'acc_corp_op_05',
    isPrimary: false,
    nickname: 'Treasury Operating',
    ...DEFAULT_PREFS,
  },
  acc_corp_sav_06: {
    accountId: 'acc_corp_sav_06',
    isPrimary: false,
    nickname: 'Corporate Reserve Savings',
    ...DEFAULT_PREFS,
  },
};

export function clonePreferences(accountId: string): AccountPreferencesModel | null {
  const prefs = CORPORATE_ACCOUNT_PREFERENCES[accountId];
  return prefs ? { ...prefs } : null;
}
