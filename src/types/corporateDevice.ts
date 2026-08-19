export type DeviceVerificationStatus =
  | 'initial'
  | 'biometric_enabled'
  | 'biometric_disabled'
  | 'prompt'
  | 'verifying'
  | 'biometric_success'
  | 'device_verified'
  | 'failed'
  | 'skip_confirmation';

export interface DeviceVerificationState {
  status: DeviceVerificationStatus;
  biometricEnabled: boolean;
  attemptCount: number;
  isTrusted: boolean;
  showSkipSheet: boolean;
}

export interface MockDeviceInfo {
  label: string;
  platform: string;
  deviceStatus: 'new' | 'trusted';
}

export const INITIAL_DEVICE_VERIFICATION_STATE: DeviceVerificationState = {
  status: 'initial',
  biometricEnabled: true,
  attemptCount: 0,
  isTrusted: false,
  showSkipSheet: false,
};
