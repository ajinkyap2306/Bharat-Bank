import {
  formatPaymentDisplayDate,
  getProcessingEstimate,
  getTransactionFee,
  getVendorBeneficiaryById,
  getVendorPaymentAccount,
  PAYMENT_PURPOSE_OPTIONS,
} from './corporateVendorPaymentDetailsMock';
import type { VendorPaymentDraft, VendorPaymentReviewData } from '../types/corporateVendorPaymentReview';

export const VENDOR_PAYMENT_DRAFT_KEY = 'vendorPaymentDraft';

export const REVIEW_DAILY_LIMIT = 5000000;
export const REVIEW_DAILY_USED_BEFORE = 1250000;
export const HIGH_VALUE_THRESHOLD = 500000;
export const DUPLICATE_INVOICE_PREFIX = 'INV-2026';

export function loadVendorPaymentDraft(): VendorPaymentDraft | null {
  try {
    const raw = sessionStorage.getItem(VENDOR_PAYMENT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VendorPaymentDraft;
  } catch {
    return null;
  }
}

export function saveVendorPaymentDraft(draft: VendorPaymentDraft): void {
  sessionStorage.setItem(VENDOR_PAYMENT_DRAFT_KEY, JSON.stringify(draft));
}

export function buildVendorPaymentReview(draft: VendorPaymentDraft): VendorPaymentReviewData | null {
  const beneficiary = getVendorBeneficiaryById(draft.beneficiaryId);
  const account = getVendorPaymentAccount(draft.accountId);
  if (!beneficiary || !account) return null;

  const fee = draft.fee ?? getTransactionFee(draft.paymentMethod, draft.amount);
  const totalDebit = draft.totalDebit ?? draft.amount + fee;
  const balanceBefore = account.availableBalance;
  const balanceAfter = balanceBefore - totalDebit;
  const sufficientBalance = balanceAfter >= 0 && draft.amount > 0;

  const dailyUsedAfter = REVIEW_DAILY_USED_BEFORE + draft.amount;
  const dailyRemaining = REVIEW_DAILY_LIMIT - dailyUsedAfter;
  const withinDailyLimit = dailyUsedAfter <= REVIEW_DAILY_LIMIT;

  const purposeLabel =
    PAYMENT_PURPOSE_OPTIONS.find((p) => p.id === draft.purpose)?.label ?? draft.purpose;

  const displayDate = draft.scheduled ? draft.executionDate : draft.paymentDate;
  const scheduleLabel = draft.scheduled ? 'Scheduled' : 'Immediate';

  const highValueWarning = draft.amount >= HIGH_VALUE_THRESHOLD;
  const approvalLevels = highValueWarning ? 2 : 1;
  const approvalLabel = highValueWarning ? '2-level approval required' : 'Standard approval';
  const approvalDescription = highValueWarning
    ? 'Payment above ₹5,00,000 requires additional approval.'
    : "Payment will be submitted according to your company's approval workflow.";

  const duplicateWarning =
    draft.invoiceNumber.toUpperCase().startsWith(DUPLICATE_INVOICE_PREFIX) ||
    (draft.reference.toLowerCase().includes('march') &&
      draft.invoiceNumber.toUpperCase().includes('4582'));

  return {
    beneficiary,
    sourceAccount: {
      id: account.id,
      name: account.name,
      maskedNumber: account.maskedNumber,
      availableBalance: balanceBefore,
      currency: account.currency,
    },
    amount: draft.amount,
    fee,
    totalDebit,
    currency: 'INR',
    purposeLabel,
    invoiceNumber: draft.invoiceNumber || '—',
    reference: draft.reference || '—',
    paymentMethod: draft.paymentMethod,
    paymentDate: displayDate,
    scheduled: draft.scheduled,
    scheduleLabel,
    processingEstimate: getProcessingEstimate(draft.paymentMethod),
    balanceBefore,
    balanceAfter,
    sufficientBalance,
    dailyLimit: REVIEW_DAILY_LIMIT,
    dailyUsedBefore: REVIEW_DAILY_USED_BEFORE,
    dailyUsedAfter,
    dailyRemaining,
    withinDailyLimit,
    approvalRequired: true,
    approvalLabel,
    approvalDescription,
    approvalLevels,
    createdBy: 'Rahul Sharma',
    currentRole: 'Finance Maker',
    nextStep: 'Finance Checker',
    workflowSteps: [
      { id: 'maker', label: 'Maker', status: 'completed' },
      { id: 'checker', label: 'Finance Checker', status: 'pending' },
    ],
    duplicateWarning,
    highValueWarning,
    selfAuthorizeAllowed: false,
    form: { ...draft, fee, totalDebit },
  };
}

export function recalculateReviewFromDraft(
  draft: VendorPaymentDraft,
  accountId?: string
): VendorPaymentDraft {
  const nextAccountId = accountId ?? draft.accountId;
  const account = getVendorPaymentAccount(nextAccountId);
  const fee = getTransactionFee(draft.paymentMethod, draft.amount);
  return {
    ...draft,
    accountId: nextAccountId,
    fee,
    totalDebit: draft.amount + fee,
    ...(account ? {} : {}),
  };
}

export async function submitVendorPaymentForApproval(
  _draft: VendorPaymentDraft,
  simulateError = false,
  canSubmitPayment = true
): Promise<void> {
  if (!canSubmitPayment) {
    throw new Error('CHECKER_CANNOT_SUBMIT');
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (simulateError) {
    throw new Error('SUBMIT_FAILED');
  }
}
