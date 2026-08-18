import { EmiScheduleItem, LoanAccount } from '../../../types/banking';

export type LoanCategoryType = 'Personal Loan' | 'Home Loan' | 'Vehicle Loan' | 'Education Loan';

export interface LoanTypeInfo {
  id: LoanCategoryType;
  title: string;
  shortDesc: string;
  tagline: string;
  interestRateStart: number;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  defaultTenureMonths: number;
  processingFeePercent: number;
  minProcessingFee: number;
  highlights: string[];
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    minCreditScore: number;
    employmentType: string;
  };
  requiredDocs: string[];
  color: string;
  bgGradient: string;
}

export const LOAN_TYPES_CONFIG: Record<LoanCategoryType, LoanTypeInfo> = {
  'Personal Loan': {
    id: 'Personal Loan',
    title: 'Personal Loan',
    shortDesc: 'Instant digital funds for weddings, medical emergencies, travel, or renovations.',
    tagline: 'Zero Collateral • 100% Paperless • 10 Min Sanction',
    interestRateStart: 10.49,
    minAmount: 50000,
    maxAmount: 4000000,
    defaultAmount: 500000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    defaultTenureMonths: 36,
    processingFeePercent: 1.0,
    minProcessingFee: 1500,
    highlights: [
      'Disbursed within 15 minutes of approval',
      'No collateral or guarantor required',
      'Flexible repayment tenure up to 5 years',
      'Zero prepayment penalty after 6 EMIs'
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 58,
      minIncome: 25000,
      minCreditScore: 700,
      employmentType: 'Salaried / Self-Employed'
    },
    requiredDocs: ['Identity Proof (PAN)', 'Address Proof (Aadhaar)', '3 Months Salary Slips', '6 Months Bank Statement'],
    color: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent'
  },
  'Home Loan': {
    id: 'Home Loan',
    title: 'Home Loan',
    shortDesc: 'Turn your dream home into reality with our lowest interest rates and flexible tenures.',
    tagline: 'Lowest Rate • Tax Benefits u/s 80C & 24b • Up to 30 Years',
    interestRateStart: 8.40,
    minAmount: 500000,
    maxAmount: 50000000,
    defaultAmount: 3500000,
    minTenureMonths: 60,
    maxTenureMonths: 360,
    defaultTenureMonths: 240,
    processingFeePercent: 0.35,
    minProcessingFee: 5000,
    highlights: [
      'Up to 90% property value financing',
      'PMAY subsidy benefits applicable',
      'Doorstep legal & technical valuation',
      'Zero charges on floating rate part-prepayment'
    ],
    eligibilityCriteria: {
      minAge: 23,
      maxAge: 65,
      minIncome: 35000,
      minCreditScore: 720,
      employmentType: 'Salaried / Self-Employed Professional'
    },
    requiredDocs: ['PAN Card', 'Aadhaar / Passport', 'Form 16 / ITR of 2 Years', '6 Months Bank Statement', 'Property Title Deeds'],
    color: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent'
  },
  'Vehicle Loan': {
    id: 'Vehicle Loan',
    title: 'Vehicle Loan',
    shortDesc: 'Drive home your dream car or two-wheeler with 100% on-road funding and instant sanction.',
    tagline: '100% On-Road Funding • Instant Sanction • Low EMI',
    interestRateStart: 8.75,
    minAmount: 100000,
    maxAmount: 5000000,
    defaultAmount: 800000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    defaultTenureMonths: 60,
    processingFeePercent: 0.5,
    minProcessingFee: 2500,
    highlights: [
      'Up to 100% financing on ex-showroom & on-road price',
      'Pre-approved offers with zero documentation',
      'Special discounted rates for Electric Vehicles (EV)',
      'Tie-ups with 2,500+ certified dealer showrooms'
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 60,
      minIncome: 20000,
      minCreditScore: 680,
      employmentType: 'Salaried / Business'
    },
    requiredDocs: ['PAN Card', 'Driving License / Aadhaar', '3 Months Salary Slip', 'Dealer Proforma Invoice'],
    color: 'from-amber-600 to-orange-600',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent'
  },
  'Education Loan': {
    id: 'Education Loan',
    title: 'Education Loan',
    shortDesc: 'Fund global & premier Indian higher education including tuition, housing, and study materials.',
    tagline: 'Moratorium Period • 100% Study Cost • Tax Benefit u/s 80E',
    interestRateStart: 9.25,
    minAmount: 200000,
    maxAmount: 15000000,
    defaultAmount: 1500000,
    minTenureMonths: 24,
    maxTenureMonths: 180,
    defaultTenureMonths: 84,
    processingFeePercent: 0.75,
    minProcessingFee: 3000,
    highlights: [
      'Covers tuition fees, living expenses, laptop & airfare',
      'Moratorium period: Course duration + 1 year after graduation',
      '100% income tax deduction on interest under Section 80E',
      'Quick sanction for top 500 global QS-ranked universities'
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 35,
      minIncome: 30000,
      minCreditScore: 680,
      employmentType: 'Student + Co-Borrower (Parent/Guardian)'
    },
    requiredDocs: ['Student KYC & Admission Letter', 'Fee Structure Breakdown', 'Co-borrower KYC & 6 Months Bank Statement', 'Academic Transcripts'],
    color: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent'
  }
};

