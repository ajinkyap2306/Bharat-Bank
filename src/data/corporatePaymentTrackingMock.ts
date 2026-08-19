import { CORPORATE_PAYMENT_HISTORY } from './corporatePaymentsMock';
import type {
  CorporatePaymentStatus,
  CorporatePaymentTrackingData,
  PaymentTimelineStep,
} from '../types/corporatePaymentTracking';
import type { CorporatePaymentRecord } from '../types/corporatePayments';

const PAYMENT_TO_APPROVAL: Record<string, string> = {
  'PAY-2026-0818-001': 'APR-20260818-782145',
  'PAY-20260818-458201': 'APR-20260818-782145',
  'PAY-2026-0818-002': 'APR-20260818-003',
  'PAY-2026-0817-003': 'APR-20260817-004',
  'PAY-2026-0816-004': 'APR-20260817-005',
};

const DEFAULT_PAYMENT_ID = 'PAY-20260818-458201';

const PROCESSING_TIMELINE: PaymentTimelineStep[] = [
  { id: '1', label: 'Payment Created', timestamp: '18 Aug • 10:35 AM', state: 'completed' },
  { id: '2', label: 'Submitted for Approval', timestamp: '18 Aug • 10:36 AM', state: 'completed' },
  { id: '3', label: 'Finance Checker Approved', timestamp: '18 Aug • 11:15 AM', state: 'completed' },
  { id: '4', label: 'Payment Processing', timestamp: '18 Aug • 11:16 AM', state: 'current' },
  { id: '5', label: 'Payment Completed', timestamp: 'Pending', state: 'upcoming' },
];

const COMPLETED_TIMELINE: PaymentTimelineStep[] = [
  { id: '1', label: 'Payment Created', timestamp: '18 Aug • 10:35 AM', state: 'completed' },
  { id: '2', label: 'Submitted', timestamp: '18 Aug • 10:36 AM', state: 'completed' },
  { id: '3', label: 'Approved', timestamp: '18 Aug • 11:30 AM', state: 'completed' },
  { id: '4', label: 'Processing', timestamp: '18 Aug • 11:31 AM', state: 'completed' },
  { id: '5', label: 'Completed', timestamp: '18 Aug • 11:33 AM', state: 'completed' },
];

const PENDING_TIMELINE: PaymentTimelineStep[] = [
  { id: '1', label: 'Payment Created', timestamp: '18 Aug • 10:35 AM', state: 'completed' },
  { id: '2', label: 'Submitted for Approval', timestamp: '18 Aug • 10:36 AM', state: 'completed' },
  { id: '3', label: 'Finance Checker Approval', timestamp: 'Pending', state: 'current' },
  { id: '4', label: 'Payment Processing', state: 'upcoming' },
];

function getStatusLabel(status: CorporatePaymentStatus): string {
  const map: Record<CorporatePaymentStatus, string> = {
    submitted: 'Submitted',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    processing: 'Payment Processing',
    completed: 'Payment Successful',
    rejected: 'Payment Rejected',
    failed: 'Payment Failed',
    cancelled: 'Payment Cancelled',
    reversed: 'Payment Reversed',
  };
  return map[status];
}

function mapRecordStatus(status: CorporatePaymentRecord['status']): CorporatePaymentStatus {
  switch (status) {
    case 'Completed':
      return 'completed';
    case 'Processing':
      return 'processing';
    case 'Pending Approval':
      return 'pending_approval';
    case 'Failed':
      return 'failed';
    case 'Scheduled':
      return 'submitted';
    default:
      return 'processing';
  }
}

function parseMaskedAccount(label: string, masked?: string): string {
  if (masked) return masked.replace(/X/g, '•');
  const match = label.match(/••••\s*\d+/);
  return match ? match[0] : '•••• ••••';
}

function buildApprovalHistory(record: CorporatePaymentRecord) {
  if (record.approvalLevels?.length) {
    return record.approvalLevels.map((level, index) => ({
      id: `h${index + 1}`,
      name: level.name,
      role: `Level ${level.level}`,
      action: level.status === 'approved' ? 'Approved' : level.status === 'rejected' ? 'Rejected' : 'Pending',
      timestamp: level.date ?? record.createdAt,
    }));
  }
  const history = [
    {
      id: 'h1',
      name: record.submittedBy,
      role: 'Finance Maker',
      action: 'Created',
      timestamp: record.createdAt,
    },
  ];
  if (record.approvedBy) {
    history.push({
      id: 'h2',
      name: record.approvedBy,
      role: 'Finance Checker',
      action: 'Approved',
      timestamp: record.paymentDate,
    });
  }
  return history;
}

