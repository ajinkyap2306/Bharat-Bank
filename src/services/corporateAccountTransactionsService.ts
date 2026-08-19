import type { CorporateAccountTransaction } from '../types/corporateAccounts';
import type {
  AccountTransactionFilters,
  AccountTransactionsData,
  AccountTransactionsPage,
} from '../types/corporateAccountTransactions';
import {
  getAccountById,
  getActivityForAccount,
  getExtendedTransactionsForAccount,
  CORPORATE_ACCOUNT_TXN_TOTALS,
} from '../data/corporateAccountsMock';

const PAGE_SIZE = 20;

function parseTxnDate(date: string): Date {
  return new Date(date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'));
}

function matchesDate(txn: CorporateAccountTransaction, dateFilter: AccountTransactionFilters['date']): boolean {
  if (dateFilter === 'all') return true;
  const txnDate = parseTxnDate(txn.date);
  const now = new Date('2026-08-18');
  const diffDays = Math.floor((now.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
  if (dateFilter === 'today') return txn.dateGroup === 'Today' || diffDays === 0;
  if (dateFilter === '7d') return diffDays <= 7;
  if (dateFilter === '30d') return diffDays <= 30;
  if (dateFilter === '90d') return diffDays <= 90;
  return true;
}

function matchesAmount(txn: CorporateAccountTransaction, range: AccountTransactionFilters['amountRange']): boolean {
  if (range === 'all') return true;
  const a = txn.amount;
  if (range === 'under_10k') return a < 10000;
  if (range === '10k_1l') return a >= 10000 && a <= 100000;
  if (range === '1l_5l') return a > 100000 && a <= 500000;
  if (range === 'above_5l') return a > 500000;
  return true;
}

function matchesType(txn: CorporateAccountTransaction, types: AccountTransactionFilters['types']): boolean {
  if (types.length === 0 || types.includes('all')) return true;
  return types.some((t) => {
    if (t === 'credit') return txn.type === 'credit';
    if (t === 'debit') return txn.type === 'debit';
    if (t === 'transfer') return txn.txnType.toLowerCase().includes('transfer');
    if (t === 'payment') return txn.txnType.toLowerCase().includes('payment');
    if (t === 'payroll') return txn.txnType.toLowerCase().includes('payroll');
    if (t === 'collection') return txn.txnType.toLowerCase().includes('collection');
    if (t === 'fee') return txn.txnType.toLowerCase().includes('fee');
    return false;
  });
}

function matchesStatus(txn: CorporateAccountTransaction, statuses: AccountTransactionFilters['statuses']): boolean {
  if (statuses.length === 0 || statuses.includes('all')) return true;
  return statuses.some((s) => {
    const ts = txn.status.toLowerCase();
    if (s === 'pending') return ts.includes('pending');
    return ts.includes(s);
  });
}

function sortTransactions(
  list: CorporateAccountTransaction[],
  sort: AccountTransactionFilters['sort']
): CorporateAccountTransaction[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    const dateA = parseTxnDate(a.date).getTime();
    const dateB = parseTxnDate(b.date).getTime();
    if (sort === 'newest') return dateB - dateA || b.time.localeCompare(a.time);
    if (sort === 'oldest') return dateA - dateB || a.time.localeCompare(b.time);
    if (sort === 'highest') return b.amount - a.amount;
    if (sort === 'lowest') return a.amount - b.amount;
    return 0;
  });
  return sorted;
}

export function filterTransactions(
  transactions: CorporateAccountTransaction[],
  query: string,
  filters: AccountTransactionFilters
): CorporateAccountTransaction[] {
  let list = transactions;
  const q = query.trim().toLowerCase();

  if (q) {
    list = list.filter(
      (t) =>
        t.counterpartyName.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.transactionId.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.txnType.toLowerCase().includes(q) ||
        (t.invoiceNumber?.toLowerCase().includes(q) ?? false) ||
        String(t.amount).includes(q)
    );
  }

  list = list.filter(
    (t) =>
      matchesType(t, filters.types) &&
      matchesStatus(t, filters.statuses) &&
      matchesDate(t, filters.date) &&
      matchesAmount(t, filters.amountRange)
  );

  return sortTransactions(list, filters.sort);
}

export function countActiveFilters(filters: AccountTransactionFilters): number {
  let count = 0;
  if (filters.types.length > 0 && !filters.types.includes('all')) count++;
  if (filters.statuses.length > 0 && !filters.statuses.includes('all')) count++;
  if (filters.date !== 'all') count++;
  if (filters.amountRange !== 'all') count++;
  if (filters.sort !== 'newest') count++;
  return count;
}

export async function fetchAccountTransactionsMeta(
  accountId: string
): Promise<AccountTransactionsData | null> {
  await new Promise((r) => setTimeout(r, 500));
  const account = getAccountById(accountId);
  if (!account) return null;

  const activity = getActivityForAccount(accountId);
  const total = CORPORATE_ACCOUNT_TXN_TOTALS[accountId] ?? getExtendedTransactionsForAccount(accountId).length;

  return {
    accountId,
    availableBalance: account.availableBalance,
    currentBalance: account.balance,
    currency: account.currency,
    accountLabel: `${account.accountType} ${account.maskedNumber}`,
    summary: {
      transactionCount: total,
      todayCount: activity.transactionCount,
      moneyIn: activity.todayInflow,
      moneyOut: activity.todayOutflow,
      netFlow: activity.todayInflow - activity.todayOutflow,
    },
  };
}

export async function fetchAccountTransactionsPage(
  accountId: string,
  page: number,
  query: string,
  filters: AccountTransactionFilters
): Promise<AccountTransactionsPage> {
  await new Promise((r) => setTimeout(r, page === 1 ? 400 : 300));
  const all = getExtendedTransactionsForAccount(accountId);
  const filtered = filterTransactions(all, query, filters);
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);
  return {
    items,
    total: filtered.length,
    hasMore: start + PAGE_SIZE < filtered.length,
    page,
  };
}

export { PAGE_SIZE as TRANSACTIONS_PAGE_SIZE };
