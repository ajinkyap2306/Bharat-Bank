export type RetailRegistrationMethod = 'sim_verify';

export type SimSlotId = 'sim1' | 'sim2';

export type RetailRegistrationStep =
  | 'welcome'
  | 'terms'
  | 'sim_select'
  | 'sim_processing'
  | 'sim_success'
  | 'sim_failed'
  | 'select_account'
  | 'otp'
  | 'mpin'
  | 'tpin'
  | 'processing'
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
  termsAccepted: boolean;
  selectedSimId: SimSlotId | null;
  registeredMobile: string;
  simVerified: boolean;
  selectedAccountId: string;
  customerId: string;
  accountNumber: string;
  accountType: string;
  userId: string;
  profileCode: string;
  mpin: string;
  tpin: string;
}

export interface RetailRegistrationResult {
  userId: string;
  profileCode: string;
  customerId: string;
  accountNumber: string;
  mpinSet: boolean;
  tpinSet: boolean;
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
