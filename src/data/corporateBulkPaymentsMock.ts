import type {
  BulkBatch,
  BulkDuplicatePayment,
  BulkPaymentAccount,
  BulkPaymentRecord,
  BulkPaymentValidationError,
  BulkPaymentsHomeData,
  DuplicateResolution,
} from '../types/corporateBulkPayments';

const STORAGE_KEY = 'corporateBulkBatchDraft';

export const BULK_ACCOUNTS: BulkPaymentAccount[] = [
  {
    id: 'acc_corp_op_01',
    name: 'Operating Account',
    maskedNumber: '•••• 4582',
    availableBalance: 1245000,
    currency: '₹',
    bulkEligible: true,
  },
  {
    id: 'acc_corp_pay_02',
    name: 'Payroll Account',
    maskedNumber: '•••• 9102',
    availableBalance: 3200000,
    currency: '₹',
    bulkEligible: true,
  },
  {
    id: 'acc_corp_tax_03',
    name: 'Tax Reserve',
    maskedNumber: '•••• 2291',
    availableBalance: 850000,
    currency: '₹',
    bulkEligible: false,
  },
];

const SAMPLE_ERRORS: BulkPaymentValidationError[] = [
  { row: 12, beneficiary: 'ABC Suppliers Ltd.', reason: 'Invalid Account Number' },
  { row: 48, beneficiary: 'XYZ Logistics', reason: 'Invalid IFSC' },
  { row: 91, beneficiary: 'Office Supplies Co.', reason: 'Amount exceeds payment limit' },
];

const SAMPLE_DUPLICATES: BulkDuplicatePayment[] = [
  {
    id: 'dup_01',
    beneficiary: 'ABC Suppliers Ltd.',
    amount: 250000,
    similarDate: '18 Aug 2026',
    similarPaymentId: 'PAY-20260818-458201',
    resolution: 'pending',
  },
  {
    id: 'dup_02',
    beneficiary: 'Metro Freight Services',
    amount: 185000,
    similarDate: '17 Aug 2026',
    similarPaymentId: 'PAY-20260817-009',
    resolution: 'pending',
  },
];

const SAMPLE_VALID: BulkPaymentRecord[] = [
  {
    id: 'bp_01',
    beneficiary: 'ABC Suppliers Ltd.',
    maskedAccount: '•••• 7821',
    bank: 'HDFC Bank',
    amount: 250000,
    reference: 'INV-4582',
    paymentMethod: 'NEFT',
    paymentType: 'Vendor Payment',
    status: 'valid',
    rowNumber: 1,
  },
  {
    id: 'bp_02',
    beneficiary: 'XYZ Logistics',
    maskedAccount: '•••• 4412',
    bank: 'ICICI Bank',
    amount: 125000,
    reference: 'LOG-AUG-01',
    paymentMethod: 'NEFT',
    paymentType: 'Vendor Payment',
    status: 'valid',
    rowNumber: 2,
  },
  {
    id: 'bp_03',
    beneficiary: 'Office Supplies Co.',
    maskedAccount: '•••• 9033',
    bank: 'Axis Bank',
    amount: 75000,
    reference: 'SUP-0826',
    paymentMethod: 'NEFT',
    paymentType: 'Vendor Payment',
    status: 'valid',
    rowNumber: 3,
  },
  {
    id: 'bp_04',
    beneficiary: 'TechServe India',
    maskedAccount: '•••• 5521',
    bank: 'HDFC Bank',
    amount: 320000,
    reference: 'TECH-Q3',
    paymentMethod: 'RTGS',
    paymentType: 'Vendor Payment',
    status: 'valid',
    rowNumber: 4,
  },
  {
    id: 'bp_05',
    beneficiary: 'CleanPro Facilities',
    maskedAccount: '•••• 1188',
    bank: 'SBI',
    amount: 45000,
    reference: 'FAC-AUG',
    paymentMethod: 'NEFT',
    paymentType: 'Vendor Payment',
    status: 'valid',
    rowNumber: 5,
  },
];

