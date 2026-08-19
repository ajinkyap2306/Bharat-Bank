import type {
  AccountStatementData,
  StatementAccountOption,
  StatementDateRange,
  StatementPeriodPreset,
} from '../types/corporateAccountStatements';
import {
  CORPORATE_ACCOUNTS_LIST,
  getExtendedTransactionsForAccount,
} from './corporateAccountsMock';
import type { CorporateAccountTransaction } from '../types/corporateAccounts';

const DEMO_TODAY = new Date('2026-08-18');

export const STATEMENT_ACCOUNT_OPTIONS: StatementAccountOption[] = CORPORATE_ACCOUNTS_LIST.filter(
  (a) =>
    ['acc_corp_op_01', 'acc_corp_pay_02', 'acc_corp_col_03', 'acc_corp_sav_04'].includes(a.id)
).map((a) => ({
  id: a.id,
  label: a.accountType,
  maskedNumber: a.maskedNumber,
}));

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getPeriodRange(preset: StatementPeriodPreset): StatementDateRange {
  const today = DEMO_TODAY;
  let from: Date;
  let to = new Date(today);

  switch (preset) {
    case 'this_month':
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'last_month':
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'last_3_months':
      from = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      break;
    case 'last_6_months':
      from = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      break;
    case 'this_fy':
      from = new Date(today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1, 3, 1);
      break;
    default:
      from = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return {
    fromDate: formatDisplayDate(from),
    toDate: formatDisplayDate(to),
    fromISO: toISO(from),
    toISO: toISO(to),
  };
}

function parseTxnDate(txn: CorporateAccountTransaction): Date {
  return new Date(txn.date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'));
}

function filterByRange(
  txns: CorporateAccountTransaction[],
  range: StatementDateRange
): CorporateAccountTransaction[] {
  const from = new Date(range.fromISO);
  const to = new Date(range.toISO);
  to.setHours(23, 59, 59, 999);
  return txns.filter((t) => {
    const d = parseTxnDate(t);
    return d >= from && d <= to;
  });
}

const STATEMENT_SUMMARIES: Record<string, Partial<AccountStatementData>> = {
  acc_corp_op_01: {
    openingBalance: 1085000,
    totalCredits: 1245000,
    totalDebits: 1085000,
    closingBalance: 1245000,
    transactionCount: 128,
    creditCount: 42,
    debitCount: 86,
    netMovement: 160000,
  },
  acc_corp_pay_02: {
    openingBalance: 520000,
    totalCredits: 0,
    totalDebits: 845000,
    closingBalance: 685000,
    transactionCount: 8,
    creditCount: 0,
    debitCount: 8,
    netMovement: -160000,
  },
  acc_corp_col_03: {
    openingBalance: 120000,
    totalCredits: 425000,
    totalDebits: 125000,
    closingBalance: 420000,
    transactionCount: 12,
    creditCount: 8,
    debitCount: 4,
    netMovement: 300000,
  },
  acc_corp_sav_04: {
    openingBalance: 8200000,
    totalCredits: 540000,
    totalDebits: 200000,
    closingBalance: 8540000,
    transactionCount: 24,
    creditCount: 10,
    debitCount: 14,
    netMovement: 340000,
  },
};

export function buildAccountStatement(
  accountId: string,
  range: StatementDateRange,
  status: AccountStatementData['status'] = 'ready'
): AccountStatementData | null {
  const account = CORPORATE_ACCOUNTS_LIST.find((a) => a.id === accountId);
  if (!account) return null;

  const allTxns = getExtendedTransactionsForAccount(accountId);
  const txns = filterByRange(allTxns, range);
  const summary = STATEMENT_SUMMARIES[accountId] ?? {
    openingBalance: account.balance - 100000,
    totalCredits: txns.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0),
    totalDebits: txns.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0),
    closingBalance: account.balance,
    transactionCount: txns.length,
    creditCount: txns.filter((t) => t.type === 'credit').length,
    debitCount: txns.filter((t) => t.type === 'debit').length,
    netMovement: 0,
  };

  const credits = txns.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits = txns.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return {
    accountId,
    accountName: account.accountType,
    accountNumber: account.maskedNumber,
    companyName: account.companyName,
    currency: account.currency,
    currencyCode: account.currencyCode,
    fromDate: range.fromDate,
    toDate: range.toDate,
    openingBalance: summary.openingBalance ?? account.balance - (credits - debits),
    totalCredits: summary.totalCredits ?? credits,
    totalDebits: summary.totalDebits ?? debits,
    closingBalance: summary.closingBalance ?? account.balance,
    transactionCount: summary.transactionCount ?? txns.length,
    creditCount: summary.creditCount ?? txns.filter((t) => t.type === 'credit').length,
    debitCount: summary.debitCount ?? txns.filter((t) => t.type === 'debit').length,
    netMovement: summary.netMovement ?? credits - debits,
    status,
    generatedAt: status === 'ready' ? '18 Aug 2026 • 11:05 AM' : undefined,
    transactions: txns,
  };
}
