import React, { useCallback, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../../../context/BankingContext';
import {
  INITIAL_DEVICE_VERIFICATION_STATE,
  type DeviceVerificationState,
  type DeviceVerificationStatus,
} from '../../../../types/corporateDevice';
import {
  completeDeviceTrustMock,
  DEVICE_VERIFICATION_SUCCESS_DELAY_MS,
  getMockDeviceInfo,
  verifyBiometricMock,
} from '../../../../services/corporateDeviceService';
import { SecurityHeader } from './SecurityHeader';
import { SecurityIcon } from './SecurityIcon';
import { DeviceInfoCard } from './DeviceInfoCard';
import { BiometricCard } from './BiometricCard';
import { BiometricPrompt } from './BiometricPrompt';
import { VerificationStatus } from './VerificationStatus';
import { SkipBiometricSheet } from './SkipBiometricSheet';
import { LoginButton } from '../login/LoginButton';
import { getCorporateLandingPath } from '../../../../utils/corporateLanding';

type DeviceAction =
  | { type: 'SET_STATUS'; status: DeviceVerificationStatus }
  | { type: 'SET_BIOMETRIC'; enabled: boolean }
  | { type: 'INCREMENT_ATTEMPT' }
  | { type: 'SET_TRUSTED'; trusted: boolean }
  | { type: 'SET_SKIP_SHEET'; open: boolean }
  | { type: 'RESET_FAILURE' };

function deviceReducer(
  state: DeviceVerificationState,
  action: DeviceAction
): DeviceVerificationState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_BIOMETRIC':
      return {
        ...state,
        biometricEnabled: action.enabled,
        status: action.enabled ? 'biometric_enabled' : 'biometric_disabled',
      };
    case 'INCREMENT_ATTEMPT':
      return { ...state, attemptCount: state.attemptCount + 1 };
    case 'SET_TRUSTED':
      return { ...state, isTrusted: action.trusted };
    case 'SET_SKIP_SHEET':
      return { ...state, showSkipSheet: action.open };
    case 'RESET_FAILURE':
      return {
        ...state,
        status: state.biometricEnabled ? 'biometric_enabled' : 'biometric_disabled',
      };
    default:
      return state;
  }
}

