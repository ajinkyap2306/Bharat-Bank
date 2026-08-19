import type { PaymentRailMethod, VendorPaymentForm } from './corporateVendorPaymentDetails';
import type { VendorBeneficiary } from './corporateVendorBeneficiarySelection';

export interface VendorPaymentDraft extends VendorPaymentForm {
  fee: number;
  totalDebit: number;
}

export type ApprovalLevelStatus = 'completed' | 'pending' | 'optional';

export interface ApprovalWorkflowStep {
  id: string;
  label: string;
  status: ApprovalLevelStatus;
}

export interface VendorPaymentReviewData {
  beneficiary: VendorBeneficiary;
  sourceAccount: {
    id: string;
    name: string;
    maskedNumber: string;
    availableBalance: number;
    currency: string;
  };
  amount: number;
  fee: number;
  totalDebit: number;
  currency: string;
  purposeLabel: string;
  invoiceNumber: string;
  reference: string;
  paymentMethod: PaymentRailMethod;
  paymentDate: string;
  scheduled: boolean;
  scheduleLabel: string;
  processingEstimate: string;
  balanceBefore: number;
  balanceAfter: number;
  sufficientBalance: boolean;
  dailyLimit: number;
  dailyUsedBefore: number;
  dailyUsedAfter: number;
  dailyRemaining: number;
  withinDailyLimit: boolean;
  approvalRequired: boolean;
  approvalLabel: string;
  approvalDescription: string;
  approvalLevels: number;
  createdBy: string;
  currentRole: string;
  nextStep: string;
  workflowSteps: ApprovalWorkflowStep[];
  duplicateWarning: boolean;
  highValueWarning: boolean;
  selfAuthorizeAllowed: boolean;
  form: VendorPaymentDraft;
}

export type SubmissionState = 'idle' | 'submitting' | 'error' | 'session-expired';
