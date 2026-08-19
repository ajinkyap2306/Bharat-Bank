import type { AccountLimitModel } from '../types/corporateAccountLimits';

const RESET_CONFIG = {
  daily: 'Every day at 00:00',
  monthly: 'First day of each month',
  timezone: 'IST',
};

export const CORPORATE_ACCOUNT_LIMITS_DATA: Record<string, AccountLimitModel> = {
  acc_corp_op_01: {
    accountId: 'acc_corp_op_01',
    dailyTransferLimit: 5000000,
    dailyTransferUsed: 1250000,
    singleTransactionLimit: 1000000,
    approvalThreshold: 500000,
    paymentLimits: [
      {
        id: 'vendor',
        label: 'Vendor Payment',
        dailyLimit: 2500000,
        singleLimit: 1000000,
      },
      {
        id: 'internal',
        label: 'Internal Transfer',
        dailyLimit: 5000000,
        singleLimit: 2000000,
      },
      {
        id: 'scheduled',
        label: 'Scheduled Payment',
        dailyLimit: 1500000,
        singleLimit: 500000,
      },
    ],
    bulkPaymentDailyLimit: 5000000,
    bulkPaymentMaxBatch: 2500000,
    bulkPaymentUsed: 1200000,
    payrollMonthlyLimit: 10000000,
    payrollMonthlyUsed: 3845000,
    beneficiaryDailyLimit: 2500000,
    beneficiaryDailyUsed: 650000,
    utilization: [
      { id: 'transfer', label: 'Transfer', percent: 25 },
      { id: 'payments', label: 'Payments', percent: 32 },
      { id: 'bulk', label: 'Bulk Payments', percent: 24 },
      { id: 'payroll', label: 'Payroll', percent: 38 },
    ],
    resetFrequency: RESET_CONFIG,
    configuredBy: 'Corporate Administrator',
  },
  acc_corp_pay_02: {
    accountId: 'acc_corp_pay_02',
    dailyTransferLimit: 3000000,
    dailyTransferUsed: 845000,
    singleTransactionLimit: 800000,
    approvalThreshold: 400000,
    paymentLimits: [
      {
        id: 'vendor',
        label: 'Vendor Payment',
        dailyLimit: 1500000,
        singleLimit: 500000,
      },
      {
        id: 'internal',
        label: 'Internal Transfer',
        dailyLimit: 3000000,
        singleLimit: 1000000,
      },
      {
        id: 'scheduled',
        label: 'Scheduled Payment',
        dailyLimit: 1000000,
        singleLimit: 300000,
      },
    ],
    bulkPaymentDailyLimit: 2000000,
    bulkPaymentMaxBatch: 1000000,
    bulkPaymentUsed: 400000,
    payrollMonthlyLimit: 8000000,
    payrollMonthlyUsed: 6200000,
    beneficiaryDailyLimit: 1500000,
    beneficiaryDailyUsed: 900000,
    utilization: [
      { id: 'transfer', label: 'Transfer', percent: 28 },
      { id: 'payments', label: 'Payments', percent: 45 },
      { id: 'bulk', label: 'Bulk Payments', percent: 20 },
      { id: 'payroll', label: 'Payroll', percent: 78 },
    ],
    resetFrequency: RESET_CONFIG,
    configuredBy: 'Corporate Administrator',
  },
};

export function getAccountLimitsMock(accountId: string): AccountLimitModel | null {
  if (CORPORATE_ACCOUNT_LIMITS_DATA[accountId]) {
    return { ...CORPORATE_ACCOUNT_LIMITS_DATA[accountId] };
  }

  const base = CORPORATE_ACCOUNT_LIMITS_DATA.acc_corp_op_01;
  return {
    ...base,
    accountId,
    dailyTransferUsed: Math.round(base.dailyTransferLimit * 0.18),
    bulkPaymentUsed: Math.round(base.bulkPaymentDailyLimit * 0.15),
    payrollMonthlyUsed: Math.round(base.payrollMonthlyLimit * 0.25),
    beneficiaryDailyUsed: Math.round(base.beneficiaryDailyLimit * 0.2),
  };
}
