import {
  CorporateAccount,
  CorporateAccountActivity,
  CorporateAccountTransaction,
  CorporateStatementPeriod,
} from '../types/corporateAccounts';
import { CORPORATE_CASH_POSITION } from './corporateDashboardMock';

const COMPANY = 'Acme Technologies Pvt. Ltd.';

export const CORPORATE_ACCOUNTS_BALANCE = CORPORATE_CASH_POSITION;

export const CORPORATE_ACCOUNTS_LIST: CorporateAccount[] = [
  {
    id: 'acc_corp_op_01',
    accountNumber: '9100882314582',
    maskedNumber: '•••• 4582',
    accountType: 'Operating Account',
    category: 'operating',
    balance: 1268500,
    availableBalance: 1245000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Mumbai Corporate Branch',
    nickname: 'Main Operations Account',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '12 Mar 2024',
    accountIdentifier: 'COP-ACC-OP-4582',
    relationshipManager: 'Neha Sharma',
    isPrimary: true,
    holdAmount: 23500,
  },
  {
    id: 'acc_corp_pay_02',
    accountNumber: '910088237821',
    maskedNumber: '•••• 7821',
    accountType: 'Payroll Account',
    category: 'payroll',
    balance: 685000,
    availableBalance: 685000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Nariman Point Institutional Branch, Mumbai',
    nickname: 'Payroll Account',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '08 Jun 2020',
    accountIdentifier: 'COP-ACC-PAY-7821',
    relationshipManager: 'Anita Desai',
  },
  {
    id: 'acc_corp_col_03',
    accountNumber: '910088233491',
    maskedNumber: '•••• 3491',
    accountType: 'Collection Account',
    category: 'collections',
    balance: 420000,
    availableBalance: 420000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Nariman Point Institutional Branch, Mumbai',
    nickname: 'Collection Account',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '15 Jan 2021',
    accountIdentifier: 'COP-ACC-COL-3491',
  },
  {
    id: 'acc_corp_sav_04',
    accountNumber: '910088236721',
    maskedNumber: '•••• 6721',
    accountType: 'Business Savings',
    category: 'savings',
    balance: 8540000,
    availableBalance: 8540000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Business Savings',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '22 Sep 2022',
    accountIdentifier: 'COP-ACC-SAV-6721',
  },
  {
    id: 'acc_corp_op_05',
    accountNumber: '910088234882',
    maskedNumber: '•••• 4882',
    accountType: 'Treasury Operating Account',
    category: 'operating',
    balance: 3250000,
    availableBalance: 3100000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Nariman Point Institutional Branch, Mumbai',
    nickname: 'Treasury Operating',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '04 May 2023',
    accountIdentifier: 'COP-ACC-OP-4882',
  },
  {
    id: 'acc_corp_sav_06',
    accountNumber: '910088235512',
    maskedNumber: '•••• 5512',
    accountType: 'Corporate Reserve Savings',
    category: 'savings',
    balance: 2100000,
    availableBalance: 2100000,
    currency: '₹',
    currencyCode: 'INR',
    ifsc: 'APEX0009981',
    branch: 'Bandra Kurla Complex, Mumbai',
    nickname: 'Corporate Reserve Savings',
    displayStatus: 'Active',
    companyName: COMPANY,
    openingDate: '10 Jan 2024',
    accountIdentifier: 'COP-ACC-SAV-5512',
  },
];

export const CORPORATE_ACCOUNT_ACTIVITY: Record<string, CorporateAccountActivity> = {
  acc_corp_op_01: {
    todayInflow: 425000,
    todayOutflow: 285000,
    transactionCount: 18,
    pendingCount: 2,
    failedCount: 0,
  },
  acc_corp_pay_02: {
    todayInflow: 0,
    todayOutflow: 845000,
    transactionCount: 8,
    pendingCount: 1,
    failedCount: 0,
  },
  acc_corp_col_03: {
    todayInflow: 425000,
    todayOutflow: 0,
    transactionCount: 12,
    pendingCount: 0,
    failedCount: 0,
  },
};