function buildFromHistory(record: CorporatePaymentRecord): CorporatePaymentTrackingData {
  const status = mapRecordStatus(record.status);
  const completedApprovals =
    record.approvalLevels?.filter((l) => l.status === 'approved').length ??
    (record.approvedBy ? 1 : 0);
  const totalApprovals = record.approvalLevels?.length ?? 1;

  return {
    id: record.paymentId,
    approvalId:
      PAYMENT_TO_APPROVAL[record.paymentId] ?? `APR-${record.paymentId.replace(/^PAY-/, '')}`,
    transactionId: record.transactionId,
    status,
    statusLabel: getStatusLabel(status),
    type: record.typeLabel,
    beneficiary: {
      name: record.beneficiaryName,
      maskedAccount: parseMaskedAccount(record.debitAccountLabel, record.beneficiaryMasked),
      bankName: record.beneficiaryBank ?? 'Beneficiary Bank',
      verified: true,
    },
    sourceAccount: {
      id: record.debitAccountId,
      name: record.debitAccountLabel.split('•')[0].trim() || 'Operating Account',
      maskedNumber: parseMaskedAccount(record.debitAccountLabel),
      companyName: 'Acme Technologies Pvt. Ltd.',
      balanceAfter: status === 'completed' ? undefined : undefined,
    },
    amount: record.amount,
    fee: record.charges,
    totalDebit: record.totalDebit,
    currency: '₹',
    purpose: record.purpose,
    invoiceNumber: record.invoiceNumber ?? '',
    reference: record.reference,
    paymentMethod: 'NEFT',
    paymentDate: record.paymentDate,
    channel: 'Corporate Mobile Banking',
    createdBy: record.submittedBy,
    createdRole: 'Finance Maker',
    createdAt: record.createdAt,
    approvalHistory: buildApprovalHistory(record),
    timeline: status === 'completed' ? COMPLETED_TIMELINE : status === 'pending_approval' ? PENDING_TIMELINE : PROCESSING_TIMELINE,
    completedApprovals,
    totalApprovals,
    nextApprover: status === 'pending_approval' ? 'Finance Checker' : undefined,
    receiptAvailable: status === 'completed',
    completionTime: status === 'completed' ? `${record.paymentDate} • Completed` : undefined,
    failureReason: record.failureReason,
    failureTime: status === 'failed' ? record.paymentDate : undefined,
  };
}

function basePayment(status: CorporatePaymentStatus): CorporatePaymentTrackingData {
  return {
    id: DEFAULT_PAYMENT_ID,
    approvalId: 'APR-20260818-782145',
    transactionId: ['processing', 'completed', 'failed', 'reversed'].includes(status)
      ? 'TXN-20260818-458201'
      : undefined,
    status,
    statusLabel: getStatusLabel(status),
    type: 'Vendor Payment',
    beneficiary: {
      name: 'ABC Suppliers Ltd.',
      maskedAccount: '•••• 7821',
      bankName: 'HDFC Bank',
      verified: true,
    },
    sourceAccount: {
      id: 'acc_corp_op_01',
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
      companyName: 'Acme Technologies Pvt. Ltd.',
      balanceAfter: ['completed', 'processing'].includes(status) ? 994975 : undefined,
    },
    amount: 250000,
    fee: 25,
    totalDebit: 250025,
    currency: '₹',
    purpose: 'Vendor Settlement',
    invoiceNumber: 'INV-2026-4582',
    reference: 'March Supplier Settlement',
    paymentMethod: 'NEFT',
    paymentDate: '18 Aug 2026',
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: '18 Aug 2026 • 10:35 AM',
    approvalHistory: [
      { id: 'h1', name: 'Rahul Sharma', role: 'Finance Maker', action: 'Created', timestamp: '10:35 AM' },
      { id: 'h2', name: 'Amit Verma', role: 'Finance Checker', action: 'Approved', timestamp: '11:15 AM' },
    ],
    timeline: PROCESSING_TIMELINE,
    completedApprovals: 1,
    totalApprovals: 1,
    receiptAvailable: status === 'completed',
    completionTime: status === 'completed' ? '18 Aug 2026 • 11:33 AM' : undefined,
  };
}

