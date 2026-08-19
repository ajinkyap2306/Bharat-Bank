export interface BulkReviewApprovalLevel {
  role: string;
  status: 'completed' | 'pending' | 'upcoming';
}

export interface BulkPaymentCategoryBreakdown {
  label: string;
  count: number;
  amount: number;
}

export interface BulkPaymentMethodBreakdown {
  method: string;
  count: number;
}

export interface BulkRecipientPreviewItem {
  beneficiary: string;
  amount: number;
}

export interface BulkBatchReview {
  batchId: string;
  name: string;
  reference: string;
  account: {
    id: string;
    name: string;
    maskedNumber: string;
    availableBalance: number;
    currency: string;
  };
  paymentDate: string;
  paymentDateLabel: string;
  currency: string;
  paymentCount: number;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
  totalAmount: number;
  fee: number;
  totalDebit: number;
  balanceBefore: number;
  balanceAfter: number;
  dailyLimit: number;
  dailyUsed: number;
  dailyRemaining: number;
  maxBatchSize: number;
  approvalRequired: boolean;
  approvalLabel: string;
  approvalLevels: BulkReviewApprovalLevel[];
  createdBy: string;
  createdRole: string;
  department: string;
  createdAt: string;
  isReady: boolean;
  recipients: BulkRecipientPreviewItem[];
  recipientCount: number;
  paymentMethods: BulkPaymentMethodBreakdown[];
  categories: BulkPaymentCategoryBreakdown[];
  isHighValue: boolean;
  highValueThreshold: number;
}
