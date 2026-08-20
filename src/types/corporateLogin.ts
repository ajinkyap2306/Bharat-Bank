import type { CorporateLoginFieldError } from './corporateAuth';
import {
  CORPORATE_DEMO_COMPANY_ID,
  CORPORATE_DEMO_PASSWORD,
} from '../data/corporateAuthMock';

export type CorporateLoginFocusField = 'corporate_id' | 'user_id' | 'password' | null;

export type CorporateLoginStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'invalid_credentials';

export interface CorporateLoginFormState {
  corporateId: string;
  userId: string;
  password: string;
  showPassword: boolean;
  focusedField: CorporateLoginFocusField;
  fieldError: CorporateLoginFieldError;
  fieldErrorMessage: string;
  status: CorporateLoginStatus;
  showHelp: boolean;
}

export const INITIAL_CORPORATE_LOGIN_STATE: CorporateLoginFormState = {
  corporateId: CORPORATE_DEMO_COMPANY_ID,
  userId: 'C001',
  password: CORPORATE_DEMO_PASSWORD,
  showPassword: false,
  focusedField: null,
  fieldError: 'none',
  fieldErrorMessage: '',
  status: 'idle',
  showHelp: false,
};
