export type BulkBatchStatus =
  | 'draft'
  | 'validating'
  | 'validation_errors'
  | 'ready_for_review'
  | 'pending_approval'
  | 'processing'
  | 'completed'
  | 'partially_completed'
  | 'failed'
  | 'cancelled';

export type BulkPaymentRowStatus = 'valid' | 'error' | 'duplicate' | 'removed';

export type BulkUploadState =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'validated'
  | 'upload_failed'
  | 'validation_failed';

export type DuplicateResolution = 'pending' | 'kept' | 'removed';

export interface BulkPaymentAccount {
  id: string;
  name: string;
  maskedNumber: string;
  availableBalance: number;
  currency: string;
  bulkEligible: boolean;
}

export interface BulkPaymentValidationError {
  row: number;
  beneficiary: string;
  reason: string;
  paymentId?: string;
}

export interface BulkDuplicatePayment {
  id: string;
  beneficiary: string;
  amount: number;
  similarDate: string;
  similarPaymentId: string;
  resolution: DuplicateResolution;
}

export interface BulkPaymentRecord {
  id: string;
  beneficiary: string;
  maskedAccount: string;
  bank: string;
  amount: number;
  reference: string;
  paymentMethod: string;
  paymentType: string;
  status: BulkPaymentRowStatus;
  validationErrors?: string[];
  duplicate?: boolean;
  rowNumber?: number;
}

export interface BulkBatchLimits {
  dailyLimit: number;
  usedToday: number;
  maxBatchSize: number;
}

export interface BulkBatch {
  id: string;
  name: string;
  reference: string;
  accountId: string;
  paymentDate: string;
  currency: string;
  paymentCount: number;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
  totalAmount: number;
  fee: number;
  totalDebit: number;
  status: BulkBatchStatus;
  payments: BulkPaymentRecord[];
  errors: BulkPaymentValidationError[];
  duplicates: BulkDuplicatePayment[];
  limits: BulkBatchLimits;
  createdBy: string;
  createdAt: string;
  uploadFileName?: string;
}

export interface BulkPaymentsHomeData {
  pendingBatches: number;
  awaitingApprovalAmount: number;
  completedThisMonth: number;
  completedThisMonthAmount: number;
  recentBatches: { id: string; name: string; amount: number; status: BulkBatchStatus; date: string }[];
}