function applyStatusVariant(
  data: CorporatePaymentTrackingData,
  status: CorporatePaymentStatus
): CorporatePaymentTrackingData {
  switch (status) {
    case 'pending_approval':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        transactionId: undefined,
        timeline: PENDING_TIMELINE,
        completedApprovals: Math.min(data.completedApprovals, data.totalApprovals - 1),
        nextApprover: 'Finance Checker',
        receiptAvailable: false,
        sourceAccount: { ...data.sourceAccount, balanceAfter: undefined },
      };
    case 'completed':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        timeline: COMPLETED_TIMELINE,
        receiptAvailable: true,
        completionTime: data.completionTime ?? '18 Aug 2026 • 11:33 AM',
      };
    case 'rejected':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        transactionId: undefined,
        rejectionReason: data.rejectionReason ?? 'Payment exceeds configured approval policy.',
        rejectedBy: data.rejectedBy ?? 'Finance Checker',
        rejectedAt: data.rejectedAt ?? '18 Aug 2026 • 11:15 AM',
        timeline: [
          { id: '1', label: 'Payment Created', timestamp: '18 Aug • 10:35 AM', state: 'completed' },
          { id: '2', label: 'Submitted', timestamp: '18 Aug • 10:36 AM', state: 'completed' },
          { id: '3', label: 'Rejected', timestamp: '18 Aug • 11:15 AM', state: 'rejected' },
        ],
        receiptAvailable: false,
        sourceAccount: { ...data.sourceAccount, balanceAfter: undefined },
      };
    case 'failed':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        failureReason: data.failureReason ?? 'Beneficiary bank could not process the transaction.',
        failureTime: data.failureTime ?? '18 Aug 2026 • 11:33 AM',
        timeline: [
          ...PROCESSING_TIMELINE.slice(0, 5),
          { id: '6', label: 'Payment Failed', timestamp: '18 Aug • 11:33 AM', state: 'failed' },
        ],
        receiptAvailable: false,
      };
    case 'cancelled':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        transactionId: undefined,
        cancellationReason: data.cancellationReason ?? 'Duplicate payment request',
        cancelledBy: data.cancelledBy ?? 'Amit Verma',
        cancelledAt: data.cancelledAt ?? '18 Aug 2026',
        timeline: [
          { id: '1', label: 'Payment Created', timestamp: '18 Aug • 10:35 AM', state: 'completed' },
          { id: '2', label: 'Payment Cancelled', timestamp: '18 Aug • 12:00 PM', state: 'cancelled' },
        ],
        receiptAvailable: false,
        sourceAccount: { ...data.sourceAccount, balanceAfter: undefined },
      };
    case 'reversed':
      return {
        ...data,
        status,
        statusLabel: getStatusLabel(status),
        reversalReason: data.reversalReason ?? 'Beneficiary bank reversal',
        reversalDate: data.reversalDate ?? '20 Aug 2026',
        reversalAmount: data.reversalAmount ?? data.amount,
        timeline: [
          ...COMPLETED_TIMELINE.slice(0, 4),
          { id: '5', label: 'Completed', timestamp: '18 Aug • 11:33 AM', state: 'completed' },
          { id: '6', label: 'Payment Reversed', timestamp: '20 Aug • 09:15 AM', state: 'returned' },
        ],
        receiptAvailable: true,
        completionTime: data.completionTime ?? '18 Aug 2026 • 11:33 AM',
      };
    default:
      return { ...data, status, statusLabel: getStatusLabel(status) };
  }
}

export function getPaymentTrackingData(
  paymentId: string,
  variant?: string | null
): CorporatePaymentTrackingData | null {
  const historyRecord = CORPORATE_PAYMENT_HISTORY.find(
    (p) => p.paymentId === paymentId || p.id === paymentId
  );

  if (historyRecord) {
    const base = buildFromHistory(historyRecord);
    const status = (variant as CorporatePaymentStatus) || base.status;
    return applyStatusVariant({ ...base, id: historyRecord.paymentId }, status);
  }

  if (!paymentId) {
    return null;
  }

  if (!paymentId.startsWith('PAY-') && paymentId !== DEFAULT_PAYMENT_ID) {
    return null;
  }

  const status = (variant as CorporatePaymentStatus) || 'processing';
  const data = basePayment(status);
  data.id = paymentId;
  return applyStatusVariant(data, status);
}

export async function fetchPaymentTracking(
  paymentId: string,
  variant?: string | null,
  simulateError = false
): Promise<CorporatePaymentTrackingData | null> {
  await new Promise((r) => setTimeout(r, 500));
  if (simulateError) throw new Error('LOAD_FAILED');
  return getPaymentTrackingData(paymentId, variant);
}
