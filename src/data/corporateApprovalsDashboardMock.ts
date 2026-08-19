import type {
  ApprovalCategoryTab,
  ApprovalDashboardFilters,
  ApprovalDisplayStatus,
  ApprovalItemType,
  ApprovalSortOption,
  ApprovalsDashboardData,
  ApprovalsDashboardSummary,
  CorporateApprovalItem,
} from '../types/corporateApprovalsDashboard';
import { getCorporateDashboardData } from './corporateDashboardMock';

export const CURRENT_APPROVER = {
  name: 'Amit Verma',
  role: 'Finance Checker',
};

const step = (
  role: string,
  state: 'completed' | 'current' | 'upcoming'
): CorporateApprovalItem['approvalSteps'][number] => ({ role, state });

export const CORPORATE_APPROVAL_ITEMS: CorporateApprovalItem[] = [
  {
    id: 'apr_001',
    approvalId: 'APR-20260818-782145',
    type: 'payment',
    typeLabel: 'Vendor Payment',
    title: 'ABC Suppliers Ltd.',
    amount: 250000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '18 Aug 2026 • 10:35 AM',
    createdAtIso: '2026-08-18T10:35:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    dueDate: '2026-08-20',
    dueLabel: 'Due 20 Aug',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'INV-2026-4582',
  },
  {
    id: 'apr_002',
    approvalId: 'APR-20260818-002',
    type: 'payment',
    typeLabel: 'Vendor Payment',
    title: 'Office Rent',
    amount: 150000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '18 Aug 2026 • 09:45 AM',
    createdAtIso: '2026-08-18T09:45:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'high',
    dueDate: '2026-08-18',
    dueLabel: 'Due Today',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'RENT-AUG-2026',
  },
  {
    id: 'apr_sched_01',
    approvalId: 'APR-20260818-SCH01',
    type: 'payment',
    typeLabel: 'Scheduled Payment',
    title: 'Office Rent',
    amount: 150000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '12 Aug 2026 • 10:40 AM',
    createdAtIso: '2026-08-12T10:40:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    dueDate: '2026-08-28',
    dueLabel: 'Due 28 Aug',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'RENT-BKC-AUG',
  },
  {
    id: 'apr_sched_02',
    approvalId: 'APR-20260818-SCH02',
    type: 'payment',
    typeLabel: 'Scheduled Payment',
    title: 'Vendor Settlement',
    amount: 225000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '15 Aug 2026 • 04:20 PM',
    createdAtIso: '2026-08-15T16:20:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    dueDate: '2026-08-30',
    dueLabel: 'Due 30 Aug',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'March Supplier Settlement',
  },
  {
    id: 'apr_003',
    approvalId: 'APR-20260818-003',
    type: 'payroll',
    typeLabel: 'Payroll',
    title: 'August Payroll',
    description: '245 Employees',
    amount: 3575000,
    currency: '₹',
    employeeCount: 245,
    createdBy: 'Finance Team',
    createdAt: '18 Aug 2026',
    createdAtIso: '2026-08-18T08:00:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'high',
    dueDate: '2026-08-20',
    dueLabel: 'Due 20 Aug',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'PAYROLL-AUG-2026',
  },
  {
    id: 'apr_004',
    approvalId: 'APR-20260817-004',
    type: 'payment',
    typeLabel: 'Vendor Payment',
    title: 'XYZ Logistics',
    amount: 125000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '17 Aug 2026',
    createdAtIso: '2026-08-17T14:20:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    dueDate: '2026-08-19',
    dueLabel: 'Due Tomorrow',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'LOG-4582',
  },
  {
    id: 'apr_005',
    approvalId: 'APR-20260817-005',
    type: 'beneficiary',
    typeLabel: 'Beneficiary',
    title: 'New Services Pvt. Ltd.',
    description: 'New Beneficiary Registration',
    createdBy: 'Rahul Sharma',
    createdAt: '17 Aug 2026',
    createdAtIso: '2026-08-17T11:00:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'BEN-NS-2026',
  },
  {
    id: 'apr_006',
    approvalId: 'APR-20260818-006',
    type: 'payment',
    typeLabel: 'Vendor Payment',
    title: 'Metro Infrastructure',
    amount: 175000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '18 Aug 2026 • 08:15 AM',
    createdAtIso: '2026-08-18T08:15:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'urgent',
    dueDate: '2026-08-18',
    dueLabel: 'Due Today',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'INFRA-8821',
  },
  {
    id: 'apr_007',
    approvalId: 'APR-20260818-007',
    type: 'payment',
    typeLabel: 'Vendor Payment',
    title: 'Precision Tools India',
    amount: 175000,
    currency: '₹',
    createdBy: 'Rahul Sharma',
    createdAt: '18 Aug 2026 • 07:50 AM',
    createdAtIso: '2026-08-18T07:50:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    dueDate: '2026-08-18',
    dueLabel: 'Due Today',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'PTI-2026-118',
  },
  {
    id: 'apr_008',
    approvalId: 'APR-20260818-008',
    type: 'bulk_payment',
    typeLabel: 'Bulk Payment',
    title: 'Vendor Batch — Week 33',
    description: '18 payments',
    amount: 430000,
    currency: '₹',
    createdBy: 'Finance Team',
    createdAt: '18 Aug 2026 • 07:30 AM',
    createdAtIso: '2026-08-18T07:30:00',
    status: 'pending_other',
    statusLabel: 'Pending Finance Checker',
    priority: 'urgent',
    dueDate: '2026-08-18',
    dueLabel: 'Due Today',
    currentApprover: 'Finance Checker',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'BULK-W33-2026',
  },
  {
    id: 'apr_009',
    approvalId: 'APR-20260817-009',
    type: 'user_access',
    typeLabel: 'User Access',
    title: 'Access Request — Kavita Iyer',
    description: 'Checker role assignment',
    createdBy: 'HR Admin',
    createdAt: '17 Aug 2026 • 03:00 PM',
    createdAtIso: '2026-08-17T15:00:00',
    status: 'pending_yours',
    statusLabel: 'Pending Your Approval',
    priority: 'normal',
    approvalSteps: [step('Finance Checker', 'current')],
    completedSteps: 0,
    totalSteps: 1,
    reference: 'USR-KI-2026',
  },
];

