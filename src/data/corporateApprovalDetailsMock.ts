import { CORPORATE_APPROVAL_ITEMS, CURRENT_APPROVER } from './corporateApprovalsDashboardMock';
import type { CorporateDemoRole } from '../types/corporateDemoUser';
import type { CorporateApprovalDetail, ApprovalActionResult } from '../types/corporateApprovalDetails';
import {
  activateScheduledPayment,
  getScheduleIdByApprovalId,
} from './corporateScheduledPaymentsMock';

/** Maps payment IDs and legacy aliases to dashboard approval IDs */
const APPROVAL_ID_ALIASES: Record<string, string> = {
  'PAY-2026-0818-001': 'APR-20260818-782145',
  'PAY-20260818-458201': 'APR-20260818-782145',
  'APR-2026-0818-001': 'APR-20260818-782145',
  'APR-20260818-458201': 'APR-20260818-782145',
  'PAY-2026-0818-002': 'APR-20260818-003',
  'APR-2026-0818-002': 'APR-20260818-003',
  'PAY-2026-0817-003': 'APR-20260817-004',
  'APR-2026-0817-003': 'APR-20260817-004',
  'PAY-2026-0818-010': 'APR-20260818-782145',
  'APR-BULK-20260818-4582': 'APR-20260818-782145',
  'APR-20260818-SCH01': 'APR-20260818-SCH01',
  'APR-20260818-SCH02': 'APR-20260818-SCH02',
  sch_02: 'APR-20260818-SCH01',
  sch_03: 'APR-20260818-SCH02',
};

function normalizeApprovalId(raw: string): string {
  const id = decodeURIComponent(raw).trim();
  if (APPROVAL_ID_ALIASES[id]) return APPROVAL_ID_ALIASES[id];

  const byItem = CORPORATE_APPROVAL_ITEMS.find((i) => i.approvalId === id || i.id === id);
  if (byItem) return byItem.approvalId;

  return id;
}

function buildFallbackDetail(approvalId: string): CorporateApprovalDetail {
  return {
    ...DEFAULT_DETAIL,
    id: `apr_fallback_${approvalId}`,
    approvalId,
    paymentId: approvalId.startsWith('APR-') ? `PAY-${approvalId.slice(4)}` : DEFAULT_DETAIL.paymentId,
  };
}

const DEFAULT_DETAIL: CorporateApprovalDetail = {
  id: 'apr_001',
  approvalId: 'APR-20260818-782145',
  paymentId: 'PAY-20260818-458201',
  type: 'payment',
  typeLabel: 'Vendor Payment',
  status: 'pending_yours',
  statusLabel: 'Pending Your Approval',
  title: 'ABC Suppliers Ltd.',
  amount: 250000,
  currency: '₹',
  beneficiary: {
    name: 'ABC Suppliers Ltd.',
    maskedAccount: '•••• 7821',
    bankName: 'HDFC Bank',
    type: 'Vendor',
    verified: true,
  },
  sourceAccount: {
    id: 'acc_corp_op_01',
    name: 'Operating Account',
    maskedNumber: '•••• 4582',
    availableBalance: 1245000,
    balanceAfter: 994975,
    sufficientBalance: true,
  },
  paymentDetails: {
    purpose: 'Vendor Settlement',
    invoiceNumber: 'INV-2026-4582',
    reference: 'March Supplier Settlement',
    paymentMethod: 'NEFT',
    paymentDate: '18 Aug 2026',
    scheduled: false,
    scheduleLabel: 'Immediate',
    fee: 25,
    totalDebit: 250025,
    currency: 'INR',
  },
  requestor: {
    name: 'Rahul Sharma',
    role: 'Finance Maker',
    department: 'Finance',
    createdAt: '18 Aug 2026 • 10:35 AM',
  },
  currentApprover: {
    name: CURRENT_APPROVER.name,
    role: CURRENT_APPROVER.role,
    completedSteps: 0,
    totalSteps: 1,
  },
  timeline: [
    {
      id: 't1',
      label: 'Payment Created',
      userName: 'Rahul Sharma',
      userRole: 'Finance Maker',
      state: 'completed',
    },
    {
      id: 't2',
      label: 'Submitted for Approval',
      timestamp: '10:36 AM',
      state: 'completed',
    },
    {
      id: 't3',
      label: 'Finance Checker',
      userName: CURRENT_APPROVER.name,
      userRole: 'Pending Your Approval',
      state: 'current',
    },
  ],
  previousApprovals: [],
  warnings: [
    {
      type: 'high_value',
      title: 'High Value Payment',
      message: 'This payment is above the configured review threshold.',
    },
  ],
  documents: [
    {
      id: 'doc_1',
      name: 'Invoice_INV-2026-4582.pdf',
      sizeLabel: '245 KB',
    },
  ],
  makerComment: 'Payment against March supplier invoice.',
  canAct: true,
  requiresVerification: false,
};

