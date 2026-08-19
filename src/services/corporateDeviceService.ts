import type { MockDeviceInfo } from '../types/corporateDevice';

const VERIFY_DELAY_MS = 1400;
const SUCCESS_TRANSITION_MS = 900;

export const DEVICE_VERIFICATION_SUCCESS_DELAY_MS = SUCCESS_TRANSITION_MS;

export type BiometricVerifyResult = 'success' | 'failed';

export function getMockDeviceInfo(isTrusted = false): MockDeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edg/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);

  let platform = 'Mobile Browser';
  if (isAndroid) {
    platform = isChrome ? 'Android • Chrome' : 'Android';
  } else if (isIOS) {
    platform = isChrome ? 'iOS • Chrome' : 'iOS • Safari';
  } else if (isChrome) {
    platform = 'Desktop • Chrome';
  } else if (isFirefox) {
    platform = 'Desktop • Firefox';
  }

  return {
    label: 'This device',
    platform,
    deviceStatus: isTrusted ? 'trusted' : 'new',
  };
}

/**
 * Mock biometric verification — never accesses real biometric APIs.
 */
export async function verifyBiometricMock(
  _attemptCount: number
): Promise<BiometricVerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, VERIFY_DELAY_MS));
  return 'success';
}

/** Skip biometric — marks device as trusted without biometric check */
export async function completeDeviceTrustMock(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
}