export const CORPORATE_ACCOUNT_TRANSACTIONS: CorporateAccountTransaction[] = [
  {
    id: 'cat_01',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'RTGS9921400192',
    transactionId: 'TXN-20260818-458201',
    counterpartyName: 'ABC Suppliers Ltd.',
    amount: 250000,
    type: 'debit',
    txnType: 'Vendor Payment',
    date: '18 Aug 2026',
    time: '10:42 AM',
    dateGroup: 'Today',
    description: 'Vendor payment — office supplies',
    status: 'Completed',
    paymentMode: 'RTGS',
    initiatedBy: 'Rahul Sharma',
    approvedBy: 'Amit Verma',
    approvalDate: '18 Aug 2026',
    batchId: 'BATCH-2026-0818-A',
    remarks: 'Approved against PO-8821',
    invoiceNumber: 'INV-2026-4582',
  },
  {
    id: 'cat_03',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'NEFT8812904811',
    transactionId: 'TXN-CORP-20260818-003',
    counterpartyName: 'Customer Collection',
    amount: 425000,
    type: 'credit',
    txnType: 'Collection',
    date: '18 Aug 2026',
    time: '09:35 AM',
    dateGroup: 'Today',
    description: 'Enterprise license settlement',
    status: 'Completed',
    paymentMode: 'NEFT',
  },
  {
    id: 'cat_02',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'BLK7712904419',
    transactionId: 'TXN-CORP-20260818-002',
    counterpartyName: 'Salary Batch',
    amount: 845000,
    type: 'debit',
    txnType: 'Payroll',
    date: '18 Aug 2026',
    time: '09:15 AM',
    dateGroup: 'Today',
    description: 'Monthly payroll disbursement',
    status: 'Processing',
    paymentMode: 'Bulk',
    initiatedBy: 'Priya Nair',
    approvedBy: 'Amit Verma',
    approvalDate: '18 Aug 2026',
    batchId: 'BATCH-PAY-0818',
  },
  {
    id: 'cat_03b',
    accountId: 'acc_corp_col_03',
    referenceNumber: 'NEFT8812904811',
    transactionId: 'TXN-CORP-20260818-003B',
    counterpartyName: 'Customer Payment',
    amount: 425000,
    type: 'credit',
    txnType: 'Collection',
    date: '18 Aug 2026',
    time: '08:30 AM',
    dateGroup: 'Today',
    description: 'Enterprise license settlement',
    status: 'Completed',
    paymentMode: 'NEFT',
  },
  {
    id: 'cat_04',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'RTGS4401923881',
    transactionId: 'TXN-CORP-20260817-001',
    counterpartyName: 'Office Rent',
    amount: 150000,
    type: 'debit',
    txnType: 'Business Payment',
    date: '17 Aug 2026',
    time: '05:30 PM',
    dateGroup: 'Yesterday',
    description: 'Monthly office rent — BKC',
    status: 'Completed',
    paymentMode: 'NEFT',
    initiatedBy: 'Rahul Sharma',
    approvedBy: 'Amit Verma',
    approvalDate: '17 Aug 2026',
  },
  {
    id: 'cat_05',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'RTGS9921400999',
    transactionId: 'TXN-CORP-20260817-002',
    counterpartyName: 'XYZ Logistics',
    amount: 125000,
    type: 'debit',
    txnType: 'Vendor Payment',
    date: '17 Aug 2026',
    time: '03:20 PM',
    dateGroup: 'Yesterday',
    description: 'Freight and logistics charges',
    status: 'Failed',
    paymentMode: 'RTGS',
    initiatedBy: 'Rohit Sharma',
    failureReason: 'Transaction could not be completed.',
  },
  {
    id: 'cat_06',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'PND-88291001',
    transactionId: 'TXN-CORP-20260818-004',
    counterpartyName: 'CtrlS Datacenters Ltd',
    amount: 1450000,
    type: 'debit',
    txnType: 'Payment',
    date: '18 Aug 2026',
    time: '08:30 AM',
    dateGroup: 'Today',
    description: 'Data center lease — Q3',
    status: 'Pending Approval',
    paymentMode: 'RTGS',
    initiatedBy: 'Rohit Sharma',
    batchId: 'BATCH-2026-0817-A',
  },
  {
    id: 'cat_07',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'TRF8829104421',
    transactionId: 'TXN-CORP-20260817-003',
    counterpartyName: 'Internal Transfer',
    amount: 500000,
    type: 'credit',
    txnType: 'Transfer',
    date: '17 Aug 2026',
    time: '12:10 PM',
    dateGroup: 'Yesterday',
    description: 'Treasury to operating transfer',
    status: 'Completed',
    paymentMode: 'Internal',
    initiatedBy: 'Priya Nair',
    approvedBy: 'Amit Verma',
    approvalDate: '17 Aug 2026',
  },
  {
    id: 'cat_08',
    accountId: 'acc_corp_op_01',
    referenceNumber: 'RTGS9921400888',
    transactionId: 'TXN-CORP-20260816-001',
    counterpartyName: 'Global Tech Supplies',
    amount: 250000,
    type: 'debit',
    txnType: 'Vendor Payment',
    date: '16 Aug 2026',
    time: '02:15 PM',
    dateGroup: '16 Aug 2026',
    description: 'IT hardware procurement',
    status: 'Rejected',
    paymentMode: 'RTGS',
    initiatedBy: 'Rahul Sharma',
    rejectedBy: 'Amit Verma',
    failureReason: 'Rejected by approver',
  },
];