export const CorporateDeviceVerification: React.FC = () => {
  const navigate = useNavigate();
  const isCompletingRef = useRef(false);
  const {
    completeCorporateAuthentication,
    setCorporateLoginVerified,
    pendingCorporateUser,
  } = useBanking();

  const [state, dispatch] = useReducer(deviceReducer, {
    ...INITIAL_DEVICE_VERIFICATION_STATE,
    status: 'biometric_enabled',
  });

  const device = getMockDeviceInfo(state.isTrusted);

  const isVerifying = state.status === 'verifying';
  const isFailed = state.status === 'failed';
  const isBiometricSuccess = state.status === 'biometric_success';
  const isDeviceVerified = state.status === 'device_verified';
  const isTransitioning = isBiometricSuccess || isDeviceVerified;
  const actionsDisabled = isVerifying || isTransitioning || isCompletingRef.current;

  const completeAndNavigate = useCallback(
    async (markTrusted: boolean) => {
      if (isCompletingRef.current) return;
      isCompletingRef.current = true;

      dispatch({ type: 'SET_TRUSTED', trusted: markTrusted });
      await completeDeviceTrustMock();
      completeCorporateAuthentication(markTrusted);

      const landing = getCorporateLandingPath(pendingCorporateUser?.role);
      setTimeout(() => {
        navigate(landing, { replace: true });
      }, DEVICE_VERIFICATION_SUCCESS_DELAY_MS);
    },
    [completeCorporateAuthentication, navigate, pendingCorporateUser?.role]
  );

  const handleVerifyBiometric = useCallback(async () => {
    if (actionsDisabled) return;

    dispatch({ type: 'SET_STATUS', status: 'verifying' });

    const result = await verifyBiometricMock(state.attemptCount);
    dispatch({ type: 'INCREMENT_ATTEMPT' });

    if (result === 'failed') {
      dispatch({ type: 'SET_STATUS', status: 'failed' });
      return;
    }

    dispatch({ type: 'SET_STATUS', status: 'biometric_success' });

    setTimeout(() => {
      dispatch({ type: 'SET_STATUS', status: 'device_verified' });
      completeAndNavigate(true);
    }, DEVICE_VERIFICATION_SUCCESS_DELAY_MS);
  }, [actionsDisabled, state.attemptCount, completeAndNavigate]);

  const handleContinueWithoutBiometric = useCallback(() => {
    if (actionsDisabled) return;
    dispatch({ type: 'SET_STATUS', status: 'device_verified' });
    completeAndNavigate(false);
  }, [actionsDisabled, completeAndNavigate]);

  const handleSkipConfirm = useCallback(() => {
    dispatch({ type: 'SET_SKIP_SHEET', open: false });
    dispatch({ type: 'SET_STATUS', status: 'device_verified' });
    completeAndNavigate(false);
  }, [completeAndNavigate]);

  const handleBack = useCallback(() => {
    setCorporateLoginVerified(true);
    navigate('/', { replace: true });
  }, [navigate, setCorporateLoginVerified]);

  const handleUseOtp = useCallback(() => {
    dispatch({ type: 'RESET_FAILURE' });
    setCorporateLoginVerified(true);
    navigate('/', { replace: true });
  }, [navigate, setCorporateLoginVerified]);

  const handleTryAgain = useCallback(() => {
    dispatch({ type: 'RESET_FAILURE' });
  }, []);

  if (isTransitioning) {
    return (
      <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 safe-top safe-bottom max-w-107.5 mx-auto w-full">
        <VerificationStatus
          status={isDeviceVerified ? 'device_verified' : 'biometric_success'}
        />
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 safe-top safe-bottom max-w-107.5 mx-auto w-full">
        <VerificationStatus status="verifying" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col safe-top safe-bottom max-w-107.5 mx-auto w-full">
      <SecurityHeader title="Secure Your Device" onBack={handleBack} />

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key="device-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <section className="px-4 text-center mb-5">
              <div className="flex justify-center mb-4">
                <SecurityIcon variant="shield" />
              </div>
              <h2 className="text-[22px] font-semibold tracking-tight leading-tight">
                Secure this device
              </h2>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                Use biometric authentication for faster and more secure access to
                Corporate Banking.
              </p>
            </section>

            <DeviceInfoCard device={device} />

            <div className="mt-4">
              <BiometricCard
                enabled={state.biometricEnabled}
                disabled={actionsDisabled}
                onToggle={(enabled) => dispatch({ type: 'SET_BIOMETRIC', enabled })}
              />
            </div>

            <BiometricPrompt visible={state.biometricEnabled} />

            {isFailed && (
              <div className="mt-4">
                <VerificationStatus
                  status="failed"
                  onTryAgain={handleTryAgain}
                  onUseOtp={handleUseOtp}
                />
              </div>
            )}

            <div className="px-4 mt-auto pt-6 sticky bottom-0 bg-slate-50 dark:bg-slate-950 safe-bottom">
              {state.biometricEnabled ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyBiometric();
                  }}
                >
                  <LoginButton
                    label="Verify with Biometrics"
                    loadingLabel="Verifying..."
                    isLoading={false}
                    disabled={actionsDisabled}
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={handleContinueWithoutBiometric}
                  disabled={actionsDisabled}
                  className="w-full py-3.5 rounded-2xl bg-congress-blue-700 hover:bg-congress-blue-800 text-white font-semibold text-base disabled:opacity-60 min-h-12 active:scale-[0.99] transition-all shadow-sm"
                >
                  Continue
                </button>
              )}

              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_SKIP_SHEET', open: true })}
                disabled={actionsDisabled}
                className="w-full py-3 mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 min-h-11 disabled:opacity-50"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <SkipBiometricSheet
        isOpen={state.showSkipSheet}
        onClose={() => dispatch({ type: 'SET_SKIP_SHEET', open: false })}
        onSkip={handleSkipConfirm}
        onEnable={() => dispatch({ type: 'SET_SKIP_SHEET', open: false })}
      />
    </div>
  );
};
