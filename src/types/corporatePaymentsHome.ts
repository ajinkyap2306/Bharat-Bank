import type { CorporatePaymentStatus } from './corporatePayments';

export interface PaymentAccountOption {
  id: string;
  accountType: string;
  maskedNumber: string;
  label: string;
  availableBalance: number;
  currency: string;
}

export interface PaymentsHomePaymentItem {
  id: string;
  type: string;
  beneficiary: string;
  amount: number;
  currency: string;
  status: CorporatePaymentStatus | 'Cancelled' | 'Reversed';
  date: string;
  reference?: string;
  meta?: string;
  paymentId?: string;
}

export interface PaymentTemplateItem {
  id: string;
  name: string;
  type: string;
  beneficiary: string;
  defaultAmount: number | null;
  currency: string;
}

export interface PaymentLimitSnapshot {
  dailyLimit: number;
  used: number;
  remaining: number;
}

export interface LimitUtilizationItem {
  id: string;
  label: string;
  percent: number;
}

export interface PaymentsHomeData {
  accounts: PaymentAccountOption[];
  selectedAccountId: string;
  pendingApprovalsCount: number;
  pendingApprovalsAmount: number;
  pendingPayments: PaymentsHomePaymentItem[];
  scheduledPayments: PaymentsHomePaymentItem[];
  recentPayments: PaymentsHomePaymentItem[];
  templates: PaymentTemplateItem[];
  limits: PaymentLimitSnapshot;
  utilization: LimitUtilizationItem[];
}
