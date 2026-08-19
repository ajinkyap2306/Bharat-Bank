export type CorporateAuthStep =
  | 'session_expired'
  | 'login'
  | 'processing'
  | 'otp'
  | 'device_verify'
  | 'biometric'
  | 'auth_progress'
  | 'login_success'
  | 'forgot_id'
  | 'forgot_contact'
  | 'forgot_otp'
  | 'new_password'
  | 'password_updated';

export type CorporateLoginFieldError = 'corporate_id' | 'user_id' | 'password' | 'none';

export type CorporateOtpError = 'none' | 'invalid' | 'expired' | 'max_attempts';
