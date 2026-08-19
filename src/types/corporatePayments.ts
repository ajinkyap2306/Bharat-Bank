export type CorporatePaymentType =
  | 'internal'
  | 'bank_transfer'
  | 'vendor'
  | 'payroll'
  | 'tax'
  | 'scheduled';

export type CorporatePaymentStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'Rejected'
  | 'Scheduled';

export type CorporatePaymentRole = 'maker' | 'checker' | 'admin';

export type CorporatePaymentsScreen =
  | 'home'
  | 'history'
  | 'scheduled'
  | 'templates'
  | 'drafts'
  | 'payment-type'
  | 'beneficiary-select'
  | 'debit-account'
  | 'to-account'
  | 'amount'
  | 'details'
  | 'schedule'
  | 'review'
  | 'submitted'
  | 'auth'
  | 'processing'
  | 'success'
  | 'pending'
  | 'failed'
  | 'rejected'
  | 'payment-detail'
  | 'approve-confirm'
  | 'reject-reason'
  | 'save-template'
  | 'cancel-scheduled'
  | 'cancel-auth';

export interface CorporatePaymentLimits {
  dailyLimit: number;
  usedToday: number;
}

export interface CorporatePaymentCharges {
  bankCharges: number;
  tax: number;
}

export interface CorporatePaymentApprovalLevel {
  level: number;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  date?: string;
}

export interface CorporatePaymentRecord {
  id: string;
  paymentId: string;
  transactionId?: string;
  type: CorporatePaymentType;
  typeLabel: string;
  beneficiaryName: string;
  beneficiaryBank?: string;
  beneficiaryMasked?: string;
  debitAccountId: string;
  debitAccountLabel: string;
  amount: number;
  charges: number;
  totalDebit: number;
  purpose: string;
  reference: string;
  invoiceNumber?: string;
  remarks?: string;
  paymentDate: string;
  submittedBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  status: CorporatePaymentStatus;
  failureReason?: string;
  scheduleDate?: string;
  frequency?: string;
  approvalLevels?: CorporatePaymentApprovalLevel[];
  createdAt: string;
}

export interface CorporatePaymentTemplate {
  id: string;
  name: string;
  type: CorporatePaymentType;
  beneficiaryName: string;
  beneficiaryId?: string;
  amount: number;
  purpose: string;
  reference: string;
  debitAccountId: string;
}

export interface CorporateScheduledPayment {
  id: string;
  name: string;
  beneficiaryName: string;
  amount: number;
  scheduledDate: string;
  frequency: string;
  status: CorporatePaymentStatus;
  debitAccountId: string;
}

export interface CorporatePaymentDraft {
  id: string;
  label: string;
  type: CorporatePaymentType;
  beneficiaryName?: string;
  amount: number;
  status: 'Draft';
  updatedAt: string;
  form: Partial<CorporatePaymentForm>;
}

export interface CorporatePaymentForm {
  paymentType: CorporatePaymentType;
  fromAccountId: string;
  toAccountId: string;
  beneficiaryId: string;
  amount: string;
  purpose: string;
  remarks: string;
  reference: string;
  invoiceNumber: string;
  scheduleType: 'now' | 'scheduled';
  scheduleDate: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  paymentMode: 'RTGS' | 'NEFT' | 'IMPS' | 'Internal';
}

export const DEFAULT_PAYMENT_FORM: CorporatePaymentForm = {
  paymentType: 'bank_transfer',
  fromAccountId: 'acc_corp_op_01',
  toAccountId: 'acc_corp_pay_02',
  beneficiaryId: '',
  amount: '',
  purpose: '',
  remarks: '',
  reference: '',
  invoiceNumber: '',
  scheduleType: 'now',
  scheduleDate: '2026-08-25',
  frequency: 'once',
  paymentMode: 'RTGS',
};
