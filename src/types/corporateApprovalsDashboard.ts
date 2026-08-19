export type ApprovalItemType =
  | 'payment'
  | 'beneficiary'
  | 'payroll'
  | 'bulk_payment'
  | 'user_access'
  | 'limit_change'
  | 'service_request';

export type ApprovalCategoryTab =
  | 'all'
  | 'payments'
  | 'beneficiaries'
  | 'payroll'
  | 'bulk_payments'
  | 'users';

export type ApprovalDisplayStatus =
  | 'pending_yours'
  | 'pending_other'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'expired'
  | 'cancelled'
  | 'completed';

export type ApprovalPriority = 'normal' | 'high' | 'urgent';

export type ApprovalSortOption =
  | 'newest'
  | 'oldest'
  | 'highest_amount'
  | 'lowest_amount'
  | 'due_date';

export interface ApprovalWorkflowStep {
  role: string;
  state: 'completed' | 'current' | 'upcoming';
}

export interface CorporateApprovalItem {
  id: string;
  approvalId: string;
  type: ApprovalItemType;
  typeLabel: string;
  title: string;
  description?: string;
  amount?: number;
  currency: string;
  createdBy: string;
  createdAt: string;
  createdAtIso: string;
  status: ApprovalDisplayStatus;
  statusLabel: string;
  priority: ApprovalPriority;
  dueDate?: string;
  dueLabel?: string;
  isOverdue?: boolean;
  currentApprover?: string;
  approvalSteps: ApprovalWorkflowStep[];
  completedSteps: number;
  totalSteps: number;
  reference?: string;
  employeeCount?: number;
}

export interface ApprovalsDashboardSummary {
  pendingCount: number;
  totalPendingAmount: number;
  urgentCount: number;
  dueTodayCount: number;
  actionRequiredCount: number;
  actionRequiredAmount: number;
  categoryCounts: Record<ApprovalCategoryTab, number>;
}

export interface ApprovalsDashboardUser {
  name: string;
  role: string;
}

export interface ApprovalsDashboardData {
  user: ApprovalsDashboardUser;
  summary: ApprovalsDashboardSummary;
  items: CorporateApprovalItem[];
  lastUpdated: string;
}

export interface ApprovalDashboardFilters {
  types: ApprovalItemType[];
  statuses: ApprovalDisplayStatus[];
  priorities: ApprovalPriority[];
  dateRange: '' | 'today' | '7days' | '30days' | 'custom';
  amountRanges: ('under1' | '1to5' | '5to10' | 'above10')[];
  createdBy: string;
}

export const DEFAULT_APPROVAL_FILTERS: ApprovalDashboardFilters = {
  types: [],
  statuses: [],
  priorities: [],
  dateRange: '',
  amountRanges: [],
  createdBy: '',
};
