import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Fingerprint, 
  KeyRound, 
  Loader2, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanAuthStepProps {
  appState: LoanApplicationState;
  onAuthSuccess: () => void;
  onBack: () => void;
}

export const LoanAuthStep: React.FC<LoanAuthStepProps> = ({
  appState,
  onAuthSuccess,
  onBack
}) => {
  const [authMode, setAuthMode] = useState<'mpin' | 'otp' | 'biometric'>('mpin');
  const [pin, setPin] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNumpad = (num: string) => {
    if (authMode === 'mpin') {
      if (pin.length < 6) setPin(prev => prev + num);
    } else if (authMode === 'otp') {
      if (otp.length < 6) setOtp(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (authMode === 'mpin') setPin(prev => prev.slice(0, -1));
    else if (authMode === 'otp') setOtp(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (authMode === 'mpin') setPin('');
    else if (authMode === 'otp') setOtp('');
  };

  const handleConfirmSubmit = () => {
    const val = authMode === 'mpin' ? pin : otp;
    const requiredLength = 6;
    if (authMode !== 'biometric' && val.length < requiredLength) {
      setErrorMsg(
        authMode === 'mpin'
          ? 'Please enter your complete 6-digit MPIN.'
          : 'Please enter your complete 6-digit OTP.'
      );
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onAuthSuccess();
    }, 1200);
  };

  const handleBiometricAuthenticate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onAuthSuccess();
    }, 1000);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header & Step Indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Step 5 of 6: Security Verification
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Confirm Your Application
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full w-5/6 rounded-full transition-all duration-300" />
      </div>

      {/* Auth Method Selector */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => { setAuthMode('mpin'); setErrorMsg(''); }}
          className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 ${
            authMode === 'mpin'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>6-Digit MPIN</span>
        </button>

        <button
          type="button"
          onClick={() => { setAuthMode('otp'); setErrorMsg(''); }}
          className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 ${
            authMode === 'otp'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>SMS OTP</span>
        </button>

        <button
          type="button"
          onClick={() => { setAuthMode('biometric'); setErrorMsg(''); }}
          className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 ${
            authMode === 'biometric'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Biometric</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {authMode === 'mpin' && 'Enter 6-Digit Banking MPIN'}
            {authMode === 'otp' && 'Enter OTP sent to +91 98765•••••'}
            {authMode === 'biometric' && 'Use Face ID / Fingerprint to Authorize'}
          </h3>
          <p className="text-xs text-slate-400">
            Authorizing submission for {appState.loanType} of ₹{appState.requestedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* PIN / OTP Display Dots */}
        {authMode !== 'biometric' && (
          <div className="space-y-3">
            <div className="flex justify-center items-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const activeVal = authMode === 'mpin' ? pin : otp;
                const isFilled = idx < activeVal.length;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      isFilled
                        ? 'bg-blue-600 scale-110 shadow-xs shadow-blue-500/50'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
            )}
          </div>
        )}

        {/* Biometric trigger */}
        {authMode === 'biometric' && (
          <div className="py-4 space-y-4">
            <button
              type="button"
              onClick={handleBiometricAuthenticate}
              disabled={isVerifying}
              className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              {isVerifying ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <Fingerprint className="w-10 h-10" />
              )}
            </button>
            <p className="text-xs text-slate-500">Tap icon to scan fingerprint</p>
          </div>
        )}

        {/* Custom Numpad */}
        {authMode !== 'biometric' && (
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumpad(num)}
                className="py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold text-xs hover:bg-slate-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleNumpad('0')}
              className="py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold text-xs hover:bg-slate-100"
            >
              ⌫
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isVerifying}
          onClick={authMode === 'biometric' ? handleBiometricAuthenticate : handleConfirmSubmit}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying & Submitting...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Submit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
