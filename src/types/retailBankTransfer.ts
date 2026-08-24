export type BankTransferPath = 'self' | 'bank';

export type BankTransferMode = 'IMPS' | 'NEFT' | 'RTGS';

export type BankTransferStep =
  | 'home'
  | 'self'
  | 'bank-beneficiary'
  | 'bank-enter'
  | 'amount'
  | 'auth'
  | 'processing'
  | 'success'
  | 'failed'
  | 'submitted'
  | 'unavailable';

export interface ManualReceiver {
  name: string;
  accountNumber: string;
  maskedAccount: string;
  bankName: string;
  ifsc: string;
}

export interface BankTransferDraft {
  path: BankTransferPath | null;
  fromAccountId: string;
  toAccountId: string;
  beneficiaryId: string | null;
  manualReceiver: ManualReceiver | null;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  amount: string;
  note: string;
  transferMode: BankTransferMode;
}

export interface BankTransferResult {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  mode: BankTransferMode | 'Internal';
  receiverLabel: string;
  receiverBank: string;
  receiverAccount: string;
  receiverIfsc?: string;
  timestamp: string;
  isSelf: boolean;
}
