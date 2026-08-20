export type RetailRegistrationMethod = 'sim_verify';

export type RetailRegistrationStep =
  | 'activate'
  | 'sim_verify'
  | 'sim_processing'
  | 'sim_success'
  | 'sim_failed'
  | 'customer_verify'
  | 'credentials'
  | 'mpin'
  | 'biometric'
  | 'complete';

export interface RetailSecurityAnswer {
  questionId: string;
  answer: string;
}

export interface RetailRegistrationDraft {
  registeredMobile: string;
  simVerified: boolean;
  customerId: string;
  dateOfBirth: string;
  userId: string;
  password: string;
  confirmPassword: string;
  profileCode: string;
  mpin: string;
  biometricEnabled: boolean;
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
