import type {
  BulkApprovalStep,
  BulkBatchTrackingData,
  BulkBatchTrackingStatus,
  BulkLifecycleStep,
  BulkViewerRole,
} from '../types/corporateBulkBatchStatus';

const SUBMISSION_KEY = 'bulkBatchSubmitted';
const SUBMISSION_DATA_KEY = 'bulkBatchSubmissionData';

const PENDING_APPROVAL_STEPS: BulkApprovalStep[] = [
  { id: '1', label: 'Batch Created', state: 'completed', timestamp: '18 Aug • 10:45 AM' },
  { id: '2', label: 'Submitted for Approval', state: 'completed', timestamp: '18 Aug • 11:20 AM' },
  { id: '3', label: 'Finance Checker', state: 'current' },
];

const PENDING_LIFECYCLE: BulkLifecycleStep[] = [
  { id: '1', label: 'Created', state: 'completed' },
  { id: '2', label: 'Validated', state: 'completed' },
  { id: '3', label: 'Submitted', state: 'completed' },
  { id: '4', label: 'Pending Approval', state: 'current' },
  { id: '5', label: 'Processing', state: 'upcoming' },
  { id: '6', label: 'Completed', state: 'upcoming' },
];

function baseBatch(status: BulkBatchTrackingStatus, viewerRole: BulkViewerRole): BulkBatchTrackingData {
  return {
    batchId: 'BATCH-20260818-00125',
    batchRef: 'batch_aug_vendor_01',
    batchName: 'August Vendor Payments',
    reference: 'BULK-AUG-2026-01',
    status,
    statusLabel: 'Pending Approval',
    statusSupporting: 'Awaiting Finance Checker approval',
    paymentCount: 120,
    validCount: 120,
    errorCount: 0,
    duplicateCount: 0,
    successfulCount: 0,
    failedCount: 0,
    processingCount: 0,
    totalAmount: 1_875_000,
    fee: 1_200,
    totalDebit: 1_876_200,
    sourceAccount: {
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
    },
    paymentDate: '18 Aug 2026',
    submittedBy: 'Rahul Sharma',
    submittedRole: 'Finance Maker',
    submittedAt: '18 Aug 2026 • 11:20 AM',
    approvalId: 'APR-BULK-20260818-4582',
    approvalSteps: PENDING_APPROVAL_STEPS,
    completedApprovalStages: 1,
    totalApprovalStages: 3,
    currentApprover: 'Finance Checker',
    lifecycle: PENDING_LIFECYCLE,
    viewerRole,
    showPaymentResults: false,
  };
}

function withStatus(
  status: BulkBatchTrackingStatus,
  viewerRole: BulkViewerRole
): BulkBatchTrackingData {
  const data = baseBatch(status, viewerRole);

  switch (status) {
    case 'processing':
      return {
        ...data,
        statusLabel: 'Processing',
        statusSupporting: 'All required approvals are complete. Payments are being processed.',
        completedApprovalStages: 1,
        approvalSteps: [
          { id: '1', label: 'Batch Created', state: 'completed' },
          { id: '2', label: 'Submitted for Approval', state: 'completed' },
          { id: '3', label: 'Finance Checker', state: 'completed' },
        ],
        lifecycle: [
          { id: '1', label: 'Created', state: 'completed' },
          { id: '2', label: 'Validated', state: 'completed' },
          { id: '3', label: 'Submitted', state: 'completed' },
          { id: '4', label: 'Approved', state: 'completed' },
          { id: '5', label: 'Processing', state: 'current' },
          { id: '6', label: 'Completed', state: 'upcoming' },
        ],
        processingCount: 120,
        showPaymentResults: true,
      };
    case 'completed':
      return {
        ...data,
        statusLabel: 'Completed',
        statusSupporting: 'Bulk payment batch completed successfully.',
        completedApprovalStages: 3,
        successfulCount: 120,
        failedCount: 0,
        completedAt: '18 Aug 2026 • 12:15 PM',
        lifecycle: [
          { id: '1', label: 'Created', state: 'completed' },
          { id: '2', label: 'Validated', state: 'completed' },
          { id: '3', label: 'Submitted', state: 'completed' },
          { id: '4', label: 'Approved', state: 'completed' },
          { id: '5', label: 'Processing', state: 'completed' },
          { id: '6', label: 'Completed', state: 'completed' },
        ],
        showPaymentResults: true,
      };
    case 'partially_completed':
      return {
        ...data,
        statusLabel: 'Partially Completed',
        statusSupporting: '118 payments completed and 2 payments require attention.',
        successfulCount: 118,
        failedCount: 2,
        completedAt: '18 Aug 2026 • 12:15 PM',
        showPaymentResults: true,
      };
    case 'rejected':
      return {
        ...data,
        statusLabel: 'Batch Rejected',
        statusSupporting: 'The batch was rejected during the corporate approval process.',
        rejectedBy: 'Finance Checker',
        rejectionReason: 'Supporting invoice information is incomplete.',
        approvalSteps: [
          { id: '1', label: 'Batch Created', state: 'completed' },
          { id: '2', label: 'Submitted for Approval', state: 'completed' },
          { id: '3', label: 'Finance Checker', state: 'rejected', timestamp: '18 Aug • 11:45 AM' },
        ],
        lifecycle: [
          { id: '1', label: 'Created', state: 'completed' },
          { id: '2', label: 'Validated', state: 'completed' },
          { id: '3', label: 'Submitted', state: 'completed' },
          { id: '4', label: 'Rejected', state: 'rejected' },
        ],
      };
    case 'returned':
      return {
        ...data,
        statusLabel: 'Returned for Changes',
        statusSupporting: 'The batch has been returned to the maker for correction.',
        returnComment: 'Please correct the beneficiary details for 3 records.',
        lifecycle: [
          { id: '1', label: 'Created', state: 'completed' },
          { id: '2', label: 'Validated', state: 'completed' },
          { id: '3', label: 'Submitted', state: 'completed' },
          { id: '4', label: 'Returned', state: 'returned' },
        ],
      };
    case 'cancelled':
      return {
        ...data,
        statusLabel: 'Batch Cancelled',
        statusSupporting: 'The batch was cancelled before processing.',
        cancelledBy: 'Rahul Sharma',
        cancelledAt: '18 Aug 2026',
        cancellationReason: 'Duplicate batch',
      };
    default:
      return data;
  }
}

export function saveBatchSubmission(batchId: string): void {
  sessionStorage.setItem(SUBMISSION_KEY, batchId);
}

export function getBatchTrackingData(
  batchId: string,
  variant?: string | null,
  role?: string | null
): BulkBatchTrackingData | null {
  const viewerRole: BulkViewerRole = role === 'checker' ? 'checker' : 'maker';
  const status = (variant as BulkBatchTrackingStatus) || 'pending_approval';

  if (batchId.startsWith('batch_') || batchId === 'BATCH-20260818-00125') {
    const data = withStatus(status, viewerRole);
    return { ...data, batchRef: batchId.startsWith('batch_') ? batchId : data.batchRef };
  }

  const submitted = sessionStorage.getItem(SUBMISSION_KEY);
  if (submitted === batchId) {
    return withStatus('pending_approval', viewerRole);
  }

  return null;
}

export async function fetchBatchTracking(
  batchId: string,
  variant?: string | null,
  role?: string | null
): Promise<BulkBatchTrackingData | null> {
  await new Promise((r) => setTimeout(r, 450));
  return getBatchTrackingData(batchId, variant, role);
}