function typeToCategory(type: ApprovalItemType): ApprovalCategoryTab {
  if (type === 'payment') return 'payments';
  if (type === 'beneficiary') return 'beneficiaries';
  if (type === 'payroll') return 'payroll';
  if (type === 'bulk_payment') return 'bulk_payments';
  if (type === 'user_access' || type === 'limit_change' || type === 'service_request') return 'users';
  return 'all';
}

export function buildApprovalsSummary(items: CorporateApprovalItem[]): ApprovalsDashboardSummary {
  const pending = items.filter((i) =>
    ['pending_yours', 'pending_other'].includes(i.status)
  );
  const actionRequired = items.filter((i) => i.status === 'pending_yours');
  const actionPayments = actionRequired.filter((i) => i.type === 'payment');

  const categoryCounts: ApprovalsDashboardSummary['categoryCounts'] = {
    all: pending.length,
    payments: pending.filter((i) => i.type === 'payment').length,
    beneficiaries: pending.filter((i) => i.type === 'beneficiary').length,
    payroll: pending.filter((i) => i.type === 'payroll').length,
    bulk_payments: pending.filter((i) => i.type === 'bulk_payment').length,
    users: pending.filter(
      (i) => i.type === 'user_access' || i.type === 'limit_change' || i.type === 'service_request'
    ).length,
  };

  return {
    pendingCount: pending.length,
    totalPendingAmount: pending.reduce((sum, i) => sum + (i.amount ?? 0), 0),
    urgentCount: pending.filter((i) => i.priority === 'urgent').length,
    dueTodayCount: pending.filter((i) => i.dueLabel === 'Due Today').length,
    actionRequiredCount: actionPayments.length,
    actionRequiredAmount: actionPayments.reduce((sum, i) => sum + (i.amount ?? 0), 0),
    categoryCounts,
  };
}

