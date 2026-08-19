import type { BulkPaymentResultsData } from '../types/corporateBulkPaymentResults';

const DEMO_RESULTS: BulkPaymentResultsData = {
  batchId: 'BATCH-20260818-00125',
  batchRef: 'BATCH-20260818-00125',
  batchName: 'August Vendor Payroll Batch',
  totalPayments: 5,
  successfulCount: 3,
  processingCount: 1,
  failedCount: 1,
  rejectedCount: 0,
  totalAmount: 875000,
  successfulAmount: 625000,
  failedAmount: 125000,
  items: [
    {
      id: 'bp_01',
      beneficiaryName: 'ABC Suppliers Ltd.',
      maskedAccount: '•••• 7821',
      bankName: 'HDFC Bank',
      amount: 250000,
      status: 'successful',
      statusLabel: 'Successful',
      paymentId: 'PAY-20260818-458201',
      processedAt: '18 Aug 2026 • 02:15 PM',
    },
    {
      id: 'bp_02',
      beneficiaryName: 'XYZ Logistics',
      maskedAccount: '•••• 9134',
      bankName: 'ICICI Bank',
      amount: 175000,
      status: 'successful',
      statusLabel: 'Successful',
      paymentId: 'PAY-20260818-458202',
      processedAt: '18 Aug 2026 • 02:16 PM',
    },
    {
      id: 'bp_03',
      beneficiaryName: 'Office Supplies Co.',
      maskedAccount: '•••• 5432',
      bankName: 'Axis Bank',
      amount: 200000,
      status: 'successful',
      statusLabel: 'Successful',
      paymentId: 'PAY-20260818-458203',
      processedAt: '18 Aug 2026 • 02:16 PM',
    },
    {
      id: 'bp_04',
      beneficiaryName: 'Tech Services Pvt. Ltd.',
      maskedAccount: '•••• 8821',
      bankName: 'HDFC Bank',
      amount: 125000,
      status: 'failed',
      statusLabel: 'Failed',
      failureReason: 'Invalid beneficiary account — account closed',
    },
    {
      id: 'bp_05',
      beneficiaryName: 'Metro Facilities',
      maskedAccount: '•••• 6612',
      bankName: 'Kotak Mahindra Bank',
      amount: 125000,
      status: 'processing',
      statusLabel: 'Processing',
      paymentId: 'PAY-20260818-458205',
    },
  ],
};

export async function fetchBulkPaymentResults(
  batchId: string
): Promise<BulkPaymentResultsData | null> {
  await new Promise((r) => setTimeout(r, 400));
  if (
    batchId.startsWith('batch_') ||
    batchId === 'BATCH-20260818-00125' ||
    batchId.length > 0
  ) {
    return { ...DEMO_RESULTS, batchId, batchRef: batchId };
  }
  return null;
}
