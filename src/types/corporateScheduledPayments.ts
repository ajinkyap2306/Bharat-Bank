export type ScheduledPaymentTab = 'upcoming' | 'pending_approval' | 'completed' | 'cancelled';

export type ScheduledPaymentStatus =
  | 'upcoming'
  | 'pending_approval'
  | 'completed'
  | 'cancelled'
  | 'processing';

export type ScheduleFrequency = 'one_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type ScheduledPaymentType = 'vendor' | 'bank_transfer' | 'internal_transfer';

export interface ScheduledPaymentListItem {
  id: string;
  scheduleRef: string;
  title: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  scheduledDate: string;
  executionTime: string;
  frequency: string;
  frequencyKey: ScheduleFrequency;
  status: ScheduledPaymentStatus;
  paymentType: string;
  approvalId?: string;
  scheduleLabel?: string;
}

export interface CorporateScheduledPaymentDetail {
  id: string;
  scheduleRef: string;
  linkedPaymentId?: string;
  approvalId?: string;
  title: string;
  status: ScheduledPaymentStatus;
  paymentType: string;
  amount: number;
  fee: number;
  totalDebit: number;
  currency: string;
  beneficiary: {
    id?: string;
    name: string;
    maskedAccount: string;
    bankName: string;
  };
  sourceAccount: {
    id: string;
    name: string;
    maskedNumber: string;
    companyName: string;
    availableBalance?: number;
  };
  scheduledDate: string;
  executionTime: string;
  frequency: string;
  frequencyKey: ScheduleFrequency;
  scheduleLabel: string;
  paymentMethod: string;
  purpose: string;
  reference: string;
  remarks?: string;
  invoiceNumber?: string;
  channel: string;
  createdBy: string;
  createdRole: string;
  createdAt: string;
  approvedBy?: string;
  approvedRole?: string;
  approvedAt?: string;
  nextExecution?: string;
  lastExecutedAt?: string;
  endDate?: string;
  startDate?: string;
  weeklyDay?: string;
  monthlyDay?: number;
  occurrences?: number;
  estimatedTotal?: number;
  canEdit: boolean;
  canCancel: boolean;
}

export interface ScheduledPaymentDraft {
  paymentType: ScheduledPaymentType;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryMaskedAccount: string;
  beneficiaryBank: string;
  accountId: string;
  amount: number;
  reference: string;
  remarks: string;
  frequency: ScheduleFrequency;
  paymentDate: string;
  executionTime: string;
  startDate: string;
  endDate: string;
  noEndDate: boolean;
  weeklyDay: string;
  monthlyDay: number;
}

export interface ScheduledPaymentsHomeSummary {
  upcomingTotal: number;
  pendingApprovalCount: number;
  currency: string;
}
