import { findCorporateDemoUser } from '../data/corporateAuthMock';
import type { CorporateLoginCredentials } from '../data/corporateAuthMock';
import type { CorporateDemoUser } from '../types/corporateDemoUser';
import type { CorporateLoginFieldError } from '../types/corporateAuth';

export type { CorporateLoginCredentials };

export type LoginValidationResult =
  | { valid: true }
  | { valid: false; field: CorporateLoginFieldError; message: string };

const LOGIN_DELAY_MS = 1400;
const SUCCESS_TRANSITION_MS = 600;

export function validateLoginFields(
  credentials: CorporateLoginCredentials
): LoginValidationResult {
  if (!credentials.corporateId.trim()) {
    return {
      valid: false,
      field: 'corporate_id',
      message: 'Enter your Corporate ID.',
    };
  }

  if (!credentials.userId.trim()) {
    return {
      valid: false,
      field: 'user_id',
      message: 'Enter your User ID.',
    };
  }

  if (!credentials.password) {
    return {
      valid: false,
      field: 'password',
      message: 'Enter your password.',
    };
  }

  return { valid: true };
}

export function authenticateCorporate(
  credentials: CorporateLoginCredentials
): Promise<CorporateDemoUser | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        findCorporateDemoUser(
          credentials.corporateId,
          credentials.userId,
          credentials.password
        )
      );
    }, LOGIN_DELAY_MS);
  });
}

export const CORPORATE_LOGIN_SUCCESS_DELAY_MS = SUCCESS_TRANSITION_MS;
