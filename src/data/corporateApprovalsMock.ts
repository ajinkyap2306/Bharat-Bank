import {
  CorporateApprovalRequest,
  ApprovalDelegation,
  ApprovalSummary,
} from '../types/corporateApprovals';

export const APPROVER_LIMIT = 50000000;

const levels = (
  l1: { name: string; role: string; status: 'approved' | 'pending' | 'waiting'; date?: string },
  l2?: { name: string; role: string; status: 'approved' | 'pending' | 'waiting'; date?: string },
  l3?: { name: string; role: string; status: 'approved' | 'pending' | 'waiting'; date?: string }
) => {
  const arr = [
    { level: 1, role: l1.role, name: l1.name, status: l1.status, date: l1.date },
    l2 ? { level: 2, role: l2.role, name: l2.name, status: l2.status, date: l2.date } : null,
    l3 ? { level: 3, role: l3.role, name: l3.name, status: l3.status, date: l3.date } : null,
  ].filter(Boolean) as CorporateApprovalRequest['approvalLevels'];
  return arr;
};

export const CORPORATE_APPROVAL_REQUESTS: CorporateApprovalRequest[] = [
  {
    id: 'appr_01',
    requestId: 'APR-2026-0818-001',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Vendor Payment',
    title: 'ABC Suppliers Ltd.',
    amount: 250000,
    charges: 30,
    beneficiaryName: 'ABC Suppliers Ltd.',
    debitAccount: 'Operating Account ••••4582',
    paymentDate: '18 Aug 2026',
    purpose: 'Vendor Invoice',
    reference: 'INV-2026-4582',
    createdBy: 'Rahul Sharma',
    createdByRole: 'Finance Executive',
    createdAt: '18 Aug 2026 • 10:42 AM',
    status: 'pending',
    priority: 'high',
    expiresAt: 'Review by 6:00 PM',
    requiredApprovals: 2,
    currentApprovals: 1,
    approvalLevels: levels(
      { name: 'Amit Verma', role: 'Finance Manager', status: 'approved', date: '18 Aug • 11:05 AM' },
      { name: 'You', role: 'Authorized Signatory', status: 'pending' }
    ),
    timeline: [
      { id: 't1', label: 'Request Created', user: 'Rahul Sharma', date: '18 Aug', time: '10:42 AM', status: 'completed' },
      { id: 't2', label: 'Level 1 Review', user: 'Amit Verma', date: '18 Aug', time: '11:05 AM', status: 'completed' },
      { id: 't3', label: 'Level 2 Approval', user: 'You', date: '—', time: '—', status: 'pending' },
      { id: 't4', label: 'Final Processing', user: 'System', date: '—', time: '—', status: 'waiting' },
    ],
    notes: 'Office supplies invoice verified against PO-8821.',
    batchId: 'BATCH-2026-0818-A',
  },
  {
    id: 'appr_02',
    requestId: 'APR-2026-0818-002',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Tax Payment',
    title: 'Quarterly GST Remittance',
    amount: 3240000,
    charges: 30,
    beneficiaryName: 'GST Council / CBIC Revenue',
    debitAccount: 'Operating Account ••••4582',
    paymentDate: '18 Aug 2026',
    purpose: 'GSTR-3B',
    reference: 'GST-Q3-2026',
    createdBy: 'Kavita Iyer',
    createdByRole: 'Tax Manager',
    createdAt: 'Today, 09:15 AM',
    status: 'pending',
    requiredApprovals: 2,
    currentApprovals: 0,
    approvalLevels: levels(
      { name: 'Finance Manager', role: 'Level 1', status: 'pending' },
      { name: 'Authorized Signatory', role: 'Level 2', status: 'waiting' }
    ),
    timeline: [
      { id: 't5', label: 'Request Created', user: 'Kavita Iyer', date: '18 Aug', time: '09:15 AM', status: 'completed' },
      { id: 't6', label: 'Level 1 Review', user: 'Pending', date: '—', time: '—', status: 'pending' },
    ],
    notes: 'Statutory GST liability for Maharashtra & Karnataka.',
  },
  {
    id: 'appr_03',
    requestId: 'APR-2026-0818-003',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Vendor Payment',
    title: 'CtrlS Datacenters Ltd',
    amount: 1450000,
    charges: 30,
    beneficiaryName: 'CtrlS Datacenters Ltd',
    debitAccount: 'Operating Account ••••4582',
    paymentDate: '18 Aug 2026',
    purpose: 'Data Center Lease',
    reference: 'PO-4910',
    createdBy: 'Rohit Sharma',
    createdByRole: 'Finance Lead',
    createdAt: 'Today, 08:30 AM',
    status: 'pending',
    requiredApprovals: 2,
    currentApprovals: 1,
    approvalLevels: levels(
      { name: 'Priya Varma', role: 'Treasury Head', status: 'approved', date: '18 Aug • 09:00 AM' },
      { name: 'You', role: 'CFO', status: 'pending' }
    ),
    timeline: [
      { id: 't7', label: 'Request Created', user: 'Rohit Sharma', date: '18 Aug', time: '08:30 AM', status: 'completed' },
      { id: 't8', label: 'Level 1 Approved', user: 'Priya Varma', date: '18 Aug', time: '09:00 AM', status: 'completed' },
    ],
  },
  {
    id: 'appr_04',
    requestId: 'APR-2026-0818-004',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Bank Transfer',
    title: 'XYZ Logistics Pvt. Ltd.',
    amount: 125000,
    beneficiaryName: 'XYZ Logistics Pvt. Ltd.',
    debitAccount: 'Operating Account ••••4582',
    createdBy: 'Rahul Sharma',
    createdByRole: 'Finance Executive',
    createdAt: '18 Aug 2026 • 09:30 AM',
    status: 'pending',
    requiredApprovals: 1,
    currentApprovals: 0,
    approvalLevels: levels({ name: 'Finance Manager', role: 'Level 1', status: 'pending' }),
    timeline: [{ id: 't9', label: 'Request Created', user: 'Rahul Sharma', date: '18 Aug', time: '09:30 AM', status: 'completed' }],
  },
  {
    id: 'appr_05',
    requestId: 'APR-2026-0818-005',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Scheduled Payment',
    title: 'Office Rent',
    amount: 150000,
    beneficiaryName: 'Office Rent — BKC',
    debitAccount: 'Operating Account ••••4582',
    paymentDate: '28 Aug 2026',
    createdBy: 'Rahul Sharma',
    createdByRole: 'Finance Executive',
    createdAt: '17 Aug 2026 • 04:20 PM',
    status: 'pending',
    requiredApprovals: 1,
    currentApprovals: 0,
    approvalLevels: levels({ name: 'Finance Manager', role: 'Level 1', status: 'pending' }),
    timeline: [{ id: 't10', label: 'Request Created', user: 'Rahul Sharma', date: '17 Aug', time: '04:20 PM', status: 'completed' }],
  },
  {
    id: 'ben_appr_01',
    requestId: 'APR-2026-0818-006',
    category: 'beneficiary',
    categoryLabel: 'Beneficiary',
    requestType: 'New Beneficiary',
    title: 'Snowflake Data Solutions India',
    beneficiaryName: 'Snowflake Data Solutions India',
    debitAccount: 'Enterprise Vendor Master',
    createdBy: 'Rohit Sharma',
    createdByRole: 'Finance Lead',
    createdAt: 'Yesterday, 02:20 PM',
    status: 'pending',
    requiredApprovals: 1,
    currentApprovals: 0,
    approvalLevels: levels({ name: 'Finance Manager', role: 'Level 1', status: 'pending' }),
    timeline: [{ id: 't11', label: 'Beneficiary Created', user: 'Rohit Sharma', date: '17 Aug', time: '02:20 PM', status: 'completed' }],
    notes: 'Vendor GST and cancelled cheque verified.',
  },
  {
    id: 'ben_appr_02',
    requestId: 'APR-2026-0818-007',
    category: 'beneficiary',
    categoryLabel: 'Beneficiary',
    requestType: 'Bank Detail Change',
    title: 'ABC Suppliers Ltd.',
    beneficiaryName: 'ABC Suppliers Ltd.',
    createdBy: 'Rahul Sharma',
    createdByRole: 'Finance Executive',
    createdAt: '18 Aug 2026 • 08:00 AM',
    status: 'pending',
    requiredApprovals: 2,
    currentApprovals: 0,
    approvalLevels: levels(
      { name: 'Finance Manager', role: 'Level 1', status: 'pending' },
      { name: 'Authorized Signatory', role: 'Level 2', status: 'waiting' }
    ),
    timeline: [{ id: 't12', label: 'Change Requested', user: 'Rahul Sharma', date: '18 Aug', time: '08:00 AM', status: 'completed' }],
  },
  {
    id: 'pay_appr_01',
    requestId: 'APR-2026-0818-008',
    category: 'payroll',
    categoryLabel: 'Payroll',
    requestType: 'Salary Batch',
    title: 'August Payroll Batch',
    amount: 845000,
    beneficiaryName: 'Salary Batch — 48 employees',
    debitAccount: 'Payroll Account ••••7821',
    paymentDate: '25 Aug 2026',
    createdBy: 'Priya Nair',
    createdByRole: 'HR & Payroll',
    createdAt: '18 Aug 2026 • 07:30 AM',
    status: 'pending',
    priority: 'urgent',
    requiredApprovals: 2,
    currentApprovals: 0,
    approvalLevels: levels(
      { name: 'Finance Manager', role: 'Level 1', status: 'pending' },
      { name: 'CFO', role: 'Level 2', status: 'waiting' }
    ),
    timeline: [{ id: 't13', label: 'Payroll Submitted', user: 'Priya Nair', date: '18 Aug', time: '07:30 AM', status: 'completed' }],
  },
  {
    id: 'usr_appr_01',
    requestId: 'APR-2026-0818-009',
    category: 'user',
    categoryLabel: 'User Request',
    requestType: 'Role Change',
    title: 'Access Request — Kavita Iyer',
    beneficiaryName: 'Kavita Iyer',
    createdBy: 'HR Admin',
    createdByRole: 'Corporate Admin',
    createdAt: '17 Aug 2026 • 03:00 PM',
    status: 'pending',
    requiredApprovals: 1,
    currentApprovals: 0,
    approvalLevels: levels({ name: 'Corporate Admin', role: 'Level 1', status: 'pending' }),
    timeline: [{ id: 't14', label: 'User Request Created', user: 'HR Admin', date: '17 Aug', time: '03:00 PM', status: 'completed' }],
    notes: 'Requesting Checker role for tax payment approvals.',
  },
  {
    id: 'appr_hist_01',
    requestId: 'APR-2026-0817-010',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Vendor Payment',
    title: 'Amazon Web Services India',
    amount: 825000,
    beneficiaryName: 'Amazon Web Services India',
    debitAccount: 'Operating Account ••••4582',
    createdBy: 'Rohit Sharma',
    createdByRole: 'Finance Lead',
    createdAt: '17 Aug 2026 • 11:00 AM',
    status: 'approved',
    requiredApprovals: 2,
    currentApprovals: 2,
    approvalLevels: levels(
      { name: 'Amit Verma', role: 'Finance Manager', status: 'approved', date: '17 Aug' },
      { name: 'Devansh Singhania', role: 'CFO', status: 'approved', date: '17 Aug' }
    ),
    timeline: [
      { id: 't15', label: 'Request Created', user: 'Rohit Sharma', date: '17 Aug', time: '11:00 AM', status: 'completed' },
      { id: 't16', label: 'Authorization Completed', user: 'System', date: '17 Aug', time: '11:45 AM', status: 'completed' },
    ],
    approvedBy: 'Devansh Singhania',
  },
  {
    id: 'appr_hist_02',
    requestId: 'APR-2026-0816-011',
    category: 'payment',
    categoryLabel: 'Payment',
    requestType: 'Bank Transfer',
    title: 'Global Services Ltd.',
    amount: 320000,
    beneficiaryName: 'Global Services Ltd.',
    createdBy: 'Rahul Sharma',
    createdByRole: 'Finance Executive',
    createdAt: '16 Aug 2026 • 02:20 PM',
    status: 'rejected',
    requiredApprovals: 1,
    currentApprovals: 0,
    approvalLevels: levels({ name: 'Amit Verma', role: 'Finance Manager', status: 'rejected', date: '16 Aug' }),
    timeline: [
      { id: 't17', label: 'Request Created', user: 'Rahul Sharma', date: '16 Aug', time: '02:20 PM', status: 'completed' },
      { id: 't18', label: 'Rejected', user: 'Amit Verma', date: '16 Aug', time: '03:00 PM', status: 'completed', comments: 'Invoice details require correction.' },
    ],
    rejectedBy: 'Amit Verma',
    rejectionReason: 'Invoice details require correction.',
  },
];

