import type { CorporateAccountDetailsData } from '../types/corporateAccountDetails';
import {
  getAccountById,
  getActivityForAccount,
  getTransactionsForAccount,
  CORPORATE_CASH_FLOW_ACCOUNTS,
  CORPORATE_ACCOUNT_LIMITS,
  CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY,
} from '../data/corporateAccountsMock';

export async function fetchAccountDetails(
  accountId: string
): Promise<CorporateAccountDetailsData | null> {
  await new Promise((r) => setTimeout(r, 600));

  const account = getAccountById(accountId);
  if (!account) return null;

  const limitsConfig = CORPORATE_ACCOUNT_LIMITS[accountId];
  const limits = limitsConfig
    ? {
        dailyLimit: limitsConfig.dailyLimit,
        usedToday: limitsConfig.usedToday,
        remaining: limitsConfig.dailyLimit - limitsConfig.usedToday,
      }
    : undefined;

  const customNickname =
    account.nickname !== account.accountType ? account.nickname : undefined;

  return {
    account,
    activity: getActivityForAccount(accountId),
    recentTransactions: getTransactionsForAccount(accountId).slice(0, 5),
    cashFlow: CORPORATE_CASH_FLOW_ACCOUNTS,
    cashFlowSummary: {
      '7D': {
        inflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['7D'].inflow,
        outflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['7D'].outflow,
        net: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['7D'].net,
      },
      '30D': {
        inflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['30D'].inflow,
        outflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['30D'].outflow,
        net: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['30D'].net,
      },
      '90D': {
        inflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['90D'].inflow,
        outflow: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['90D'].outflow,
        net: CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY['90D'].net,
      },
    },
    limits,
    customNickname,
    corporateRelationship: 'Corporate Banking',
  };
}

export async function fetchAccountTransactions(
  accountId: string
): Promise<ReturnType<typeof getTransactionsForAccount>> {
  await new Promise((r) => setTimeout(r, 400));
  return getTransactionsForAccount(accountId).slice(0, 5);
}