function buildScheduledPaymentDetail(approvalId: string): CorporateApprovalDetail {
  const scheduleId = getScheduleIdByApprovalId(approvalId) ?? 'sch_02';
  const isOfficeRent = approvalId === 'APR-20260818-SCH01';
  return {
    ...DEFAULT_DETAIL,
    id: isOfficeRent ? 'apr_sched_01' : 'apr_sched_02',
    approvalId,
    paymentId: `SCH-${scheduleId}`,
    type: 'payment',
    typeLabel: 'Scheduled Payment',
    title: isOfficeRent ? 'Office Rent' : 'Vendor Settlement',
    amount: isOfficeRent ? 150000 : 225000,
    beneficiary: {
      name: isOfficeRent ? 'Office Rent — BKC' : 'ABC Suppliers Ltd.',
      maskedAccount: isOfficeRent ? '•••• 3344' : '•••• 7821',
      bankName: isOfficeRent ? 'ICICI Bank' : 'HDFC Bank',
      type: 'Vendor',
      verified: true,
    },
    paymentDetails: {
      purpose: isOfficeRent ? 'Office Rent' : 'Vendor Settlement',
      invoiceNumber: isOfficeRent ? 'INV-RENT-0826' : '—',
      reference: isOfficeRent ? 'RENT-BKC-AUG' : 'March Supplier Settlement',
      paymentMethod: 'NEFT',
      paymentDate: isOfficeRent ? '28 Aug 2026' : '30 Aug 2026',
      scheduled: true,
      scheduleLabel: isOfficeRent ? 'Monthly • 28th' : 'One Time',
      fee: 25,
      totalDebit: (isOfficeRent ? 150000 : 225000) + 25,
      currency: 'INR',
    },
    makerComment: 'Scheduled payment requires Checker approval before activation.',
    timeline: [
      {
        id: 't1',
        label: 'Scheduled Payment Created',
        userName: 'Rahul Sharma',
        userRole: 'Finance Maker',
        state: 'completed',
      },
      {
        id: 't2',
        label: 'Submitted for Approval',
        timestamp: '10:40 AM',
        state: 'completed',
      },
      {
        id: 't3',
        label: 'Finance Checker',
        userName: CURRENT_APPROVER.name,
        userRole: 'Pending Your Approval',
        state: 'current',
      },
    ],
    warnings: [],
  };
}

function buildGenericDetail(approvalId: string): CorporateApprovalDetail | null {
  const item = CORPORATE_APPROVAL_ITEMS.find(
    (i) => i.approvalId === approvalId || i.id === approvalId
  );
  if (!item) return null;

  const isPayment = item.type === 'payment' || item.type === 'bulk_payment';
  const canAct = item.status === 'pending_yours';

  return {
    id: item.id,
    approvalId: item.approvalId,
    paymentId: isPayment ? `PAY-${item.approvalId.slice(4)}` : undefined,
    type: item.type,
    typeLabel: item.typeLabel,
    status: item.status === 'pending_yours' ? 'pending_yours' : 'pending_other',
    statusLabel: item.statusLabel,
    title: item.title,
    amount: item.amount,
    currency: item.currency,
    beneficiary: isPayment
      ? {
          name: item.title,
          maskedAccount: '•••• 7821',
          bankName: 'HDFC Bank',
          type: 'Vendor',
          verified: true,
        }
      : item.type === 'beneficiary'
        ? {
            name: item.title,
            maskedAccount: '•••• 3456',
            bankName: 'ICICI Bank',
            type: 'Vendor',
            verified: false,
          }
        : undefined,
    sourceAccount: isPayment
      ? {
          id: 'acc_corp_op_01',
          name: 'Operating Account',
          maskedNumber: '•••• 4582',
          availableBalance: 1245000,
          balanceAfter: 1245000 - (item.amount ?? 0) - 25,
          sufficientBalance: 1245000 >= (item.amount ?? 0) + 25,
        }
      : undefined,
    paymentDetails: isPayment
      ? {
          purpose: 'Vendor Settlement',
          invoiceNumber: item.reference ?? '—',
          reference: item.reference ?? '—',
          paymentMethod: 'NEFT',
          paymentDate: '18 Aug 2026',
          scheduled: false,
          scheduleLabel: 'Immediate',
          fee: 25,
          totalDebit: (item.amount ?? 0) + 25,
          currency: 'INR',
        }
      : undefined,
    requestor: {
      name: item.createdBy,
      role: 'Finance Maker',
      department: 'Finance',
      createdAt: item.createdAt,
    },
    currentApprover: {
      name: CURRENT_APPROVER.name,
      role: CURRENT_APPROVER.role,
      completedSteps: item.completedSteps,
      totalSteps: item.totalSteps,
    },
    timeline: [
      {
        id: 't1',
        label: 'Request Created',
        userName: item.createdBy,
        userRole: 'Finance Maker',
        state: 'completed',
      },
      {
        id: 't2',
        label: item.statusLabel,
        userName: CURRENT_APPROVER.name,
        userRole: CURRENT_APPROVER.role,
        state: item.status === 'pending_yours' ? 'current' : 'upcoming',
      },
    ],
    previousApprovals: [],
    warnings:
      (item.amount ?? 0) >= 200000
        ? [
            {
              type: 'high_value' as const,
              title: 'High Value Payment',
              message: 'This payment is above the configured review threshold.',
            },
          ]
        : [],
    documents: [],
    makerComment: undefined,
    canAct,
    requiresVerification: item.type === 'beneficiary',
  };
}

