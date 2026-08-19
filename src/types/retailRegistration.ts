export type RetailRegistrationMethod = 'debit_card' | 'pan_card_code';

export type RetailRegistrationStep =
  | 'method'
  | 'debit_auth'
  | 'pan_auth'
  | 'cooling_period'
  | 'terms'
  | 'device'
  | 'user_id'
  | 'mpin'
  | 'biometric'
  | 'security'
  | 'complete';

export interface RetailSecurityAnswer {
  questionId: string;
  answer: string;
}

export interface RetailRegistrationDraft {
  method: RetailRegistrationMethod | null;
  cardNumber: string;
  atmPin: string;
  pan: string;
  codeA: string;
  codeJ: string;
  codeL: string;
  termsAccepted: boolean;
  assignedUserId: string;
  profileCode: string;
  mpin: string;
  biometricEnabled: boolean;
  securityAnswers: RetailSecurityAnswer[];
  securitySkipCount: number;
  deviceSeedStored: boolean;
}

export interface RetailRegistrationResult {
  userId: string;
  profileCode: string;
  mpinSet: boolean;
  biometricEnabled: boolean;
  method: RetailRegistrationMethod;
  securityAnswers: RetailSecurityAnswer[];
}

export interface SecurityQuestionOption {
  id: string;
  text: string;
}