export function createEmptyBatch(accountId = 'acc_corp_op_01'): BulkBatch {
  const account = BULK_ACCOUNTS.find((a) => a.id === accountId) ?? BULK_ACCOUNTS[0];
  return {
    id: `batch_${Date.now()}`,
    name: '',
    reference: `BULK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
    accountId: account.id,
    paymentDate: '18 Aug 2026',
    currency: 'INR',
    paymentCount: 0,
    validCount: 0,
    errorCount: 0,
    duplicateCount: 0,
    totalAmount: 0,
    fee: 0,
    totalDebit: 0,
    status: 'draft',
    payments: [],
    errors: [],
    duplicates: [],
    limits: { dailyLimit: 5000000, usedToday: 1200000, maxBatchSize: 500 },
    createdBy: 'Rahul Sharma',
    createdAt: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function resolveBatchStatus(
  batch: Pick<BulkBatch, 'errorCount' | 'duplicates' | 'paymentCount'>
): BulkBatch['status'] {
  const pendingDuplicates = batch.duplicates.filter((d) => d.resolution === 'pending').length;
  if (batch.errorCount > 0 || pendingDuplicates > 0) return 'validation_errors';
  if (batch.paymentCount > 0) return 'ready_for_review';
  return 'draft';
}

export function createValidatedDemoBatch(): BulkBatch {
  const account = BULK_ACCOUNTS[0];
  const totalAmount = 1875000;
  const fee = 1200;
  return {
    id: 'batch_aug_vendor_01',
    name: 'August Vendor Payments',
    reference: 'BULK-AUG-2026-01',
    accountId: account.id,
    paymentDate: '18 Aug 2026',
    currency: 'INR',
    paymentCount: 125,
    validCount: 120,
    errorCount: 3,
    duplicateCount: 2,
    totalAmount,
    fee,
    totalDebit: totalAmount + fee,
    status: 'validation_errors',
    payments: SAMPLE_VALID,
    errors: SAMPLE_ERRORS,
    duplicates: SAMPLE_DUPLICATES.map((d) => ({ ...d })),
    limits: { dailyLimit: 5000000, usedToday: 1200000, maxBatchSize: 500 },
    createdBy: 'Rahul Sharma',
    createdAt: '18 Aug 2026 • 10:15 AM',
    uploadFileName: 'August_Vendor_Payments.csv',
  };
}

/** Clean upload result — no blocking errors (used for direct Upload Payment File demo). */
export function createCleanValidatedBatch(overrides: Partial<BulkBatch> = {}): BulkBatch {
  const account = BULK_ACCOUNTS[0];
  const totalAmount = 1875000;
  const fee = 1200;
  return {
    id: `batch_${Date.now()}`,
    name: 'August Vendor Payments',
    reference: 'BULK-AUG-2026-01',
    accountId: account.id,
    paymentDate: '18 Aug 2026',
    currency: 'INR',
    paymentCount: 125,
    validCount: 125,
    errorCount: 0,
    duplicateCount: 0,
    totalAmount,
    fee,
    totalDebit: totalAmount + fee,
    status: 'ready_for_review',
    payments: SAMPLE_VALID,
    errors: [],
    duplicates: [],
    limits: { dailyLimit: 5000000, usedToday: 1200000, maxBatchSize: 500 },
    createdBy: 'Rahul Sharma',
    createdAt: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    uploadFileName: 'August_Vendor_Payments.csv',
    ...overrides,
  };
}

export function getBulkPaymentsHomeData(): BulkPaymentsHomeData {
  return {
    pendingBatches: 3,
    awaitingApprovalAmount: 1250000,
    completedThisMonth: 18,
    completedThisMonthAmount: 4875000,
    recentBatches: [
      {
        id: 'batch_aug_vendor_01',
        name: 'August Vendor Payments',
        amount: 1875000,
        status: 'pending_approval',
        date: '18 Aug 2026',
      },
      {
        id: 'batch_jul_payroll',
        name: 'July Payroll Batch',
        amount: 845000,
        status: 'pending_approval',
        date: '25 Jul 2026',
      },
      {
        id: 'batch_jul_rent',
        name: 'Office Rent — July',
        amount: 150000,
        status: 'completed',
        date: '28 Jul 2026',
      },
    ],
  };
}

export async function fetchBulkPaymentsHome(): Promise<BulkPaymentsHomeData> {
  await new Promise((r) => setTimeout(r, 400));
  return getBulkPaymentsHomeData();
}

export function loadBulkBatchDraft(): BulkBatch | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BulkBatch) : null;
  } catch {
    return null;
  }
}

export function saveBulkBatchDraft(batch: BulkBatch): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
}

export function clearBulkBatchDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function simulateFileValidation(batch: BulkBatch, fileName?: string): BulkBatch {
  const demo = createCleanValidatedBatch();
  return {
    ...demo,
    id: batch.id,
    name: batch.name || demo.name,
    reference: batch.reference || demo.reference,
    accountId: batch.accountId,
    paymentDate: batch.paymentDate,
    currency: batch.currency,
    uploadFileName: fileName || demo.uploadFileName,
  };
}

export function removeValidationError(batch: BulkBatch, row: number): BulkBatch {
  const errors = batch.errors.filter((e) => e.row !== row);
  const errorCount = errors.length;
  const next = {
    ...batch,
    errors,
    errorCount,
    validCount: batch.validCount + 1,
  };
  return { ...next, status: resolveBatchStatus(next) };
}

export function clearValidationErrors(batch: BulkBatch): BulkBatch {
  const next = {
    ...batch,
    errors: [],
    errorCount: 0,
    validCount: batch.paymentCount,
  };
  return { ...next, status: resolveBatchStatus(next) };
}

export function addManualPayment(batch: BulkBatch, payment: Omit<BulkPaymentRecord, 'id' | 'status'>): BulkBatch {
  const record: BulkPaymentRecord = {
    ...payment,
    id: `bp_${Date.now()}`,
    status: 'valid',
  };
  const payments = [...batch.payments, record];
  const validCount = payments.filter((p) => p.status === 'valid').length;
  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const fee = Math.max(1200, Math.round(validCount * 10));
  return {
    ...batch,
    payments,
    paymentCount: payments.length,
    validCount,
    totalAmount,
    fee,
    totalDebit: totalAmount + fee,
    status: resolveBatchStatus({
      ...batch,
      paymentCount: payments.length,
      validCount,
      errorCount: batch.errorCount,
      duplicates: batch.duplicates,
    }),
  };
}

export function removePayment(batch: BulkBatch, paymentId: string): BulkBatch {
  const payments = batch.payments.filter((p) => p.id !== paymentId);
  const validCount = payments.filter((p) => p.status === 'valid').length;
  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const fee = payments.length > 0 ? Math.max(1200, Math.round(validCount * 10)) : 0;
  return {
    ...batch,
    payments,
    paymentCount: payments.length,
    validCount,
    totalAmount,
    fee,
    totalDebit: totalAmount + fee,
  };
}

export function resolveDuplicate(
  batch: BulkBatch,
  duplicateId: string,
  resolution: DuplicateResolution
): BulkBatch {
  const duplicates = batch.duplicates.map((d) =>
    d.id === duplicateId ? { ...d, resolution } : d
  );
  const duplicateCount = duplicates.filter((d) => d.resolution === 'pending').length;
  const next = { ...batch, duplicates, duplicateCount };
  return { ...next, status: resolveBatchStatus(next) };
}
export function getAccountById(id: string): BulkPaymentAccount | undefined {
  return BULK_ACCOUNTS.find((a) => a.id === id);
}

export function getEligibleAccounts(): BulkPaymentAccount[] {
  return BULK_ACCOUNTS.filter((a) => a.bulkEligible);
}
