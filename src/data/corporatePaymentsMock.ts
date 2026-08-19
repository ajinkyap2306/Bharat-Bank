import {
  CorporatePaymentRecord,
  CorporatePaymentTemplate,
  CorporateScheduledPayment,
  CorporatePaymentDraft,
  CorporatePaymentLimits,
  CorporatePaymentCharges,
  DEFAULT_PAYMENT_FORM,
} from '../types/corporatePayments';

export const CORPORATE_PAYMENT_LIMITS: CorporatePaymentLimits = {
  dailyLimit: 5000000,
  usedToday: 1250000,
};

export const CORPORATE_PAYMENT_CHARGES: CorporatePaymentCharges = {
  bankCharges: 25,
  tax: 5,
};

export const CORPORATE_PAYMENT_HISTORY: CorporatePaymentRecord[] = [
  {
    id: 'pay_01',
    paymentId: 'PAY-2026-0818-001',
    transactionId: 'TXN-CORP-20260818-001',
    type: 'vendor',
    typeLabel: 'Vendor Payment',
    beneficiaryName: 'ABC Suppliers Ltd.',
    beneficiaryBank: 'HDFC Bank',
    beneficiaryMasked: 'XXXX 4582',
    debitAccountId: 'acc_corp_op_01',
    debitAccountLabel: 'Operating Account ••••4582',
    amount: 250000,
    charges: 30,
    totalDebit: 250030,
    purpose: 'Vendor Invoice',
    reference: 'INV-2026-4582',
    invoiceNumber: 'INV-2026-4582',
    paymentDate: '18 Aug 2026',
    submittedBy: 'Rahul Sharma',
    approvedBy: 'Amit Verma',
    status: 'Completed',
    createdAt: 'Today, 10:42 AM',
    approvalLevels: [
      { level: 1, name: 'Rahul Sharma', status: 'approved', date: '18 Aug 2026' },
      { level: 2, name: 'Amit Verma', status: 'approved', date: '18 Aug 2026' },
    ],
  },
  {
    id: 'pay_02',
    paymentId: 'PAY-2026-0818-002',
    type: 'payroll',
    typeLabel: 'Salary / Payroll',
    beneficiaryName: 'Salary Batch',
    debitAccountId: 'acc_corp_pay_02',
    debitAccountLabel: 'Payroll Account ••••7821',
    amount: 845000,
    charges: 0,
    totalDebit: 845000,
    purpose: 'Monthly Payroll',
    reference: 'PAYROLL-AUG-2026',
    paymentDate: '18 Aug 2026',
    submittedBy: 'Priya Nair',
    status: 'Processing',
    createdAt: 'Today, 09:15 AM',
    approvalLevels: [
      { level: 1, name: 'Priya Nair', status: 'approved', date: '18 Aug 2026' },
      { level: 2, name: 'Amit Verma', status: 'pending' },
    ],
  },
  {
    id: 'pay_03',
    paymentId: 'PAY-2026-0817-003',
    type: 'bank_transfer',
    typeLabel: 'Bank Transfer',
    beneficiaryName: 'CtrlS Datacenters Ltd',
    beneficiaryBank: 'HDFC Bank',
    beneficiaryMasked: 'XXXX 3711',
    debitAccountId: 'acc_corp_op_01',
    debitAccountLabel: 'Operating Account ••••4582',
    amount: 1450000,
    charges: 30,
    totalDebit: 1450030,
    purpose: 'Data Center Lease',
    reference: 'PO-4910',
    paymentDate: '17 Aug 2026',
    submittedBy: 'Rohit Sharma',
    status: 'Pending Approval',
    createdAt: 'Yesterday, 04:45 PM',
    approvalLevels: [
      { level: 1, name: 'Rohit Sharma', status: 'approved', date: '17 Aug 2026' },
      { level: 2, name: 'Amit Verma', status: 'pending' },
    ],
  },
  {
    id: 'pay_04',
    paymentId: 'PAY-2026-0816-004',
    type: 'internal',
    typeLabel: 'Internal Transfer',
    beneficiaryName: 'Payroll Account',
    debitAccountId: 'acc_corp_op_01',
    debitAccountLabel: 'Operating Account ••••4582',
    amount: 500000,
    charges: 0,
    totalDebit: 500000,
    purpose: 'Payroll Funding',
    reference: 'INT-0816',
    paymentDate: '16 Aug 2026',
    submittedBy: 'Rahul Sharma',
    approvedBy: 'Amit Verma',
    status: 'Completed',
    createdAt: '16 Aug 2026, 11:00 AM',
  },
  {
    id: 'pay_05',
    paymentId: 'PAY-2026-0815-005',
    type: 'bank_transfer',
    typeLabel: 'Bank Transfer',
    beneficiaryName: 'Cloud Infrastructure Payout',
    debitAccountId: 'acc_corp_op_01',
    debitAccountLabel: 'Operating Account ••••4582',
    amount: 320000,
    charges: 30,
    totalDebit: 320030,
    purpose: 'Vendor Payment',
    reference: 'AWS-AUG',
    paymentDate: '15 Aug 2026',
    submittedBy: 'Rohit Sharma',
    status: 'Failed',
    failureReason: 'Beneficiary account validation failed',
    createdAt: '15 Aug 2026, 11:00 AM',
  },
  {
    id: 'pay_06',
    paymentId: 'PAY-2026-0814-006',
    type: 'vendor',
    typeLabel: 'Vendor Payment',
    beneficiaryName: 'Office Rent — BKC',
    debitAccountId: 'acc_corp_op_01',
    debitAccountLabel: 'Operating Account ••••4582',
    amount: 150000,
    charges: 30,
    totalDebit: 150030,
    purpose: 'Office Rent',
    reference: 'RENT-AUG',
    paymentDate: '14 Aug 2026',
    submittedBy: 'Rahul Sharma',
    rejectedBy: 'Amit Verma',
    rejectionReason: 'Invoice details require correction.',
    status: 'Rejected',
    createdAt: '14 Aug 2026, 02:20 PM',
  },
];

