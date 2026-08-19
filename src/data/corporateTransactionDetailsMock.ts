import type { CorporateTransactionDetails } from '../types/corporateTransactionDetails';
import {
  CORPORATE_ACCOUNT_TRANSACTIONS,
  getAccountById,
  getExtendedTransactionsForAccount,
} from './corporateAccountsMock';
import type { CorporateAccountTransaction } from '../types/corporateAccounts';

const DEFAULT_COUNTERPARTY = {
  name: 'ABC Suppliers Ltd.',
  maskedAccount: '•••• 7821',
  bank: 'HDFC Bank',
  ifsc: 'HDFC0001234',
};

const completedTimeline = (
  events: { label: string; date: string; time: string }[]
) =>
  events.map((e, i, arr) => ({
    id: `tl_${i}`,
    label: e.label,
    date: e.date,
    time: e.time,
    state: (i === arr.length - 1 ? 'completed' : 'completed') as const,
  }));

export const CORPORATE_TRANSACTION_DETAILS: Record<string, CorporateTransactionDetails> = {
  cat_01: {
    id: 'cat_01',
    accountId: 'acc_corp_op_01',
    direction: 'debit',
    txnType: 'Vendor Payment',
    category: 'Business Payment',
    amount: 250000,
    fee: 250,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Completed',
    date: '18 Aug 2026',
    time: '10:42 AM',
    reference: 'INV-2026-4582',
    transactionId: 'TXN-20260818-458201',
    purpose: 'Vendor Settlement',
    channel: 'Corporate Mobile Banking',
    paymentDate: '18 Aug 2026',
    processingDate: '18 Aug 2026',
    counterparty: DEFAULT_COUNTERPARTY,
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    createdBy: {
      name: 'Rahul Sharma',
      role: 'Finance Maker',
      date: '18 Aug 2026',
      time: '10:35 AM',
    },
    approvedBy: {
      name: 'Amit Verma',
      role: 'Finance Approver',
      date: '18 Aug 2026',
      time: '10:40 AM',
    },
    approvalLevels: [
      { level: 1, name: 'Amit Verma', role: 'Finance Checker', status: 'Approved', date: '18 Aug 2026', time: '10:40 AM' },
    ],
    timeline: completedTimeline([
      { label: 'Created', date: '18 Aug', time: '10:35 AM' },
      { label: 'Submitted for Approval', date: '18 Aug', time: '10:36 AM' },
      { label: 'Approved by Finance Checker', date: '18 Aug', time: '10:40 AM' },
      { label: 'Processing', date: '18 Aug', time: '10:41 AM' },
      { label: 'Completed', date: '18 Aug', time: '10:42 AM' },
    ]),
    balanceAfter: 1245000,
  },
  cat_03: {
    id: 'cat_03',
    accountId: 'acc_corp_op_01',
    direction: 'credit',
    txnType: 'Collection',
    category: 'Customer Collection',
    amount: 425000,
    fee: 0,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Completed',
    date: '18 Aug 2026',
    time: '09:35 AM',
    reference: 'COL-2026-8831',
    transactionId: 'TXN-CORP-20260818-003',
    purpose: 'Enterprise license settlement',
    channel: 'Corporate Mobile Banking',
    paymentDate: '18 Aug 2026',
    processingDate: '18 Aug 2026',
    counterparty: {
      name: 'Customer Collection',
      maskedAccount: '•••• 3491',
      bank: 'Axis Bank',
      ifsc: 'UTIB0001234',
    },
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    timeline: completedTimeline([
      { label: 'Received', date: '18 Aug', time: '09:34 AM' },
      { label: 'Processing', date: '18 Aug', time: '09:35 AM' },
      { label: 'Completed', date: '18 Aug', time: '09:35 AM' },
    ]),
    balanceAfter: 1495000,
  },
  cat_02: {
    id: 'cat_02',
    accountId: 'acc_corp_op_01',
    direction: 'debit',
    txnType: 'Payroll',
    category: 'Payroll',
    amount: 845000,
    fee: 0,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Processing',
    date: '18 Aug 2026',
    time: '09:15 AM',
    reference: 'BATCH-PAY-0818',
    transactionId: 'TXN-CORP-20260818-002',
    purpose: 'Monthly payroll disbursement',
    channel: 'Corporate Mobile Banking',
    paymentDate: '18 Aug 2026',
    counterparty: {
      name: 'Salary Batch',
      maskedAccount: '•••• 7821',
      bank: 'HDFC Bank',
      ifsc: 'HDFC0001234',
    },
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    createdBy: { name: 'Priya Nair', role: 'Finance Maker', date: '18 Aug 2026', time: '09:10 AM' },
    approvedBy: { name: 'Amit Verma', role: 'Finance Approver', date: '18 Aug 2026', time: '09:12 AM' },
    timeline: [
      { id: 'tl_1', label: 'Created', date: '18 Aug', time: '09:10 AM', state: 'completed' },
      { id: 'tl_2', label: 'Approved', date: '18 Aug', time: '09:12 AM', state: 'completed' },
      { id: 'tl_3', label: 'Processing', date: '18 Aug', time: '09:15 AM', state: 'current' },
      { id: 'tl_4', label: 'Completed', date: '18 Aug', time: '—', state: 'pending' },
    ],
  },
  cat_05: {
    id: 'cat_05',
    accountId: 'acc_corp_op_01',
    direction: 'debit',
    txnType: 'Vendor Payment',
    category: 'Business Payment',
    amount: 125000,
    fee: 125,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Failed',
    date: '17 Aug 2026',
    time: '03:20 PM',
    reference: 'LOG-2026-4412',
    transactionId: 'TXN-CORP-20260817-002',
    purpose: 'Freight and logistics charges',
    channel: 'Corporate Mobile Banking',
    paymentDate: '17 Aug 2026',
    counterparty: {
      name: 'XYZ Logistics',
      maskedAccount: '•••• 9012',
      bank: 'ICICI Bank',
      ifsc: 'ICIC0001234',
    },
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    createdBy: { name: 'Rohit Sharma', role: 'Finance Maker', date: '17 Aug 2026', time: '03:15 PM' },
    failureReason: 'Beneficiary bank could not process the transaction.',
    failureDate: '17 Aug 2026',
    failureTime: '03:20 PM',
    timeline: [
      { id: 'tl_1', label: 'Created', date: '17 Aug', time: '03:15 PM', state: 'completed' },
      { id: 'tl_2', label: 'Submitted for Approval', date: '17 Aug', time: '03:16 PM', state: 'completed' },
      { id: 'tl_3', label: 'Processing', date: '17 Aug', time: '03:18 PM', state: 'completed' },
      { id: 'tl_4', label: 'Failed', date: '17 Aug', time: '03:20 PM', state: 'failed' },
    ],
  },
  cat_06: {
    id: 'cat_06',
    accountId: 'acc_corp_op_01',
    direction: 'debit',
    txnType: 'Payment',
    category: 'Business Payment',
    amount: 1450000,
    fee: 500,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Pending Approval',
    date: '18 Aug 2026',
    time: '08:30 AM',
    reference: 'BATCH-2026-0817-A',
    transactionId: 'TXN-CORP-20260818-004',
    purpose: 'Data center lease — Q3',
    channel: 'Corporate Mobile Banking',
    paymentDate: '18 Aug 2026',
    counterparty: {
      name: 'CtrlS Datacenters Ltd',
      maskedAccount: '•••• 6621',
      bank: 'HDFC Bank',
      ifsc: 'HDFC0001234',
    },
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    createdBy: { name: 'Rohit Sharma', role: 'Finance Maker', date: '18 Aug 2026', time: '08:25 AM' },
    approvalLevels: [
      { level: 1, name: 'Amit Verma', role: 'Finance Checker', status: 'Pending' },
    ],
    pendingApproval: {
      currentLevel: 1,
      requiredLevel: 1,
      message: 'This transaction is waiting for Finance Checker approval.',
    },
    timeline: [
      { id: 'tl_1', label: 'Created', date: '18 Aug', time: '08:25 AM', state: 'completed' },
      { id: 'tl_2', label: 'Submitted for Approval', date: '18 Aug', time: '08:26 AM', state: 'completed' },
      { id: 'tl_3', label: 'Pending Approval', date: '18 Aug', time: '08:28 AM', state: 'current' },
      { id: 'tl_4', label: 'Processing', date: '18 Aug', time: '—', state: 'pending' },
    ],
  },
  cat_08: {
    id: 'cat_08',
    accountId: 'acc_corp_op_01',
    direction: 'debit',
    txnType: 'Vendor Payment',
    category: 'Business Payment',
    amount: 250000,
    fee: 250,
    currency: '₹',
    currencyCode: 'INR',
    status: 'Rejected',
    date: '16 Aug 2026',
    time: '02:15 PM',
    reference: 'PO-2026-9921',
    transactionId: 'TXN-CORP-20260816-001',
    purpose: 'IT hardware procurement',
    channel: 'Corporate Mobile Banking',
    paymentDate: '16 Aug 2026',
    counterparty: {
      name: 'Global Tech Supplies',
      maskedAccount: '•••• 3344',
      bank: 'HDFC Bank',
      ifsc: 'HDFC0001234',
    },
    sourceAccount: {
      accountType: 'Operating Account',
      companyName: 'Acme Technologies Pvt. Ltd.',
      maskedNumber: '•••• 4582',
      availableBalance: 1245000,
    },
    createdBy: { name: 'Rahul Sharma', role: 'Finance Maker', date: '16 Aug 2026', time: '02:10 PM' },
    rejectedBy: { name: 'Amit Verma', role: 'Finance Approver', date: '16 Aug 2026', time: '02:15 PM' },
    rejectionReason: 'Payment exceeds the configured approval limit.',
    timeline: [
      { id: 'tl_1', label: 'Created', date: '16 Aug', time: '02:10 PM', state: 'completed' },
      { id: 'tl_2', label: 'Submitted for Approval', date: '16 Aug', time: '02:12 PM', state: 'completed' },
      { id: 'tl_3', label: 'Rejected', date: '16 Aug', time: '02:15 PM', state: 'failed' },
    ],
  },
};

