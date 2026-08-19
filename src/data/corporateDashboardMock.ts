import type {
  CorporateCashFlowPoint,
  CorporateDashboardNotification,
  CorporateDashboardSummary,
  CorporateEntity,
} from '../types/corporateDashboard';

export const CORPORATE_ENTITIES: CorporateEntity[] = [
  { id: 'ent_01', name: 'Acme Technologies Pvt. Ltd.', cin: 'U72200MH2018PTC309812', isPrimary: true },
  { id: 'ent_02', name: 'Acme Services Pvt. Ltd.', cin: 'U74999MH2019PTC328441' },
  { id: 'ent_03', name: 'Acme Holdings Ltd.', cin: 'U65990MH2015PLC267102' },
];

export const CORPORATE_DASHBOARD_USER = {
  name: 'Amit',
  role: 'Finance Manager',
  lastLogin: 'Today, 10:42 AM',
};

/** @deprecated Use getCorporateDashboardData().cashPosition */
export const CORPORATE_CASH_POSITION = {
  totalBalance: 245890450,
  availableBalance: 184220000,
  todayInflow: 1245000,
  todayOutflow: 825000,
};

export const CORPORATE_CASH_FLOW: Record<'7D' | '30D' | '90D', CorporateCashFlowPoint[]> = {
  '7D': [
    { label: 'Mon', inflow: 8.2, outflow: 5.1 },
    { label: 'Tue', inflow: 12.4, outflow: 7.8 },
    { label: 'Wed', inflow: 6.5, outflow: 9.2 },
    { label: 'Thu', inflow: 15.1, outflow: 6.4 },
    { label: 'Fri', inflow: 9.8, outflow: 11.2 },
    { label: 'Sat', inflow: 3.2, outflow: 1.8 },
    { label: 'Sun', inflow: 12.5, outflow: 8.3 },
  ],
  '30D': [
    { label: 'W1', inflow: 42, outflow: 38 },
    { label: 'W2', inflow: 55, outflow: 41 },
    { label: 'W3', inflow: 48, outflow: 52 },
    { label: 'W4', inflow: 61, outflow: 44 },
  ],
  '90D': [
    { label: 'M1', inflow: 180, outflow: 165 },
    { label: 'M2', inflow: 195, outflow: 172 },
    { label: 'M3', inflow: 210, outflow: 188 },
  ],
};

export const CORPORATE_DASHBOARD_NOTIFICATIONS: CorporateDashboardNotification[] = [
  {
    id: 'cn1',
    type: 'approval',
    title: 'Approvals pending',
    description: '3 payments require your approval.',
    time: 'Today, 10:42 AM',
    read: false,
  },
  {
    id: 'cn2',
    type: 'payment',
    title: 'Payment approved',
    description: '₹2,50,000 payment to ABC Suppliers was approved.',
    time: 'Today, 09:15 AM',
    read: false,
  },
  {
    id: 'cn3',
    type: 'security',
    title: 'New device login',
    description: 'A new device signed in today at 10:42 AM.',
    time: 'Today, 10:42 AM',
    read: false,
  },
  {
    id: 'cn4',
    type: 'payroll',
    title: 'Payroll pending',
    description: 'August payroll requires your approval.',
    time: 'Yesterday, 06:30 PM',
    read: true,
  },
];

