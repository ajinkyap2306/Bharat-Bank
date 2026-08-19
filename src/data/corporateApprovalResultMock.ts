import { CURRENT_APPROVER } from './corporateApprovalsDashboardMock';
import type { CorporateApprovalDetail } from '../types/corporateApprovalDetails';
import type {
  ApprovalResultAction,
  CorporateApprovalResultData,
  ResultTimelineStep,
} from '../types/corporateApprovalResult';

export const APPROVAL_RESULT_STORAGE_KEY = 'approvalActionResult';
export const APPROVAL_RESULT_TOAST_KEY = 'approvalResultToastShown';

const PERFORMED_AT = '18 Aug 2026 • 11:15 AM';

const FINAL_APPROVAL_TIMELINE: ResultTimelineStep[] = [
  { id: '1', label: 'Payment Created', state: 'completed' },
  { id: '2', label: 'Submitted for Approval', state: 'completed' },
  { id: '3', label: 'Finance Checker', state: 'completed', sublabel: 'Amit Verma' },
  { id: '4', label: 'Payment Processing', state: 'current' },
];

const REJECTED_TIMELINE: ResultTimelineStep[] = [
  { id: '1', label: 'Payment Created', state: 'completed' },
  { id: '2', label: 'Submitted', state: 'completed' },
  { id: '3', label: 'Finance Checker', state: 'rejected', sublabel: 'Rejected' },
];

const RETURNED_TIMELINE: ResultTimelineStep[] = [
  { id: '1', label: 'Payment Created', state: 'completed' },
  { id: '2', label: 'Submitted', state: 'completed' },
  { id: '3', label: 'Finance Checker', state: 'returned', sublabel: 'Returned for Changes' },
];

export function saveApprovalResult(data: CorporateApprovalResultData): void {
  sessionStorage.setItem(APPROVAL_RESULT_STORAGE_KEY, JSON.stringify(data));
}

export function loadApprovalResult(): CorporateApprovalResultData | null {
  try {
    const raw = sessionStorage.getItem(APPROVAL_RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CorporateApprovalResultData;
  } catch {
    return null;
  }
}

function baseFromDetail(detail: CorporateApprovalDetail): Omit<
  CorporateApprovalResultData,
  'status' | 'action' | 'timeline' | 'completedApprovals' | 'totalApprovals'
> {
  return {
    approvalId: detail.approvalId,
    paymentId: detail.paymentId,
    requestType: detail.typeLabel,
    beneficiary: detail.beneficiary?.name ?? detail.title,
    amount: detail.amount,
    currency: detail.currency,
    performedBy: CURRENT_APPROVER.name,
    performedByRole: CURRENT_APPROVER.role,
    performedAt: PERFORMED_AT,
  };
}

export function buildApprovalResult(
  detail: CorporateApprovalDetail,
  action: ApprovalResultAction,
  payload: { reason?: string; comment?: string } = {}
): CorporateApprovalResultData {
  const base = baseFromDetail(detail);

  if (action === 'reject') {
    return {
      ...base,
      status: 'rejected',
      action,
      rejectionReason: payload.reason ?? 'Invoice information requires correction.',
      comment: payload.comment,
      completedApprovals: 1,
      totalApprovals: 1,
      timeline: REJECTED_TIMELINE,
    };
  }

  if (action === 'return') {
    return {
      ...base,
      status: 'returned',
      action,
      returnComment: payload.comment ?? 'Please update the invoice reference and resubmit.',
      comment: payload.comment,
      completedApprovals: 1,
      totalApprovals: 1,
      timeline: RETURNED_TIMELINE,
    };
  }

  return {
    ...base,
    status: 'approved_final',
    action,
    comment: payload.comment ?? 'Approved after invoice verification.',
    completedApprovals: 1,
    totalApprovals: 1,
    nextStatusLabel: 'Payment Processing',
    timeline: FINAL_APPROVAL_TIMELINE,
  };
}

export function getDemoApprovalResult(
  approvalId: string,
  variant?: string | null
): CorporateApprovalResultData {
  const base: CorporateApprovalResultData = {
    status: 'approved_final',
    action: 'approve',
    approvalId,
    paymentId: 'PAY-20260818-458201',
    requestType: 'Vendor Payment',
    beneficiary: 'ABC Suppliers Ltd.',
    amount: 250000,
    currency: '₹',
    performedBy: CURRENT_APPROVER.name,
    performedByRole: CURRENT_APPROVER.role,
    performedAt: PERFORMED_AT,
    comment: 'Approved after invoice verification.',
    completedApprovals: 1,
    totalApprovals: 1,
    nextStatusLabel: 'Payment Processing',
    timeline: FINAL_APPROVAL_TIMELINE,
  };

  if (variant === 'rejected') {
    return {
      ...base,
      status: 'rejected',
      action: 'reject',
      rejectionReason: 'Invoice information requires correction.',
      nextApprover: undefined,
      nextStatusLabel: undefined,
      timeline: REJECTED_TIMELINE,
    };
  }

  if (variant === 'returned') {
    return {
      ...base,
      status: 'returned',
      action: 'return',
      returnComment: 'Please update the invoice reference and resubmit.',
      nextApprover: undefined,
      nextStatusLabel: undefined,
      timeline: RETURNED_TIMELINE,
    };
  }

  if (variant === 'already_processed') {
    return {
      ...base,
      status: 'already_processed',
      action: 'approve',
      currentWorkflowStatus: 'Approved',
      nextApprover: undefined,
      timeline: FINAL_APPROVAL_TIMELINE,
    };
  }

  if (variant === 'failed') {
    return {
      ...base,
      status: 'failed',
      action: 'approve',
      nextApprover: undefined,
      timeline: FINAL_APPROVAL_TIMELINE,
    };
  }

  return base;
}

export async function fetchApprovalResult(
  approvalId: string,
  variant?: string | null
): Promise<CorporateApprovalResultData> {
  await new Promise((r) => setTimeout(r, 450));
  const stored = loadApprovalResult();
  if (stored && stored.approvalId === approvalId) {
    return stored;
  }
  return getDemoApprovalResult(approvalId, variant);
}
