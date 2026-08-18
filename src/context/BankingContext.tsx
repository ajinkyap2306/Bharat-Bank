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
  Statement
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
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  
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
  const [employees] = useState<CorporateEmployee[]>(INITIAL_CORPORATE_EMPLOYEES);
  const [corporateUsers] = useState<CorporateUser[]>(INITIAL_CORPORATE_USERS);
  const [securityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [statements, setStatements] = useState<Statement[]>(INITIAL_RETAIL_STATEMENTS);

  // Active user depending on bankingType
  const user = bankingType === 'retail' ? INITIAL_RETAIL_USER : INITIAL_CORPORATE_USER;
  const accounts = bankingType === 'retail' ? retailAccounts : corporateAccounts;
  const transactions = bankingType === 'retail' ? retailTransactions : corporateTransactions;
  const beneficiaries = bankingType === 'retail' ? retailBeneficiaries : corporateBeneficiaries;
  const cards = bankingType === 'retail' ? retailCards : corporateCards;

  // Login handler
  const login = (type: BankingType) => {
    setBankingType(type);
    setIsAuthenticated(true);
    if (type === 'retail') {
      setRetailTab('home');
    } else {
      setCorporateTab('home');
    }
    addToast({
      type: 'success',
      title: `Welcome, ${type === 'retail' ? 'Arjun' : 'Devansh'}`,
      message: `Successfully authenticated into ${type === 'retail' ? 'Retail' : 'Corporate'} Banking.`,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthScreen('welcome');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Your banking session has ended securely.',
    });
  };

  const quickDemoLogin = (type: BankingType) => {
    setBankingType(type);
    setIsAuthenticated(true);
    if (type === 'retail') {
      setRetailTab('home');
    } else {
      setCorporateTab('home');
    }
    addToast({
      type: 'success',
      title: `${type === 'retail' ? 'Retail Profile (RB-123456)' : 'Corporate Profile (COP-13456)'} Loaded`,
      message: 'Demo credentials authenticated.',
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

      executeTransfer,
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
      closeDetailFlow
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
