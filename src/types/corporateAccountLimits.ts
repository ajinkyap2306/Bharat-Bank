import type { CorporateAccount } from './corporateAccounts';

export type LimitStatus = 'within_limit' | 'near_limit' | 'exceeded' | 'restricted';

export interface PaymentLimitItem {
  id: string;
  label: string;
  dailyLimit: number;
  singleLimit: number;
}

export interface LimitUtilizationItem {
  id: string;
  label: string;
  percent: number;
}

export interface AccountLimitModel {
  accountId: string;
  dailyTransferLimit: number;
  dailyTransferUsed: number;
  singleTransactionLimit: number;
  approvalThreshold: number;
  paymentLimits: PaymentLimitItem[];
  bulkPaymentDailyLimit: number;
  bulkPaymentMaxBatch: number;
  bulkPaymentUsed: number;
  payrollMonthlyLimit: number;
  payrollMonthlyUsed: number;
  beneficiaryDailyLimit: number;
  beneficiaryDailyUsed: number;
  utilization: LimitUtilizationItem[];
  resetFrequency: {
    daily: string;
    monthly: string;
    timezone: string;
  };
  isRestricted?: boolean;
  configuredBy: string;
}

export interface AccountLimitsScreenData {
  account: CorporateAccount;
  limits: AccountLimitModel;
  hideBalance: boolean;
  canRequestLimitChange: boolean;
}

export function getLimitStatus(used: number, limit: number, restricted?: boolean): LimitStatus {
  if (restricted) return 'restricted';
  if (limit <= 0) return 'within_limit';
  if (used >= limit) return 'exceeded';
  const utilization = (used / limit) * 100;
  if (utilization >= 80) return 'near_limit';
  return 'within_limit';
}

export function getUtilizationPercent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
