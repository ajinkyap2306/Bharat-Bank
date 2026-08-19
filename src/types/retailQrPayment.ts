export type QrPaymentStep =
  | 'scanner'
  | 'payment'
  | 'success'
  | 'failed'
  | 'pending'
  | 'my-qr';

export type QrErrorType = 'invalid' | 'expired' | 'unsupported' | 'duplicate';

export interface QrMerchant {
  id: string;
  name: string;
  upiId: string;
  city: string;
  verified: boolean;
  /** Fixed amount from QR; omit for open amount */
  encodedAmount?: number;
}

export interface QrPaymentDraft {
  merchant: QrMerchant | null;
  amount: string;
  accountId: string;
}

export interface QrPaymentResult {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  merchantName: string;
  merchantUpiId: string;
  fromAccountLabel: string;
  timestamp: string;
}
