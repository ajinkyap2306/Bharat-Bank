import { PreLoginLocator } from './preLoginMock';

export interface LoanClosureCertificateRequest {
  id: string;
  loanId: string;
  loanNumber: string;
  loanType: string;
  requestedOn: string;
  status: 'processing' | 'ready';
  reference: string;
}

export interface BondOffering {
  id: string;
  name: string;
  category: 'corporate' | 'gsec' | 'sgb';
  couponRate: number;
  maturityYears: number;
  minInvestment: number;
  rating?: string;
  isin: string;
}

export interface BondHolding {
  id: string;
  bondId: string;
  bondName: string;
  category: BondOffering['category'];
  investedAmount: number;
  units: number;
  couponRate: number;
  maturityDate: string;
  purchasedOn: string;
}

export interface DematAccount {
  id: string;
  dpId: string;
  clientId: string;
  status: 'active' | 'pending';
  linkedAccountLabel: string;
  openedOn?: string;
}

export interface FeedbackSubmission {
  id: string;
  category: string;
  rating: number;
  message: string;
  submittedOn: string;
  reference: string;
  status: 'submitted' | 'acknowledged';
}

export const INITIAL_LOAN_CLOSURE_REQUESTS: LoanClosureCertificateRequest[] = [
  {
    id: 'lcc_1',
    loanId: 'loan_02',
    loanNumber: 'PL-APEX-8810245',
    loanType: 'Personal Loan',
    requestedOn: '02 Aug 2026',
    status: 'ready',
    reference: 'LCC-2026-4410',
  },
];

export const INITIAL_BOND_HOLDINGS: BondHolding[] = [
  {
    id: 'bh_1',
    bondId: 'bond_gsec_7yr',
    bondName: '7.18% GOI Savings Bond 2033',
    category: 'gsec',
    investedAmount: 100000,
    units: 100,
    couponRate: 7.18,
    maturityDate: '15 Dec 2033',
    purchasedOn: '10 Jan 2026',
  },
];

export const BOND_OFFERINGS: BondOffering[] = [
  {
    id: 'bond_gsec_7yr',
    name: '7.18% GOI Savings Bond 2033',
    category: 'gsec',
    couponRate: 7.18,
    maturityYears: 7,
    minInvestment: 1000,
    rating: 'Sovereign',
    isin: 'IN0020230045',
  },
  {
    id: 'bond_gsec_10yr',
    name: '7.26% GOI Bond 2036',
    category: 'gsec',
    couponRate: 7.26,
    maturityYears: 10,
    minInvestment: 1000,
    rating: 'Sovereign',
    isin: 'IN0020240088',
  },
  {
    id: 'bond_sgb_2026',
    name: 'Sovereign Gold Bond Series IV',
    category: 'sgb',
    couponRate: 2.5,
    maturityYears: 8,
    minInvestment: 5000,
    isin: 'IN002026SGB4',
  },
  {
    id: 'bond_corp_aaa',
    name: 'Bharat Infra AAA Corporate Bond',
    category: 'corporate',
    couponRate: 8.65,
    maturityYears: 5,
    minInvestment: 10000,
    rating: 'AAA',
    isin: 'INE882B07012',
  },
  {
    id: 'bond_corp_aa',
    name: 'Metro Power AA+ Debenture',
    category: 'corporate',
    couponRate: 9.1,
    maturityYears: 3,
    minInvestment: 10000,
    rating: 'AA+',
    isin: 'INE441M08021',
  },
];

export const INITIAL_DEMAT_ACCOUNT: DematAccount | null = null;

export const INITIAL_FEEDBACK: FeedbackSubmission[] = [
  {
    id: 'fb_1',
    category: 'Mobile App',
    rating: 5,
    message: 'UPI transfers are very smooth.',
    submittedOn: '05 Aug 2026',
    reference: 'FB-2026-8821',
    status: 'acknowledged',
  },
];

export const CDM_LOCATORS: PreLoginLocator[] = [
  {
    id: 'cdm_1',
    name: 'BKC Cash Deposit Machine',
    address: 'G Block, Bandra Kurla Complex, Mumbai 400051',
    distance: '0.3 km',
    hours: '24x7',
    services: ['Cash Deposit', 'Note Count', 'Receipt Print'],
  },
  {
    id: 'cdm_2',
    name: 'Andheri West CDM',
    address: 'SV Road, Andheri West, Mumbai 400058',
    distance: '2.0 km',
    hours: '6:00 AM – 11:00 PM',
    services: ['Cash Deposit', 'Account Credit'],
  },
  {
    id: 'cdm_3',
    name: 'Powai Hiranandani CDM',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    distance: '4.6 km',
    hours: '24x7',
    services: ['Cash Deposit', 'Mini Statement'],
  },
  {
    id: 'cdm_4',
    name: 'Fort Branch CDM',
    address: 'D N Road, Fort, Mumbai 400001',
    distance: '8.2 km',
    hours: 'Mon–Sat, 8:00 AM – 8:00 PM',
    services: ['Cash Deposit', 'Cheque Drop'],
  },
];

export const FEEDBACK_CATEGORIES = [
  'Mobile App',
  'Branch Experience',
  'Customer Support',
  'Cards & Payments',
  'Loans & Deposits',
  'Other',
];
