export type ChequeStatus = 'issued' | 'deposited' | 'cleared' | 'stopped' | 'pending';

export interface ChequeBook {
  id: string;
  accountId: string;
  accountLabel: string;
  chequeBookNumber: string;
  leavesTotal: number;
  leavesUsed: number;
  issuedDate: string;
  status: 'active' | 'exhausted';
}

export interface ChequeRecord {
  id: string;
  chequeNumber: string;
  date: string;
  payee: string;
  amount: number;
  status: ChequeStatus;
  type: 'issued' | 'deposited';
  accountLabel: string;
}

export interface PositivePayRegistration {
  id: string;
  chequeNumber: string;
  payeeName: string;
  amount: number;
  issueDate: string;
  status: 'registered' | 'cleared' | 'rejected';
  reference: string;
}

export const INITIAL_CHEQUE_BOOKS: ChequeBook[] = [
  {
    id: 'cb_1',
    accountId: 'acc_ret_sav_01',
    accountLabel: 'Savings •••• 0012',
    chequeBookNumber: 'CHQ-BK-2024-881',
    leavesTotal: 25,
    leavesUsed: 8,
    issuedDate: '12 Jan 2024',
    status: 'active',
  },
  {
    id: 'cb_2',
    accountId: 'acc_ret_cur_02',
    accountLabel: 'Current •••• 9943',
    chequeBookNumber: 'CHQ-BK-2023-442',
    leavesTotal: 50,
    leavesUsed: 50,
    issuedDate: '03 Mar 2023',
    status: 'exhausted',
  },
];

export const INITIAL_ISSUED_CHEQUES: ChequeRecord[] = [
  {
    id: 'chq_i_1',
    chequeNumber: '004521',
    date: '15 Aug 2026',
    payee: 'Sharma Electronics',
    amount: 45000,
    status: 'cleared',
    type: 'issued',
    accountLabel: 'Savings •••• 0012',
  },
  {
    id: 'chq_i_2',
    chequeNumber: '004522',
    date: '18 Aug 2026',
    payee: 'City Property Mgmt',
    amount: 125000,
    status: 'pending',
    type: 'issued',
    accountLabel: 'Savings •••• 0012',
  },
];

export const INITIAL_DEPOSITED_CHEQUES: ChequeRecord[] = [
  {
    id: 'chq_d_1',
    chequeNumber: '889012',
    date: '10 Aug 2026',
    payee: 'Self',
    amount: 75000,
    status: 'cleared',
    type: 'deposited',
    accountLabel: 'Savings •••• 0012',
  },
];

export const INITIAL_POSITIVE_PAY: PositivePayRegistration[] = [
  {
    id: 'pp_1',
    chequeNumber: '004520',
    payeeName: 'ABC Suppliers Ltd',
    amount: 250000,
    issueDate: '05 Aug 2026',
    status: 'cleared',
    reference: 'PP-20260805-001',
  },
];

export function generateChequeReference(prefix: string): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${n}`;
}
