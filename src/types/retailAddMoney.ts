export type AddMoneySourceType = 'bank_account' | 'debit_card' | 'upi';

export type AddMoneyStep =
  | 'home'
  | 'select-source'
  | 'amount'
  | 'auth'
  | 'processing'
  | 'success'
  | 'failed'
  | 'transaction-detail';

export interface LinkedBankAccount {
  id: string;
  bankName: string;
  accountType: string;
  maskedNumber: string;
  availableBalance: number;
}

export interface LinkedDebitCard {
  id: string;
  bankName: string;
  maskedNumber: string;
  network: string;
}

export interface AddMoneyLimits {
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  usedToday: number;
  fee: number;
}

export interface AddMoneyDraft {
  sourceType: AddMoneySourceType | null;
  sourceId: string;
  upiId: string;
  upiApp: string;
  amount: string;
}

export interface AddMoneyResult {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  creditedAccountLabel: string;
  sourceLabel: string;
  timestamp: string;
}