export const APPROVAL_SUMMARY: ApprovalSummary = {
  payments: 5,
  beneficiaries: 2,
  payroll: 1,
  userRequests: 1,
  total: 9,
};

export const APPROVAL_DELEGATIONS: ApprovalDelegation[] = [
  {
    id: 'del_01',
    delegateTo: 'Rahul Sharma',
    delegateToRole: 'Finance Executive',
    startDate: '18 Aug',
    endDate: '25 Aug',
    categories: ['Payments', 'Beneficiaries'],
    status: 'active',
  },
];

export const REJECTION_REASONS = [
  'Incorrect beneficiary',
  'Incorrect amount',
  'Missing documentation',
  'Payment not authorized',
  'Duplicate request',
  'Other',
];

export const getApprovalRole = (role?: string): 'maker' | 'checker' | 'admin' => {
  if (!role) return 'checker';
  const r = role.toLowerCase();
  if (r.includes('maker') || r.includes('initiator') || r.includes('executive')) return 'maker';
  if (r.includes('admin') || r.includes('cfo') || r.includes('checker') || r.includes('approver') || r.includes('signatory') || r.includes('finance manager')) return 'checker';
  return 'maker';
};

export const isSelfApproval = (createdBy: string, userName: string): boolean =>
  createdBy.toLowerCase().includes(userName.split(' ')[0].toLowerCase());

export const exceedsLimit = (amount?: number): boolean =>
  !!amount && amount > APPROVER_LIMIT;
