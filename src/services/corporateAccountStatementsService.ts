import type {
  AccountStatementData,
  StatementDateRange,
  StatementPeriodPreset,
} from '../types/corporateAccountStatements';
import {
  buildAccountStatement,
  getPeriodRange,
  STATEMENT_ACCOUNT_OPTIONS,
} from '../data/corporateAccountStatementsMock';

export async function fetchStatementAccounts() {
  await new Promise((r) => setTimeout(r, 200));
  return STATEMENT_ACCOUNT_OPTIONS;
}

export async function fetchAccountStatement(
  accountId: string,
  preset: StatementPeriodPreset,
  customRange?: StatementDateRange
): Promise<AccountStatementData | null> {
  const preparingDelay = preset === 'custom' ? 900 : 650;
  await new Promise((r) => setTimeout(r, preparingDelay));

  const range = preset === 'custom' && customRange ? customRange : getPeriodRange(preset);
  const statement = buildAccountStatement(accountId, range, 'ready');

  if (!statement) return null;
  if (statement.transactionCount === 0) {
    return { ...statement, status: 'ready' };
  }
  return statement;
}

export async function simulateStatementPreparing(
  accountId: string,
  preset: StatementPeriodPreset,
  customRange?: StatementDateRange
): Promise<AccountStatementData | null> {
  const range = preset === 'custom' && customRange ? customRange : getPeriodRange(preset);
  return buildAccountStatement(accountId, range, 'preparing');
}

export { getPeriodRange };
