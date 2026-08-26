import { PAYMENT_TYPE_ACCOUNTS } from './corporatePaymentTypeSelectionMock';
import {
  formatPaymentDisplayDate,
  getProcessingEstimate,
  getTransactionFee,
  getVendorPaymentLimits,
  getTodayIso,
} from './corporateVendorPaymentDetailsMock';
import { getVendorBeneficiaryById } from './corporateVendorPaymentDetailsMock';
import { buildDefaultApprovalSteps, saveVendorPaymentSubmission } from './corporateVendorPaymentSubmissionMock';
import type {
  BankTransferDraft,
  InternalTransferDraft,
  SimplePaymentDraft,
  SimplePaymentReview,
} from '../types/corporateSimplePayment';
import type { VendorPaymentSubmissionData } from '../types/corporateVendorPaymentSubmission';

export const INTERNAL_TRANSFER_DRAFT_KEY = 'internalTransferDraft';
export const BANK_TRANSFER_DRAFT_KEY = 'bankTransferDraft';
export const PAYMENT_SOURCE_ACCOUNT_KEY = 'paymentSourceAccountId';

const DEFAULT_PAYMENT_ID = 'PAY-20260818-458201';
const DEFAULT_APPROVAL_ID = 'APR-20260818-782145';

export function loadInternalTransferDraft(): InternalTransferDraft | null {
  return loadDraft<InternalTransferDraft>(INTERNAL_TRANSFER_DRAFT_KEY);
}

export function saveInternalTransferDraft(draft: InternalTransferDraft): void {
  sessionStorage.setItem(INTERNAL_TRANSFER_DRAFT_KEY, JSON.stringify(draft));
}

export function loadBankTransferDraft(): BankTransferDraft | null {
  return loadDraft<BankTransferDraft>(BANK_TRANSFER_DRAFT_KEY);
}