export interface ApplicantPersonalDetails {
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  panNumber: string;
  aadhaarNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  residenceType: 'Owned' | 'Rented' | 'Parental';
  yearsAtAddress: number;
}

export interface ApplicantEmploymentDetails {
  employmentType: 'Salaried' | 'Self-Employed Professional' | 'Business Owner';
  employerName: string;
  designation: string;
  monthlyNetIncome: number;
  totalWorkExperienceYears: number;
  currentCompanyExperienceYears: number;
  existingMonthlyEmis: number;
  salaryBank: string;
}

export interface UploadedDocument {
  id: string;
  type: 'identity' | 'address' | 'income' | 'bank_statement' | 'employment';
  name: string;
  requiredFor: string;
  status: 'not_uploaded' | 'uploading' | 'uploaded' | 'verified' | 'failed';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  previewUrl?: string;
}

export interface LoanApplicationState {
  // Step identification
  loanType: LoanCategoryType;
  requestedAmount: number;
  tenureMonths: number;
  interestRate: number;
  calculatedEmi: number;
  processingFee: number;
  totalInterest: number;
  totalRepayment: number;

  // Eligibility & Underwriting
  isEligible: boolean;
  eligibleAmount: number;
  eligibleRate: number;
  cibilScore: number;
  eligibilityReason?: string;

  // Applicant Profile
  personal: ApplicantPersonalDetails;
  employment: ApplicantEmploymentDetails;
  documents: UploadedDocument[];

  // Processing & State
  applicationId: string;
  submittedAt: string;
  currentStatus: 'submitted' | 'under_review' | 'docs_verified' | 'approved' | 'agreement_signed' | 'disbursed';
  disbursementAccount: string;
  authMethod: 'mpin' | 'otp' | 'biometric';
  eSignCompleted: boolean;
  eSignTimestamp?: string;
  disbursementRef?: string;
}

export const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc_id',
    type: 'identity',
    name: 'Identity Proof (PAN Card)',
    requiredFor: 'KYC & CIBIL Verification',
    status: 'uploaded',
    fileName: 'PAN_CARD_PRAYAAS.pdf',
    fileSize: '1.2 MB',
    uploadedAt: 'Verified via NSDL'
  },
  {
    id: 'doc_addr',
    type: 'address',
    name: 'Address Proof (Aadhaar / Utility)',
    requiredFor: 'Residence Verification',
    status: 'uploaded',
    fileName: 'AADHAAR_CARD_OFFICIAL.pdf',
    fileSize: '2.4 MB',
    uploadedAt: 'Verified via UIDAI'
  },
  {
    id: 'doc_income',
    type: 'income',
    name: 'Income Proof (3 Months Salary Slips)',
    requiredFor: 'Income & Debt-to-Income Calculation',
    status: 'not_uploaded'
  },
  {
    id: 'doc_stmt',
    type: 'bank_statement',
    name: 'Bank Statement (Last 6 Months)',
    requiredFor: 'Cashflow & Banking History',
    status: 'not_uploaded'
  },
  {
    id: 'doc_emp',
    type: 'employment',
    name: 'Employment Proof (Work ID / Offer)',
    requiredFor: 'Corporate Employment Check',
    status: 'not_uploaded'
  }
];