function applyViewerRole(
  detail: CorporateApprovalDetail,
  viewerRole?: CorporateDemoRole | null
): CorporateApprovalDetail {
  if (!viewerRole || viewerRole === 'maker') {
    return {
      ...detail,
      canAct: false,
      status: detail.status === 'pending_yours' ? 'pending_other' : detail.status,
      statusLabel:
        detail.status === 'pending_yours' ? 'Pending Approval' : detail.statusLabel,
    };
  }
  return {
    ...detail,
    canAct: detail.status === 'pending_yours',
  };
}

export function getApprovalDetail(
  approvalId: string,
  viewerRole?: CorporateDemoRole | null
): CorporateApprovalDetail | null {
  if (!approvalId) return null;

  const resolved = normalizeApprovalId(approvalId);

  if (resolved === 'APR-20260818-782145') {
    return applyViewerRole({ ...DEFAULT_DETAIL }, viewerRole);
  }

  if (resolved === 'APR-20260818-SCH01' || resolved === 'APR-20260818-SCH02') {
    return applyViewerRole(buildScheduledPaymentDetail(resolved), viewerRole);
  }

  const generic = buildGenericDetail(resolved);
  if (generic) return applyViewerRole(generic, viewerRole);

  if (resolved.startsWith('APR-') || resolved.startsWith('apr_')) {
    return applyViewerRole(
      buildFallbackDetail(resolved.startsWith('apr_') ? DEFAULT_DETAIL.approvalId : resolved),
      viewerRole
    );
  }

  return null;
}

export async function fetchApprovalDetail(
  approvalId: string,
  simulateError = false,
  viewerRole?: CorporateDemoRole | null
): Promise<CorporateApprovalDetail | null> {
  await new Promise((r) => setTimeout(r, 500));
  if (simulateError) throw new Error('LOAD_FAILED');
  return getApprovalDetail(approvalId, viewerRole);
}

export async function submitApprovalAction(
  action: 'approve' | 'reject' | 'return',
  detail: CorporateApprovalDetail,
  payload: { reason?: string; comment?: string }
): Promise<ApprovalActionResult> {
  await new Promise((r) => setTimeout(r, 1200));

  if (action === 'approve') {
    const scheduleId = getScheduleIdByApprovalId(detail.approvalId);
    if (scheduleId) {
      activateScheduledPayment(scheduleId);
      return {
        action: 'approve',
        title: 'Scheduled Payment Approved',
        message: 'The scheduled payment is now active and will run on the next payment date.',
        secondaryMessage: 'Scheduled / Active',
        amount: detail.amount,
        beneficiary: detail.beneficiary?.name ?? detail.title,
        awaitingNextApproval: false,
        paymentId: detail.paymentId,
      };
    }

    const awaitingNext = detail.currentApprover.completedSteps + 1 < detail.currentApprover.totalSteps;
    return {
      action: 'approve',
      title: 'Payment Approved',
      message: awaitingNext
        ? 'The payment has been approved and will proceed to the next processing stage.'
        : 'The payment has been approved and will proceed to processing.',
      secondaryMessage: awaitingNext ? 'Awaiting next approval' : 'Payment Processing',
      amount: detail.amount,
      beneficiary: detail.beneficiary?.name ?? detail.title,
      awaitingNextApproval: awaitingNext,
      paymentId: detail.paymentId,
    };
  }

  if (action === 'reject') {
    return {
      action: 'reject',
      title: 'Payment Rejected',
      message: 'Payment has not been processed.',
      reason: payload.reason,
      amount: detail.amount,
      beneficiary: detail.beneficiary?.name ?? detail.title,
      paymentId: detail.paymentId,
    };
  }

  return {
    action: 'return',
    title: 'Returned for Changes',
    message: 'The payment has been returned to the maker for correction.',
    comment: payload.comment,
    paymentId: detail.paymentId,
  };
}
