export type SendMoneyStep =
  | 'home'
  | 'recipient'
  | 'amount'
  | 'auth'
  | 'processing'
  | 'success'
  | 'failed'
  | 'pending';

export interface SendMoneyRecipient {
  id: string;
  name: string;
  upiId?: string;
  mobile?: string;
  mobileMasked?: string;
  verified: boolean;
}

export interface SendMoneyDraft {
  recipient: SendMoneyRecipient | null;
  fromAccountId: string;
  amount: string;
  note: string;
}

export interface SendMoneyResult {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  recipientName: string;
  recipientUpi: string;
  fromAccountLabel: string;
  timestamp: string;
}