export const CORPORATE_PAYMENT_TEMPLATES: CorporatePaymentTemplate[] = [
  {
    id: 'tpl_01',
    name: 'Monthly Office Rent',
    type: 'vendor',
    beneficiaryName: 'Office Rent — BKC',
    beneficiaryId: 'ben_corp_rent',
    amount: 150000,
    purpose: 'Office Rent',
    reference: 'RENT-MONTHLY',
    debitAccountId: 'acc_corp_op_01',
  },
  {
    id: 'tpl_02',
    name: 'AWS Cloud Hosting',
    type: 'vendor',
    beneficiaryName: 'Amazon Web Services India Pvt Ltd',
    beneficiaryId: 'ben_corp_01',
    amount: 825000,
    purpose: 'Cloud Infrastructure',
    reference: 'AWS-MONTHLY',
    debitAccountId: 'acc_corp_op_01',
  },
];

export const CORPORATE_SCHEDULED_PAYMENTS: CorporateScheduledPayment[] = [
  {
    id: 'sch_01',
    name: 'Payroll',
    beneficiaryName: 'Salary Batch',
    amount: 845000,
    scheduledDate: '25 Aug 2026',
    frequency: 'Monthly',
    status: 'Scheduled',
    debitAccountId: 'acc_corp_pay_02',
  },
  {
    id: 'sch_02',
    name: 'Office Rent',
    beneficiaryName: 'Office Rent — BKC',
    amount: 150000,
    scheduledDate: '28 Aug 2026',
    frequency: 'Monthly',
    status: 'Scheduled',
    debitAccountId: 'acc_corp_op_01',
  },
  {
    id: 'sch_03',
    name: 'Vendor Settlement',
    beneficiaryName: 'Vendor Settlement',
    amount: 225000,
    scheduledDate: '30 Aug 2026',
    frequency: 'Once',
    status: 'Scheduled',
    debitAccountId: 'acc_corp_op_01',
  },
];

export const CORPORATE_PAYMENT_DRAFTS: CorporatePaymentDraft[] = [
  {
    id: 'drf_01',
    label: 'ABC Suppliers Payment',
    type: 'vendor',
    beneficiaryName: 'ABC Suppliers Ltd.',
    amount: 250000,
    status: 'Draft',
    updatedAt: 'Today, 08:15 AM',
    form: {
      ...DEFAULT_PAYMENT_FORM,
      paymentType: 'vendor',
      beneficiaryId: 'ben_corp_abc',
      amount: '250000',
      purpose: 'Vendor Invoice',
      invoiceNumber: 'INV-2026-4582',
    },
  },
];

export const PAYMENT_TYPE_OPTIONS = [
  { id: 'internal' as const, label: 'Internal Transfer', description: 'Between company accounts', roles: ['maker', 'checker', 'admin'] },
  { id: 'bank_transfer' as const, label: 'Bank Transfer', description: 'External beneficiary transfer', roles: ['maker', 'checker', 'admin'] },
  { id: 'vendor' as const, label: 'Vendor Payment', description: 'Approved supplier payment', roles: ['maker', 'checker', 'admin'] },
  { id: 'payroll' as const, label: 'Salary / Payroll', description: 'Salary payment batches', roles: ['maker', 'checker', 'admin'] },
  { id: 'tax' as const, label: 'Tax / Government Payment', description: 'Statutory obligations', roles: ['checker', 'admin'] },
  { id: 'scheduled' as const, label: 'Scheduled Payment', description: 'Future-dated payment', roles: ['maker', 'checker', 'admin'] },
];

export const getPaymentRole = (role?: string): 'maker' | 'checker' | 'admin' => {
  if (!role) return 'checker';
  const r = role.toLowerCase();
  if (r.includes('maker') || r.includes('initiator')) return 'maker';
  if (r.includes('admin') || r.includes('cfo') || r.includes('checker') || r.includes('approver') || r.includes('finance')) return 'checker';
  return 'maker';
};

export const calcTotalDebit = (amount: number, type: string): number => {
  if (type === 'internal') return amount;
  return amount + CORPORATE_PAYMENT_CHARGES.bankCharges + CORPORATE_PAYMENT_CHARGES.tax;
};
