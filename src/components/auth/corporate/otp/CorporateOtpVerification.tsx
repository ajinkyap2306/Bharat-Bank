import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import {
  EMPTY_OTP_DIGITS,
  INITIAL_CORPORATE_OTP_STATE,
  type CorporateOtpFormState,
  type CorporateOtpStatus,
} from '../../../../types/corporateOtp';
import {
  CORPORATE_OTP_RESEND_SECONDS,
  CORPORATE_OTP_SUCCESS_DELAY_MS,
  getOtpSecondsRemaining,
  isOtpComplete,
  isOtpSessionExpired,
  resendCorporateOtpCode,
  verifyCorporateOtpCode,
} from '../../../../services/corporateOtpService';
import { CORPORATE_MAX_OTP_ATTEMPTS, CORPORATE_DEMO_OTP } from '../../../../data/corporateAuthMock';
import { AuthSecurityHeader } from './AuthSecurityHeader';
import { OtpInput } from './OtpInput';
import { OtpTimer } from './OtpTimer';
import { OtpValidityTimer } from './OtpValidityTimer';
import { ResendOtpButton } from './ResendOtpButton';
import { VerificationStatus } from './VerificationStatus';
import { LoginButton } from '../login/LoginButton';

const MASKED_MOBILE_DISPLAY = '••••••4582';

type OtpAction =
  | { type: 'SET_DIGITS'; digits: string[] }
  | { type: 'SET_ACTIVE_INDEX'; index: number }
  | { type: 'SET_STATUS'; status: CorporateOtpStatus }
  | { type: 'TICK_RESEND' }
  | { type: 'RESET_RESEND_TIMER' }
  | { type: 'INCREMENT_ATTEMPT' }
  | { type: 'RESET_OTP_INPUT' }
  | { type: 'NEW_OTP_ISSUED'; otpGeneration: number; otpIssuedAt: number }
  | { type: 'INCREMENT_RESEND_COUNT' };

function otpReducer(state: CorporateOtpFormState, action: OtpAction): CorporateOtpFormState {
  switch (action.type) {
    case 'SET_DIGITS': {
      const filled = action.digits.filter((d) => d).length;
      const status: CorporateOtpStatus =
        filled === 0
          ? 'idle'
          : filled === 6
            ? 'ready'
            : 'entering';
      return { ...state, digits: action.digits, status };
    }
    case 'SET_ACTIVE_INDEX':
      return { ...state, activeIndex: action.index };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'TICK_RESEND':
      return {
        ...state,
        resendSeconds: Math.max(0, state.resendSeconds - 1),
      };
    case 'RESET_RESEND_TIMER':
      return { ...state, resendSeconds: CORPORATE_OTP_RESEND_SECONDS };
    case 'INCREMENT_ATTEMPT':
      return { ...state, attemptCount: state.attemptCount + 1 };
    case 'RESET_OTP_INPUT':
      return {
        ...state,
        digits: [...EMPTY_OTP_DIGITS],
        activeIndex: 0,
        status: 'idle',
      };
    case 'NEW_OTP_ISSUED':
      return {
        ...state,
        otpGeneration: action.otpGeneration,
        otpIssuedAt: action.otpIssuedAt,
      };
    case 'INCREMENT_RESEND_COUNT':
      return { ...state, resendCount: state.resendCount + 1 };
    default:
      return state;
  }
}