export function saveBankTransferDraft(draft: BankTransferDraft): void {
  sessionStorage.setItem(BANK_TRANSFER_DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function buildDefaultInternalTransferDraft(accountId?: string): InternalTransferDraft {
  const fromId = accountId ?? sessionStorage.getItem(PAYMENT_SOURCE_ACCOUNT_KEY) ?? 'acc_corp_op_01';
  const toId =
    fromId === 'acc_corp_op_01'
      ? 'acc_corp_pay_02'
      : fromId === 'acc_corp_pay_02'
        ? 'acc_corp_op_01'
        : 'acc_corp_op_01';

  return {
    flowKind: 'internal-transfer',
    fromAccountId: fromId,
    toAccountId: toId,
    amount: 0,
    reference: '',
    remarks: '',
    paymentDate: getTodayIso(),
  };
}

export function buildDefaultBankTransferDraft(accountId?: string): BankTransferDraft {
  return {
    flowKind: 'bank-transfer',
    accountId: accountId ?? sessionStorage.getItem(PAYMENT_SOURCE_ACCOUNT_KEY) ?? 'acc_corp_op_01',
    beneficiaryId: 'ben_vendor_abc',
    amount: 0,
    reference: '',
    remarks: '',
    paymentMethod: 'NEFT',
    paymentDate: getTodayIso(),
  };
}

function getAccount(accountId: string) {
  return PAYMENT_TYPE_ACCOUNTS.find((a) => a.id === accountId);
}

export function buildInternalTransferReview(draft: InternalTransferDraft): SimplePaymentReview | null {
  const from = getAccount(draft.fromAccountId);
  const to = getAccount(draft.toAccountId);
  if (!from || !to) return null;

  const limits = getVendorPaymentLimits(draft.fromAccountId);
  const fee = 0;
  const totalDebit = draft.amount + fee;
  const dailyUsedBefore = limits.dailyPaymentLimit - limits.dailyRemainingLimit;

  return {
    flowKind: 'internal-transfer',
    flowLabel: 'Internal Transfer',
    sourceAccount: {
      id: from.id,
      name: from.name,
      maskedNumber: from.maskedNumber,
      availableBalance: from.availableBalance,
      currency: from.currency,
    },
    destination: {
      id: to.id,
      name: to.name,
      maskedAccount: to.maskedNumber,
      bankName: 'Same Bank — Internal',
    },
    amount: draft.amount,
    fee,
    totalDebit,
    reference: draft.reference || '—',
    remarks: draft.remarks,
    paymentMethod: 'NEFT',
    paymentDate: draft.paymentDate,
    processingEstimate: 'Instant — same bank internal transfer',
    sufficientBalance: draft.amount <= from.availableBalance,
    balanceBefore: from.availableBalance,
    balanceAfter: from.availableBalance - totalDebit,
    dailyLimit: limits.dailyPaymentLimit,
    dailyUsedBefore,
    dailyUsedAfter: dailyUsedBefore + draft.amount,
    dailyRemaining: Math.max(0, limits.dailyRemainingLimit - draft.amount),
    withinDailyLimit: draft.amount <= limits.dailyRemainingLimit,
    approvalLabel: 'Checker Approval Required',
    approvalDescription: 'Finance Checker must approve this transfer before funds move.',
    approvalLevels: 1,
    createdBy: 'Rahul Sharma',
    currentRole: 'Finance Maker (Maker)',
    nextStep: 'Finance Checker',
    selfAuthorizeAllowed: false,
  };
}

export function buildBankTransferReview(draft: BankTransferDraft): SimplePaymentReview | null {
  const account = getAccount(draft.accountId);
  const beneficiary = getVendorBeneficiaryById(draft.beneficiaryId);
  if (!account || !beneficiary) return null;

  const limits = getVendorPaymentLimits(draft.accountId);
  const fee = getTransactionFee(draft.paymentMethod, draft.amount);
  const totalDebit = draft.amount + fee;
  const dailyUsedBefore = limits.dailyPaymentLimit - limits.dailyRemainingLimit;

  return {
    flowKind: 'bank-transfer',
    flowLabel: 'Bank Transfer',
    sourceAccount: {
      id: account.id,
      name: account.name,
      maskedNumber: account.maskedNumber,
      availableBalance: account.availableBalance,
      currency: account.currency,
    },
    destination: {
      id: beneficiary.id,
      name: beneficiary.name,
      maskedAccount: beneficiary.maskedAccountNumber,
      bankName: beneficiary.bankName,
    },
    amount: draft.amount,
    fee,
    totalDebit,
    reference: draft.reference || '—',
    remarks: draft.remarks,
    paymentMethod: draft.paymentMethod,
    paymentDate: draft.paymentDate,
    processingEstimate: getProcessingEstimate(draft.paymentMethod),
    sufficientBalance: totalDebit <= account.availableBalance,
    balanceBefore: account.availableBalance,
    balanceAfter: account.availableBalance - totalDebit,
    dailyLimit: limits.dailyPaymentLimit,
    dailyUsedBefore,
    dailyUsedAfter: dailyUsedBefore + draft.amount,
    dailyRemaining: Math.max(0, limits.dailyRemainingLimit - draft.amount),
    withinDailyLimit: draft.amount <= limits.dailyRemainingLimit,
    approvalLabel: 'Checker Approval Required',
    approvalDescription: 'Finance Checker must approve this transfer before funds are sent.',
    approvalLevels: 1,
    createdBy: 'Rahul Sharma',
    currentRole: 'Finance Maker (Maker)',
    nextStep: 'Finance Checker',
    selfAuthorizeAllowed: false,
  };
}

export function createSimplePaymentSubmission(
  draft: SimplePaymentDraft,
  canSubmitPayment = true
): VendorPaymentSubmissionData | null {
  if (!canSubmitPayment) return null;

  const review =
    draft.flowKind === 'internal-transfer'
      ? buildInternalTransferReview(draft)
      : buildBankTransferReview(draft);

  if (!review) return null;

  const approvalSteps = buildDefaultApprovalSteps('submitted');
  const completedSteps = approvalSteps.filter((s) => s.state === 'completed').length;
  const createNewRoute =
    draft.flowKind === 'internal-transfer'
      ? '/corporate/payments/create/internal-transfer'
      : '/corporate/payments/create/bank-transfer';

  return {
    status: 'submitted',
    paymentId: DEFAULT_PAYMENT_ID,
    approvalId: DEFAULT_APPROVAL_ID,
    beneficiary: {
      id: review.destination.id,
      name: review.destination.name,
      maskedAccount: review.destination.maskedAccount,
      bankName: review.destination.bankName,
    },
    sourceAccount: {
      id: review.sourceAccount.id,
      name: review.sourceAccount.name,
      maskedNumber: review.sourceAccount.maskedNumber,
    },
    amount: review.amount,
    fee: review.fee,
    totalDebit: review.totalDebit,
    currency: '₹',
    paymentMethod: review.paymentMethod,
    paymentDate: review.paymentDate,
    reference: review.reference,
    invoiceNumber: '—',
    purposeLabel: review.flowLabel,
    submittedBy: 'Rahul Sharma',
    submittedRole: 'Finance Maker',
    submittedAt: new Date().toISOString(),
    submittedAtDisplay: '18 Aug 2026 • 11:05 AM',
    approvalSteps,
    completedSteps,
    totalSteps: approvalSteps.length,
    currentApprovalStep: 'Finance Checker',
    nextActionTitle: 'Finance Checker approval is required.',
    nextActionDescription:
      'The payment will continue after the required approval is completed.',
    approvalRequired: true,
    canCancel: true,
    flowKind: draft.flowKind,
    createNewRoute,
  };
}

export async function submitSimplePaymentForApproval(canSubmitPayment = true): Promise<void> {
  if (!canSubmitPayment) {
    throw new Error('CHECKER_CANNOT_SUBMIT');
  }
  await new Promise((r) => setTimeout(r, 800));
}

export function formatSimplePaymentDate(isoDate: string): string {
  return formatPaymentDisplayDate(isoDate);
}

export { saveVendorPaymentSubmission };