function buildDetailsFromBase(txn: CorporateAccountTransaction): CorporateTransactionDetails {
  const account = getAccountById(txn.accountId);
  return {
    id: txn.id,
    accountId: txn.accountId,
    direction: txn.type,
    txnType: txn.txnType,
    category: txn.txnType,
    amount: txn.amount,
    fee: 0,
    currency: account?.currency ?? '₹',
    currencyCode: account?.currencyCode ?? 'INR',
    status: txn.status,
    date: txn.date,
    time: txn.time,
    reference: txn.invoiceNumber ?? txn.referenceNumber,
    transactionId: txn.transactionId,
    purpose: txn.description,
    channel: 'Corporate Mobile Banking',
    paymentDate: txn.date,
    processingDate: txn.date,
    counterparty: {
      name: txn.counterpartyName,
      maskedAccount: txn.counterpartyAccount ?? '•••• ••••',
      bank: 'Partner Bank',
      ifsc: 'HDFC0001234',
    },
    sourceAccount: {
      accountType: account?.accountType ?? 'Corporate Account',
      companyName: account?.companyName ?? '',
      maskedNumber: account?.maskedNumber ?? '•••• ••••',
      availableBalance: account?.availableBalance ?? 0,
    },
    createdBy: txn.initiatedBy
      ? { name: txn.initiatedBy, role: 'Finance Maker', date: txn.date, time: txn.time }
      : undefined,
    approvedBy: txn.approvedBy
      ? { name: txn.approvedBy, role: 'Finance Approver', date: txn.approvalDate, time: txn.time }
      : undefined,
    timeline: [
      {
        id: 'tl_1',
        label: txn.status === 'Failed' ? 'Failed' : txn.status,
        date: txn.date.split(' ').slice(0, 2).join(' '),
        time: txn.time,
        state: txn.status === 'Failed' || txn.status === 'Rejected' ? 'failed' : 'completed',
      },
    ],
    failureReason: txn.failureReason,
    rejectedBy: txn.rejectedBy
      ? { name: txn.rejectedBy, role: 'Finance Approver', date: txn.date, time: txn.time }
      : undefined,
  };
}

export function getTransactionDetailsById(
  transactionId: string,
  accountId?: string
): CorporateTransactionDetails | null {
  if (CORPORATE_TRANSACTION_DETAILS[transactionId]) {
    return CORPORATE_TRANSACTION_DETAILS[transactionId];
  }

  const all = accountId
    ? getExtendedTransactionsForAccount(accountId)
    : CORPORATE_ACCOUNT_TRANSACTIONS;

  const base = all.find((t) => t.id === transactionId);
  if (!base) return null;
  return buildDetailsFromBase(base);
}
