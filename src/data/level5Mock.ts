export type GovtSchemeType = 'ppf' | 'ssa' | 'nps';

export interface GovtSavingsAccount {
  id: string;
  scheme: GovtSchemeType;
  accountNumber: string;
  holderLabel: string;
  balance: number;
  financialYear: string;
  annualLimit: number;
  contributedYtd: number;
}

export interface Form15GSubmission {
  id: string;
  formType: '15G' | '15H';
  financialYear: string;
  estimatedIncome: number;
  submittedOn: string;
  status: 'submitted' | 'accepted' | 'rejected';
  reference: string;
}

export interface RemittanceRequest {
  id: string;
  beneficiaryName: string;
  country: string;
  currency: string;
  amountInr: number;
  amountForeign: number;
  purpose: string;
  status: 'pending' | 'processed' | 'rejected';
  reference: string;
  createdAt: string;
  scheme: 'SWIFT' | 'LRS';
}

export interface ForexCardAccount {
  id: string;
  cardLabel: string;
  maskedNumber: string;
  status: 'active' | 'blocked' | 'pending';
  balances: { currency: string; amount: number; symbol: string }[];
}

export interface BranchAppointment {
  id: string;
  branchName: string;
  purpose: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  reference: string;
}

export interface LockerApplication {
  id: string;
  branchName: string;
  lockerSize: 'small' | 'medium' | 'large';
  annualRent: number;
  status: 'active' | 'waitlisted' | 'pending';
  lockerNumber?: string;
}

export interface BankingOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  validTill: string;
  cta: string;
}

export const INITIAL_GOVT_SAVINGS: GovtSavingsAccount[] = [
  {
    id: 'gov_ppf_1',
    scheme: 'ppf',
    accountNumber: 'PPF-88291034',
    holderLabel: 'Rahul Sharma',
    balance: 285000,
    financialYear: '2025-26',
    annualLimit: 150000,
    contributedYtd: 75000,
  },
  {
    id: 'gov_ssa_1',
    scheme: 'ssa',
    accountNumber: 'SSA-44120098',
    holderLabel: 'Aanya Sharma (Daughter)',
    balance: 142500,
    financialYear: '2025-26',
    annualLimit: 150000,
    contributedYtd: 50000,
  },
  {
    id: 'gov_nps_1',
    scheme: 'nps',
    accountNumber: 'NPS-T1-990012',
    holderLabel: 'Tier I — PRAN 123456789012',
    balance: 520000,
    financialYear: '2025-26',
    annualLimit: 200000,
    contributedYtd: 120000,
  },
];

export const INITIAL_FORM15G: Form15GSubmission[] = [
  {
    id: 'f15_1',
    formType: '15G',
    financialYear: '2024-25',
    estimatedIncome: 180000,
    submittedOn: '12 Apr 2025',
    status: 'accepted',
    reference: 'F15G-2025-8821',
  },
];

export const INITIAL_REMITTANCES: RemittanceRequest[] = [
  {
    id: 'rem_1',
    beneficiaryName: 'John Smith',
    country: 'United States',
    currency: 'USD',
    amountInr: 250000,
    amountForeign: 3000,
    purpose: 'Education',
    status: 'processed',
    reference: 'SWF88291034',
    createdAt: '10 Aug 2026',
    scheme: 'SWIFT',
  },
];

export const INITIAL_FOREX_CARDS: ForexCardAccount[] = [
  {
    id: 'fx_1',
    cardLabel: 'Travel Forex Card',
    maskedNumber: '•••• 4521',
    status: 'active',
    balances: [
      { currency: 'USD', amount: 850, symbol: '$' },
      { currency: 'EUR', amount: 320, symbol: '€' },
      { currency: 'GBP', amount: 150, symbol: '£' },
    ],
  },
];

export const INITIAL_BRANCH_APPOINTMENTS: BranchAppointment[] = [
  {
    id: 'apt_1',
    branchName: 'Bandra Kurla Complex, Mumbai',
    purpose: 'Signature update',
    date: '22 Aug 2026',
    timeSlot: '11:00 AM — 11:30 AM',
    status: 'confirmed',
    reference: 'APT-2026-4412',
  },
];

export const INITIAL_LOCKERS: LockerApplication[] = [
  {
    id: 'lck_1',
    branchName: 'Bandra Kurla Complex, Mumbai',
    lockerSize: 'medium',
    annualRent: 4500,
    status: 'active',
    lockerNumber: 'B-142',
  },
];

export const BANKING_OFFERS: BankingOffer[] = [
  { id: 'off_1', title: '5% Cashback on Bill Pay', description: 'Pay 3 utility bills and earn up to ₹500 cashback.', category: 'Bills', validTill: '31 Aug 2026', cta: 'Pay Bills' },
  { id: 'off_2', title: 'Zero Forex Markup', description: 'Load forex card with zero markup on weekends.', category: 'Forex', validTill: '15 Sep 2026', cta: 'Load Card' },
  { id: 'off_3', title: 'FD @ 7.75% p.a.', description: 'Special rate on 1-year FD for salary customers.', category: 'Deposits', validTill: '30 Sep 2026', cta: 'Open FD' },
  { id: 'off_4', title: 'Personal Loan Pre-approved', description: '₹8 Lakh pre-approved at 10.5% p.a.', category: 'Loans', validTill: '30 Sep 2026', cta: 'Apply Now' },
];

export const REWARD_CATALOG = [
  { id: 'rw_1', name: '₹500 Amazon Voucher', points: 2500 },
  { id: 'rw_2', name: '₹200 Swiggy Credit', points: 1200 },
  { id: 'rw_3', name: '1 Month Netflix', points: 3000 },
  { id: 'rw_4', name: 'Airport Lounge Access', points: 4500 },
];

export const LRS_ANNUAL_LIMIT = 2500000;
export const FX_RATES: Record<string, number> = { USD: 83.5, EUR: 90.2, GBP: 105.8, AED: 22.7 };
