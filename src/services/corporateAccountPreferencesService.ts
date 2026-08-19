import type {
  AccountPreferencesModel,
  AccountPreferencesScreenData,
  PreferenceUpdateKey,
} from '../types/corporateAccountPreferences';
import {
  CORPORATE_ACCOUNT_PREFERENCES,
  clonePreferences,
} from '../data/corporateAccountPreferencesMock';
import {
  CORPORATE_ACCOUNT_LIMITS,
  CORPORATE_ACCOUNTS_LIST,
  getAccountById,
} from '../data/corporateAccountsMock';

let preferencesStore: Record<string, AccountPreferencesModel> = Object.fromEntries(
  Object.entries(CORPORATE_ACCOUNT_PREFERENCES).map(([id, prefs]) => [id, { ...prefs }])
);

let primaryAccountId = 'acc_corp_op_01';
let simulateFailure = false;

export function setPreferencesFailureSimulation(enabled: boolean) {
  simulateFailure = enabled;
}

function getPrimaryAccount() {
  const account = getAccountById(primaryAccountId);
  return account
    ? { id: primaryAccountId, label: `${account.accountType} ${account.maskedNumber}` }
    : null;
}

export async function fetchAccountPreferences(
  accountId: string,
  canConfigureLowBalanceAlert: boolean
): Promise<AccountPreferencesScreenData | null> {
  await new Promise((r) => setTimeout(r, 500));

  const account = getAccountById(accountId);
  if (!account) return null;

  const stored = preferencesStore[accountId] ?? clonePreferences(accountId);
  if (!stored) return null;

  const isPrimary = accountId === primaryAccountId;
  const preferences: AccountPreferencesModel = {
    ...stored,
    isPrimary,
    nickname: stored.nickname || account.nickname,
  };

  preferencesStore[accountId] = preferences;

  const limitsConfig = CORPORATE_ACCOUNT_LIMITS[accountId];
  const limits = limitsConfig
    ? {
        dailyLimit: limitsConfig.dailyLimit,
        usedToday: limitsConfig.usedToday,
        remaining: limitsConfig.dailyLimit - limitsConfig.usedToday,
      }
    : undefined;

  const primary = getPrimaryAccount();

  return {
    account,
    preferences,
    limits,
    currentPrimaryAccountId: primary?.id ?? null,
    currentPrimaryAccountLabel: primary?.label ?? null,
    canConfigureLowBalanceAlert,
  };
}

export async function updateAccountPreference<K extends PreferenceUpdateKey>(
  accountId: string,
  key: K,
  value: AccountPreferencesModel[K]
): Promise<AccountPreferencesModel> {
  await new Promise((r) => setTimeout(r, 350));

  if (simulateFailure) {
    throw new Error('Unable to update preference');
  }

  const current = preferencesStore[accountId];
  if (!current) throw new Error('Account preferences not found');

  const updated = { ...current, [key]: value };
  preferencesStore[accountId] = updated;
  return { ...updated, isPrimary: accountId === primaryAccountId };
}

export async function updateAccountNickname(
  accountId: string,
  nickname: string
): Promise<AccountPreferencesModel> {
  return updateAccountPreference(accountId, 'nickname', nickname.trim());
}

export async function setPrimaryAccount(accountId: string): Promise<{
  preferences: AccountPreferencesModel;
  previousPrimaryId: string;
}> {
  await new Promise((r) => setTimeout(r, 500));

  if (simulateFailure) {
    throw new Error('Unable to set primary account');
  }

  const account = getAccountById(accountId);
  if (!account) throw new Error('Account not found');

  const previousPrimaryId = primaryAccountId;
  primaryAccountId = accountId;

  Object.keys(preferencesStore).forEach((id) => {
    preferencesStore[id] = {
      ...preferencesStore[id],
      isPrimary: id === accountId,
    };
  });

  if (!preferencesStore[accountId]) {
    preferencesStore[accountId] = {
      accountId,
      isPrimary: true,
      nickname: account.nickname,
      hideBalance: false,
      transactionAlerts: true,
      largeTransactionAlerts: true,
      balanceAlerts: true,
      paymentStatusAlerts: true,
      statementAlerts: true,
      lowBalanceAlertEnabled: false,
      lowBalanceThreshold: 100000,
    };
  }

  return {
    preferences: { ...preferencesStore[accountId], isPrimary: true },
    previousPrimaryId,
  };
}

export async function removePrimaryStatus(accountId: string): Promise<never> {
  await new Promise((r) => setTimeout(r, 300));
  throw new Error(
    'A primary account is required. Set another eligible account as primary first.'
  );
}

export async function verifyPreferenceAuth(
  method: 'mpin' | 'biometric',
  code?: string
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  if (method === 'biometric') return true;
  return code === '1234' || (code?.length ?? 0) >= 4;
}

export function getStoredPrimaryAccountId() {
  return primaryAccountId;
}

export function getEligiblePrimaryAccounts() {
  return CORPORATE_ACCOUNTS_LIST.filter(
    (a) => a.displayStatus === 'Active' && a.category !== 'loan'
  );
}
