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

export const INITIAL_PERSONAL_INFO: PersonalInfo = {
  fullName: 'Arjun Mehta',
  dateOfBirth: '14 Mar 1992',
  gender: 'Male',
  mobile: '+91 98765 43210',
  email: 'arjun.mehta@fintechmail.com',
  nationalIdMasked: 'XXXX XXXX 4829',
  residentialAddress: 'Flat 1204, Oberoi Springs, Andheri West, Mumbai - 400053',
  mailingAddress: 'Flat 1204, Oberoi Springs, Andheri West, Mumbai - 400053',
  mobileVerified: true,
  emailVerified: true,
};

export const INITIAL_KYC_DETAILS: KycDetails = {
  status: 'verified',
  verificationDate: '12 Jan 2024',
  nationalIdMasked: 'XXXX XXXX 4829',
  addressVerified: true,
  lastUpdated: '12 Jan 2024',
  documents: [
    { name: 'Aadhaar Card', status: 'Verified' },
    { name: 'PAN Card', status: 'Verified' },
    { name: 'Address Proof', status: 'Verified' },
  ],
};

export const INITIAL_TRUSTED_DEVICES: TrustedDevice[] = [
  {
    id: 'dev_current',
    name: 'iPhone 16 Pro',
    os: 'iOS 18.2',
    lastActive: 'Active now',
    isCurrent: true,
    location: 'Mumbai, India',
  },
  {
    id: 'dev_android',
    name: 'Samsung Galaxy S24',
    os: 'Android 15',
    lastActive: '2 days ago',
    isCurrent: false,
    location: 'Pune, India',
  },
];

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_current',
    device: 'iPhone 16 Pro • Mobile App',
    location: 'Mumbai, India',
    lastActivity: 'Active now',
    isCurrent: true,
  },
  {
    id: 'sess_web',
    device: 'Chrome • macOS',
    location: 'Mumbai, India',
    lastActivity: '35 mins ago',
    isCurrent: false,
  },
];

export const INITIAL_LOGIN_ACTIVITY: LoginActivityEvent[] = [
  {
    id: 'log_1',
    device: 'iPhone 16 Pro',
    location: 'Mumbai, India',
    date: '18 Aug 2026',
    time: '10:42 AM',
    status: 'success',
  },
  {
    id: 'log_2',
    device: 'Chrome • macOS',
    location: 'Mumbai, India',
    date: '17 Aug 2026',
    time: '09:15 PM',
    status: 'success',
  },
  {
    id: 'log_3',
    device: 'Unknown Android',
    location: 'Delhi, India',
    date: '15 Aug 2026',
    time: '03:22 AM',
    status: 'failed',
  },
];

export const INITIAL_PROFILE_DOCUMENTS: ProfileDocument[] = [
  { id: 'doc_1', name: 'Savings Statement - Jul 2026', category: 'Account Statements', date: '01 Aug 2026', type: 'PDF' },
  { id: 'doc_2', name: 'Interest Certificate FY 2025-26', category: 'Interest Certificates', date: '15 Apr 2026', type: 'PDF' },
  { id: 'doc_3', name: 'Form 26AS TDS Summary', category: 'Tax Documents', date: '10 Jun 2026', type: 'PDF' },
  { id: 'doc_4', name: 'FD Certificate •••• 0199', category: 'Deposit Certificates', date: '12 Jan 2026', type: 'PDF' },
  { id: 'doc_5', name: 'Home Loan Sanction Letter', category: 'Loan Documents', date: '05 Mar 2025', type: 'PDF' },
  { id: 'doc_6', name: 'Health Insurance Policy', category: 'Insurance Policies', date: '20 Feb 2026', type: 'PDF' },
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'SR-2026-88421',
    type: 'Address Update',
    status: 'under_review',
    createdDate: '10 Aug 2026',
    lastUpdated: '16 Aug 2026',
    timeline: [
      { label: 'Request Created', completed: true, date: '10 Aug 2026' },
      { label: 'Under Review', completed: true, date: '12 Aug 2026' },
      { label: 'Action Required', completed: false },
      { label: 'Resolved', completed: false },
    ],
  },
];

export const INITIAL_NOTIFICATION_PREFS: NotificationPreferences = {
  moneyReceived: true,
  moneySent: true,
  paymentCompleted: true,
  paymentFailed: true,
  cardTransaction: true,
  cardBlocked: true,
  cardLimitChanged: true,
  newLogin: true,
  deviceAdded: true,
  passwordChanged: true,
  mpinChanged: true,
  loanUpdates: true,
  depositMaturity: true,
  insuranceRenewal: true,
  investmentUpdates: false,
  offers: false,
  rewards: true,
  productUpdates: false,
};

export const INITIAL_APP_PREFS: AppPreferences = {
  language: 'English',
  theme: 'system',
  currencyDisplay: 'INR (₹)',
  dateFormat: 'DD MMM YYYY',
};

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  biometricEnabled: true,
  mpinActive: true,
  tpinActive: true,
  transactionAuthEnabled: true,
  securityAlertsEnabled: true,
  authMethods: { mpin: true, otp: true, biometric: true },
  securityScore: 'Strong',
};

export const INITIAL_PRIVACY_PREFS: PrivacyPreferences = {
  marketingEmails: false,
  marketingSms: false,
  marketingPush: true,
  dataAnalytics: true,
  thirdPartySharing: false,
};
