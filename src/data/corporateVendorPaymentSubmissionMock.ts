import {
  formatPaymentDisplayDate,
  getTransactionFee,
  getVendorBeneficiaryById,
  getVendorPaymentAccount,
  PAYMENT_PURPOSE_OPTIONS,
} from './corporateVendorPaymentDetailsMock';
import { buildVendorPaymentReview } from './corporateVendorPaymentReviewMock';
import type { VendorPaymentDraft } from '../types/corporateVendorPaymentReview';
import type {
  ApprovalTimelineStep,
  VendorPaymentSubmissionData,
  VendorPaymentSubmissionStatus,
} from '../types/corporateVendorPaymentSubmission';

export const VENDOR_PAYMENT_SUBMISSION_KEY = 'vendorPaymentSubmission';

const DEFAULT_PAYMENT_ID = 'PAY-20260818-458201';
const DEFAULT_APPROVAL_ID = 'APR-20260818-782145';

export function loadVendorPaymentSubmission(): VendorPaymentSubmissionData | null {
  try {
    const raw = sessionStorage.getItem(VENDOR_PAYMENT_SUBMISSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VendorPaymentSubmissionData;
  } catch {
    return null;
  }
}

export function saveVendorPaymentSubmission(data: VendorPaymentSubmissionData): void {
  sessionStorage.setItem(VENDOR_PAYMENT_SUBMISSION_KEY, JSON.stringify(data));
}

export function buildDefaultApprovalSteps(
  status: VendorPaymentSubmissionStatus
): ApprovalTimelineStep[] {
  const base: ApprovalTimelineStep[] = [
    { id: 'created', label: 'Payment Created', state: 'completed' },
    { id: 'submitted', label: 'Submitted for Approval', state: 'completed' },
    { id: 'checker', label: 'Finance Checker', state: 'current' },
  ];

  if (status === 'approval-in-progress') {
    return base;
  }

  if (status === 'approved' || status === 'processing') {
    return [
      { id: 'created', label: 'Payment Created', state: 'completed' },
      { id: 'submitted', label: 'Submitted for Approval', state: 'completed' },
      { id: 'checker', label: 'Finance Checker', state: 'completed' },
      { id: 'processing', label: 'Payment Processing', state: 'current' },
    ];
  }

  if (status === 'completed') {
    return [
      { id: 'created', label: 'Payment Created', state: 'completed' },
      { id: 'submitted', label: 'Submitted for Approval', state: 'completed' },
      { id: 'checker', label: 'Finance Checker', state: 'completed' },
      { id: 'processing', label: 'Payment Processing', state: 'completed' },
      { id: 'completed', label: 'Payment Completed', state: 'completed' },
    ];
  }

  if (status === 'rejected') {
    return [
      { id: 'created', label: 'Payment Created', state: 'completed' },
      { id: 'submitted', label: 'Submitted for Approval', state: 'completed' },
      {
        id: 'checker',
        label: 'Finance Checker',
        state: 'current',
        description: 'Rejected',
      },
    ];
  }

  if (status === 'cancelled') {
    return [
      { id: 'created', label: 'Payment Created', state: 'completed' },
      { id: 'submitted', label: 'Submitted for Approval', state: 'completed' },
      {
        id: 'cancelled',
        label: 'Payment Cancelled',
        state: 'current',
        description: 'Cancelled by maker',
      },
    ];
  }

  return base;
}

export function createVendorPaymentSubmission(
  draft: VendorPaymentDraft,
  status: VendorPaymentSubmissionStatus = 'submitted'
): VendorPaymentSubmissionData | null {
  const review = buildVendorPaymentReview(draft);
  const beneficiary = getVendorBeneficiaryById(draft.beneficiaryId);
  const account = getVendorPaymentAccount(draft.accountId);
  if (!review || !beneficiary || !account) return null;

  const fee = draft.fee ?? getTransactionFee(draft.paymentMethod, draft.amount);
  const totalDebit = draft.totalDebit ?? draft.amount + fee;
  const purposeLabel =
    PAYMENT_PURPOSE_OPTIONS.find((p) => p.id === draft.purpose)?.label ?? draft.purpose;
  const paymentDate = draft.scheduled ? draft.executionDate : draft.paymentDate;

  const approvalSteps = buildDefaultApprovalSteps(status);
  const completedSteps = approvalSteps.filter((s) => s.state === 'completed').length;

  const now = new Date();
  const submittedAtDisplay = '18 Aug 2026 • 11:05 AM';

  return {
    status,
    paymentId: DEFAULT_PAYMENT_ID,
    approvalId: DEFAULT_APPROVAL_ID,
    transactionId: status === 'completed' ? 'txn_pay_458201' : undefined,
    beneficiary: {
      id: beneficiary.id,
      name: beneficiary.name,
      maskedAccount: beneficiary.maskedAccountNumber,
      bankName: beneficiary.bankName,
    },
    sourceAccount: {
      id: account.id,
      name: account.name,
      maskedNumber: account.maskedNumber,
    },
    amount: draft.amount,
    fee,
    totalDebit,
    currency: '₹',
    paymentMethod: draft.paymentMethod,
    paymentDate,
    reference: draft.reference || '—',
    invoiceNumber: draft.invoiceNumber || '—',
    purposeLabel,
    submittedBy: 'Rahul Sharma',
    submittedRole: 'Finance Maker',
    submittedAt: now.toISOString(),
    submittedAtDisplay,
    approvalSteps,
    completedSteps,
    totalSteps: approvalSteps.length,
    currentApprovalStep: 'Finance Checker',
    nextActionTitle: 'Finance Checker approval is required.',
    nextActionDescription:
      'The payment will continue after the required approval is completed.',
    approvalRequired: true,
    canCancel: status === 'submitted' || status === 'approval-in-progress',
    rejectionReason:
      status === 'rejected'
        ? 'Payment exceeds configured approval policy.'
        : undefined,
    rejectedBy: status === 'rejected' ? 'Amit Verma' : undefined,
    cancellationReason:
      status === 'cancelled' ? 'Cancelled by payment initiator' : undefined,
    cancelledAt: status === 'cancelled' ? submittedAtDisplay : undefined,
  };
}

export function updateSubmissionStatus(
  data: VendorPaymentSubmissionData,
  status: VendorPaymentSubmissionStatus
): VendorPaymentSubmissionData {
  const updated = createVendorPaymentSubmission(
    {
      beneficiaryId: data.beneficiary.id,
      accountId: data.sourceAccount.id,
      amount: data.amount,
      currency: 'INR',
      purpose: 'vendor-settlement',
      invoiceNumber: data.invoiceNumber === '—' ? '' : data.invoiceNumber,
      reference: data.reference === '—' ? '' : data.reference,
      paymentDate: data.paymentDate,
      scheduled: false,
      executionDate: data.paymentDate,
      repeatPayment: false,
      remarks: '',
      charges: 'shared',
      paymentMethod: data.paymentMethod,
      fee: data.fee,
      totalDebit: data.totalDebit,
    },
    status
  );
  return updated ? { ...updated, paymentId: data.paymentId, approvalId: data.approvalId } : data;
}

export function formatSubmissionDisplayDate(isoDate: string): string {
  return formatPaymentDisplayDate(isoDate);
}