const BASE_DASHBOARD: CorporateDashboardSummary = {
  userName: CORPORATE_DASHBOARD_USER.name,
  userRole: CORPORATE_DASHBOARD_USER.role,
  greeting: 'Good morning',
  lastLogin: CORPORATE_DASHBOARD_USER.lastLogin,
  cashPosition: {
    totalBalance: 2350000,
    availableBalance: 2350000,
    todayInflow: 450000,
    todayOutflow: 375000,
  },
  accounts: [
    {
      id: 'acc_op',
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
      balance: 1245000,
      availableBalance: 1245000,
      status: 'Active',
      isPrimary: true,
    },
    {
      id: 'acc_pay',
      name: 'Payroll Account',
      maskedNumber: '•••• 7821',
      balance: 685000,
      availableBalance: 685000,
      status: 'Active',
    },
    {
      id: 'acc_col',
      name: 'Collection Account',
      maskedNumber: '•••• 3491',
      balance: 420000,
      availableBalance: 420000,
      status: 'Active',
    },
  ],
  approvalAlert: {
    requestCount: 5,
    totalAmount: 875000,
  },
  actionRequired: {
    total: 5,
    payments: 5,
    beneficiaries: 0,
    payroll: 0,
    userRequests: 0,
  },
  pendingApprovals: [
    {
      id: 'pa1',
      title: 'ABC Suppliers Ltd.',
      subtitle: 'Vendor Payment',
      amount: 250000,
      createdBy: 'Rahul Sharma',
      status: 'Pending Approval',
    },
    {
      id: 'pa2',
      title: 'August Payroll',
      subtitle: '245 Employees',
      amount: 3845000,
      employeeCount: 245,
      status: 'Pending Approval',
    },
    {
      id: 'pa3',
      title: 'Vendor Settlement',
      subtitle: 'Batch Payment',
      amount: 1450000,
      createdBy: 'Priya Nair',
      status: 'Pending Approval',
    },
  ],
  upcomingPayments: [
    {
      id: 'up1',
      title: 'August Payroll',
      amount: 845000,
      dueDate: '25 Aug 2026',
      status: 'Scheduled',
      sourceAccount: 'Operating Account •••• 4582',
    },
    { id: 'up2', title: 'Office Rent', amount: 150000, dueDate: '28 Aug', status: 'Scheduled' },
  ],
  recentTransactions: [
    {
      id: 'rt1',
      title: 'ABC Suppliers Ltd.',
      subtitle: 'Vendor Payment',
      amount: 250000,
      direction: 'debit',
      date: 'Today',
      status: 'Completed',
    },
    {
      id: 'rt2',
      title: 'XYZ Logistics',
      subtitle: 'Vendor Payment',
      amount: 125000,
      direction: 'debit',
      date: 'Yesterday',
      status: 'Completed',
    },
    {
      id: 'rt3',
      title: 'Collection Account',
      subtitle: 'Credit',
      amount: 450000,
      direction: 'credit',
      date: 'Yesterday',
      status: 'Completed',
    },
  ],
  collections: {
    todayTotal: 1845000,
    matched: 1680000,
    unmatched: 165000,
  },
  payroll: {
    id: 'pr1',
    title: 'August Payroll',
    employeeCount: 245,
    amount: 3845000,
    status: 'Pending Approval',
  },
  bulkPayments: {
    pendingBatches: 3,
  },
  securityAlert: {
    id: 'sec1',
    title: 'New device login',
    message: 'A new device signed in today at 10:42 AM.',
    timestamp: 'Today, 10:42 AM',
  },
};

const ENTITY_OVERRIDES: Record<string, Partial<CorporateDashboardSummary>> = {
  ent_02: {
    cashPosition: {
      totalBalance: 84250000,
      availableBalance: 62100000,
      todayInflow: 420000,
      todayOutflow: 310000,
    },
    approvalAlert: { requestCount: 2, totalAmount: 320000 },
    actionRequired: { total: 2, payments: 2, beneficiaries: 0, payroll: 0, userRequests: 0 },
    payroll: null,
    securityAlert: null,
  },
  ent_03: {
    cashPosition: {
      totalBalance: 156320000,
      availableBalance: 112450000,
      todayInflow: 680000,
      todayOutflow: 520000,
    },
    approvalAlert: { requestCount: 3, totalAmount: 540000 },
    actionRequired: { total: 3, payments: 3, beneficiaries: 0, payroll: 0, userRequests: 0 },
    bulkPayments: { pendingBatches: 1 },
    securityAlert: null,
  },
};

export function getCorporateDashboardData(entityId: string): CorporateDashboardSummary {
  const override = ENTITY_OVERRIDES[entityId];
  if (!override) return { ...BASE_DASHBOARD };

  return {
    ...BASE_DASHBOARD,
    ...override,
    cashPosition: override.cashPosition ?? BASE_DASHBOARD.cashPosition,
    approvalAlert: override.approvalAlert ?? BASE_DASHBOARD.approvalAlert,
    actionRequired: override.actionRequired ?? BASE_DASHBOARD.actionRequired,
    accounts: override.accounts ?? BASE_DASHBOARD.accounts,
    collections: override.collections ?? BASE_DASHBOARD.collections,
    bulkPayments: override.bulkPayments ?? BASE_DASHBOARD.bulkPayments,
  };
}

export async function fetchCorporateDashboard(
  entityId: string,
  options?: { shouldFail?: boolean }
): Promise<CorporateDashboardSummary> {
  await new Promise((r) => setTimeout(r, 700));
  if (options?.shouldFail) {
    throw new Error('Dashboard load failed');
  }
  return getCorporateDashboardData(entityId);
}
