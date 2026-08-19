import type { AccountLimitsScreenData } from '../types/corporateAccountLimits';
import { getAccountLimitsMock } from '../data/corporateAccountLimitsMock';
import { getAccountById } from '../data/corporateAccountsMock';
import { clonePreferences } from '../data/corporateAccountPreferencesMock';

export function canViewAccountLimits(role?: string): boolean {
  if (!role) return true;
  const r = role.toLowerCase();
  if (r.includes('viewer') || r.includes('read-only') || r.includes('guest')) return false;
  return true;
}

export function canRequestLimitChange(role?: string): boolean {
  if (!role) return true;
  const r = role.toLowerCase();
  return (
    r.includes('admin') ||
    r.includes('cfo') ||
    r.includes('finance manager') ||
    r.includes('corporate admin')
  );
}

export async function fetchAccountLimits(
  accountId: string,
  role?: string
): Promise<AccountLimitsScreenData | null> {
  await new Promise((r) => setTimeout(r, 550));

  if (!canViewAccountLimits(role)) {
    throw new Error('You do not have permission to view account limits.');
  }

  const account = getAccountById(accountId);
  const limits = getAccountLimitsMock(accountId);

  if (!account || !limits) return null;

  const prefs = clonePreferences(accountId);

  return {
    account,
    limits,
    hideBalance: prefs?.hideBalance ?? false,
    canRequestLimitChange: canRequestLimitChange(role),
  };
}
