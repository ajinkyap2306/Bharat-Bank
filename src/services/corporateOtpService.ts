import {
  CORPORATE_MAX_OTP_ATTEMPTS,
  CORPORATE_OTP_RESEND_SECONDS,
  validateCorporateOtp,
} from '../data/corporateAuthMock';

const VERIFY_DELAY_MS = 900;
const RESEND_DELAY_MS = 1200;
const SUCCESS_TRANSITION_MS = 700;

/** Mock-only code that triggers a network error (not shown in UI). */
const MOCK_NETWORK_ERROR_OTP = '000000';

export const CORPORATE_OTP_EXPIRY_SECONDS = 120;
export const CORPORATE_OTP_SUCCESS_DELAY_MS = SUCCESS_TRANSITION_MS;

export type OtpVerificationResult =
  | { status: 'success' }
  | { status: 'incorrect' }
  | { status: 'expired' }
  | { status: 'network_error' }
  | { status: 'max_attempts' };

export interface OtpSessionContext {
  attemptCount: number;
  otpIssuedAt: number;
  otpGeneration: number;
}

export function isOtpSessionExpired(otpIssuedAt: number): boolean {
  return getOtpSecondsRemaining(otpIssuedAt) <= 0;
}

export function getOtpSecondsRemaining(otpIssuedAt: number): number {
  const elapsed = (Date.now() - otpIssuedAt) / 1000;
  return Math.max(0, Math.ceil(CORPORATE_OTP_EXPIRY_SECONDS - elapsed));
}

export function formatOtpCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function isOtpComplete(digits: string[]): boolean {
  return digits.every((d) => d.length === 1) && digits.join('').length === 6;
}

export function parsePastedOtp(text: string): string[] {
  const cleaned = text.replace(/\D/g, '').slice(0, 6);
  const digits = [...EMPTY_OTP_PLACEHOLDER];
  for (let i = 0; i < cleaned.length; i += 1) {
    digits[i] = cleaned[i];
  }
  return digits;
}

const EMPTY_OTP_PLACEHOLDER = ['', '', '', '', '', ''];

export async function verifyCorporateOtpCode(
  otp: string,
  session: OtpSessionContext
): Promise<OtpVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, VERIFY_DELAY_MS));

  if (session.attemptCount >= CORPORATE_MAX_OTP_ATTEMPTS) {
    return { status: 'max_attempts' };
  }

  if (isOtpSessionExpired(session.otpIssuedAt)) {
    return { status: 'expired' };
  }

  const code = otp.replace(/\s/g, '');

  if (code === MOCK_NETWORK_ERROR_OTP) {
    return { status: 'network_error' };
  }

  if (!validateCorporateOtp(code)) {
    return { status: 'incorrect' };
  }

  return { status: 'success' };
}

export async function resendCorporateOtpCode(): Promise<{ otpIssuedAt: number }> {
  await new Promise((resolve) => setTimeout(resolve, RESEND_DELAY_MS));
  return {
    otpIssuedAt: Date.now(),
  };
}

export { CORPORATE_OTP_RESEND_SECONDS };
