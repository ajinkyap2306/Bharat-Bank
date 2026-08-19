import type { BulkBatch } from '../types/corporateBulkPayments';
import type { BulkBatchReview } from '../types/corporateBulkPaymentReview';
import {
  BULK_ACCOUNTS,
  getAccountById,
  loadBulkBatchDraft,
} from './corporateBulkPaymentsMock';
import { saveBatchSubmission } from './corporateBulkBatchStatusMock';

const HIGH_VALUE_THRESHOLD = 10_000_000;
const REVIEW_ACCOUNT_BALANCE = 5_000_000;

export function createReadyForReviewBatch(): BulkBatchReview {
  const account = BULK_ACCOUNTS[0];
  const totalAmount = 1_875_000;
  const fee = 1_200;
  const totalDebit = totalAmount + fee;
  const balanceBefore = REVIEW_ACCOUNT_BALANCE;

  return {
    batchId: 'batch_aug_vendor_01',
    name: 'August Vendor Payments',
    reference: 'BULK-AUG-2026-01',
    account: {
      id: account.id,
      name: account.name,
      maskedNumber: account.maskedNumber,
      availableBalance: balanceBefore,
      currency: account.currency,
    },
    paymentDate: '18 Aug 2026',
    paymentDateLabel: 'Today',
    currency: 'INR',
    paymentCount: 120,
    validCount: 120,
    errorCount: 0,
    duplicateCount: 0,
    totalAmount,
    fee,
    totalDebit,
    balanceBefore,
    balanceAfter: balanceBefore - totalDebit,
    dailyLimit: 5_000_000,
    dailyUsed: 1_200_000,
    dailyRemaining: 5_000_000 - 1_200_000 - totalAmount,
    maxBatchSize: 500,
    approvalRequired: true,
    approvalLabel: 'Checker approval required',
    approvalLevels: [
      { role: 'Maker', status: 'completed' },
      { role: 'Finance Checker', status: 'pending' },
    ],
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    department: 'Finance',
    createdAt: '18 Aug 2026 • 10:45 AM',
    isReady: true,
    recipients: [
      { beneficiary: 'ABC Suppliers Ltd.', amount: 250_000 },
      { beneficiary: 'XYZ Logistics', amount: 125_000 },
      { beneficiary: 'Office Supplies Co.', amount: 75_000 },
    ],
    recipientCount: 120,
    paymentMethods: [{ method: 'NEFT', count: 120 }],
    categories: [{ label: 'Vendor Payments', count: 120, amount: totalAmount }],
    isHighValue: totalAmount >= HIGH_VALUE_THRESHOLD,
    highValueThreshold: HIGH_VALUE_THRESHOLD,
  };
}

export function createReviewWithIssues(): BulkBatchReview {
  const base = createReadyForReviewBatch();
  return {
    ...base,
    errorCount: 3,
    duplicateCount: 2,
    isReady: false,
    validCount: 117,
  };
}

