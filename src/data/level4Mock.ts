export interface ScheduledTransfer {
  id: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  bankName: string;
  amount: number;
  mode: 'IMPS' | 'NEFT' | 'RTGS' | 'Internal';
  frequency: 'once' | 'weekly' | 'monthly';
  scheduledDate: string;
  nextExecution: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  remarks?: string;
  fromAccountLabel: string;
}

export interface MoneyRequest {
  id: string;
  counterpartyName: string;
  counterpartyUpi: string;
  amount: number;
  note: string;
  status: 'pending' | 'paid' | 'declined' | 'expired';
  createdAt: string;
  direction: 'sent' | 'received';
}

export interface CardlessWithdrawal {
  id: string;
  amount: number;
  otp: string;
  expiresAt: string;
  atmHint: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  accountLabel: string;
}

export interface ActivityEvent {
  id: string;
  category: 'login' | 'transfer' | 'profile' | 'security' | 'payment' | 'deposit';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

export interface RetailTransactionLimits {
  impsDaily: number;
  neftDaily: number;
  rtgsDaily: number;
  upiDaily: number;
  beneficiaryAddDaily: number;
  cardlessDaily: number;
}

export const DEFAULT_RETAIL_LIMITS: RetailTransactionLimits = {
  impsDaily: 200000,
  neftDaily: 500000,
  rtgsDaily: 2000000,
  upiDaily: 100000,
  beneficiaryAddDaily: 5,
  cardlessDaily: 10000,
};

export const INITIAL_SCHEDULED_TRANSFERS: ScheduledTransfer[] = [
  {
    id: 'sch_1',
    beneficiaryName: 'Priya Sharma',
    beneficiaryAccount: '501009182901',
    bankName: 'HDFC Bank',
    amount: 15000,
    mode: 'IMPS',
    frequency: 'monthly',
    scheduledDate: '05 of every month',
    nextExecution: '05 Sep 2026',
    status: 'active',
    remarks: 'Rent',
    fromAccountLabel: 'Savings •••• 0012',
  },
  {
    id: 'sch_2',
    beneficiaryName: 'Rahul Verma',
    beneficiaryAccount: '409288112233',
    bankName: 'Bharat Co-operative Bank',
    amount: 5000,
    mode: 'Internal',
    frequency: 'weekly',
    scheduledDate: 'Every Monday',
    nextExecution: '25 Aug 2026',
    status: 'active',
    fromAccountLabel: 'Savings •••• 0012',
  },
  {
    id: 'sch_3',
    beneficiaryName: 'Sneha Mehta',
    beneficiaryAccount: '55556666909033',
    bankName: 'ICICI Bank',
    amount: 25000,
    mode: 'NEFT',
    frequency: 'once',
    scheduledDate: '01 Sep 2026',
    nextExecution: '01 Sep 2026',
    status: 'paused',
    fromAccountLabel: 'Current •••• 9943',
  },
];

export const INITIAL_MONEY_REQUESTS: MoneyRequest[] = [
  {
    id: 'mr_1',
    counterpartyName: 'Amit Kumar',
    counterpartyUpi: 'amit@okaxis',
    amount: 2500,
    note: 'Dinner split',
    status: 'pending',
    createdAt: 'Today, 2:15 PM',
    direction: 'received',
  },
  {
    id: 'mr_2',
    counterpartyName: 'Neha Patel',
    counterpartyUpi: 'neha@apex',
    amount: 1200,
    note: 'Cab fare',
    status: 'pending',
    createdAt: 'Yesterday, 6:40 PM',
    direction: 'sent',
  },
  {
    id: 'mr_3',
    counterpartyName: 'Rohit Singh',
    counterpartyUpi: 'rohit@ybl',
    amount: 800,
    note: 'Snacks',
    status: 'paid',
    createdAt: '18 Aug, 11:20 AM',
    direction: 'received',
  },
];

export const INITIAL_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'act_1',
    category: 'login',
    title: 'Successful Login',
    description: 'iPhone 15 Pro • Mumbai, MH',
    timestamp: 'Today, 9:12 AM',
    status: 'success',
  },
  {
    id: 'act_2',
    category: 'transfer',
    title: 'IMPS Transfer',
    description: '₹5,000 to Priya Sharma',
    timestamp: 'Today, 10:45 AM',
    status: 'success',
  },
  {
    id: 'act_3',
    category: 'security',
    title: 'MPIN Verified',
    description: 'Transaction authentication for bill payment',
    timestamp: 'Yesterday, 4:30 PM',
    status: 'info',
  },
  {
    id: 'act_4',
    category: 'profile',
    title: 'Nominee Updated',
    description: 'Savings •••• 0012 nominee amended',
    timestamp: '17 Aug, 3:15 PM',
    status: 'success',
  },
  {
    id: 'act_5',
    category: 'payment',
    title: 'BBPS Bill Paid',
    description: 'BSES Electricity ₹2,450',
    timestamp: '16 Aug, 8:00 AM',
    status: 'success',
  },
  {
    id: 'act_6',
    category: 'deposit',
    title: 'RD Installment',
    description: '₹5,000 credited to RD •••• 8821',
    timestamp: '05 Aug, 6:00 AM',
    status: 'success',
  },
  {
    id: 'act_7',
    category: 'login',
    title: 'Failed Login Attempt',
    description: 'Unknown device • blocked after 3 tries',
    timestamp: '03 Aug, 11:55 PM',
    status: 'warning',
  },
];

export const OPEN_ACCOUNT_TYPES = [
  { id: 'savings', label: 'Savings Account', rate: '3.50% p.a.', minBalance: 1000 },
  { id: 'current', label: 'Current Account', rate: 'Business banking', minBalance: 10000 },
  { id: 'nre-savings', label: 'NRE Savings', rate: '4.25% p.a.', minBalance: 5000 },
] as const;

export function generateCardlessOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