export const CORPORATE_STATEMENT_PERIODS: CorporateStatementPeriod[] = [
  { id: 'stmt_08', label: 'August 2026', accountId: 'acc_corp_op_01', status: 'Available' },
  { id: 'stmt_07', label: 'July 2026', accountId: 'acc_corp_op_01', status: 'Available' },
  { id: 'stmt_06', label: 'June 2026', accountId: 'acc_corp_op_01', status: 'Available' },
  { id: 'stmt_05', label: 'May 2026', accountId: 'acc_corp_op_01', status: 'Available' },
];

export const CORPORATE_ACCOUNT_DOCUMENTS = [
  { id: 'doc_stmt', title: 'Account Statement', description: 'Monthly account statement' },
  { id: 'doc_cert', title: 'Account Certificate', description: 'Official account certificate' },
  { id: 'doc_int', title: 'Interest Certificate', description: 'Interest earned certificate' },
  { id: 'doc_tax', title: 'Tax Certificate', description: 'TDS / tax certificate' },
  { id: 'doc_conf', title: 'Account Confirmation Letter', description: 'Balance confirmation letter' },
];

export const CORPORATE_ACCOUNT_LIMITS: Record<string, { dailyLimit: number; usedToday: number }> = {
  acc_corp_op_01: { dailyLimit: 5000000, usedToday: 1250000 },
  acc_corp_pay_02: { dailyLimit: 3000000, usedToday: 845000 },
  acc_corp_op_05: { dailyLimit: 10000000, usedToday: 2100000 },
};

export const CORPORATE_ACCOUNT_CASH_FLOW_SUMMARY = {
  '7D': { inflow: 12.45, outflow: 8.25, net: 4.2 },
  '30D': { inflow: 48.6, outflow: 41.2, net: 7.4 },
  '90D': { inflow: 185.0, outflow: 162.5, net: 22.5 },
};

export const CORPORATE_CASH_FLOW_ACCOUNTS = {
  '7D': [
    { label: 'Mon', inflow: 8.2, outflow: 5.1 },
    { label: 'Tue', inflow: 12.4, outflow: 7.8 },
    { label: 'Wed', inflow: 6.5, outflow: 9.2 },
    { label: 'Thu', inflow: 15.1, outflow: 6.4 },
    { label: 'Fri', inflow: 9.8, outflow: 11.2 },
    { label: 'Sat', inflow: 3.2, outflow: 1.8 },
    { label: 'Sun', inflow: 12.5, outflow: 8.3 },
  ],
  '30D': [
    { label: 'W1', inflow: 42, outflow: 38 },
    { label: 'W2', inflow: 55, outflow: 41 },
    { label: 'W3', inflow: 48, outflow: 52 },
    { label: 'W4', inflow: 61, outflow: 44 },
  ],
  '90D': [
    { label: 'M1', inflow: 180, outflow: 165 },
    { label: 'M2', inflow: 195, outflow: 172 },
    { label: 'M3', inflow: 210, outflow: 188 },
  ],
};

