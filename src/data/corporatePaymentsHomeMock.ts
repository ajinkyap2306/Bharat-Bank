import type { PaymentsHomeData } from '../types/corporatePaymentsHome';
import { CORPORATE_ACCOUNTS_LIST } from './corporateAccountsMock';
import {
  CORPORATE_PAYMENT_HISTORY,
  CORPORATE_PAYMENT_TEMPLATES,
  CORPORATE_SCHEDULED_PAYMENTS,
} from './corporatePaymentsMock';

const ELIGIBLE_ACCOUNT_IDS = ['acc_corp_op_01', 'acc_corp_pay_02', 'acc_corp_col_03'];

export const PAYMENTS_HOME_LIMITS = {
  dailyLimit: 5000000,
  usedToday: 1250000,
  remaining: 3750000,
};

export function buildPaymentsHomeData(accountId: string): PaymentsHomeData {
  const accounts = CORPORATE_ACCOUNTS_LIST.filter((a) => ELIGIBLE_ACCOUNT_IDS.includes(a.id)).map(
    (a) => ({
      id: a.id,
      accountType: a.accountType,
      maskedNumber: a.maskedNumber,
      label: `${a.accountType} ${a.maskedNumber}`,
      availableBalance: a.availableBalance,
      currency: a.currency,
    })
  );

  const pendingPayments = [
    {
      id: 'pay_pending_01',
      type: 'Vendor Payment',
      beneficiary: 'ABC Suppliers Ltd.',
      amount: 250000,
      currency: '₹',
      status: 'Pending Approval' as const,
      date: '18 Aug 2026',
      meta: 'Created by Rahul Sharma',
      paymentId: 'PAY-2026-0818-010',
    },
    {
      id: 'pay_pending_02',
      type: 'Scheduled Payment',
      beneficiary: 'Office Rent',
      amount: 150000,
      currency: '₹',
      status: 'Scheduled' as const,
      date: '28 Aug 2026',
      meta: 'Due 28 Aug',
      paymentId: 'PAY-2026-0828-002',
    },
    {
      id: 'pay_pending_03',
      type: 'Vendor Payment',
      beneficiary: 'CtrlS Datacenters Ltd',
      amount: 1450000,
      currency: '₹',
      status: 'Pending Approval' as const,
      date: '17 Aug 2026',
      meta: 'Created by Rohit Sharma',
      paymentId: 'PAY-2026-0817-003',
    },
  ];

  const scheduledPayments = CORPORATE_SCHEDULED_PAYMENTS.map((s) => ({
    id: s.id,
    type: s.name,
    beneficiary: s.beneficiaryName,
    amount: s.amount,
    currency: '₹',
    status: 'Scheduled' as const,
    date: s.scheduledDate,
    meta: s.frequency,
  }));

  const recentPayments: PaymentsHomeData['recentPayments'] = [
    {
      id: 'pay_01',
      type: 'Vendor Payment',
      beneficiary: 'ABC Suppliers Ltd.',
      amount: 250000,
      currency: '₹',
      status: 'Completed',
      date: '18 Aug 2026',
      paymentId: 'PAY-2026-0818-001',
    },
    {
      id: 'pay_refund',
      type: 'Refund',
      beneficiary: 'Customer Refund',
      amount: 25000,
      currency: '₹',
      status: 'Completed',
      date: '17 Aug 2026',
      paymentId: 'PAY-2026-0817-008',
    },
    {
      id: 'pay_04',
      type: 'Internal Transfer',
      beneficiary: 'Internal Transfer',
      amount: 500000,
      currency: '₹',
      status: 'Completed',
      date: '16 Aug 2026',
      paymentId: 'PAY-2026-0816-004',
    },
    {
      id: 'pay_02',
      type: 'Payroll',
      beneficiary: 'Salary Batch',
      amount: 845000,
      currency: '₹',
      status: 'Processing',
      date: '18 Aug 2026',
      paymentId: 'PAY-2026-0818-002',
    },
  ];

  const templates: PaymentsHomeData['templates'] = [
    {
      id: 'tpl_rent',
      name: 'Monthly Rent',
      type: 'Vendor Payment',
      beneficiary: 'Office Rent — BKC',
      defaultAmount: 150000,
      currency: '₹',
    },
    {
      id: 'tpl_supplies',
      name: 'Office Supplies',
      type: 'Vendor Payment',
      beneficiary: 'Stationery World Pvt Ltd',
      defaultAmount: 75000,
      currency: '₹',
    },
    {
      id: 'tpl_vendor',
      name: 'Vendor Settlement',
      type: 'Vendor Payment',
      beneficiary: 'ABC Suppliers Ltd.',
      defaultAmount: null,
      currency: '₹',
    },
  ];

  const pendingFromHistory = CORPORATE_PAYMENT_HISTORY.filter(
    (p) => p.status === 'Pending Approval' && p.debitAccountId === accountId
  );

  return {
    accounts,
    selectedAccountId: accountId,
    pendingApprovalsCount: 5,
    pendingApprovalsAmount: 875000,
    pendingPayments: pendingPayments.filter(
      (p) => pendingFromHistory.length === 0 || true
    ),
    scheduledPayments,
    recentPayments,
    templates,
    limits: PAYMENTS_HOME_LIMITS,
    utilization: [
      { id: 'transfer', label: 'Transfer', percent: 25 },
      { id: 'payments', label: 'Payments', percent: 32 },
      { id: 'bulk', label: 'Bulk Payments', percent: 24 },
      { id: 'payroll', label: 'Payroll', percent: 38 },
    ],
  };
}

export function searchPaymentsHome(
  data: PaymentsHomeData,
  query: string
): PaymentsHomePaymentItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = [
    ...data.recentPayments,
    ...data.pendingPayments,
    ...data.scheduledPayments,
  ];

  return pool.filter(
    (p) =>
      p.beneficiary.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      (p.paymentId?.toLowerCase().includes(q) ?? false) ||
      (p.reference?.toLowerCase().includes(q) ?? false) ||
      String(p.amount).includes(q)
  );
}
