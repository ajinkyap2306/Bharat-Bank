import type { AccountsOverviewData } from '../types/corporateAccountsOverview';
import {
  CORPORATE_ACCOUNTS_LIST,
  getAccountsCategorySummary,
} from '../data/corporateAccountsMock';

const DEMO_ACCOUNT_IDS = ['acc_corp_op_01', 'acc_corp_pay_02', 'acc_corp_col_03'] as const;

export async function fetchAccountsOverview(): Promise<AccountsOverviewData> {
  await new Promise((r) => setTimeout(r, 650));

  const accounts = CORPORATE_ACCOUNTS_LIST.filter((a) =>
    DEMO_ACCOUNT_IDS.includes(a.id as (typeof DEMO_ACCOUNT_IDS)[number])
  );

  const availableBalance = accounts.reduce((sum, a) => sum + a.availableBalance, 0);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return {
    companyName: 'Acme Technologies Pvt. Ltd.',
    balance: {
      totalBalance,
      availableBalance,
      accountCount: accounts.length,
    },
    summary: getAccountsCategorySummary(accounts),
    accounts,
  };
}
