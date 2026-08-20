export type RetailRegistrationMethod = 'sim_verify';

export type VerificationMethod = 'customer_id' | 'debit_card' | 'aadhaar' | 'pan';

export type SimSlotId = 'sim1' | 'sim2';

export type RetailRegistrationStep =
  | 'welcome'
  | 'sim_verify'
  | 'sim_processing'
  | 'sim_failed'
  | 'otp'
  | 'choose_verification_method'
  | 'verify_customer_id'
  | 'verify_debit_card'
  | 'verify_aadhaar'
  | 'verify_pan'
  | 'accounts_found'
  | 'mpin'
  | 'tpin'
  | 'biometric'
  | 'complete';

export interface RetailSimOption {
  id: SimSlotId;
  carrier: string;
  mobile: string;
  isRegistered: boolean;
}

export interface RetailLinkedAccount {
  id: string;
  type: string;
  maskedAccount: string;
  customerId: string;
  accountNumber: string;
}

export interface RetailRegistrationDraft {
  selectedSimId: SimSlotId | null;
  registeredMobile: string;
  verificationMethod: VerificationMethod | null;
  customerId: string;
  dateOfBirth: string;
  debitCardNumber: string;
  debitCardExpiry: string;
  aadhaarNumber: string;
  pan: string;
  linkedAccountId: string | null;
  userId: string;
  profileCode: string;
  mpin: string;
  tpin: string;
  biometricEnabled: boolean;
}

export interface RetailRegistrationResult {
  userId: string;
  profileCode: string;
  customerId: string;
  mpinSet: boolean;
  tpinSet: boolean;
  biometricEnabled: boolean;
  method: RetailRegistrationMethod;
}

export interface SecurityQuestionOption {
  id: string;
  text: string;
}

export interface PasswordRuleStatus {
  length: boolean;
  upperLower: boolean;
  number: boolean;
  special: boolean;
}