export const INITIAL_APPLICATION_STATE: LoanApplicationState = {
  loanType: 'Personal Loan',
  requestedAmount: 500000,
  tenureMonths: 36,
  interestRate: 10.49,
  calculatedEmi: 16252,
  processingFee: 5000,
  totalInterest: 85072,
  totalRepayment: 585072,

  isEligible: true,
  eligibleAmount: 1200000,
  eligibleRate: 10.49,
  cibilScore: 785,

  personal: {
    fullName: 'Priya Sharma',
    dob: '1992-07-14',
    gender: 'Female',
    mobile: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    panNumber: 'ABCPS1234F',
    aadhaarNumber: 'XXXX XXXX 8912',
    addressLine1: 'B-402, Skyline Residency, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    residenceType: 'Owned',
    yearsAtAddress: 4
  },

  employment: {
    employmentType: 'Salaried',
    employerName: 'Google India Pvt Ltd',
    designation: 'Senior Product Lead',
    monthlyNetIncome: 145000,
    totalWorkExperienceYears: 8,
    currentCompanyExperienceYears: 3,
    existingMonthlyEmis: 12000,
    salaryBank: 'Bharat Co-operative Bank'
  },

  documents: INITIAL_DOCUMENTS,

  applicationId: 'BCB-LN-2026-' + Math.floor(10000 + Math.random() * 90000),
  submittedAt: 'Today',
  currentStatus: 'submitted',
  disbursementAccount: '•••• •••• 0012 (Savings A/C)',
  authMethod: 'mpin',
  eSignCompleted: false
};

// Calculate EMI helper
export function calculateEmi(amount: number, annualRate: number, tenureMonths: number): {
  emi: number;
  totalInterest: number;
  totalRepayment: number;
} {
  if (!amount || !annualRate || !tenureMonths) {
    return { emi: 0, totalInterest: 0, totalRepayment: 0 };
  }
  const monthlyRate = annualRate / 12 / 100;
  const emi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalRepayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - amount);
  return { emi, totalInterest, totalRepayment };
}

// Generate Month-by-month Amortization Schedule
export function generateEmiSchedule(
  principal: number,
  annualRate: number,
  totalTenureMonths: number,
  paidCount: number = 0
): EmiScheduleItem[] {
  const { emi } = calculateEmi(principal, annualRate, totalTenureMonths);
  const monthlyRate = annualRate / 12 / 100;
  let remaining = principal;
  const schedule: EmiScheduleItem[] = [];

  const baseDate = new Date();
  baseDate.setDate(5); // 5th of each month

  for (let i = 1; i <= totalTenureMonths; i++) {
    const interest = Math.round(remaining * monthlyRate);
    const principalPaid = Math.min(remaining, emi - interest);
    remaining = Math.max(0, remaining - principalPaid);

    const emiDate = new Date(baseDate);
    emiDate.setMonth(baseDate.getMonth() + (i - 1));
    const dateStr = emiDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    let status: 'paid' | 'upcoming' | 'overdue' = 'upcoming';
    if (i <= paidCount) {
      status = 'paid';
    } else if (i === paidCount + 1 && i === 1) {
      status = 'upcoming';
    }

    schedule.push({
      emiNumber: i,
      dueDate: dateStr,
      emiAmount: emi,
      principal: principalPaid,
      interest: interest,
      remainingBalance: remaining,
      status
    });
  }

  return schedule;
}
