export type RetailRegistrationMethod = 'sim_verify';

export type VerificationMethod = 'customer_id' | 'debit_card' | 'aadhaar' | 'pan';

export type RetailRegistrationStep =
  | 'welcome'
  | 'sim_verify'
  | 'sim_processing'
  | 'sim_success'
  | 'sim_failed'
  | 'choose_verification_method'
  | 'verify_customer_id'
  | 'verify_debit_card'
  | 'verify_aadhaar'
  | 'verify_pan'
  | 'customer_verified'
  | 'otp'
  | 'mpin'
  | 'biometric'
  | 'terms'
  | 'processing'
  | 'complete';

export interface RetailSecurityAnswer {
  questionId: string;
  answer: string;
}

export interface RetailRegistrationDraft {
  registeredMobile: string;
  simVerified: boolean;
  verificationMethod: VerificationMethod | null;
  customerId: string;
  dateOfBirth: string;
  accountNumber: string;
  debitCardNumber: string;
  debitCardExpiry: string;
  aadhaarNumber: string;
  pan: string;
  userId: string;
  password: string;
  confirmPassword: string;
  profileCode: string;
  mpin: string;
  biometricEnabled: boolean;
  termsAccepted: boolean;
  otpRequired: boolean;
}

export interface RetailRegistrationResult {
  userId: string;
  profileCode: string;
  mpinSet: boolean;
  biometricEnabled: boolean;
  method: RetailRegistrationMethod;
  securityAnswers?: RetailSecurityAnswer[];
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

export interface VerificationMethodOption {
  id: VerificationMethod;
  title: string;
  description: string;
}
