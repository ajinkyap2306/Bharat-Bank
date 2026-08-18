export type KycStatus = 'verified' | 'pending' | 'action_required';

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  email: string;
  nationalIdMasked: string;
  residentialAddress: string;
  mailingAddress: string;
  mobileVerified: boolean;
  emailVerified: boolean;
}

export interface KycDetails {
  status: KycStatus;
  verificationDate: string;
  nationalIdMasked: string;
  addressVerified: boolean;
  lastUpdated: string;
  documents: { name: string; status: string }[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
  location: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface LoginActivityEvent {
  id: string;
  device: string;
  location: string;
  date: string;
  time: string;
  status: 'success' | 'failed' | 'warning';
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  date: string;
  type: string;
}

export interface ServiceRequest {
  id: string;
  type: string;
  status: 'created' | 'under_review' | 'action_required' | 'resolved';
  createdDate: string;
  lastUpdated: string;
  timeline: { label: string; completed: boolean; date?: string }[];
}

export interface NotificationPreferences {
  moneyReceived: boolean;
  moneySent: boolean;
  paymentCompleted: boolean;
  paymentFailed: boolean;
  cardTransaction: boolean;
  cardBlocked: boolean;
  cardLimitChanged: boolean;
  newLogin: boolean;
  deviceAdded: boolean;
  passwordChanged: boolean;
  mpinChanged: boolean;
  loanUpdates: boolean;
  depositMaturity: boolean;
  insuranceRenewal: boolean;
  investmentUpdates: boolean;
  offers: boolean;
  rewards: boolean;
  productUpdates: boolean;
}

export interface AppPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  currencyDisplay: string;
  dateFormat: string;
}

export interface SecuritySettings {
  biometricEnabled: boolean;
  mpinActive: boolean;
  transactionAuthEnabled: boolean;
  securityAlertsEnabled: boolean;
  authMethods: { mpin: boolean; otp: boolean; biometric: boolean };
  securityScore: 'Strong' | 'Moderate' | 'Weak';
}

export interface PrivacyPreferences {
  marketingEmails: boolean;
  marketingSms: boolean;
  marketingPush: boolean;
  dataAnalytics: boolean;
  thirdPartySharing: boolean;
}
