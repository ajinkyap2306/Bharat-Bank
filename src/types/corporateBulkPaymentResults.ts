export type BulkPaymentResultStatus = 'successful' | 'processing' | 'failed' | 'rejected';

export interface BulkPaymentResultItem {
  id: string;
  beneficiaryName: string;
  maskedAccount: string;
  bankName: string;
  amount: number;
  status: BulkPaymentResultStatus;
  statusLabel: string;
  paymentId?: string;
  failureReason?: string;
  processedAt?: string;
}

export interface BulkPaymentResultsData {
  batchId: string;
  batchRef: string;
  batchName: string;
  totalPayments: number;
  successfulCount: number;
  processingCount: number;
  failedCount: number;
  rejectedCount: number;
  totalAmount: number;
  successfulAmount: number;
  failedAmount: number;
  items: BulkPaymentResultItem[];
}