export function buildBatchReviewFromDraft(batch: BulkBatch): BulkBatchReview {
  const account = getAccountById(batch.accountId) ?? BULK_ACCOUNTS[0];
  const balanceBefore = batch.accountId === 'acc_corp_op_01' ? REVIEW_ACCOUNT_BALANCE : account.availableBalance;
  const pendingDuplicates = batch.duplicates.filter((d) => d.resolution === 'pending').length;
  const dailyRemaining = batch.limits.dailyLimit - batch.limits.usedToday - batch.totalAmount;

  const methodMap = new Map<string, number>();
  batch.payments.forEach((p) => {
    methodMap.set(p.paymentMethod, (methodMap.get(p.paymentMethod) ?? 0) + 1);
  });
  const paymentMethods =
    methodMap.size > 0
      ? Array.from(methodMap.entries()).map(([method, count]) => ({ method, count }))
      : [{ method: 'NEFT', count: batch.validCount }];

  const categoryMap = new Map<string, { count: number; amount: number }>();
  batch.payments.forEach((p) => {
    const existing = categoryMap.get(p.paymentType) ?? { count: 0, amount: 0 };
    categoryMap.set(p.paymentType, {
      count: existing.count + 1,
      amount: existing.amount + p.amount,
    });
  });
  const categories =
    categoryMap.size > 0
      ? Array.from(categoryMap.entries()).map(([label, data]) => ({
          label,
          count: data.count,
          amount: data.amount,
        }))
      : [{ label: 'Vendor Payments', count: batch.validCount, amount: batch.totalAmount }];

  const isReady =
    batch.errorCount === 0 &&
    pendingDuplicates === 0 &&
    batch.name.trim().length > 0 &&
    balanceBefore >= batch.totalDebit &&
    dailyRemaining >= 0 &&
    batch.paymentCount <= batch.limits.maxBatchSize;

  return {
    batchId: batch.id,
    name: batch.name,
    reference: batch.reference,
    account: {
      id: account.id,
      name: account.name,
      maskedNumber: account.maskedNumber,
      availableBalance: balanceBefore,
      currency: account.currency,
    },
    paymentDate: batch.paymentDate,
    paymentDateLabel: batch.paymentDate.includes('18 Aug 2026') ? 'Today' : 'Scheduled',
    currency: batch.currency,
    paymentCount: batch.paymentCount,
    validCount: batch.validCount,
    errorCount: batch.errorCount,
    duplicateCount: pendingDuplicates,
    totalAmount: batch.totalAmount,
    fee: batch.fee,
    totalDebit: batch.totalDebit,
    balanceBefore,
    balanceAfter: balanceBefore - batch.totalDebit,
    dailyLimit: batch.limits.dailyLimit,
    dailyUsed: batch.limits.usedToday,
    dailyRemaining,
    maxBatchSize: batch.limits.maxBatchSize,
    approvalRequired: true,
    approvalLabel: 'Checker approval required',
    approvalLevels: [
      { role: 'Maker', status: 'completed' },
      { role: 'Finance Checker', status: 'pending' },
    ],
    createdBy: batch.createdBy,
    createdRole: 'Finance Maker',
    department: 'Finance',
    createdAt: batch.createdAt,
    isReady,
    recipients: batch.payments.slice(0, 3).map((p) => ({
      beneficiary: p.beneficiary,
      amount: p.amount,
    })),
    recipientCount: batch.validCount || batch.paymentCount,
    paymentMethods,
    categories,
    isHighValue: batch.totalAmount >= HIGH_VALUE_THRESHOLD,
    highValueThreshold: HIGH_VALUE_THRESHOLD,
  };
}

export function getBatchReviewData(batchId: string, variant?: string | null): BulkBatchReview | null {
  if (variant === 'issues') return createReviewWithIssues();
  if (variant === 'highvalue') {
    const base = createReadyForReviewBatch();
    return { ...base, totalAmount: 12_000_000, fee: 5000, totalDebit: 12_005_000, isHighValue: true };
  }

  const resolvedBatchId =
    batchId || loadBulkBatchDraft()?.id || 'batch_aug_vendor_01';

  const draft = loadBulkBatchDraft();
  if (draft && draft.id === resolvedBatchId) {
    const pendingDup = draft.duplicates.filter((d) => d.resolution === 'pending').length;
    if (draft.errorCount === 0 && pendingDup === 0 && draft.validCount > 0) {
      const ready = createReadyForReviewBatch();
      return {
        ...ready,
        batchId: draft.id,
        name: draft.name || ready.name,
        reference: draft.reference || ready.reference,
        paymentDate: draft.paymentDate,
        paymentDateLabel: draft.paymentDate.includes('18 Aug 2026') ? 'Today' : 'Scheduled',
      };
    }
    if (draft.validCount > 0 || draft.paymentCount > 0) {
      return buildBatchReviewFromDraft(draft);
    }
  }

  if (resolvedBatchId === 'batch_aug_vendor_01' || resolvedBatchId.startsWith('batch_')) {
    const ready = createReadyForReviewBatch();
    return { ...ready, batchId: resolvedBatchId };
  }

  return null;
}

export async function fetchBatchReview(
  batchId: string,
  variant?: string | null
): Promise<BulkBatchReview | null> {
  await new Promise((r) => setTimeout(r, 450));
  return getBatchReviewData(batchId, variant);
}

export async function submitBatchForApproval(
  batchId: string,
  simulateError = false
): Promise<{ success: boolean; batchId: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  if (simulateError) throw new Error('SUBMIT_FAILED');
  saveBatchSubmission(batchId);
  return { success: true, batchId };
}
