import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BankingType, 
  AuthScreen, 
  RetailTab, 
  CorporateTab, 
  UserProfile, 
  BankAccount, 
  Transaction, 
  Beneficiary, 
  PaymentApproval, 
  CreditDebitCard,
  CardTransaction,
  CardReplacementRequest,
  CardSecurityAlert,
  FixedDeposit, 
  RecurringDeposit,
  InsurancePolicy,
  InsurancePlan,
  InsuranceClaim,
  DepositTransaction,
  LoanAccount, 
  InvestmentItem, 
  Biller, 
  CorporateEmployee, 
  CorporateUser, 
  SecurityLog, 
  NotificationItem,
  Statement,
  TransferRepeatPayload,
} from '../types/banking';
import {
  INITIAL_RETAIL_USER,
  INITIAL_CORPORATE_USER,
  INITIAL_RETAIL_ACCOUNTS,
  INITIAL_CORPORATE_ACCOUNTS,
  INITIAL_RETAIL_TRANSACTIONS,
  INITIAL_CORPORATE_TRANSACTIONS,
  INITIAL_CORPORATE_APPROVALS,
  INITIAL_RETAIL_BENEFICIARIES,
  INITIAL_CORPORATE_BENEFICIARIES,
  INITIAL_RETAIL_CARDS,
  INITIAL_CARD_TRANSACTIONS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_CORPORATE_CARDS,
  INITIAL_FIXED_DEPOSITS,
  INITIAL_RECURRING_DEPOSITS,
  INITIAL_INSURANCE_POLICIES,
  INITIAL_INSURANCE_PLANS,
  INITIAL_INSURANCE_CLAIMS,
  INITIAL_LOANS,
  INITIAL_INVESTMENTS,
  INITIAL_BILLERS,
  INITIAL_CORPORATE_EMPLOYEES,
  INITIAL_CORPORATE_USERS,
  INITIAL_SECURITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RETAIL_STATEMENTS
} from '../data/mockData';
import {
  CORPORATE_DEMO_COMPANY_ID,
  corporateDemoUserToProfile,
  getCorporateDemoUserByRole,
} from '../data/corporateAuthMock';
import type { CorporateDemoUser } from '../types/corporateDemoUser';
import type { RetailRegistrationResult } from '../types/retailRegistration';
import { RETAIL_REGISTRATION_STORAGE_KEY } from '../data/retailRegistrationMock';
import { BillPaymentRecord, FetchedBill, BillProvider } from '../types/bills';
import {
  BILL_PROVIDERS,
  INITIAL_BILL_PAYMENT_HISTORY,
  INITIAL_UPCOMING_BILLS,
  mockFetchBill,
} from '../data/billsMockData';
import { UpcomingBill } from '../types/bills';
import { ServiceRoute } from '../types/services';
import {
  DEFAULT_FAVORITE_SERVICE_IDS,
  DEFAULT_RECENT_SERVICE_IDS,
} from '../data/servicesCatalog';
import {
  ChequeBook,
  ChequeRecord,
  PositivePayRegistration,
  INITIAL_CHEQUE_BOOKS,
  INITIAL_DEPOSITED_CHEQUES,
  INITIAL_ISSUED_CHEQUES,
  INITIAL_POSITIVE_PAY,
  generateChequeReference,
} from '../data/chequeServicesMock';
import {
  EStatementSubscription,
  INITIAL_ESTATEMENT_SUBSCRIPTIONS,
  generateEStatementRef,
  lookupBanl,
  type BanlLookupResult,
} from '../data/accountServicesMock';
import {
  NachMandate,
  INITIAL_NACH_MANDATES,
  AUTO_FAVORITE_TXN_THRESHOLD,
} from '../data/level3Mock';
import {
  ScheduledTransfer,
  MoneyRequest,
  CardlessWithdrawal,
  ActivityEvent,
  RetailTransactionLimits,
  INITIAL_SCHEDULED_TRANSFERS,
  INITIAL_MONEY_REQUESTS,
  INITIAL_ACTIVITY_EVENTS,
  DEFAULT_RETAIL_LIMITS,
  generateCardlessOtp,
} from '../data/level4Mock';
import {
  GovtSavingsAccount,
  Form15GSubmission,
  RemittanceRequest,
  ForexCardAccount,
  BranchAppointment,
  LockerApplication,
  INITIAL_GOVT_SAVINGS,
  INITIAL_FORM15G,
  INITIAL_REMITTANCES,
  INITIAL_FOREX_CARDS,
  INITIAL_BRANCH_APPOINTMENTS,
  INITIAL_LOCKERS,
} from '../data/level5Mock';
import {
  LoanClosureCertificateRequest,
  BondHolding,
  DematAccount,
  FeedbackSubmission,
  INITIAL_LOAN_CLOSURE_REQUESTS,
  INITIAL_BOND_HOLDINGS,
  INITIAL_DEMAT_ACCOUNT,
  INITIAL_FEEDBACK,
  BOND_OFFERINGS,
} from '../data/level6Mock';
import { setCorporateAccountFrozen } from '../data/corporateAccountsMock';
import {
  PersonalInfo,
  KycDetails,
  TrustedDevice,
  ActiveSession,
  LoginActivityEvent,
  ProfileDocument,
  ServiceRequest,
  NotificationPreferences,
  AppPreferences,
  SecuritySettings,
  PrivacyPreferences,
} from '../types/profile';
import {
  INITIAL_PERSONAL_INFO,
  INITIAL_KYC_DETAILS,
  INITIAL_TRUSTED_DEVICES,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_LOGIN_ACTIVITY,
  INITIAL_PROFILE_DOCUMENTS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_NOTIFICATION_PREFS,
  INITIAL_APP_PREFS,
  INITIAL_SECURITY_SETTINGS,
  INITIAL_PRIVACY_PREFS,
} from '../data/profileMockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface BankingContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Auth State
  isAuthenticated: boolean;
  bankingType: BankingType;
  authScreen: AuthScreen;
  user: UserProfile;
  setBankingType: (type: BankingType) => void;
  setAuthScreen: (screen: AuthScreen) => void;
  login: (type: BankingType, customerId?: string) => void;
  logout: () => void;
  quickDemoLogin: (type: BankingType) => void;
  isSessionExpired: boolean;
  clearSessionExpired: () => void;
  expireSession: () => void;
  corporateLoginVerified: boolean;
  corporateOtpVerified: boolean;
  setCorporateLoginVerified: (verified: boolean) => void;
  setCorporateOtpVerified: (verified: boolean) => void;
  clearCorporateAuthFlow: () => void;
  corporateDeviceTrusted: boolean;
  completeCorporateAuthentication: (deviceTrusted?: boolean) => void;
  corporateSession: CorporateDemoUser | null;
  pendingCorporateUser: CorporateDemoUser | null;
  setPendingCorporateUser: (user: CorporateDemoUser | null) => void;
  retailRegistration: RetailRegistrationResult | null;
  completeRetailRegistration: (result: RetailRegistrationResult) => void;
  canApproveCorporate: boolean;
  canSubmitCorporatePayment: boolean;
  canCreateCorporateBulk: boolean;

  // Navigation
  retailTab: RetailTab;
  setRetailTab: (tab: RetailTab) => void;
  corporateTab: CorporateTab;
  setCorporateTab: (tab: CorporateTab) => void;

  // Data State
  accounts: BankAccount[];
  transactions: Transaction[];
  approvals: PaymentApproval[];
  beneficiaries: Beneficiary[];
  cards: CreditDebitCard[];
  cardTransactions: CardTransaction[];
  securityAlerts: CardSecurityAlert[];
  fixedDeposits: FixedDeposit[];
  recurringDeposits: RecurringDeposit[];
  insurancePolicies: InsurancePolicy[];
  insurancePlans: InsurancePlan[];
  insuranceClaims: InsuranceClaim[];
  loans: LoanAccount[];
  investments: InvestmentItem[];
  billers: Biller[];
  employees: CorporateEmployee[];
  corporateUsers: CorporateUser[];
  securityLogs: SecurityLog[];
  notifications: NotificationItem[];
  statements: Statement[];
  chequeBooks: ChequeBook[];
  issuedCheques: ChequeRecord[];
  depositedCheques: ChequeRecord[];
  positivePayRegs: PositivePayRegistration[];
  eStatementSubscriptions: EStatementSubscription[];
  locatorType: 'atm' | 'branch' | 'cdm';
  transferRepeat: TransferRepeatPayload | null;
  nachMandates: NachMandate[];
  scheduledTransfers: ScheduledTransfer[];
  moneyRequests: MoneyRequest[];
  cardlessWithdrawals: CardlessWithdrawal[];
  activityEvents: ActivityEvent[];
  retailTransactionLimits: RetailTransactionLimits;
  govtSavingsAccounts: GovtSavingsAccount[];
  form15gSubmissions: Form15GSubmission[];
  remittanceRequests: RemittanceRequest[];
  lrsUsedYtd: number;
  forexCards: ForexCardAccount[];
  branchAppointments: BranchAppointment[];
  lockerApplications: LockerApplication[];
  rewardPoints: number;
  loanClosureRequests: LoanClosureCertificateRequest[];
  bondHoldings: BondHolding[];
  dematAccount: DematAccount | null;
  feedbackSubmissions: FeedbackSubmission[];

  // Action methods
  executeTransfer: (params: {
    fromAccountId: string;
    beneficiaryName: string;
    beneficiaryAccount: string;
    bankName: string;
    amount: number;
    mode: 'UPI' | 'NEFT' | 'RTGS' | 'IMPS' | 'Internal';
    remarks?: string;
  }) => Transaction;

  executeSelfTransfer: (params: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    remarks?: string;
  }) => Transaction;
  
  approveCorporatePayment: (approvalId: string, notes?: string) => void;
  rejectCorporatePayment: (approvalId: string, reason: string) => void;
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'status' | 'maskedAccount'>) => Beneficiary;
  updateBeneficiary: (beneficiaryId: string, updates: Partial<Beneficiary>) => void;
  deleteBeneficiary: (beneficiaryId: string) => void;
  toggleBeneficiaryBlock: (beneficiaryId: string) => void;
  toggleBeneficiaryFavourite: (beneficiaryId: string) => void;
  toggleCardFreeze: (cardId: string) => void;
  blockCard: (cardId: string, reason: string) => void;
  replaceCard: (cardId: string, reason: CardReplacementRequest['reason'], cardType: string, address: string) => CardReplacementRequest;
  addCard: (card: Omit<CreditDebitCard, 'id'>) => CreditDebitCard;
  changeCardPin: (cardId: string, pin: string) => void;
  payCreditCardBill: (cardId: string, amount: number, fromAccountId: string) => void;
  updateCardLimits: (cardId: string, domesticLimit: number, intlLimit: number) => void;
  updateGranularCardLimits: (cardId: string, limits: { atm?: number; pos?: number; online?: number; intl?: number; domestic?: number }) => void;
  toggleCardFeature: (cardId: string, feature: 'online' | 'contactless' | 'international' | 'atm' | 'pos') => void;
  setCardControl: (cardId: string, control: 'online' | 'contactless' | 'international' | 'atm' | 'pos', enabled: boolean) => void;
  resolveSecurityAlert: (alertId: string, isLegit: boolean) => void;
  reportCardTransaction: (transactionId: string, reason: string) => void;
  payBiller: (billerId: string, amount: number, accountId: string) => void;
  billProviders: BillProvider[];
  billPaymentHistory: BillPaymentRecord[];
  upcomingBills: UpcomingBill[];
  fetchBill: (providerId: string, formData: Record<string, string>) => FetchedBill | null;
  processBillPayment: (params: {
    fetchedBill: FetchedBill;
    amount: number;
    accountId: string;
    saveBiller?: boolean;
    nickname?: string;
  }) => BillPaymentRecord;
  addSavedBiller: (biller: Omit<Biller, 'id'>) => Biller;
  updateSavedBiller: (billerId: string, updates: Partial<Biller>) => void;
  deleteSavedBiller: (billerId: string) => void;
  toggleBillerAutoPay: (billerId: string, enabled: boolean, rule?: Biller['autoPayRule'], maxAmount?: number) => void;

  requestChequeBook: (accountId: string, leaves: number) => string;
  stopCheque: (accountId: string, chequeNumber: string, reason: string) => string;
  registerPositivePay: (params: {
    chequeNumber: string;
    payeeName: string;
    amount: number;
    issueDate: string;
  }) => string;

  lookupBanlName: (accountNumber: string, ifsc: string) => BanlLookupResult;
  requestEStatement: (params: {
    accountId: string;
    frequency: EStatementSubscription['frequency'];
    format: EStatementSubscription['format'];
    email: string;
  }) => string;
  stopEStatement: (subscriptionId: string) => void;
  resumeEStatement: (subscriptionId: string) => void;
  updateEStatementFrequency: (subscriptionId: string, frequency: EStatementSubscription['frequency']) => void;
  freezeAccount: (accountId: string) => void;
  unfreezeAccount: (accountId: string) => void;
  freezeCorporateAccount: (accountId: string) => void;
  unfreezeCorporateAccount: (accountId: string) => void;
  setTransferRepeat: (payload: TransferRepeatPayload) => void;
  clearTransferRepeat: () => void;
  setLocatorType: (type: 'atm' | 'branch' | 'cdm') => void;
  deleteNachMandate: (mandateId: string) => void;
  updateAccountNominees: (
    accountId: string,
    nominees: NonNullable<BankAccount['nominees']>
  ) => void;
  processTaxPayment: (params: {
    accountId: string;
    amount: number;
    taxType: string;
    pan: string;
    assessmentYear: string;
  }) => string;
  createScheduledTransfer: (params: Omit<ScheduledTransfer, 'id' | 'status' | 'scheduledDate' | 'nextExecution'> & { frequency: ScheduledTransfer['frequency'] }) => void;
  cancelScheduledTransfer: (id: string) => void;
  toggleScheduledTransferPause: (id: string) => void;
  createMoneyRequest: (params: { counterpartyName: string; counterpartyUpi: string; amount: number; note: string }) => void;
  respondToMoneyRequest: (id: string, action: 'paid' | 'declined') => void;
  generateCardlessWithdrawal: (accountId: string, amount: number) => { otp: string; expiresAt: string };
  updateRetailTransactionLimits: (limits: RetailTransactionLimits) => void;
  openRetailAccount: (type: 'savings' | 'current' | 'nre-savings', nickname?: string) => BankAccount;
  payRdInstallment: (rdId: string, accountId: string) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  contributeToGovtScheme: (accountId: string, amount: number, debitAccountId: string) => void;
  submitForm15G: (params: { formType: '15G' | '15H'; financialYear: string; estimatedIncome: number }) => string;
  submitRemittance: (params: {
    beneficiaryName: string;
    country: string;
    currency: string;
    amountInr: number;
    amountForeign: number;
    purpose: string;
    accountId: string;
    scheme: 'SWIFT' | 'LRS';
  }) => void;
  loadForexCard: (cardId: string, currency: string, foreignAmount: number, debitAccountId: string, inrAmount: number) => void;
  applyForexCard: () => void;
  bookBranchAppointment: (params: { branchName: string; purpose: string; date: string; timeSlot: string }) => void;
  redeemReward: (rewardId: string, points: number, rewardName: string) => void;
  applyLocker: (params: { branchName: string; lockerSize: LockerApplication['lockerSize']; annualRent: number }) => void;
  bookLockerVisit: (lockerId: string, visitDate: string) => void;
  requestLoanClosureCert: (loanId: string) => string;
  investInBond: (bondId: string, amount: number, accountId: string) => void;
  applyDematAccount: (linkedAccountId: string) => void;
  submitFeedback: (params: { category: string; rating: number; message: string }) => string;

  // Services navigation
  profileDeepLink: string | null;
  clearProfileDeepLink: () => void;
  billDeepLink: string | null;
  clearBillDeepLink: () => void;
  favoriteServiceIds: string[];
  recentServiceIds: string[];
  toggleFavoriteService: (serviceId: string) => void;
  navigateService: (serviceId: string, route: ServiceRoute) => void;
  
  // Deposits actions
  createFixedDeposit: (principal: number, tenureMonths: number, payout: FixedDeposit['payoutFrequency'], maturityInstruction: FixedDeposit['maturityInstruction'], accountId: string) => FixedDeposit;
  createRecurringDeposit: (monthlyAmount: number, tenureMonths: number, accountId: string) => RecurringDeposit;
  closeDeposit: (depositId: string, type: 'FD' | 'RD') => void;
  updateMaturityInstruction: (depositId: string, instruction: FixedDeposit['maturityInstruction']) => void;
  getDepositTransactions: (depositId: string) => DepositTransaction[];

  // Insurance actions
  buyInsurance: (planId: string, details: any) => InsurancePolicy;
  payInsurancePremium: (policyId: string, amount: number, accountId: string) => void;
  renewInsurancePolicy: (policyId: string, amount: number, accountId: string) => void;
  submitInsuranceClaim: (policyId: string, claimDetails: any) => InsuranceClaim;

  applyForLoan: (type: LoanAccount['type'], amount: number, tenureMonths: number) => LoanAccount;
  createSIP: (fundId: string, monthlyAmount: number, date: number) => void;
  processPayrollBatch: (department?: string) => void;
  addMoneyToAccount: (accountId: string, amount: number, source: string) => Transaction;
  
  // UI Helpers
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
  isSessionTimeoutModalOpen: boolean;
  extendSession: () => void;
  resetDemoData: () => void;

  // Bottom Navigation Visibility Control (Root vs Detail/Form/Flow)
  isBottomNavHidden: boolean;
  setBottomNavHidden: (hidden: boolean) => void;
  hideBottomNav: () => void;
  showBottomNav: () => void;
  activeDetailFlow: string | null;
  openDetailFlow: (flowName: string) => void;
  closeDetailFlow: () => void;

  // Profile & Preferences
  primaryAccountId: string;
  defaultDebitAccountId: string;
  defaultCardId: string;
  hiddenAccountIds: string[];
  personalInfo: PersonalInfo;
  kycDetails: KycDetails;
  trustedDevices: TrustedDevice[];
  activeSessions: ActiveSession[];
  loginActivity: LoginActivityEvent[];
  profileDocuments: ProfileDocument[];
  serviceRequests: ServiceRequest[];
  notificationPrefs: NotificationPreferences;
  appPrefs: AppPreferences;
  securitySettings: SecuritySettings;
  privacyPrefs: PrivacyPreferences;
  setPrimaryAccount: (accountId: string) => void;
  setDefaultDebitAccount: (accountId: string) => void;
  setDefaultCard: (cardId: string) => void;
  updateAccountNickname: (accountId: string, nickname: string) => void;
  toggleAccountVisibility: (accountId: string) => void;
  isAccountHidden: (accountId: string) => boolean;
  getPrimaryAccount: () => BankAccount;
  getDefaultDebitAccount: () => BankAccount;
  getVisibleAccounts: () => BankAccount[];
  primaryCorporateAccountId: string;
  corporateHiddenAccountIds: string[];
  corporateDefaultPaymentAccountId: string;
  setPrimaryCorporateAccount: (accountId: string) => void;
  setCorporateDefaultPaymentAccount: (accountId: string) => void;
  updateCorporateAccountNickname: (accountId: string, nickname: string) => void;
  toggleCorporateAccountVisibility: (accountId: string) => void;
  isCorporateAccountHidden: (accountId: string) => boolean;
  getPrimaryCorporateAccount: () => BankAccount;
  getVisibleCorporateAccounts: () => BankAccount[];
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  updateNotificationPrefs: (updates: Partial<NotificationPreferences>) => void;
  updateAppPrefs: (updates: Partial<AppPreferences>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  updatePrivacyPrefs: (updates: Partial<PrivacyPreferences>) => void;
  removeTrustedDevice: (deviceId: string) => void;
  signOutSession: (sessionId: string) => void;
  signOutAllOtherSessions: () => void;
  addServiceRequest: (type: string, details: string) => string;
  triggerSessionTimeout: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: default is light mode as requested
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('apex_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('apex_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('apex_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Authentication & Mode
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to logged-in home view for instant preview, can log out anytime
  const [bankingType, setBankingType] = useState<BankingType>('retail');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  
  // Tabs
  const [retailTab, setRetailTab] = useState<RetailTab>('home');
  const [corporateTab, setCorporateTab] = useState<CorporateTab>('home');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals & Navigation
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
  const [activeDetailFlow, setActiveDetailFlow] = useState<string | null>(null);

  const openScanner = () => {
    setIsScannerOpen(true);
    setIsBottomNavHidden(true);
  };
  const closeScanner = () => {
    setIsScannerOpen(false);
    if (!activeDetailFlow) {
      setIsBottomNavHidden(false);
    }
  };

  const hideBottomNav = () => setIsBottomNavHidden(true);
  const showBottomNav = () => {
    setIsBottomNavHidden(false);
    setActiveDetailFlow(null);
  };
  const setBottomNavHidden = (hidden: boolean) => setIsBottomNavHidden(hidden);
  const openDetailFlow = (flowName: string) => {
    setActiveDetailFlow(flowName);
    setIsBottomNavHidden(true);
  };
  const closeDetailFlow = () => {
    setActiveDetailFlow(null);
    setIsBottomNavHidden(false);
  };

  const handleSetRetailTab = (tab: RetailTab) => {
    setRetailTab(tab);
    setIsBottomNavHidden(false);
    setActiveDetailFlow(null);
  };

  const handleSetCorporateTab = (tab: CorporateTab) => {
    setCorporateTab(tab);
    setIsBottomNavHidden(false);
    setActiveDetailFlow(null);
  };

  const [isSessionTimeoutModalOpen, setIsSessionTimeoutModalOpen] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [corporateLoginVerified, setCorporateLoginVerified] = useState(false);
  const [corporateOtpVerified, setCorporateOtpVerified] = useState(false);
  const [corporateDeviceTrusted, setCorporateDeviceTrusted] = useState(false);
  const [pendingCorporateUser, setPendingCorporateUser] = useState<CorporateDemoUser | null>(null);
  const [corporateSession, setCorporateSession] = useState<CorporateDemoUser | null>(null);
  const [retailRegistration, setRetailRegistration] = useState<RetailRegistrationResult | null>(() => {
    try {
      const raw = localStorage.getItem(RETAIL_REGISTRATION_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as RetailRegistrationResult) : null;
    } catch {
      return null;
    }
  });

  const clearCorporateAuthFlow = () => {
    setCorporateLoginVerified(false);
    setCorporateOtpVerified(false);
    setCorporateDeviceTrusted(false);
    setPendingCorporateUser(null);
  };

  const completeCorporateAuthentication = (deviceTrusted = false) => {
    const sessionUser = pendingCorporateUser;
    if (sessionUser) {
      setCorporateSession(sessionUser);
    }
    setCorporateLoginVerified(false);
    setCorporateOtpVerified(false);
    setPendingCorporateUser(null);
    if (deviceTrusted) {
      setCorporateDeviceTrusted(true);
    }
    login('corporate', sessionUser?.name);
  };

  // Data Store
  const [retailAccounts, setRetailAccounts] = useState<BankAccount[]>(INITIAL_RETAIL_ACCOUNTS);
  const [corporateAccounts, setCorporateAccounts] = useState<BankAccount[]>(INITIAL_CORPORATE_ACCOUNTS);
  const [retailTransactions, setRetailTransactions] = useState<Transaction[]>(INITIAL_RETAIL_TRANSACTIONS);
  const [corporateTransactions, setCorporateTransactions] = useState<Transaction[]>(INITIAL_CORPORATE_TRANSACTIONS);
  const [approvals, setApprovals] = useState<PaymentApproval[]>(INITIAL_CORPORATE_APPROVALS);
  const [retailBeneficiaries, setRetailBeneficiaries] = useState<Beneficiary[]>(INITIAL_RETAIL_BENEFICIARIES);
  const [corporateBeneficiaries, setCorporateBeneficiaries] = useState<Beneficiary[]>(INITIAL_CORPORATE_BENEFICIARIES);
  const [retailCards, setRetailCards] = useState<CreditDebitCard[]>(INITIAL_RETAIL_CARDS);
  const [corporateCards, setCorporateCards] = useState<CreditDebitCard[]>(INITIAL_CORPORATE_CARDS);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>(INITIAL_FIXED_DEPOSITS);
  const [recurringDeposits, setRecurringDeposits] = useState<RecurringDeposit[]>(INITIAL_RECURRING_DEPOSITS);
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(INITIAL_INSURANCE_POLICIES);
  const [insurancePlans] = useState<InsurancePlan[]>(INITIAL_INSURANCE_PLANS);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(INITIAL_INSURANCE_CLAIMS);
  const [loans, setLoans] = useState<LoanAccount[]>(INITIAL_LOANS);
  const [investments, setInvestments] = useState<InvestmentItem[]>(INITIAL_INVESTMENTS);
  const [billers, setBillers] = useState<Biller[]>(INITIAL_BILLERS);
  const [billPaymentHistory, setBillPaymentHistory] = useState<BillPaymentRecord[]>(INITIAL_BILL_PAYMENT_HISTORY);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(INITIAL_UPCOMING_BILLS);
  const billProviders = BILL_PROVIDERS;
  const [employees] = useState<CorporateEmployee[]>(INITIAL_CORPORATE_EMPLOYEES);
  const [corporateUsers] = useState<CorporateUser[]>(INITIAL_CORPORATE_USERS);
  const [securityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [statements, setStatements] = useState<Statement[]>(INITIAL_RETAIL_STATEMENTS);
  const [chequeBooks, setChequeBooks] = useState<ChequeBook[]>(INITIAL_CHEQUE_BOOKS);
  const [issuedCheques, setIssuedCheques] = useState<ChequeRecord[]>(INITIAL_ISSUED_CHEQUES);
  const [depositedCheques, setDepositedCheques] = useState<ChequeRecord[]>(INITIAL_DEPOSITED_CHEQUES);
  const [positivePayRegs, setPositivePayRegs] = useState<PositivePayRegistration[]>(INITIAL_POSITIVE_PAY);
  const [eStatementSubscriptions, setEStatementSubscriptions] = useState<EStatementSubscription[]>(
    INITIAL_ESTATEMENT_SUBSCRIPTIONS
  );
  const [locatorType, setLocatorType] = useState<'atm' | 'branch' | 'cdm'>('atm');
  const [transferRepeat, setTransferRepeatState] = useState<TransferRepeatPayload | null>(null);
  const [nachMandates, setNachMandates] = useState<NachMandate[]>(INITIAL_NACH_MANDATES);
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransfer[]>(INITIAL_SCHEDULED_TRANSFERS);
  const [moneyRequests, setMoneyRequests] = useState<MoneyRequest[]>(INITIAL_MONEY_REQUESTS);
  const [cardlessWithdrawals, setCardlessWithdrawals] = useState<CardlessWithdrawal[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_EVENTS);
  const [retailTransactionLimits, setRetailTransactionLimits] = useState<RetailTransactionLimits>(DEFAULT_RETAIL_LIMITS);
  const [govtSavingsAccounts, setGovtSavingsAccounts] = useState<GovtSavingsAccount[]>(INITIAL_GOVT_SAVINGS);
  const [form15gSubmissions, setForm15gSubmissions] = useState<Form15GSubmission[]>(INITIAL_FORM15G);
  const [remittanceRequests, setRemittanceRequests] = useState<RemittanceRequest[]>(INITIAL_REMITTANCES);
  const [lrsUsedYtd, setLrsUsedYtd] = useState(850000);
  const [forexCards, setForexCards] = useState<ForexCardAccount[]>(INITIAL_FOREX_CARDS);
  const [branchAppointments, setBranchAppointments] = useState<BranchAppointment[]>(INITIAL_BRANCH_APPOINTMENTS);
  const [lockerApplications, setLockerApplications] = useState<LockerApplication[]>(INITIAL_LOCKERS);
  const [rewardPoints, setRewardPoints] = useState(6840);
  const [loanClosureRequests, setLoanClosureRequests] = useState<LoanClosureCertificateRequest[]>(INITIAL_LOAN_CLOSURE_REQUESTS);
  const [bondHoldings, setBondHoldings] = useState<BondHolding[]>(INITIAL_BOND_HOLDINGS);
  const [dematAccount, setDematAccount] = useState<DematAccount | null>(INITIAL_DEMAT_ACCOUNT);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>(INITIAL_FEEDBACK);

  // Profile & Preferences
  const [primaryAccountId, setPrimaryAccountId] = useState('acc_ret_sav_01');
  const [defaultDebitAccountId, setDefaultDebitAccountId] = useState('acc_ret_sav_01');
  const [defaultCardId, setDefaultCardId] = useState(INITIAL_RETAIL_CARDS[0]?.id || '');
  const [hiddenAccountIds, setHiddenAccountIds] = useState<string[]>([]);
  const [primaryCorporateAccountId, setPrimaryCorporateAccountId] = useState('acc_corp_op_01');
  const [corporateHiddenAccountIds, setCorporateHiddenAccountIds] = useState<string[]>([]);
  const [corporateDefaultPaymentAccountId, setCorporateDefaultPaymentAccountId] = useState('acc_corp_op_01');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(INITIAL_PERSONAL_INFO);
  const [kycDetails] = useState<KycDetails>(INITIAL_KYC_DETAILS);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(INITIAL_TRUSTED_DEVICES);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [loginActivity] = useState<LoginActivityEvent[]>(INITIAL_LOGIN_ACTIVITY);
  const [profileDocuments] = useState<ProfileDocument[]>(INITIAL_PROFILE_DOCUMENTS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(INITIAL_NOTIFICATION_PREFS);
  const [appPrefs, setAppPrefs] = useState<AppPreferences>(INITIAL_APP_PREFS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [privacyPrefs, setPrivacyPrefs] = useState<PrivacyPreferences>(INITIAL_PRIVACY_PREFS);

  const [profileDeepLink, setProfileDeepLink] = useState<string | null>(null);
  const [billDeepLink, setBillDeepLink] = useState<string | null>(null);
  const [favoriteServiceIds, setFavoriteServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apex_favorite_services');
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITE_SERVICE_IDS;
    } catch {
      return DEFAULT_FAVORITE_SERVICE_IDS;
    }
  });
  const [recentServiceIds, setRecentServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apex_recent_services');
      return saved ? JSON.parse(saved) : DEFAULT_RECENT_SERVICE_IDS;
    } catch {
      return DEFAULT_RECENT_SERVICE_IDS;
    }
  });

  // Active user depending on bankingType
  const user =
    bankingType === 'retail'
      ? retailRegistration
        ? {
            ...INITIAL_RETAIL_USER,
            customerNumber: retailRegistration.userId,
            name: INITIAL_RETAIL_USER.name,
          }
        : INITIAL_RETAIL_USER
      : corporateSession
        ? corporateDemoUserToProfile(corporateSession)
        : INITIAL_CORPORATE_USER;

  const canApproveCorporate = corporateSession?.canApprove ?? false;
  const canSubmitCorporatePayment = corporateSession?.canSubmitPayment ?? true;
  const canCreateCorporateBulk = corporateSession?.canCreateBulk ?? true;
  const accounts = bankingType === 'retail' ? retailAccounts : corporateAccounts;
  const transactions = bankingType === 'retail' ? retailTransactions : corporateTransactions;
  const beneficiaries = bankingType === 'retail' ? retailBeneficiaries : corporateBeneficiaries;
  const cards = bankingType === 'retail' ? retailCards : corporateCards;

  // Login handler
  const login = (type: BankingType, welcomeName?: string) => {
    setBankingType(type);
    setIsAuthenticated(true);
    if (type === 'retail') {
      setRetailTab('home');
    } else {
      setCorporateTab('home');
    }
    const displayName =
      welcomeName ?? (type === 'retail' ? 'Arjun' : corporateSession?.name ?? 'User');
    addToast({
      type: 'success',
      title: `Welcome, ${displayName}`,
      message: `Successfully authenticated into ${type === 'retail' ? 'Retail' : 'Corporate'} Banking.`,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSessionTimeoutModalOpen(false);
    clearCorporateAuthFlow();
    setCorporateSession(null);
    if (bankingType === 'corporate') {
      setBankingType('corporate');
      setAuthScreen('login');
    } else {
      setAuthScreen('login');
    }
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Your banking session has ended securely.',
    });
  };

  const clearSessionExpired = () => setIsSessionExpired(false);

  const expireSession = () => {
    setIsAuthenticated(false);
    setIsSessionTimeoutModalOpen(false);
    setIsSessionExpired(true);
    clearCorporateAuthFlow();
    setCorporateSession(null);
    if (bankingType === 'corporate') {
      setBankingType('corporate');
      setAuthScreen('login');
    } else {
      setAuthScreen('login');
    }
  };

  const quickDemoLogin = (type: BankingType) => {
    if (type === 'corporate') {
      const maker = getCorporateDemoUserByRole('maker');
      if (maker) setCorporateSession(maker);
    }
    setBankingType(type);
    setIsAuthenticated(true);
    if (type === 'retail') {
      setRetailTab('home');
    } else {
      setCorporateTab('home');
    }
    addToast({
      type: 'success',
      title: `${type === 'retail' ? 'Retail Profile (RB-123456)' : `Corporate Profile (${CORPORATE_DEMO_COMPANY_ID})`} Loaded`,
      message: 'Demo credentials authenticated.',
    });
  };

  const completeRetailRegistration = (result: RetailRegistrationResult) => {
    setRetailRegistration(result);
    localStorage.setItem(RETAIL_REGISTRATION_STORAGE_KEY, JSON.stringify(result));
    setSecuritySettings((prev) => ({
      ...prev,
      mpinActive: result.mpinSet,
      tpinActive: result.tpinSet,
      biometricEnabled: result.biometricEnabled || prev.biometricEnabled,
    }));
    addToast({
      type: 'success',
      title: 'Registration complete',
      message: `User ID ${result.userId} (Profile ${result.profileCode}) is ready.`,
    });
  };

  // Fund Transfer
  const executeTransfer = ({
    fromAccountId,
    beneficiaryName,
    beneficiaryAccount,
    bankName,
    amount,
    mode,
    remarks
  }: {
    fromAccountId: string;
    beneficiaryName: string;
    beneficiaryAccount: string;
    bankName: string;
    amount: number;
    mode: 'UPI' | 'NEFT' | 'RTGS' | 'IMPS' | 'Internal';
    remarks?: string;
  }): Transaction => {
    const sourceAccounts = bankingType === 'retail' ? retailAccounts : corporateAccounts;
    const fromAccount = sourceAccounts.find((a) => a.id === fromAccountId);
    if (fromAccount?.status === 'frozen') {
      addToast({
        type: 'error',
        title: 'Account Frozen',
        message: 'Debits are blocked on this account. Unfreeze to continue transfers.',
      });
      throw new Error('Account frozen');
    }

    const refNum = `${mode}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let newBalance = 0;

    if (bankingType === 'retail') {
      setRetailAccounts(prev => prev.map(acc => {
        if (acc.id === fromAccountId) {
          newBalance = Math.max(0, acc.balance - amount);
          return {
            ...acc,
            balance: newBalance,
            availableBalance: newBalance - (acc.holdAmount || 0),
          };
        }
        return acc;
      }));
    } else {
      setCorporateAccounts(prev => prev.map(acc => {
        if (acc.id === fromAccountId) {
          newBalance = Math.max(0, acc.balance - amount);
          return {
            ...acc,
            balance: newBalance,
            availableBalance: newBalance - (acc.holdAmount || 0),
          };
        }
        return acc;
      }));
    }

    const newTxn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      date: formattedDate,
      amount,
      type: 'debit',
      category: bankingType === 'retail' ? 'transfer' : 'vendor',
      description: `Transfer to ${beneficiaryName} (${bankName})`,
      counterpartyName: beneficiaryName,
      counterpartyAccount: beneficiaryAccount,
      status: 'completed',
      paymentMode: mode,
      remarks,
      balanceAfter: newBalance,
    };

    if (bankingType === 'retail') {
      setRetailTransactions(prev => [newTxn, ...prev]);

      setRetailBeneficiaries((prev) => {
        const match = prev.find(
          (b) =>
            b.accountNumber === beneficiaryAccount ||
            b.name.toLowerCase() === beneficiaryName.toLowerCase()
        );
        if (!match) return prev;
        const countKey = `apex_ben_txn_${match.id}`;
        const nextCount = parseInt(localStorage.getItem(countKey) || '0', 10) + 1;
        localStorage.setItem(countKey, String(nextCount));
        if (nextCount >= AUTO_FAVORITE_TXN_THRESHOLD && !match.isFavourite) {
          window.setTimeout(() => {
            addToast({
              type: 'info',
              title: 'Added to Favourites',
              message: `${match.name} was auto-added after ${AUTO_FAVORITE_TXN_THRESHOLD} transfers.`,
            });
          }, 400);
          return prev.map((b) => (b.id === match.id ? { ...b, isFavourite: true } : b));
        }
        return prev;
      });
    } else {
      setCorporateTransactions(prev => [newTxn, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Payment Successful',
      message: `₹${amount.toLocaleString('en-IN')} sent to ${beneficiaryName} (${refNum}).`,
    });

    return newTxn;
  };

  const executeSelfTransfer = ({
    fromAccountId,
    toAccountId,
    amount,
    remarks,
  }: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    remarks?: string;
  }): Transaction => {
    if (bankingType !== 'retail') {
      throw new Error('Self transfer is only available for retail accounts.');
    }
    if (fromAccountId === toAccountId) {
      addToast({ type: 'error', title: 'Invalid Accounts', message: 'Select two different accounts.' });
      throw new Error('Same account');
    }

    const fromAccount = retailAccounts.find((a) => a.id === fromAccountId);
    const toAccount = retailAccounts.find((a) => a.id === toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }
    if (fromAccount.status === 'frozen' || toAccount.status === 'frozen') {
      addToast({
        type: 'error',
        title: 'Account Frozen',
        message: 'Transfers are blocked on frozen accounts.',
      });
      throw new Error('Account frozen');
    }
    if (amount > fromAccount.availableBalance) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `Available balance is ₹${fromAccount.availableBalance.toLocaleString('en-IN')}.`,
      });
      throw new Error('Insufficient balance');
    }

    const refNum = `INT${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let fromBalanceAfter = 0;

    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccountId) {
          const newBalance = Math.max(0, acc.balance - amount);
          fromBalanceAfter = newBalance - (acc.holdAmount || 0);
          return {
            ...acc,
            balance: newBalance,
            availableBalance: fromBalanceAfter,
          };
        }
        if (acc.id === toAccountId) {
          const newBalance = acc.balance + amount;
          return {
            ...acc,
            balance: newBalance,
            availableBalance: newBalance - (acc.holdAmount || 0),
          };
        }
        return acc;
      })
    );

    const toLabel = `${toAccount.accountType} ${toAccount.maskedNumber}`;
    const newTxn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      date: formattedDate,
      amount,
      type: 'debit',
      category: 'transfer',
      description: `Self transfer to ${toLabel}`,
      counterpartyName: toLabel,
      counterpartyAccount: toAccount.maskedNumber,
      status: 'completed',
      paymentMode: 'Internal',
      remarks,
      balanceAfter: fromBalanceAfter,
    };

    setRetailTransactions((prev) => [newTxn, ...prev]);

    addToast({
      type: 'success',
      title: 'Transfer Successful',
      message: `₹${amount.toLocaleString('en-IN')} moved to ${toLabel}.`,
    });

    return newTxn;
  };

  // Corporate Approvals
  const approveCorporatePayment = (approvalId: string, notes?: string) => {
    const targetApproval = approvals.find(a => a.id === approvalId);
    if (!targetApproval) return;

    setApprovals(prev => prev.map(item => {
      if (item.id === approvalId) {
        return {
          ...item,
          status: 'approved',
          currentApprovals: item.requiredApprovals,
          approvedBy: [...(item.approvedBy || []), 'Devansh Singhania (CFO - Admin Approval)'],
          notes: notes || item.notes
        };
      }
      return item;
    }));

    // Deduct from Operating or relevant account
    setCorporateAccounts(prev => prev.map(acc => {
      if (acc.accountType === 'Operating') {
        const bal = acc.balance - targetApproval.amount;
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      }
      return acc;
    }));

    // Add to corporate transactions
    const refNum = `RTGS${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newTxn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      date: 'Today, Just now',
      amount: targetApproval.amount,
      type: 'debit',
      category: 'vendor',
      description: targetApproval.title,
      counterpartyName: targetApproval.beneficiaryName,
      counterpartyAccount: targetApproval.beneficiaryAccount,
      status: 'completed',
      paymentMode: targetApproval.paymentMode,
      remarks: `Maker-Checker Approved. ${notes || ''}`,
    };
    setCorporateTransactions(prev => [newTxn, ...prev]);

    addToast({
      type: 'success',
      title: 'Payment Approved & Executed',
      message: `${targetApproval.title} for ₹${targetApproval.amount.toLocaleString('en-IN')} is authorized.`,
    });
  };

  const rejectCorporatePayment = (approvalId: string, reason: string) => {
    setApprovals(prev => prev.map(item => {
      if (item.id === approvalId) {
        return {
          ...item,
          status: 'rejected',
          rejectionReason: reason
        };
      }
      return item;
    }));

    addToast({
      type: 'warning',
      title: 'Approval Rejected',
      message: `Transaction has been declined with reason: "${reason}".`,
    });
  };

  // Add Beneficiary
  const addBeneficiary = (data: Omit<Beneficiary, 'id' | 'status' | 'maskedAccount'>): Beneficiary => {
    const masked = data.accountNumber.length > 4 
      ? `•••• •••• ${data.accountNumber.slice(-4)}`
      : data.accountNumber;
    
    const newBen: Beneficiary = {
      ...data,
      id: 'ben_' + Math.random().toString(36).substring(2, 9),
      maskedAccount: masked,
      status: bankingType === 'retail' ? 'active' : 'pending_approval',
      coolingPeriodEnds: '30 mins remaining (cooling limit: ₹50,000)'
    };

    if (bankingType === 'retail') {
      setRetailBeneficiaries(prev => [newBen, ...prev]);
    } else {
      setCorporateBeneficiaries(prev => [newBen, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Beneficiary Added',
      message: `${data.name} is added to your verified payee list.`,
    });

    return newBen;
  };

  const updateBeneficiary = (beneficiaryId: string, updates: Partial<Beneficiary>) => {
    const updater = (prev: Beneficiary[]) => prev.map(b => b.id === beneficiaryId ? { ...b, ...updates } : b);
    if (bankingType === 'retail') {
      setRetailBeneficiaries(updater);
    } else {
      setCorporateBeneficiaries(updater);
    }
    addToast({
      type: 'success',
      title: 'Beneficiary Updated',
      message: 'Beneficiary details have been updated successfully.',
    });
  };

  const deleteBeneficiary = (beneficiaryId: string) => {
    const filter = (prev: Beneficiary[]) => prev.filter(b => b.id !== beneficiaryId);
    if (bankingType === 'retail') {
      setRetailBeneficiaries(filter);
    } else {
      setCorporateBeneficiaries(filter);
    }
    addToast({
      type: 'success',
      title: 'Beneficiary Deleted',
      message: 'The beneficiary has been removed from your list.',
    });
  };

  const toggleBeneficiaryBlock = (beneficiaryId: string) => {
    const updater = (prev: Beneficiary[]) => prev.map(b => {
      if (b.id === beneficiaryId) {
        const isBlocked = b.status === 'blocked';
        return { ...b, status: isBlocked ? 'active' : 'blocked' as any };
      }
      return b;
    });
    if (bankingType === 'retail') {
      setRetailBeneficiaries(updater);
    } else {
      setCorporateBeneficiaries(updater);
    }
    const ben = beneficiaries.find(b => b.id === beneficiaryId);
    addToast({
      type: 'info',
      title: ben?.status === 'blocked' ? 'Beneficiary Unblocked' : 'Beneficiary Blocked',
      message: ben?.status === 'blocked' ? 'You can now transfer funds again.' : 'Fund transfers are temporarily disabled for this beneficiary.',
    });
  };

  const toggleBeneficiaryFavourite = (beneficiaryId: string) => {
    const updater = (prev: Beneficiary[]) => prev.map(b => b.id === beneficiaryId ? { ...b, isFavourite: !b.isFavourite } : b);
    if (bankingType === 'retail') {
      setRetailBeneficiaries(updater);
    } else {
      setCorporateBeneficiaries(updater);
    }
  };

  // Card Controls and Operations
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>(INITIAL_CARD_TRANSACTIONS);
  const [securityAlerts, setSecurityAlerts] = useState<CardSecurityAlert[]>(INITIAL_SECURITY_ALERTS);

  const toggleCardFreeze = (cardId: string) => {
    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        const nextState = !c.isFrozen;
        const nextStatus = nextState ? 'frozen' : 'active';
        addToast({
          type: nextState ? 'warning' : 'success',
          title: nextState ? 'Card Temporarily Frozen' : 'Card Active & Unfrozen',
          message: `${c.network} ${c.tier} card ending in ${c.cardNumber.slice(-4)} is ${nextState ? 'frozen' : 'active'}.`,
        });
        return { ...c, isFrozen: nextState, status: nextStatus };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }
  };

  const blockCard = (cardId: string, reason: string) => {
    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        return { 
          ...c, 
          isBlocked: true, 
          isFrozen: true, 
          status: 'blocked' as const, 
          blockReason: reason,
          blockedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }

    addToast({
      type: 'warning',
      title: 'Card Permanently Blocked',
      message: `Card has been permanently disabled due to: ${reason}. All payment gateways notified.`,
    });
  };

  const replaceCard = (cardId: string, reason: CardReplacementRequest['reason'], cardType: string, address: string): CardReplacementRequest => {
    const reqId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = reason === 'Lost' || reason === 'Stolen' ? 199 : 0;
    
    const replacement: CardReplacementRequest = {
      requestId: reqId,
      cardId,
      reason,
      cardType,
      deliveryAddress: address,
      requestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expectedDelivery: '3-5 Business Days',
      fee,
      status: 'processing',
      trackingNumber: `EXP-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: 'BlueDart Express Secure',
    };

    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        return { ...c, replacementRequest: replacement };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }

    addToast({
      type: 'success',
      title: 'Card Replacement Requested',
      message: `Request ${reqId} generated. New ${cardType} card will be delivered to your address.`,
    });

    return replacement;
  };

  const addCard = (cardData: Omit<CreditDebitCard, 'id'>): CreditDebitCard => {
    const newId = `crd_${Math.random().toString(36).substring(2, 9)}`;
    const newCard: CreditDebitCard = {
      ...cardData,
      id: newId,
      isFrozen: false,
      status: 'active',
      dailyDomesticLimit: cardData.dailyDomesticLimit || 100000,
      dailyInternationalLimit: cardData.dailyInternationalLimit || 50000,
      dailyAtmLimit: cardData.dailyAtmLimit || 50000,
      dailyPosLimit: cardData.dailyPosLimit || 100000,
      dailyOnlineLimit: cardData.dailyOnlineLimit || 75000,
      maxAtmLimit: 100000,
      maxPosLimit: 300000,
      maxOnlineLimit: 300000,
      maxInternationalLimit: 150000,
      onlineTxnEnabled: cardData.onlineTxnEnabled ?? true,
      contactlessEnabled: cardData.contactlessEnabled ?? true,
      internationalEnabled: cardData.internationalEnabled ?? false,
      atmEnabled: cardData.atmEnabled ?? true,
      posTxnEnabled: cardData.posTxnEnabled ?? true,
      rewardsPoints: cardData.rewardsPoints || 500,
    };

    if (bankingType === 'retail') {
      setRetailCards(prev => [newCard, ...prev]);
    } else {
      setCorporateCards(prev => [newCard, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Card Added Successfully',
      message: `${newCard.network} ${newCard.tier} card ending in ${newCard.cardNumber.slice(-4)} is now linked.`,
    });

    return newCard;
  };

  const changeCardPin = (cardId: string, _pin: string) => {
    addToast({
      type: 'success',
      title: 'PIN Changed Successfully',
      message: 'Your 4-digit ATM & POS security PIN has been updated instantly across network switches.',
    });
  };

  const payCreditCardBill = (cardId: string, amount: number, fromAccountId: string) => {
    // Deduct from paying account
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        const bal = acc.balance - amount;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    // Update credit card balance
    setRetailCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const currentOutstanding = c.outstandingBalance || 0;
        const newOutstanding = Math.max(0, currentOutstanding - amount);
        const currentAvail = c.availableLimit || 0;
        const newAvail = (c.totalLimit || 500000) - newOutstanding;
        return {
          ...c,
          outstandingBalance: newOutstanding,
          availableLimit: newAvail,
          minAmountDue: newOutstanding > 0 ? Math.round(newOutstanding * 0.05) : 0,
        };
      }
      return c;
    }));

    // Add transaction to main transaction ledger
    const txn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: `BILL-CC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: 'Today, Just now',
      amount,
      type: 'debit',
      category: 'bill',
      description: 'Bharat Bank Credit Card Bill Settlement',
      counterpartyName: 'Credit Card Operations',
      status: 'completed',
      paymentMode: 'Internal',
      remarks: 'Instant bill payment with real-time credit limit restoration.'
    };

    setRetailTransactions(prev => [txn, ...prev]);

    // Also add to card transactions as credit
    const cardTxn: CardTransaction = {
      id: 'ctx_' + Math.random().toString(36).substring(2, 9),
      cardId,
      merchant: 'Card Bill Payment (Auto-Settled)',
      merchantCategory: 'Refund',
      amount,
      type: 'credit',
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      paymentMethod: 'Online',
      referenceNumber: txn.referenceNumber,
      authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      city: 'Mumbai',
    };

    setCardTransactions(prev => [cardTxn, ...prev]);

    addToast({
      type: 'success',
      title: 'Credit Card Bill Paid',
      message: `₹${amount.toLocaleString('en-IN')} paid. Available credit limit restored instantly.`,
    });
  };

  const updateCardLimits = (cardId: string, domesticLimit: number, intlLimit: number) => {
    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        return { ...c, dailyDomesticLimit: domesticLimit, dailyInternationalLimit: intlLimit };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }

    addToast({
      type: 'success',
      title: 'Limits Updated',
      message: `Daily domestic limit set to ₹${domesticLimit.toLocaleString('en-IN')}.`,
    });
  };

  const updateGranularCardLimits = (
    cardId: string, 
    limits: { atm?: number; pos?: number; online?: number; intl?: number; domestic?: number }
  ) => {
    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          dailyAtmLimit: limits.atm !== undefined ? limits.atm : (c.dailyAtmLimit || 50000),
          dailyPosLimit: limits.pos !== undefined ? limits.pos : (c.dailyPosLimit || 100000),
          dailyOnlineLimit: limits.online !== undefined ? limits.online : (c.dailyOnlineLimit || 75000),
          dailyInternationalLimit: limits.intl !== undefined ? limits.intl : c.dailyInternationalLimit,
          dailyDomesticLimit: limits.domestic !== undefined ? limits.domestic : c.dailyDomesticLimit,
        };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }

    addToast({
      type: 'success',
      title: 'Transaction Limits Updated',
      message: 'Your custom ATM, POS, and Online limits have been updated successfully.',
    });
  };

  const toggleCardFeature = (cardId: string, feature: 'online' | 'contactless' | 'international' | 'atm' | 'pos') => {
    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        const key = feature === 'online' ? 'onlineTxnEnabled'
          : feature === 'contactless' ? 'contactlessEnabled'
          : feature === 'international' ? 'internationalEnabled'
          : feature === 'pos' ? 'posTxnEnabled'
          : 'atmEnabled';
        const nextVal = !c[key];
        addToast({
          type: 'info',
          title: 'Card Security Changed',
          message: `${feature.toUpperCase()} transactions ${nextVal ? 'enabled' : 'disabled'}.`,
        });
        return { ...c, [key]: nextVal };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }
  };

  const setCardControl = (cardId: string, control: 'online' | 'contactless' | 'international' | 'atm' | 'pos', enabled: boolean) => {
    const key = control === 'online' ? 'onlineTxnEnabled'
      : control === 'contactless' ? 'contactlessEnabled'
      : control === 'international' ? 'internationalEnabled'
      : control === 'pos' ? 'posTxnEnabled'
      : 'atmEnabled';

    const updater = (list: CreditDebitCard[]) => list.map(c => {
      if (c.id === cardId) {
        return { ...c, [key]: enabled };
      }
      return c;
    });

    if (bankingType === 'retail') {
      setRetailCards(updater);
    } else {
      setCorporateCards(updater);
    }

    addToast({
      type: enabled ? 'success' : 'warning',
      title: 'Card Control Saved',
      message: `${control.toUpperCase()} transactions ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const resolveSecurityAlert = (alertId: string, isLegit: boolean) => {
    setSecurityAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: isLegit ? ('confirmed_legit' as const) : ('fraud_reported' as const)
        };
      }
      return a;
    }));

    if (isLegit) {
      addToast({
        type: 'success',
        title: 'Activity Verified',
        message: 'Transaction marked as verified. No action required.',
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Fraud Alert Escalated',
        message: 'Transaction flagged for fraud team review. Security protections activated.',
      });
    }
  };

  const reportCardTransaction = (transactionId: string, reason: string) => {
    addToast({
      type: 'warning',
      title: 'Dispute & Fraud Report Filed',
      message: `Dispute reference #DSP-${Math.floor(100000 + Math.random() * 900000)} created for reason: ${reason}. Bharat Bank 24x7 security team is investigating.`,
    });
  };

  // Pay Biller
  const payBiller = (billerId: string, amount: number, accountId: string) => {
    const biller = billers.find(b => b.id === billerId);
    if (!biller) return;

    executeTransfer({
      fromAccountId: accountId,
      beneficiaryName: biller.name,
      beneficiaryAccount: biller.consumerNumber,
      bankName: 'Bharat BillPay System (BBPS)',
      amount,
      mode: 'UPI',
      remarks: `Utility Bill Payment for ${biller.name} (${biller.consumerNumber})`
    });

    // Update biller dueDate
    setBillers(prev => prev.map(b => {
      if (b.id === billerId) {
        return { ...b, lastBilledAmount: 0, dueDate: 'Paid (Next cycle: Sep 2026)' };
      }
      return b;
    }));
  };

  const fetchBill = (providerId: string, formData: Record<string, string>): FetchedBill | null => {
    const provider = billProviders.find((p) => p.id === providerId);
    if (!provider) return null;
    return mockFetchBill(provider, formData);
  };

  const processBillPayment = ({
    fetchedBill,
    amount,
    accountId,
    saveBiller,
    nickname,
  }: {
    fetchedBill: FetchedBill;
    amount: number;
    accountId: string;
    saveBiller?: boolean;
    nickname?: string;
  }): BillPaymentRecord => {
    const account = retailAccounts.find((a) => a.id === accountId);
    const txnId = `TXN-BBPS-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const refNum = `REF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    executeTransfer({
      fromAccountId: accountId,
      beneficiaryName: fetchedBill.billerName,
      beneficiaryAccount: fetchedBill.consumerNumber,
      bankName: 'Bharat BillPay System (BBPS)',
      amount,
      mode: 'UPI',
      remarks: `BBPS Bill Payment - ${fetchedBill.billNumber}`,
    });

    const record: BillPaymentRecord = {
      id: 'bpay_' + Math.random().toString(36).slice(2, 9),
      txnId,
      referenceNumber: refNum,
      billerName: fetchedBill.billerName,
      category: fetchedBill.category,
      customerName: fetchedBill.customerName,
      consumerNumberMasked: fetchedBill.maskedConsumerNumber,
      billNumber: fetchedBill.billNumber,
      amount,
      convenienceFee: fetchedBill.convenienceFee,
      totalPaid: amount + fetchedBill.convenienceFee,
      paymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      debitAccountId: accountId,
      debitAccountMasked: account?.maskedNumber || '•••• ••••',
      debitAccountType: account?.accountType || 'Savings',
      status: 'completed',
      paymentMethod: 'BBPS',
    };

    setBillPaymentHistory((prev) => [record, ...prev]);
    setUpcomingBills((prev) => prev.filter((b) => b.providerId !== fetchedBill.providerId));

    const existing = billers.find((b) => b.providerId === fetchedBill.providerId || b.consumerNumber === fetchedBill.consumerNumber);
    if (existing) {
      setBillers((prev) =>
        prev.map((b) =>
          b.id === existing.id
            ? {
                ...b,
                lastBilledAmount: 0,
                dueDate: 'Paid',
                lastPaymentDate: record.paymentDate,
                billStatus: 'paid' as const,
              }
            : b
        )
      );
    } else if (saveBiller) {
      const provider = billProviders.find((p) => p.id === fetchedBill.providerId);
      addSavedBiller({
        name: fetchedBill.billerName,
        nickname: nickname || fetchedBill.billerName,
        category: fetchedBill.category,
        consumerNumber: fetchedBill.consumerNumber,
        customerName: fetchedBill.customerName,
        serviceArea: provider?.serviceArea,
        providerId: fetchedBill.providerId,
        lastBilledAmount: 0,
        dueDate: 'Paid',
        lastPaymentDate: record.paymentDate,
        billStatus: 'paid',
        isAutoPay: false,
        iconName: provider?.iconName || 'Zap',
      });
    }

    addToast({
      type: 'success',
      title: 'Bill Paid Successfully',
      message: `₹${amount.toLocaleString('en-IN')} paid to ${fetchedBill.billerName}`,
    });

    return record;
  };

  const addSavedBiller = (biller: Omit<Biller, 'id'>): Biller => {
    const newBiller: Biller = { ...biller, id: 'bil_' + Math.random().toString(36).slice(2, 9) };
    setBillers((prev) => [...prev, newBiller]);
    addToast({ type: 'success', title: 'Biller Saved', message: `${newBiller.nickname || newBiller.name} added to saved billers.` });
    return newBiller;
  };

  const updateSavedBiller = (billerId: string, updates: Partial<Biller>) => {
    setBillers((prev) => prev.map((b) => (b.id === billerId ? { ...b, ...updates } : b)));
    addToast({ type: 'success', title: 'Biller Updated', message: 'Saved biller details updated.' });
  };

  const deleteSavedBiller = (billerId: string) => {
    setBillers((prev) => prev.filter((b) => b.id !== billerId));
    addToast({ type: 'info', title: 'Biller Removed', message: 'Saved biller has been deleted.' });
  };

  const toggleBillerAutoPay = (
    billerId: string,
    enabled: boolean,
    rule?: Biller['autoPayRule'],
    maxAmount?: number
  ) => {
    setBillers((prev) =>
      prev.map((b) =>
        b.id === billerId
          ? { ...b, isAutoPay: enabled, autoPayRule: rule || 'full', autoPayMaxAmount: maxAmount }
          : b
      )
    );
    addToast({
      type: enabled ? 'success' : 'info',
      title: enabled ? 'AutoPay Enabled' : 'AutoPay Disabled',
      message: enabled ? 'Bills will be paid automatically as per your rule.' : 'AutoPay has been turned off.',
    });
  };

  const clearProfileDeepLink = () => setProfileDeepLink(null);
  const clearBillDeepLink = () => setBillDeepLink(null);

  const toggleFavoriteService = (serviceId: string) => {
    setFavoriteServiceIds((prev) => {
      const next = prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      localStorage.setItem('apex_favorite_services', JSON.stringify(next));
      return next;
    });
  };

  const requestChequeBook = (accountId: string, leaves: number): string => {
    const account = retailAccounts.find((a) => a.id === accountId);
    const ref = generateChequeReference('CHQ-BK');
    const newBook: ChequeBook = {
      id: `cb_${Date.now()}`,
      accountId,
      accountLabel: `${account?.accountType ?? 'Account'} ${account?.maskedNumber ?? ''}`,
      chequeBookNumber: ref,
      leavesTotal: leaves,
      leavesUsed: 0,
      issuedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'active',
    };
    setChequeBooks((prev) => [newBook, ...prev]);
    addToast({
      type: 'success',
      title: 'Cheque Book Requested',
      message: `Your request ${ref} will be delivered in 5–7 working days.`,
    });
    return ref;
  };

  const stopCheque = (accountId: string, chequeNumber: string, reason: string): string => {
    const account = retailAccounts.find((a) => a.id === accountId);
    const ref = generateChequeReference('CHQ-STOP');
    setIssuedCheques((prev) =>
      prev.map((c) =>
        c.chequeNumber === chequeNumber ? { ...c, status: 'stopped' as const } : c
      )
    );
    if (!issuedCheques.some((c) => c.chequeNumber === chequeNumber)) {
      setIssuedCheques((prev) => [
        {
          id: `chq_stop_${Date.now()}`,
          chequeNumber,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          payee: reason,
          amount: 0,
          status: 'stopped',
          type: 'issued',
          accountLabel: account?.maskedNumber ?? '',
        },
        ...prev,
      ]);
    }
    addToast({
      type: 'success',
      title: 'Stop Cheque Registered',
      message: `Cheque ${chequeNumber} has been stopped. Ref: ${ref}`,
    });
    return ref;
  };

  const registerPositivePay = (params: {
    chequeNumber: string;
    payeeName: string;
    amount: number;
    issueDate: string;
  }): string => {
    const ref = generateChequeReference('PP');
    const entry: PositivePayRegistration = {
      id: `pp_${Date.now()}`,
      chequeNumber: params.chequeNumber,
      payeeName: params.payeeName,
      amount: params.amount,
      issueDate: params.issueDate,
      status: 'registered',
      reference: ref,
    };
    setPositivePayRegs((prev) => [entry, ...prev]);
    addToast({
      type: 'success',
      title: 'Positive Pay Registered',
      message: `Cheque ${params.chequeNumber} registered for ₹${params.amount.toLocaleString('en-IN')}.`,
    });
    return ref;
  };

  const lookupBanlName = (accountNumber: string, ifsc: string): BanlLookupResult =>
    lookupBanl(accountNumber, ifsc);

  const requestEStatement = (params: {
    accountId: string;
    frequency: EStatementSubscription['frequency'];
    format: EStatementSubscription['format'];
    email: string;
  }): string => {
    const account = retailAccounts.find((a) => a.id === params.accountId);
    const ref = generateEStatementRef();
    const sub: EStatementSubscription = {
      id: `est_${Date.now()}`,
      accountId: params.accountId,
      accountLabel: `${account?.accountType ?? 'Account'} ${account?.maskedNumber ?? ''}`,
      frequency: params.frequency,
      email: params.email,
      format: params.format,
      status: 'active',
      nextDelivery: '01 Sep 2026',
      startedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setEStatementSubscriptions((prev) => [sub, ...prev]);
    addToast({
      type: 'success',
      title: 'eStatement Requested',
      message: `Reference ${ref}. Delivery scheduled ${params.frequency}.`,
    });
    return ref;
  };

  const stopEStatement = (subscriptionId: string) => {
    setEStatementSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'stopped' as const } : s))
    );
  };

  const resumeEStatement = (subscriptionId: string) => {
    setEStatementSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'active' as const } : s))
    );
  };

  const updateEStatementFrequency = (
    subscriptionId: string,
    frequency: EStatementSubscription['frequency']
  ) => {
    setEStatementSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, frequency, status: 'active' as const } : s))
    );
    addToast({ type: 'success', title: 'Updated', message: `Frequency set to ${frequency}.` });
  };

  const freezeAccount = (accountId: string) => {
    setRetailAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status: 'frozen' as const } : a))
    );
    addToast({
      type: 'warning',
      title: 'Account Frozen',
      message: 'Outgoing debits are blocked. Credits will continue to be accepted.',
    });
  };

  const unfreezeAccount = (accountId: string) => {
    setRetailAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status: 'active' as const } : a))
    );
    addToast({ type: 'success', title: 'Account Unfrozen', message: 'Full account operations restored.' });
  };

  const freezeCorporateAccount = (accountId: string) => {
    setCorporateAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status: 'frozen' as const } : a))
    );
    setCorporateAccountFrozen(accountId, true);
    addToast({
      type: 'warning',
      title: 'Account Frozen',
      message: 'Outgoing debits are blocked for this corporate account.',
    });
  };

  const unfreezeCorporateAccount = (accountId: string) => {
    setCorporateAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status: 'active' as const } : a))
    );
    setCorporateAccountFrozen(accountId, false);
    addToast({ type: 'success', title: 'Account Unfrozen', message: 'Corporate account operations restored.' });
  };

  const setTransferRepeat = (payload: TransferRepeatPayload) => setTransferRepeatState(payload);
  const clearTransferRepeat = () => setTransferRepeatState(null);

  const deleteNachMandate = (mandateId: string) => {
    setNachMandates((prev) =>
      prev.map((m) => (m.id === mandateId ? { ...m, status: 'cancelled' as const } : m))
    );
  };

  const updateAccountNominees = (
    accountId: string,
    nominees: NonNullable<BankAccount['nominees']>
  ) => {
    setRetailAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, nominees } : a))
    );
    addToast({
      type: 'success',
      title: 'Nominee Updated',
      message: 'Nominee details saved successfully.',
    });
  };

  const processTaxPayment = (params: {
    accountId: string;
    amount: number;
    taxType: string;
    pan: string;
    assessmentYear: string;
  }): string => {
    const ref = `CIN${Date.now().toString().slice(-10)}`;
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== params.accountId) return acc;
        const bal = acc.balance - params.amount;
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    const txn: Transaction = {
      id: `txn_tax_${Date.now()}`,
      referenceNumber: ref,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      amount: params.amount,
      type: 'debit',
      category: 'tax',
      description: `${params.taxType} — AY ${params.assessmentYear}`,
      counterpartyName: 'Income Tax / GST',
      status: 'completed',
      paymentMode: 'Internal',
      remarks: `PAN ${params.pan}`,
    };
    setRetailTransactions((prev) => [txn, ...prev]);
    addToast({
      type: 'success',
      title: 'Tax Paid',
      message: `₹${params.amount.toLocaleString('en-IN')} paid. Challan ${ref}.`,
    });
    return ref;
  };

  const addActivityEvent = (event: Omit<ActivityEvent, 'id'>) => {
    setActivityEvents((prev) => [{ ...event, id: `act_${Date.now()}` }, ...prev].slice(0, 50));
  };

  const createScheduledTransfer = (
    params: Omit<ScheduledTransfer, 'id' | 'status' | 'scheduledDate' | 'nextExecution'> & {
      frequency: ScheduledTransfer['frequency'];
    }
  ) => {
    const freqLabel =
      params.frequency === 'monthly' ? '05 of every month' :
      params.frequency === 'weekly' ? 'Every Monday' : 'Scheduled date';
    const next =
      params.frequency === 'monthly' ? '05 Sep 2026' :
      params.frequency === 'weekly' ? '25 Aug 2026' : '01 Sep 2026';
    const entry: ScheduledTransfer = {
      ...params,
      id: `sch_${Date.now()}`,
      status: 'active',
      scheduledDate: freqLabel,
      nextExecution: next,
    };
    setScheduledTransfers((prev) => [entry, ...prev]);
    addActivityEvent({
      category: 'transfer',
      title: 'Transfer Scheduled',
      description: `₹${params.amount.toLocaleString('en-IN')} to ${params.beneficiaryName}`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Scheduled', message: 'Transfer instruction created.' });
  };

  const cancelScheduledTransfer = (id: string) => {
    setScheduledTransfers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' as const } : s))
    );
    addToast({ type: 'info', title: 'Cancelled', message: 'Scheduled transfer removed.' });
  };

  const toggleScheduledTransferPause = (id: string) => {
    setScheduledTransfers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = s.status === 'paused' ? 'active' : 'paused';
        return { ...s, status: next };
      })
    );
  };

  const createMoneyRequest = (params: {
    counterpartyName: string;
    counterpartyUpi: string;
    amount: number;
    note: string;
  }) => {
    const entry: MoneyRequest = {
      id: `mr_${Date.now()}`,
      ...params,
      status: 'pending',
      createdAt: 'Just now',
      direction: 'sent',
    };
    setMoneyRequests((prev) => [entry, ...prev]);
    addToast({ type: 'success', title: 'Request Sent', message: `Collect request sent to ${params.counterpartyName}.` });
  };

  const respondToMoneyRequest = (id: string, action: 'paid' | 'declined') => {
    setMoneyRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    addToast({
      type: action === 'paid' ? 'success' : 'info',
      title: action === 'paid' ? 'Paid' : 'Declined',
      message: action === 'paid' ? 'UPI collect request paid.' : 'Request declined.',
    });
  };

  const generateCardlessWithdrawal = (accountId: string, amount: number) => {
    const acc = retailAccounts.find((a) => a.id === accountId);
    const otp = generateCardlessOtp();
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    const expiresAt = expires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entry: CardlessWithdrawal = {
      id: `cw_${Date.now()}`,
      amount,
      otp,
      expiresAt,
      atmHint: 'Any Bharat Bank ATM',
      status: 'active',
      createdAt: 'Just now',
      accountLabel: `${acc?.accountType ?? 'Savings'} ${acc?.maskedNumber ?? ''}`,
    };
    setCardlessWithdrawals((prev) => [entry, ...prev]);
    addToast({ type: 'success', title: 'Code Generated', message: `Valid until ${expiresAt}.` });
    return { otp, expiresAt };
  };

  const updateRetailTransactionLimits = (limits: RetailTransactionLimits) => {
    setRetailTransactionLimits(limits);
    addActivityEvent({
      category: 'security',
      title: 'Limits Updated',
      description: 'Transaction limits modified',
      timestamp: 'Just now',
      status: 'info',
    });
  };

  const openRetailAccount = (
    type: 'savings' | 'current' | 'nre-savings',
    nickname?: string
  ): BankAccount => {
    const accountTypeMap = {
      savings: 'Savings' as const,
      current: 'Current' as const,
      'nre-savings': 'NRE Savings' as const,
    };
    const num = String(Math.floor(100000000000 + Math.random() * 900000000000));
    const last4 = num.slice(-4);
    const account: BankAccount = {
      id: `acc_ret_new_${Date.now()}`,
      accountNumber: num,
      maskedNumber: `•••• •••• ${last4}`,
      accountType: accountTypeMap[type],
      balance: 0,
      availableBalance: 0,
      currency: '₹',
      ifsc: 'APEX0001048',
      branch: 'Bandra Kurla Complex, Mumbai',
      nickname: nickname || accountTypeMap[type],
      status: 'active',
      interestRate: type === 'nre-savings' ? 4.25 : type === 'savings' ? 3.5 : undefined,
    };
    setRetailAccounts((prev) => [...prev, account]);
    addActivityEvent({
      category: 'profile',
      title: 'Account Opened',
      description: `${account.accountType} •••• ${last4}`,
      timestamp: 'Just now',
      status: 'success',
    });
    return account;
  };

  const payRdInstallment = (rdId: string, accountId: string) => {
    const rd = recurringDeposits.find((r) => r.id === rdId);
    if (!rd) return;
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const bal = Math.max(0, acc.balance - rd.monthlyAmount);
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    setRecurringDeposits((prev) =>
      prev.map((r) =>
        r.id === rdId
          ? { ...r, totalInvested: r.totalInvested + rd.monthlyAmount, nextInstallmentDate: '05 Sep 2026' }
          : r
      )
    );
    const ref = `RD${Date.now().toString().slice(-8)}`;
    setRetailTransactions((prev) => [
      {
        id: `txn_rd_${Date.now()}`,
        referenceNumber: ref,
        date: 'Today, Just now',
        amount: rd.monthlyAmount,
        type: 'debit',
        category: 'investment',
        description: `RD Installment — ${rd.rdNumber}`,
        counterpartyName: 'Recurring Deposit',
        status: 'completed',
        paymentMode: 'Internal',
      },
      ...prev,
    ]);
    addActivityEvent({
      category: 'deposit',
      title: 'RD Installment Paid',
      description: `₹${rd.monthlyAmount.toLocaleString('en-IN')} — ${rd.rdNumber}`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Installment Paid', message: `₹${rd.monthlyAmount.toLocaleString('en-IN')} debited. Ref ${ref}.` });
  };

  const contributeToGovtScheme = (accountId: string, amount: number, debitAccountId: string) => {
    let schemeLabel = 'GOVT';
    setGovtSavingsAccounts((prev) =>
      prev.map((a) => {
        if (a.id === accountId) {
          schemeLabel = a.scheme.toUpperCase();
          return { ...a, balance: a.balance + amount, contributedYtd: a.contributedYtd + amount };
        }
        return a;
      })
    );
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== debitAccountId) return acc;
        const bal = Math.max(0, acc.balance - amount);
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    addActivityEvent({
      category: 'deposit',
      title: 'Govt Scheme Contribution',
      description: `₹${amount.toLocaleString('en-IN')} to ${schemeLabel}`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Contribution Successful', message: `₹${amount.toLocaleString('en-IN')} credited to scheme.` });
  };

  const submitForm15G = (params: { formType: '15G' | '15H'; financialYear: string; estimatedIncome: number }): string => {
    const reference = `F${params.formType}-${Date.now().toString().slice(-8)}`;
    const entry: Form15GSubmission = {
      id: `f15_${Date.now()}`,
      formType: params.formType,
      financialYear: params.financialYear,
      estimatedIncome: params.estimatedIncome,
      submittedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'submitted',
      reference,
    };
    setForm15gSubmissions((prev) => [entry, ...prev]);
    addActivityEvent({
      category: 'profile',
      title: `Form ${params.formType} Submitted`,
      description: `FY ${params.financialYear} — ${reference}`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Form Submitted', message: `Reference ${reference}` });
    return reference;
  };

  const submitRemittance = (params: {
    beneficiaryName: string;
    country: string;
    currency: string;
    amountInr: number;
    amountForeign: number;
    purpose: string;
    accountId: string;
    scheme: 'SWIFT' | 'LRS';
  }) => {
    const reference = `${params.scheme === 'LRS' ? 'LRS' : 'SWF'}${Date.now().toString().slice(-8)}`;
    const entry: RemittanceRequest = {
      id: `rem_${Date.now()}`,
      beneficiaryName: params.beneficiaryName,
      country: params.country,
      currency: params.currency,
      amountInr: params.amountInr,
      amountForeign: params.amountForeign,
      purpose: params.purpose,
      status: 'pending',
      reference,
      createdAt: 'Just now',
      scheme: params.scheme,
    };
    setRemittanceRequests((prev) => [entry, ...prev]);
    if (params.scheme === 'LRS') setLrsUsedYtd((v) => v + params.amountInr);
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== params.accountId) return acc;
        const bal = Math.max(0, acc.balance - params.amountInr);
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    addActivityEvent({
      category: 'transfer',
      title: `${params.scheme} Remittance`,
      description: `₹${params.amountInr.toLocaleString('en-IN')} to ${params.beneficiaryName}`,
      timestamp: 'Just now',
      status: 'info',
    });
    addToast({ type: 'success', title: 'Remittance Initiated', message: `Reference ${reference}. Processing 1–2 business days.` });
  };

  const loadForexCard = (cardId: string, currency: string, foreignAmount: number, debitAccountId: string, inrAmount: number) => {
    setForexCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const balances = c.balances.map((b) =>
          b.currency === currency ? { ...b, amount: b.amount + foreignAmount } : b
        );
        if (!balances.find((b) => b.currency === currency)) {
          const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
          balances.push({ currency, amount: foreignAmount, symbol: symbols[currency] || currency });
        }
        return { ...c, balances };
      })
    );
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== debitAccountId) return acc;
        const bal = Math.max(0, acc.balance - inrAmount);
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    addToast({ type: 'success', title: 'Card Loaded', message: `${currency} ${foreignAmount} added to forex card.` });
  };

  const applyForexCard = () => {
    const card: ForexCardAccount = {
      id: `fx_${Date.now()}`,
      cardLabel: 'Multi-Currency Forex Card',
      maskedNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      balances: [{ currency: 'USD', amount: 0, symbol: '$' }],
    };
    setForexCards((prev) => [...prev, card]);
    addToast({ type: 'success', title: 'Card Applied', message: 'Forex card will be dispatched in 5–7 days.' });
  };

  const bookBranchAppointment = (params: { branchName: string; purpose: string; date: string; timeSlot: string }) => {
    const reference = `APT-${Date.now().toString().slice(-6)}`;
    const entry: BranchAppointment = {
      id: `apt_${Date.now()}`,
      ...params,
      status: 'confirmed',
      reference,
    };
    setBranchAppointments((prev) => [entry, ...prev]);
    addToast({ type: 'success', title: 'Appointment Booked', message: `${params.date} • ${params.timeSlot} — ${reference}` });
  };

  const redeemReward = (rewardId: string, points: number, rewardName: string) => {
    setRewardPoints((prev) => Math.max(0, prev - points));
    addActivityEvent({
      category: 'payment',
      title: 'Reward Redeemed',
      description: `${rewardName} (${points} pts)`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Redeemed!', message: `${rewardName} voucher sent to your registered email.` });
  };

  const applyLocker = (params: { branchName: string; lockerSize: LockerApplication['lockerSize']; annualRent: number }) => {
    const entry: LockerApplication = {
      id: `lck_${Date.now()}`,
      ...params,
      status: 'active',
      lockerNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setLockerApplications((prev) => [...prev, entry]);
    addToast({ type: 'success', title: 'Locker Allotted', message: `Locker ${entry.lockerNumber} at ${params.branchName}.` });
  };

  const bookLockerVisit = (lockerId: string, visitDate: string) => {
    addToast({
      type: 'success',
      title: 'Visit Booked',
      message: `Locker access scheduled for ${visitDate}. Carry locker key & ID.`,
    });
    addActivityEvent({
      category: 'profile',
      title: 'Locker Visit Booked',
      description: visitDate,
      timestamp: 'Just now',
      status: 'info',
    });
  };

  const requestLoanClosureCert = (loanId: string): string => {
    const loan = loans.find((l) => l.id === loanId);
    const reference = `LCC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry: LoanClosureCertificateRequest = {
      id: `lcc_${Date.now()}`,
      loanId,
      loanNumber: loan?.loanNumber || '—',
      loanType: loan?.type || 'Loan',
      requestedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'processing',
      reference,
    };
    setLoanClosureRequests((prev) => [entry, ...prev]);
    addActivityEvent({
      category: 'profile',
      title: 'Closure Certificate Requested',
      description: loan?.loanNumber || reference,
      timestamp: 'Just now',
      status: 'info',
    });
    return reference;
  };

  const investInBond = (bondId: string, amount: number, accountId: string) => {
    const bond = BOND_OFFERINGS.find((b) => b.id === bondId);
    if (!bond) return;
    const units = Math.floor(amount / bond.minInvestment);
    const maturityYear = new Date().getFullYear() + bond.maturityYears;
    const holding: BondHolding = {
      id: `bh_${Date.now()}`,
      bondId,
      bondName: bond.name,
      category: bond.category,
      investedAmount: amount,
      units,
      couponRate: bond.couponRate,
      maturityDate: `15 Dec ${maturityYear}`,
      purchasedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setBondHoldings((prev) => {
      const existing = prev.find((h) => h.bondId === bondId);
      if (existing) {
        return prev.map((h) =>
          h.bondId === bondId
            ? { ...h, investedAmount: h.investedAmount + amount, units: h.units + units }
            : h
        );
      }
      return [holding, ...prev];
    });
    setRetailAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const bal = Math.max(0, acc.balance - amount);
        return { ...acc, balance: bal, availableBalance: bal - (acc.holdAmount || 0) };
      })
    );
    addActivityEvent({
      category: 'payment',
      title: 'Bond Purchase',
      description: `₹${amount.toLocaleString('en-IN')} — ${bond.name}`,
      timestamp: 'Just now',
      status: 'success',
    });
    addToast({ type: 'success', title: 'Bond Purchased', message: `${bond.name} — ₹${amount.toLocaleString('en-IN')}` });
  };

  const applyDematAccount = (linkedAccountId: string) => {
    const account = retailAccounts.find((a) => a.id === linkedAccountId);
    const dpId = `IN${Math.floor(100000 + Math.random() * 900000)}`;
    const clientId = String(Math.floor(10000000 + Math.random() * 90000000));
    const entry: DematAccount = {
      id: `demat_${Date.now()}`,
      dpId,
      clientId,
      status: 'pending',
      linkedAccountLabel: account?.nickname || account?.type || 'Savings Account',
    };
    setDematAccount(entry);
    addActivityEvent({
      category: 'profile',
      title: 'Demat Application',
      description: `${dpId} / ${clientId}`,
      timestamp: 'Just now',
      status: 'info',
    });
    addToast({ type: 'success', title: 'Application Submitted', message: 'Demat account will be activated in 2–3 working days.' });
  };

  const submitFeedback = (params: { category: string; rating: number; message: string }): string => {
    const reference = `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry: FeedbackSubmission = {
      id: `fb_${Date.now()}`,
      ...params,
      submittedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      reference,
      status: 'submitted',
    };
    setFeedbackSubmissions((prev) => [entry, ...prev]);
    addToast({ type: 'success', title: 'Thank you!', message: 'Your feedback has been recorded.' });
    return reference;
  };

  const navigateService = (serviceId: string, route: ServiceRoute) => {
    setRecentServiceIds((prev) => {
      const next = [serviceId, ...prev.filter((id) => id !== serviceId)].slice(0, 8);
      localStorage.setItem('apex_recent_services', JSON.stringify(next));
      return next;
    });

    if (route.kind === 'tab') {
      setRetailTab(route.tab);
    } else if (route.kind === 'profile') {
      setProfileDeepLink(route.screen);
      setRetailTab('profile');
    } else if (route.kind === 'bill') {
      setBillDeepLink(route.screen);
      setRetailTab('bills');
    } else if (route.kind === 'scanner') {
      openScanner();
    } else if (route.kind === 'locator') {
      setLocatorType(route.locatorType);
      setRetailTab('locator');
    } else if (route.kind === 'toast') {
      addToast({ type: 'info', title: route.title, message: route.message });
    }
  };

  // Create Fixed Deposit
  const createFixedDeposit = (principal: number, tenureMonths: number, payout: FixedDeposit['payoutFrequency'], maturityInstruction: FixedDeposit['maturityInstruction'], accountId: string): FixedDeposit => {
    const rate = tenureMonths >= 18 ? 7.75 : 7.25;
    const maturityAmt = Math.round(principal * (1 + (rate / 100) * (tenureMonths / 12)));
    
    // Deduct principal from selected account
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const bal = acc.balance - principal;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    const fdNum = `FD-APEX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newFd: FixedDeposit = {
      id: 'fd_' + Math.random().toString(36).substring(2, 9),
      fdNumber: fdNum,
      principalAmount: principal,
      interestRate: rate,
      tenureMonths,
      startDate: 'Today',
      maturityDate: `${tenureMonths} Months from now`,
      maturityAmount: maturityAmt,
      payoutFrequency: payout,
      autoRenew: maturityInstruction !== 'Transfer to Account',
      linkedAccount: '•••• •••• 0012',
      status: 'active',
      maturityInstruction: maturityInstruction
    };

    setFixedDeposits(prev => [newFd, ...prev]);

    addToast({
      type: 'success',
      title: 'Fixed Deposit Created',
      message: `Deposit of ₹${principal.toLocaleString('en-IN')} booked at ${rate}% p.a.`,
    });

    return newFd;
  };

  const createRecurringDeposit = (monthlyAmount: number, tenureMonths: number, accountId: string): RecurringDeposit => {
    const rate = 6.75;
    // Simple mock calculation for RD maturity
    const totalInvested = monthlyAmount * tenureMonths;
    const estimatedInterest = Math.round(totalInvested * (rate / 100) * (tenureMonths / 24)); 
    const estimatedMaturity = totalInvested + estimatedInterest;

    // Deduct first installment
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const bal = acc.balance - monthlyAmount;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    const rdNum = `RD-APEX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRd: RecurringDeposit = {
      id: 'rd_' + Math.random().toString(36).substring(2, 9),
      rdNumber: rdNum,
      monthlyAmount,
      interestRate: rate,
      tenureMonths,
      startDate: 'Today',
      maturityDate: `${tenureMonths} Months from now`,
      estimatedMaturityAmount: estimatedMaturity,
      totalInvested: monthlyAmount,
      linkedAccount: '•••• •••• 0012',
      status: 'active',
      nextInstallmentDate: 'Next Month'
    };

    setRecurringDeposits(prev => [newRd, ...prev]);

    addToast({
      type: 'success',
      title: 'Recurring Deposit Started',
      message: `RD of ₹${monthlyAmount.toLocaleString('en-IN')}/month started successfully.`,
    });

    return newRd;
  };

  const closeDeposit = (depositId: string, type: 'FD' | 'RD') => {
    let amountToCredit = 0;
    if (type === 'FD') {
      const fd = fixedDeposits.find(f => f.id === depositId);
      if (fd) {
        // Penalty logic: 1% reduction and partial interest
        amountToCredit = fd.principalAmount + (fd.maturityAmount - fd.principalAmount) * 0.7;
        setFixedDeposits(prev => prev.map(f => f.id === depositId ? { ...f, status: 'closed' } : f));
      }
    } else {
      const rd = recurringDeposits.find(r => r.id === depositId);
      if (rd) {
        amountToCredit = rd.totalInvested + (rd.estimatedMaturityAmount - (rd.monthlyAmount * rd.tenureMonths)) * 0.5;
        setRecurringDeposits(prev => prev.map(r => r.id === depositId ? { ...r, status: 'closed' } : r));
      }
    }

    // Credit to savings
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.accountType === 'Savings') {
        const bal = acc.balance + amountToCredit;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    addToast({
      type: 'success',
      title: 'Deposit Closed',
      message: `₹${Math.round(amountToCredit).toLocaleString('en-IN')} credited to your Savings account.`,
    });
  };

  const updateMaturityInstruction = (depositId: string, instruction: FixedDeposit['maturityInstruction']) => {
    setFixedDeposits(prev => prev.map(f => f.id === depositId ? { ...f, maturityInstruction: instruction } : f));
    addToast({
      type: 'success',
      title: 'Instruction Updated',
      message: `Maturity instruction set to: ${instruction}`,
    });
  };

  const getDepositTransactions = (depositId: string): DepositTransaction[] => {
    // Return mock transactions for the demo
    return [
      { id: 'dt1', depositId, type: 'Opening', amount: 500000, date: '12 Jan 2026', description: 'Deposit account opened', status: 'completed' },
      { id: 'dt2', depositId, type: 'Interest', amount: 3200, date: '12 Apr 2026', description: 'Quarterly interest accrued', status: 'completed' },
      { id: 'dt3', depositId, type: 'Interest', amount: 3250, date: '12 Jul 2026', description: 'Quarterly interest accrued', status: 'completed' },
    ];
  };

  // Insurance Methods
  const buyInsurance = (planId: string, details: any): InsurancePolicy => {
    const plan = insurancePlans.find(p => p.id === planId);
    const policyNum = `${plan?.type?.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newPolicy: InsurancePolicy = {
      id: 'pol_' + Math.random().toString(36).substring(2, 9),
      policyNumber: policyNum,
      type: plan?.type || 'Health',
      provider: plan?.provider || 'Bharat Secure',
      planName: plan?.name || 'Standard Plan',
      coverageAmount: details.coverageAmount || 1000000,
      premiumAmount: details.premiumAmount || 12000,
      premiumFrequency: 'Yearly',
      startDate: 'Today',
      expiryDate: '1 Year from now',
      status: 'active',
      nominee: details.nominees || []
    };

    setInsurancePolicies(prev => [newPolicy, ...prev]);

    addToast({
      type: 'success',
      title: 'Policy Issued',
      message: `Your ${newPolicy.type} insurance policy ${policyNum} is now active.`,
    });

    return newPolicy;
  };

  const payInsurancePremium = (policyId: string, amount: number, accountId: string) => {
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const bal = acc.balance - amount;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    setInsurancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: 'active' } : p));

    addToast({
      type: 'success',
      title: 'Premium Paid',
      message: `₹${amount.toLocaleString('en-IN')} paid successfully.`,
    });
  };

  const renewInsurancePolicy = (policyId: string, amount: number, accountId: string) => {
    payInsurancePremium(policyId, amount, accountId);
    setInsurancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, expiryDate: '1 Year extended' } : p));
    
    addToast({
      type: 'success',
      title: 'Policy Renewed',
      message: 'Your insurance coverage has been extended for another year.',
    });
  };

  const submitInsuranceClaim = (policyId: string, claimDetails: any): InsuranceClaim => {
    const policy = insurancePolicies.find(p => p.id === policyId);
    const claimNum = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newClaim: InsuranceClaim = {
      id: 'clm_' + Math.random().toString(36).substring(2, 9),
      claimNumber: claimNum,
      policyId,
      policyType: policy?.type || 'Health',
      claimType: claimDetails.type,
      incidentDate: claimDetails.date,
      description: claimDetails.description,
      estimatedAmount: claimDetails.amount,
      status: 'submitted',
      submissionDate: 'Today',
      timeline: [
        { status: 'Claim Submitted', date: 'Today', completed: true },
        { status: 'Documents Verified', date: 'Pending', completed: false },
        { status: 'Under Review', date: 'Pending', completed: false },
        { status: 'Settlement', date: 'Pending', completed: false },
      ]
    };

    setInsuranceClaims(prev => [newClaim, ...prev]);

    addToast({
      type: 'success',
      title: 'Claim Submitted',
      message: `Claim ${claimNum} has been registered and is under verification.`,
    });

    return newClaim;
  };

  // Loan Application
  const applyForLoan = (type: LoanAccount['type'], amount: number, tenureMonths: number): LoanAccount => {
    const rate = type === 'Home Loan' ? 8.4 : type === 'Vehicle Loan' ? 8.9 : 11.5;
    const monthlyRate = rate / 12 / 100;
    const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));
    
    const newLoan: LoanAccount = {
      id: 'loan_' + Math.random().toString(36).substring(2, 9),
      loanNumber: `LN-APEX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      type,
      sanctionedAmount: amount,
      outstandingAmount: amount,
      interestRate: rate,
      emiAmount: emi,
      nextEmiDate: '05 Sep 2026',
      tenureRemainingMonths: tenureMonths,
      totalTenureMonths: tenureMonths,
      status: 'active'
    };

    setLoans(prev => [newLoan, ...prev]);

    // Credit funds to Savings
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.accountType === 'Savings') {
        const bal = acc.balance + amount;
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    addToast({
      type: 'success',
      title: 'Instant Loan Sanctioned & Disbursed',
      message: `₹${amount.toLocaleString('en-IN')} credited to your Savings account at ${rate}% p.a.`,
    });

    return newLoan;
  };

  // Create SIP
  const createSIP = (fundId: string, monthlyAmount: number, date: number) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === fundId) {
        return { ...inv, sipAmount: monthlyAmount, sipDate: date };
      }
      return inv;
    }));

    addToast({
      type: 'success',
      title: 'Monthly SIP Configured',
      message: `Auto-debit of ₹${monthlyAmount.toLocaleString('en-IN')} on ${date}th of every month.`,
    });
  };

  // Payroll Batch
  const processPayrollBatch = (department?: string) => {
    const totalDisbursement = employees.reduce((sum, emp) => sum + emp.salary, 0);
    
    setCorporateAccounts(prev => prev.map(acc => {
      if (acc.accountType === 'Payroll') {
        const bal = Math.max(0, acc.balance - totalDisbursement);
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    const refNum = `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newTxn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      date: 'Today, Just now',
      amount: totalDisbursement,
      type: 'debit',
      category: 'payroll',
      description: `Disbursed Monthly Salary Batch to ${employees.length} Employees (${department || 'All Departments'})`,
      counterpartyName: 'Bharat Corporate Banking Automated Payroll Engine',
      status: 'completed',
      paymentMode: 'Bulk',
      remarks: 'Automated tax & PF deduction compliant.'
    };

    setCorporateTransactions(prev => [newTxn, ...prev]);

    addToast({
      type: 'success',
      title: 'Salary Batch Disbursed',
      message: `₹${totalDisbursement.toLocaleString('en-IN')} credited to ${employees.length} employee accounts.`,
    });
  };

  // Add Money (Deposit / Wallet Topup / Instant Fund Inward)
  const addMoneyToAccount = (accountId: string, amount: number, source: string): Transaction => {
    const refNum = `CR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    // Credit account balance
    let accountName = 'Savings Account';
    if (bankingType === 'retail') {
      setRetailAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
          accountName = `${acc.accountType} Account`;
          const bal = acc.balance + amount;
          return { ...acc, balance: bal, availableBalance: bal };
        }
        return acc;
      }));
    } else {
      setCorporateAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
          accountName = `${acc.accountType} Account`;
          const bal = acc.balance + amount;
          return { ...acc, balance: bal, availableBalance: bal };
        }
        return acc;
      }));
    }

    const newTxn: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      date: 'Today, Just now',
      amount,
      type: 'credit',
      category: 'transfer',
      description: `Money Added via ${source}`,
      counterpartyName: source,
      status: 'completed',
      paymentMode: source.includes('UPI') ? 'UPI' : 'IMPS',
      remarks: `Fund top-up to ${accountName}`,
    };

    if (bankingType === 'retail') {
      setRetailTransactions(prev => [newTxn, ...prev]);
    } else {
      setCorporateTransactions(prev => [newTxn, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Money Added Successfully',
      message: `₹${amount.toLocaleString('en-IN')} has been added to your ${accountName}.`,
    });

    return newTxn;
  };

  const extendSession = () => {
    setIsSessionTimeoutModalOpen(false);
    addToast({
      type: 'info',
      title: 'Session Extended',
      message: 'Your secure session has been refreshed for 15 minutes.',
    });
  };

  const triggerSessionTimeout = () => setIsSessionTimeoutModalOpen(true);

  const setPrimaryAccount = (accountId: string) => {
    setPrimaryAccountId(accountId);
    setDefaultDebitAccountId(accountId);
    addToast({
      type: 'success',
      title: 'Primary Account Updated',
      message: 'This account is now your default for eligible payments.',
    });
  };

  const setDefaultDebitAccount = (accountId: string) => {
    setDefaultDebitAccountId(accountId);
    addToast({
      type: 'success',
      title: 'Default Debit Account Updated',
      message: 'Payment flows will use this account by default.',
    });
  };

  const setDefaultCard = (cardId: string) => setDefaultCardId(cardId);

  const updateAccountNickname = (accountId: string, nickname: string) => {
    setRetailAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, nickname } : a))
    );
    addToast({ type: 'success', title: 'Nickname Updated', message: 'Account nickname saved.' });
  };

  const toggleAccountVisibility = (accountId: string) => {
    setHiddenAccountIds((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]
    );
  };

  const isAccountHidden = (accountId: string) => hiddenAccountIds.includes(accountId);

  const getPrimaryAccount = (): BankAccount =>
    retailAccounts.find((a) => a.id === primaryAccountId) || retailAccounts[0];

  const getDefaultDebitAccount = (): BankAccount =>
    retailAccounts.find((a) => a.id === defaultDebitAccountId) || getPrimaryAccount();

  const getVisibleAccounts = (): BankAccount[] =>
    retailAccounts.filter((a) => !hiddenAccountIds.includes(a.id));

  const setPrimaryCorporateAccount = (accountId: string) => {
    setPrimaryCorporateAccountId(accountId);
    setCorporateDefaultPaymentAccountId(accountId);
    addToast({
      type: 'success',
      title: 'Primary Operating Account Updated',
      message: 'This account is now your default debit account for eligible payments.',
    });
  };

  const setCorporateDefaultPaymentAccount = (accountId: string) => {
    setCorporateDefaultPaymentAccountId(accountId);
    addToast({
      type: 'success',
      title: 'Default Payment Account Updated',
      message: 'Corporate payment flows will use this account by default.',
    });
  };

  const updateCorporateAccountNickname = (accountId: string, nickname: string) => {
    setCorporateAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, nickname } : a))
    );
    addToast({ type: 'success', title: 'Nickname Updated', message: 'Account nickname saved.' });
  };

  const toggleCorporateAccountVisibility = (accountId: string) => {
    setCorporateHiddenAccountIds((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]
    );
  };

  const isCorporateAccountHidden = (accountId: string) =>
    corporateHiddenAccountIds.includes(accountId);

  const getPrimaryCorporateAccount = (): BankAccount =>
    corporateAccounts.find((a) => a.id === primaryCorporateAccountId) || corporateAccounts[0];

  const getVisibleCorporateAccounts = (): BankAccount[] =>
    corporateAccounts.filter((a) => !corporateHiddenAccountIds.includes(a.id));

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setPersonalInfo((prev) => ({ ...prev, ...updates }));
  };

  const updateNotificationPrefs = (updates: Partial<NotificationPreferences>) => {
    setNotificationPrefs((prev) => ({ ...prev, ...updates }));
  };

  const updateAppPrefs = (updates: Partial<AppPreferences>) => {
    setAppPrefs((prev) => ({ ...prev, ...updates }));
  };

  const updateSecuritySettings = (updates: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...updates }));
  };

  const updatePrivacyPrefs = (updates: Partial<PrivacyPreferences>) => {
    setPrivacyPrefs((prev) => ({ ...prev, ...updates }));
  };

  const removeTrustedDevice = (deviceId: string) => {
    setTrustedDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const signOutSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const signOutAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  const addServiceRequest = (type: string, _details: string): string => {
    const id = `SR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRequest: ServiceRequest = {
      id,
      type,
      status: 'created',
      createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeline: [
        { label: 'Request Created', completed: true, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
        { label: 'Under Review', completed: false },
        { label: 'Action Required', completed: false },
        { label: 'Resolved', completed: false },
      ],
    };
    setServiceRequests((prev) => [newRequest, ...prev]);
    return id;
  };

  const resetDemoData = () => {
    setRetailAccounts(INITIAL_RETAIL_ACCOUNTS);
    setCorporateAccounts(INITIAL_CORPORATE_ACCOUNTS);
    setRetailTransactions(INITIAL_RETAIL_TRANSACTIONS);
    setCorporateTransactions(INITIAL_CORPORATE_TRANSACTIONS);
    setApprovals(INITIAL_CORPORATE_APPROVALS);
    setRetailBeneficiaries(INITIAL_RETAIL_BENEFICIARIES);
    setCorporateBeneficiaries(INITIAL_CORPORATE_BENEFICIARIES);
    setRetailCards(INITIAL_RETAIL_CARDS);
    setCorporateCards(INITIAL_CORPORATE_CARDS);
    setFixedDeposits(INITIAL_FIXED_DEPOSITS);
    setLoans(INITIAL_LOANS);
    setInvestments(INITIAL_INVESTMENTS);
    setBillers(INITIAL_BILLERS);
    setBillPaymentHistory(INITIAL_BILL_PAYMENT_HISTORY);
    setUpcomingBills(INITIAL_UPCOMING_BILLS);
    setChequeBooks(INITIAL_CHEQUE_BOOKS);
    setIssuedCheques(INITIAL_ISSUED_CHEQUES);
    setDepositedCheques(INITIAL_DEPOSITED_CHEQUES);
    setPositivePayRegs(INITIAL_POSITIVE_PAY);
    setEStatementSubscriptions(INITIAL_ESTATEMENT_SUBSCRIPTIONS);
    setTransferRepeatState(null);
    setNachMandates(INITIAL_NACH_MANDATES);
    setScheduledTransfers(INITIAL_SCHEDULED_TRANSFERS);
    setMoneyRequests(INITIAL_MONEY_REQUESTS);
    setCardlessWithdrawals([]);
    setActivityEvents(INITIAL_ACTIVITY_EVENTS);
    setRetailTransactionLimits(DEFAULT_RETAIL_LIMITS);
    setGovtSavingsAccounts(INITIAL_GOVT_SAVINGS);
    setForm15gSubmissions(INITIAL_FORM15G);
    setRemittanceRequests(INITIAL_REMITTANCES);
    setLrsUsedYtd(850000);
    setForexCards(INITIAL_FOREX_CARDS);
    setBranchAppointments(INITIAL_BRANCH_APPOINTMENTS);
    setLockerApplications(INITIAL_LOCKERS);
    setRewardPoints(6840);
    setLoanClosureRequests(INITIAL_LOAN_CLOSURE_REQUESTS);
    setBondHoldings(INITIAL_BOND_HOLDINGS);
    setDematAccount(INITIAL_DEMAT_ACCOUNT);
    setFeedbackSubmissions(INITIAL_FEEDBACK);
    setPrimaryAccountId('acc_ret_sav_01');
    setDefaultDebitAccountId('acc_ret_sav_01');
    setDefaultCardId(INITIAL_RETAIL_CARDS[0]?.id || '');
    setHiddenAccountIds([]);
    setPrimaryCorporateAccountId('acc_corp_op_01');
    setCorporateHiddenAccountIds([]);
    setCorporateDefaultPaymentAccountId('acc_corp_op_01');
    setPersonalInfo(INITIAL_PERSONAL_INFO);
    setTrustedDevices(INITIAL_TRUSTED_DEVICES);
    setActiveSessions(INITIAL_ACTIVE_SESSIONS);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setNotificationPrefs(INITIAL_NOTIFICATION_PREFS);
    setAppPrefs(INITIAL_APP_PREFS);
    setSecuritySettings(INITIAL_SECURITY_SETTINGS);
    setPrivacyPrefs(INITIAL_PRIVACY_PREFS);
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All balances and transaction histories have been restored to initial state.',
    });
  };

  return (
    <BankingContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isAuthenticated,
      bankingType,
      authScreen,
      user,
      setBankingType,
      setAuthScreen,
      login,
      logout,
      quickDemoLogin,
      isSessionExpired,
      clearSessionExpired,
      expireSession,
      corporateLoginVerified,
      corporateOtpVerified,
      setCorporateLoginVerified,
      setCorporateOtpVerified,
      clearCorporateAuthFlow,
      corporateDeviceTrusted,
      completeCorporateAuthentication,
      corporateSession,
      pendingCorporateUser,
      setPendingCorporateUser,
      retailRegistration,
      completeRetailRegistration,
      canApproveCorporate,
      canSubmitCorporatePayment,
      canCreateCorporateBulk,
      retailTab,
      setRetailTab: handleSetRetailTab,
      corporateTab,
      setCorporateTab: handleSetCorporateTab,
      accounts,
      transactions,
      approvals,
      beneficiaries,
      cards,
      cardTransactions,
      securityAlerts,
      fixedDeposits,
      recurringDeposits,
      insurancePolicies,
      insurancePlans,
      insuranceClaims,
      loans,
      investments,
      billers,
      employees,
      corporateUsers,
      securityLogs,
      notifications,
      statements,
      chequeBooks,
      issuedCheques,
      depositedCheques,
      positivePayRegs,
      eStatementSubscriptions,
      locatorType,
      transferRepeat,
      nachMandates,
      scheduledTransfers,
      moneyRequests,
      cardlessWithdrawals,
      activityEvents,
      retailTransactionLimits,
      govtSavingsAccounts,
      form15gSubmissions,
      remittanceRequests,
      lrsUsedYtd,
      forexCards,
      branchAppointments,
      lockerApplications,
      rewardPoints,
      loanClosureRequests,
      bondHoldings,
      dematAccount,
      feedbackSubmissions,

      executeTransfer,
      executeSelfTransfer,
      approveCorporatePayment,
      rejectCorporatePayment,
      addBeneficiary,
      updateBeneficiary,
      deleteBeneficiary,
      toggleBeneficiaryBlock,
      toggleBeneficiaryFavourite,
      toggleCardFreeze,
      blockCard,
      replaceCard,
      addCard,
      changeCardPin,
      payCreditCardBill,
      updateCardLimits,
      updateGranularCardLimits,
      toggleCardFeature,
      setCardControl,
      resolveSecurityAlert,
      reportCardTransaction,
      payBiller,
      billProviders,
      billPaymentHistory,
      upcomingBills,
      fetchBill,
      processBillPayment,
      addSavedBiller,
      updateSavedBiller,
      deleteSavedBiller,
      toggleBillerAutoPay,
      requestChequeBook,
      stopCheque,
      registerPositivePay,
      lookupBanlName,
      requestEStatement,
      stopEStatement,
      resumeEStatement,
      updateEStatementFrequency,
      freezeAccount,
      unfreezeAccount,
      freezeCorporateAccount,
      unfreezeCorporateAccount,
      setTransferRepeat,
      clearTransferRepeat,
      setLocatorType,
      deleteNachMandate,
      updateAccountNominees,
      processTaxPayment,
      createScheduledTransfer,
      cancelScheduledTransfer,
      toggleScheduledTransferPause,
      createMoneyRequest,
      respondToMoneyRequest,
      generateCardlessWithdrawal,
      updateRetailTransactionLimits,
      openRetailAccount,
      payRdInstallment,
      addActivityEvent,
      contributeToGovtScheme,
      submitForm15G,
      submitRemittance,
      loadForexCard,
      applyForexCard,
      bookBranchAppointment,
      redeemReward,
      applyLocker,
      bookLockerVisit,
      requestLoanClosureCert,
      investInBond,
      applyDematAccount,
      submitFeedback,
      createFixedDeposit,
      createRecurringDeposit,
      closeDeposit,
      updateMaturityInstruction,
      getDepositTransactions,
      buyInsurance,
      payInsurancePremium,
      renewInsurancePolicy,
      submitInsuranceClaim,
      applyForLoan,
      createSIP,
      processPayrollBatch,
      addMoneyToAccount,
      toasts,
      addToast,
      removeToast,
      isScannerOpen,
      openScanner,
      closeScanner,
      isSessionTimeoutModalOpen,
      extendSession,
      resetDemoData,
      isBottomNavHidden,
      setBottomNavHidden,
      hideBottomNav,
      showBottomNav,
      activeDetailFlow,
      openDetailFlow,
      closeDetailFlow,
      primaryAccountId,
      defaultDebitAccountId,
      defaultCardId,
      hiddenAccountIds,
      personalInfo,
      kycDetails,
      trustedDevices,
      activeSessions,
      loginActivity,
      profileDocuments,
      serviceRequests,
      notificationPrefs,
      appPrefs,
      securitySettings,
      privacyPrefs,
      setPrimaryAccount,
      setDefaultDebitAccount,
      setDefaultCard,
      updateAccountNickname,
      toggleAccountVisibility,
      isAccountHidden,
      getPrimaryAccount,
      getDefaultDebitAccount,
      getVisibleAccounts,
      primaryCorporateAccountId,
      corporateHiddenAccountIds,
      corporateDefaultPaymentAccountId,
      setPrimaryCorporateAccount,
      setCorporateDefaultPaymentAccount,
      updateCorporateAccountNickname,
      toggleCorporateAccountVisibility,
      isCorporateAccountHidden,
      getPrimaryCorporateAccount,
      getVisibleCorporateAccounts,
      updatePersonalInfo,
      updateNotificationPrefs,
      updateAppPrefs,
      updateSecuritySettings,
      updatePrivacyPrefs,
      removeTrustedDevice,
      signOutSession,
      signOutAllOtherSessions,
      addServiceRequest,
      triggerSessionTimeout,
      profileDeepLink,
      clearProfileDeepLink,
      billDeepLink,
      clearBillDeepLink,
      favoriteServiceIds,
      recentServiceIds,
      toggleFavoriteService,
      navigateService,
    }}>
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
