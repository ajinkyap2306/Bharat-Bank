export type BankingType = 'retail' | 'corporate';

export type AuthScreen = 
  | 'splash'
  | 'welcome'
  | 'type_select'
  | 'login'
  | 'otp'
  | 'device_verify'
  | 'biometric'
  | 'login_success';

export type RetailTab = 
  | 'home'
  | 'accounts'
  | 'transfers'
  | 'payments'
  | 'cards'
  | 'bills'
  | 'deposits'
  | 'loans'
  | 'investments'
  | 'insurance'
  | 'services'
  | 'beneficiaries'
  | 'statements'
  | 'profile'
  | 'cheque'
  | 'epassbook'
  | 'estatement'
  | 'locator'
  | 'nach'
  | 'nominee'
  | 'scheduled'
  | 'request-money'
  | 'open-account'
  | 'cardless'
  | 'govt-savings'
  | 'form-15g'
  | 'remittance'
  | 'forex-card'
  | 'branch-appointment'
  | 'rewards'
  | 'locker'
  | 'loan-closure-cert'
  | 'bonds'
  | 'demat'
  | 'feedback';

export type CorporateTab = 
  | 'home'
  | 'accounts'
  | 'payments'
  | 'approvals'
  | 'more'
  | 'beneficiaries'
  | 'bulk_payments'
  | 'payroll'
  | 'collections'
  | 'cards'
  | 'reports'
  | 'users'
  | 'security'
  | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: BankingType;
  customerNumber: string;
  kycStatus: 'verified' | 'pending' | 'action_required';
  lastLogin: string;
  role?: string; // For corporate (e.g. "Chief Financial Officer (Admin/Checker)")
  companyName?: string; // For corporate
  cin?: string;
  gstin?: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  accountType: 'Savings' | 'Current' | 'Fixed Deposit' | 'Salary' | 'NRE Savings' | 'Overdraft' | 'BDD' | 'Operating' | 'Escrow' | 'Payroll' | 'Collection' | 'Forex';
  balance: number;
  availableBalance: number;
  currency: string;
  ifsc: string;
  branch: string;
  nickname?: string;
  status: 'active' | 'frozen' | 'dormant';
  interestRate?: number;
  holdAmount?: number;
  nominees?: {
    name: string;
    relationship: string;
    allocation: number;
    dateOfBirth?: string;
  }[];
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'transfer' | 'bill' | 'shopping' | 'salary' | 'investment' | 'vendor' | 'tax' | 'payroll' | 'collection' | 'refund';
  description: string;
  counterpartyName: string;
  counterpartyAccount?: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMode: 'UPI' | 'NEFT' | 'RTGS' | 'IMPS' | 'Card' | 'Internal' | 'Bulk';
  remarks?: string;
  receiptUrl?: string;
  balanceAfter?: number;
}

export interface TransferRepeatPayload {
  beneficiaryName: string;
  beneficiaryAccount?: string;
  bankName?: string;
  amount: number;
  mode: Transaction['paymentMode'];
  remarks?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  maskedAccount: string;
  bankName: string;
  ifsc: string;
  type: 'retail_internal' | 'retail_other' | 'upi' | 'corporate_vendor' | 'corporate_employee';
  transferLimit: number;
  coolingPeriodEnds?: string;
  status: 'active' | 'pending_approval' | 'rejected' | 'blocked';
  nickname?: string;
  email?: string;
  phone?: string;
  isFavourite?: boolean;
  addedDate?: string;
}

export interface Statement {
  id: string;
  accountId: string;
  period: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  downloadUrl?: string;
}

export interface PaymentApproval {
  id: string;
  batchId?: string;
  title: string;
  amount: number;
  debitAccount: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  bankName: string;
  ifsc: string;
  paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'Internal' | 'Bulk';
  initiatedBy: string;
  initiatedAt: string;
  category: 'Vendor Payout' | 'Tax Payment' | 'Salary Batch' | 'Utility' | 'Foreign Remittance';
  status: 'pending' | 'approved' | 'rejected';
  requiredApprovals: number;
  currentApprovals: number;
  rejectionReason?: string;
  approvedBy?: string[];
  notes?: string;
}

export interface CardReplacementRequest {
  requestId: string;
  cardId: string;
  reason: 'Expired' | 'Damaged' | 'Lost' | 'Stolen' | 'Name Change';
  cardType: string;
  deliveryAddress: string;
  requestDate: string;
  expectedDelivery: string;
  fee: number;
  status: 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered';
  trackingNumber?: string;
  courierName?: string;
}

export interface CardSecurityAlert {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  location: string;
  timestamp: string;
  flagReason: string;
  status: 'pending_review' | 'confirmed_legit' | 'fraud_reported';
}

export interface CardTransaction {
  id: string;
  cardId: string;
  merchant: string;
  merchantCategory: 'Dining' | 'E-Commerce' | 'Travel' | 'Electronics' | 'Groceries' | 'ATM Withdrawal' | 'Fuel' | 'Entertainment' | 'Refund' | 'Subscription';
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'reversed' | 'refunded';
  paymentMethod: 'Online' | 'POS' | 'Contactless' | 'ATM' | 'International';
  referenceNumber: string;
  authCode: string;
  currency?: string;
  city?: string;
  iconName?: string;
}

