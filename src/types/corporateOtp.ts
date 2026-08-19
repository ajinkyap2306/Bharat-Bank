export type CorporateOtpStatus =
  | 'idle'
  | 'entering'
  | 'ready'
  | 'verifying'
  | 'incorrect'
  | 'expired'
  | 'resending'
  | 'resent'
  | 'network_error'
  | 'max_attempts'
  | 'session_expired'
  | 'success';

export interface CorporateOtpFormState {
  digits: string[];
  status: CorporateOtpStatus;
  attemptCount: number;
  resendSeconds: number;
  otpGeneration: number;
  otpIssuedAt: number;
  activeIndex: number;
  resendCount: number;
}

export const EMPTY_OTP_DIGITS = ['', '', '', '', '', ''] as const;

export const INITIAL_CORPORATE_OTP_STATE: CorporateOtpFormState = {
  digits: [...EMPTY_OTP_DIGITS],
  status: 'idle',
  attemptCount: 0,
  resendSeconds: 30,
  otpGeneration: 1,
  otpIssuedAt: Date.now(),
  activeIndex: 0,
  resendCount: 0,
};