export function getApprovalsBadgeCount(): number {
  return getCorporateDashboardData('ent_01').approvalAlert.requestCount;
}

export function buildApprovalsDashboardData(): ApprovalsDashboardData {
  return {
    user: CURRENT_APPROVER,
    summary: buildApprovalsSummary(CORPORATE_APPROVAL_ITEMS),
    items: CORPORATE_APPROVAL_ITEMS,
    lastUpdated: 'Updated just now',
  };
}

export async function fetchApprovalsDashboard(
  simulateError = false
): Promise<ApprovalsDashboardData> {
  await new Promise((r) => setTimeout(r, 550));
  if (simulateError) throw new Error('LOAD_FAILED');
  return buildApprovalsDashboardData();
}

export function searchApprovalItems(
  items: CorporateApprovalItem[],
  query: string
): CorporateApprovalItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.typeLabel.toLowerCase().includes(q) ||
      i.approvalId.toLowerCase().includes(q) ||
      i.createdBy.toLowerCase().includes(q) ||
      (i.reference?.toLowerCase().includes(q) ?? false) ||
      (i.description?.toLowerCase().includes(q) ?? false) ||
      (i.amount !== undefined && i.amount.toString().includes(q))
  );
}

export function filterApprovalItems(
  items: CorporateApprovalItem[],
  category: ApprovalCategoryTab,
  filters: ApprovalDashboardFilters
): CorporateApprovalItem[] {
  let list = items.filter((i) =>
    ['pending_yours', 'pending_other'].includes(i.status)
  );

  if (category !== 'all') {
    list = list.filter((i) => typeToCategory(i.type) === category);
  }

  if (filters.types.length) {
    list = list.filter((i) => filters.types.includes(i.type));
  }
  if (filters.statuses.length) {
    list = list.filter((i) => filters.statuses.includes(i.status));
  }
  if (filters.priorities.length) {
    list = list.filter((i) => filters.priorities.includes(i.priority));
  }
  if (filters.createdBy.trim()) {
    const c = filters.createdBy.trim().toLowerCase();
    list = list.filter((i) => i.createdBy.toLowerCase().includes(c));
  }
  if (filters.amountRanges.length) {
    list = list.filter((i) => {
      const amt = i.amount ?? 0;
      return filters.amountRanges.some((range) => {
        if (range === 'under1') return amt > 0 && amt < 100000;
        if (range === '1to5') return amt >= 100000 && amt < 500000;
        if (range === '5to10') return amt >= 500000 && amt < 1000000;
        if (range === 'above10') return amt >= 1000000;
        return true;
      });
    });
  }
  if (filters.dateRange) {
    const now = new Date('2026-08-18T12:00:00');
    list = list.filter((i) => {
      const d = new Date(i.createdAtIso);
      if (filters.dateRange === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (filters.dateRange === '7days') {
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      if (filters.dateRange === '30days') {
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      }
      return true;
    });
  }

  return list;
}

export function sortApprovalItems(
  items: CorporateApprovalItem[],
  sort: ApprovalSortOption
): CorporateApprovalItem[] {
  const list = [...items];
  switch (sort) {
    case 'oldest':
      return list.sort(
        (a, b) => new Date(a.createdAtIso).getTime() - new Date(b.createdAtIso).getTime()
      );
    case 'highest_amount':
      return list.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    case 'lowest_amount':
      return list.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
    case 'due_date':
      return list.sort((a, b) => {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return da - db;
      });
    case 'newest':
    default:
      return list.sort(
        (a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime()
      );
  }
}

export function countActiveFilters(filters: ApprovalDashboardFilters): number {
  let n = 0;
  if (filters.types.length) n += 1;
  if (filters.statuses.length) n += 1;
  if (filters.priorities.length) n += 1;
  if (filters.dateRange) n += 1;
  if (filters.amountRanges.length) n += 1;
  if (filters.createdBy.trim()) n += 1;
  return n;
}