export const CorporateOtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const {
    addToast,
    isSessionExpired,
    setCorporateOtpVerified,
    clearCorporateAuthFlow,
  } = useBanking();

  const [state, dispatch] = useReducer(otpReducer, INITIAL_CORPORATE_OTP_STATE);
  const [validitySeconds, setValiditySeconds] = useState(() =>
    getOtpSecondsRemaining(INITIAL_CORPORATE_OTP_STATE.otpIssuedAt)
  );

  const isVerifying = state.status === 'verifying';
  const isResending = state.status === 'resending';
  const isSuccess = state.status === 'success';
  const isSessionExpiredState = state.status === 'session_expired' || isSessionExpired;
  const isMaxAttempts = state.status === 'max_attempts';
  const isExpired = state.status === 'expired';
  const isNetworkError = state.status === 'network_error';
  const isIncorrect = state.status === 'incorrect';
  const hasOtpError = isIncorrect || isExpired || isNetworkError;

  const otpComplete = isOtpComplete(state.digits);
  const canResend = state.resendSeconds <= 0 && !isMaxAttempts && !isSessionExpiredState;
  const inputsDisabled =
    isVerifying ||
    isResending ||
    isSuccess ||
    isMaxAttempts ||
    isSessionExpiredState;

  const verifyDisabled =
    !otpComplete ||
    isVerifying ||
    isResending ||
    isSuccess ||
    isMaxAttempts ||
    isSessionExpiredState ||
    isExpired;

  useEffect(() => {
    if (isSessionExpired) {
      dispatch({ type: 'SET_STATUS', status: 'session_expired' });
    }
  }, [isSessionExpired]);

  useEffect(() => {
    if (isResending || isSuccess || isSessionExpiredState) return;
    if (state.resendSeconds <= 0) return;

    const timer = setInterval(() => dispatch({ type: 'TICK_RESEND' }), 1000);
    return () => clearInterval(timer);
  }, [state.resendSeconds, isResending, isSuccess, isSessionExpiredState]);

  useEffect(() => {
    if (isSessionExpiredState || isMaxAttempts || isSuccess) return;

    const syncValidity = () => {
      const remaining = getOtpSecondsRemaining(state.otpIssuedAt);
      setValiditySeconds(remaining);
      if (remaining <= 0 && state.status !== 'expired') {
        dispatch({ type: 'SET_STATUS', status: 'expired' });
      }
    };

    syncValidity();
    const timer = setInterval(syncValidity, 1000);
    return () => clearInterval(timer);
  }, [state.otpIssuedAt, state.status, isSessionExpiredState, isMaxAttempts, isSuccess]);

  const handleBackToLogin = useCallback(() => {
    dispatch({ type: 'RESET_OTP_INPUT' });
    clearCorporateAuthFlow();
    navigate('/', { replace: true });
  }, [clearCorporateAuthFlow, navigate]);

  const handleVerify = useCallback(async () => {
    if (verifyDisabled) return;

    if (isOtpSessionExpired(state.otpIssuedAt)) {
      dispatch({ type: 'SET_STATUS', status: 'expired' });
      return;
    }

    dispatch({ type: 'SET_STATUS', status: 'verifying' });

    const result = await verifyCorporateOtpCode(state.digits.join(''), {
      attemptCount: state.attemptCount,
      otpIssuedAt: state.otpIssuedAt,
      otpGeneration: state.otpGeneration,
    });

    if (result.status === 'success') {
      dispatch({ type: 'SET_STATUS', status: 'success' });
      setCorporateOtpVerified(true);
      setTimeout(() => {
        navigate('/corporate/device-verification', { replace: true });
      }, CORPORATE_OTP_SUCCESS_DELAY_MS);
      return;
    }

    if (result.status === 'incorrect') {
      dispatch({ type: 'INCREMENT_ATTEMPT' });
      const nextAttempts = state.attemptCount + 1;
      if (nextAttempts >= CORPORATE_MAX_OTP_ATTEMPTS) {
        dispatch({ type: 'SET_STATUS', status: 'max_attempts' });
        dispatch({ type: 'RESET_OTP_INPUT' });
        return;
      }
      dispatch({ type: 'SET_STATUS', status: 'incorrect' });
      dispatch({ type: 'RESET_OTP_INPUT' });
      return;
    }

    if (result.status === 'max_attempts') {
      dispatch({ type: 'SET_STATUS', status: 'max_attempts' });
      dispatch({ type: 'RESET_OTP_INPUT' });
      return;
    }

    if (result.status === 'expired') {
      dispatch({ type: 'SET_STATUS', status: 'expired' });
      return;
    }

    if (result.status === 'network_error') {
      dispatch({ type: 'SET_STATUS', status: 'network_error' });
      return;
    }
  }, [
    verifyDisabled,
    state.digits,
    state.attemptCount,
    state.otpIssuedAt,
    state.otpGeneration,
    navigate,
    setCorporateOtpVerified,
  ]);

  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;

    dispatch({ type: 'SET_STATUS', status: 'resending' });

    const issued = await resendCorporateOtpCode();
    dispatch({
      type: 'NEW_OTP_ISSUED',
      otpGeneration: state.otpGeneration + 1,
      otpIssuedAt: issued.otpIssuedAt,
    });
    dispatch({ type: 'INCREMENT_RESEND_COUNT' });
    dispatch({ type: 'RESET_RESEND_TIMER' });
    dispatch({ type: 'RESET_OTP_INPUT' });
    dispatch({ type: 'SET_STATUS', status: 'resent' });
    setValiditySeconds(getOtpSecondsRemaining(issued.otpIssuedAt));

    addToast({
      type: 'success',
      title: 'New verification code sent',
      message: 'A new code has been sent to your registered mobile number.',
    });

    setTimeout(() => {
      dispatch({ type: 'SET_STATUS', status: 'idle' });
    }, 300);
  }, [canResend, isResending, state.otpGeneration, addToast]);

  const handleTryAgain = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'idle' });
  }, []);

  if (isSuccess) {
    return (
      <div className="min-h-dvh bg-[#F7F9FC] dark:bg-slate-950 font-['Inter',sans-serif] safe-top safe-bottom max-w-107.5 mx-auto w-full">
        <VerificationStatus status="success" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F7F9FC] dark:bg-slate-950 text-[#111827] dark:text-white flex flex-col font-['Inter',sans-serif] safe-top safe-bottom max-w-[430px] mx-auto w-full">
      <AuthSecurityHeader title="Verify Your Identity" onBack={handleBackToLogin} />

      <div className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {isSessionExpiredState ? (
            <VerificationStatus
              status="session_expired"
              onBackToLogin={handleBackToLogin}
            />
          ) : isMaxAttempts ? (
            <VerificationStatus
              status="max_attempts"
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
                <section className="text-center mb-6 pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-[#0B5CAB]" aria-hidden />
                  </div>
                  <h2 className="text-[22px] font-semibold tracking-tight leading-tight">
                    Verify Your Identity
                  </h2>
                  <p className="text-[14px] text-[#667085] dark:text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                    Enter the 6-digit verification code sent to your registered mobile
                    number.
                  </p>
                  <p
                    className="text-[15px] font-semibold text-[#111827] dark:text-white mt-3 tracking-wide"
                    aria-label="Masked mobile number ending in 4582"
                  >
                    {MASKED_MOBILE_DISPLAY}
                  </p>
                  <p className="mt-3 text-[11px] font-medium text-[#0B5CAB] dark:text-blue-400 bg-[#0B5CAB]/8 dark:bg-[#0B5CAB]/15 rounded-xl px-3 py-2 inline-block">
                    Demo OTP: {CORPORATE_DEMO_OTP}
                  </p>
                </section>

                {(isIncorrect || isExpired || isNetworkError) && (
                  <VerificationStatus
                    status={state.status as 'incorrect' | 'expired' | 'network_error'}
                    onResend={handleResend}
                    onTryAgain={handleTryAgain}
                  />
                )}

                <div className="mb-3">
                  <OtpValidityTimer secondsRemaining={validitySeconds} />
                </div>

                <div className="mb-5">
                  <OtpInput
                    digits={state.digits}
                    activeIndex={state.activeIndex}
                    hasError={hasOtpError}
                    disabled={inputsDisabled}
                    resetKey={state.otpGeneration + state.attemptCount}
                    onDigitsChange={(digits) =>
                      dispatch({ type: 'SET_DIGITS', digits })
                    }
                    onActiveIndexChange={(index) =>
                      dispatch({ type: 'SET_ACTIVE_INDEX', index })
                    }
                  />
                </div>

                <div className="mb-4 space-y-1">
                  <p className="text-[13px] text-[#667085]">Didn&apos;t receive the code?</p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <OtpTimer secondsRemaining={state.resendSeconds} />
                    <ResendOtpButton
                      isResending={isResending}
                      disabled={isVerifying}
                      canResend={canResend}
                      onResend={handleResend}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-[#E4E7EC]/80 dark:border-slate-800 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#667085]" aria-hidden />
                  <span className="text-[12px] text-[#667085]">Secure verification</span>
                </div>
              </div>

              <div className="shrink-0 px-4 pt-3 pb-2 border-t border-[#E4E7EC]/80 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-950 safe-bottom">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                >
                  <LoginButton
                    label={isExpired ? 'Code Expired — Resend OTP' : 'Verify & Continue'}
                    loadingLabel="Verifying..."
                    isLoading={isVerifying}
                    disabled={verifyDisabled}
                  />
                </form>

                {isExpired && canResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full mt-2 py-3 rounded-2xl border border-[#0B5CAB]/30 text-[#0B5CAB] font-semibold text-sm disabled:opacity-40"
                  >
                    {isResending ? 'Sending new code…' : 'Resend OTP'}
                  </button>
                )}

                <div className="mt-2 text-center">
                  <p className="text-[12px] text-[#667085] mb-1">
                    Not your mobile number?
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm font-medium text-[#0B5CAB] min-h-11 px-4"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
