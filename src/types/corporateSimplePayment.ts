import type { PaymentRailMethod } from './corporateVendorPaymentDetails';

export type SimplePaymentFlowKind = 'internal-transfer' | 'bank-transfer';

export interface InternalTransferDraft {
  flowKind: 'internal-transfer';
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  reference: string;
  remarks: string;
  paymentDate: string;
}

export interface BankTransferDraft {
  flowKind: 'bank-transfer';
  accountId: string;
  beneficiaryId: string;
  amount: number;
  reference: string;
  remarks: string;
  paymentMethod: PaymentRailMethod;
  paymentDate: string;
}

export type SimplePaymentDraft = InternalTransferDraft | BankTransferDraft;

export interface SimplePaymentReview {
  flowKind: SimplePaymentFlowKind;
  flowLabel: string;
  sourceAccount: {
    id: string;
    name: string;
    maskedNumber: string;
    availableBalance: number;
    currency: string;
  };
  destination: {
    id: string;
    name: string;
    maskedAccount: string;
    bankName: string;
  };
  amount: number;
  fee: number;
  totalDebit: number;
  reference: string;
  remarks: string;
  paymentMethod: PaymentRailMethod;
  paymentDate: string;
  processingEstimate: string;
  sufficientBalance: boolean;
  balanceBefore: number;
  balanceAfter: number;
  dailyLimit: number;
  dailyUsedBefore: number;
  dailyUsedAfter: number;
  dailyRemaining: number;
  withinDailyLimit: boolean;
  approvalLabel: string;
  approvalDescription: string;
  approvalLevels: number;
  createdBy: string;
  currentRole: string;
  nextStep: string;
  selfAuthorizeAllowed: boolean;
}