const frozenCorporateAccountIds = new Set<string>();

export function setCorporateAccountFrozen(accountId: string, frozen: boolean) {
  if (frozen) frozenCorporateAccountIds.add(accountId);
  else frozenCorporateAccountIds.delete(accountId);
}

export function isCorporateAccountFrozen(accountId: string) {
  return frozenCorporateAccountIds.has(accountId);
}

export const getAccountById = (id: string) => {
  const account = CORPORATE_ACCOUNTS_LIST.find((a) => a.id === id);
  if (!account) return undefined;
  if (frozenCorporateAccountIds.has(id)) {
    return { ...account, displayStatus: 'Restricted' as const };
  }
  return account;
};

export const getAccountsCategorySummary = (accounts: CorporateAccount[]) => ({
  total: accounts.length,
  operating: accounts.filter((a) => a.category === 'operating').length,
  payroll: accounts.filter((a) => a.category === 'payroll').length,
  collections: accounts.filter((a) => a.category === 'collections').length,
  savings: accounts.filter((a) => a.category === 'savings').length,
  loan: accounts.filter((a) => a.category === 'loan').length,
});

export const getTransactionsForAccount = (accountId: string) =>
  CORPORATE_ACCOUNT_TRANSACTIONS.filter((t) => t.accountId === accountId);

const GENERATED_TXN_TYPES = [
  'Vendor Payment',
  'Customer Collection',
  'Payroll',
  'Transfer',
  'Tax Payment',
  'Bank Transfer',
  'Account Fee',
  'Interest Credit',
  'Refund',
  'Cash Deposit',
];

const GENERATED_COUNTERPARTIES = [
  'ABC Suppliers Ltd.',
  'Customer Collection',
  'Salary Batch',
  'Office Rent',
  'XYZ Logistics',
  'Internal Transfer',
  'GST Payment',
  'Service Fee',
  'Interest Credit',
  'Refund Settlement',
];

export const getExtendedTransactionsForAccount = (
  accountId: string
): CorporateAccountTransaction[] => {
  const base = getTransactionsForAccount(accountId);
  if (accountId !== 'acc_corp_op_01') return base;

  const generated: CorporateAccountTransaction[] = [];
  const statuses: CorporateAccountTransaction['status'][] = [
    'Completed',
    'Completed',
    'Completed',
    'Processing',
    'Failed',
  ];

  for (let i = 0; i < 120; i++) {
    const dayOffset = Math.floor(i / 4) + 3;
    const date = `${Math.max(1, 18 - dayOffset)} Aug 2026`;
    const isCredit = i % 5 === 0;
    const amount = 15000 + (i % 20) * 12500;
    const typeIdx = i % GENERATED_TXN_TYPES.length;
    generated.push({
      id: `gen_${accountId}_${i}`,
      accountId,
      referenceNumber: `REF${8800000 + i}`,
      transactionId: `TXN-GEN-${i}`,
      counterpartyName: GENERATED_COUNTERPARTIES[typeIdx],
      amount,
      type: isCredit ? 'credit' : 'debit',
      txnType: GENERATED_TXN_TYPES[typeIdx],
      date,
      time: `${(9 + (i % 8))}:${String((i * 7) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
      dateGroup: dayOffset <= 1 ? 'Yesterday' : date,
      description: `Corporate transaction ${i + 1}`,
      status: statuses[i % statuses.length],
      paymentMode: i % 3 === 0 ? 'NEFT' : 'RTGS',
      initiatedBy: i % 2 === 0 ? 'Rahul Sharma' : 'Priya Nair',
      approvedBy: i % 3 === 0 ? 'Amit Verma' : undefined,
    });
  }

  return [...base, ...generated];
};

export const CORPORATE_ACCOUNT_TXN_TOTALS: Record<string, number> = {
  acc_corp_op_01: 128,
};

export const getActivityForAccount = (accountId: string): CorporateAccountActivity =>
  CORPORATE_ACCOUNT_ACTIVITY[accountId] || {
    todayInflow: 0,
    todayOutflow: 0,
    transactionCount: 0,
    pendingCount: 0,
    failedCount: 0,
  };