export interface CreditDebitCard {
  id: string;
  cardNumber: string;
  maskedNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  cardType: 'debit' | 'credit' | 'corporate';
  network: 'Visa' | 'Mastercard' | 'RuPay';
  tier: 'Platinum' | 'Signature' | 'Infinite' | 'Business Prime' | 'Titanium' | 'Select';
  isFrozen: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  status?: 'active' | 'frozen' | 'blocked';
  totalLimit?: number;
  availableLimit?: number;
  outstandingBalance?: number;
  minAmountDue?: number;
  dueDate?: string;
  linkedAccountId?: string;
  linkedAccountMasked?: string;
  dailyDomesticLimit: number;
  dailyInternationalLimit: number;
  dailyAtmLimit?: number;
  dailyPosLimit?: number;
  dailyOnlineLimit?: number;
  maxAtmLimit?: number;
  maxPosLimit?: number;
  maxOnlineLimit?: number;
  maxInternationalLimit?: number;
  onlineTxnEnabled: boolean;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  atmEnabled: boolean;
  posTxnEnabled?: boolean;
  rewardsPoints: number;
  department?: string; // For corporate cards
  replacementRequest?: CardReplacementRequest;
}

export interface DepositTransaction {
  id: string;
  depositId: string;
  type: 'Interest' | 'Opening' | 'Closure' | 'Renewal' | 'Installment';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending';
}

export interface FixedDeposit {
  id: string;
  fdNumber: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  payoutFrequency: 'Monthly' | 'Quarterly' | 'On Maturity';
  autoRenew: boolean;
  linkedAccount: string;
  status: 'active' | 'matured' | 'closed';
  maturityInstruction: 'Renew Principal + Interest' | 'Renew Principal Only' | 'Transfer to Account';
}

export interface RecurringDeposit {
  id: string;
  rdNumber: string;
  monthlyAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  estimatedMaturityAmount: number;
  totalInvested: number;
  linkedAccount: string;
  status: 'active' | 'matured' | 'closed';
  nextInstallmentDate: string;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  type: 'Health' | 'Life' | 'Motor' | 'Travel';
  provider: string;
  planName: string;
  coverageAmount: number;
  premiumAmount: number;
  premiumFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
  startDate: string;
  expiryDate: string;
  status: 'active' | 'payment_due' | 'expiring_soon' | 'expired' | 'claim_in_progress';
  nominee?: {
    name: string;
    relationship: string;
    allocation: number;
  }[];
  documents?: {
    name: string;
    url: string;
  }[];
}

export interface InsurancePlan {
  id: string;
  type: 'Health' | 'Life' | 'Motor' | 'Travel';
  provider: string;
  name: string;
  description: string;
  coverageRange: string;
  startingPremium: number;
  keyBenefits: string[];
  exclusions: string[];
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyType: string;
  claimType: string;
  incidentDate: string;
  description: string;
  estimatedAmount: number;
  status: 'submitted' | 'docs_required' | 'under_review' | 'approved' | 'rejected' | 'settlement_processing' | 'settled';
  submissionDate: string;
  timeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

export interface EmiScheduleItem {
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: 'paid' | 'upcoming' | 'overdue';
}

export interface LoanAccount {
  id: string;
  loanNumber: string;
  type: 'Home Loan' | 'Personal Loan' | 'Vehicle Loan' | 'Education Loan' | 'Business Term Loan';
  sanctionedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  emiAmount: number;
  nextEmiDate: string;
  tenureRemainingMonths: number;
  totalTenureMonths: number;
  status: 'active' | 'closed';
  disbursementDate?: string;
  linkedAccountId?: string;
  processingFee?: number;
  emiSchedule?: EmiScheduleItem[];
}

export interface InvestmentItem {
  id: string;
  fundName: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Index';
  investedAmount: number;
  currentValue: number;
  returnsPercentage: number;
  sipAmount?: number;
  sipDate?: number;
  nav: number;
  units: number;
  rating: number;
}

export interface Biller {
  id: string;
  name: string;
  nickname?: string;
  category: 'electricity' | 'water' | 'gas' | 'mobile' | 'broadband' | 'dth' | 'insurance' | 'fastag' | 'credit_card' | 'education' | 'municipal';
  consumerNumber: string;
  customerName?: string;
  serviceArea?: string;
  providerId?: string;
  lastBilledAmount?: number;
  dueDate?: string;
  lastPaymentDate?: string;
  billStatus?: 'due' | 'overdue' | 'paid';
  isAutoPay: boolean;
  autoPayRule?: 'full' | 'max_amount';
  autoPayMaxAmount?: number;
  iconName: string;
}

export interface CorporateEmployee {
  id: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  salary: number;
  accountNumber: string;
  ifsc: string;
  status: 'active' | 'on_leave';
}

export interface CorporateUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Checker / Approver' | 'Maker / Initiator' | 'Auditor';
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  permissions: string[];
}

export interface SecurityLog {
  id: string;
  event: string;
  ip: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'warning' | 'failed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'transaction' | 'approval' | 'offer';
  read: boolean;
}

export interface Statement {
  id: string;
  accountId: string;
  period: string;
  startDate: string;
  endDate: string;
  downloadUrl?: string;
}
