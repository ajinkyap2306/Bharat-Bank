import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Fingerprint, 
  Lock, 
  Sparkles,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';

interface ChangePinModalProps {
  isOpen: boolean;
  card: CreditDebitCard;
  onClose: () => void;
  onSuccess: (newPin: string) => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  card,
  onClose,
  onSuccess,
}) => {
  // Steps: 1: Auth (6-digit MPIN), 2: Enter ATM PIN, 3: Confirm ATM PIN, 4: OTP, 5: Success
  const [step, setStep] = useState<number>(1);
  const [authPin, setAuthPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState('');

  if (!isOpen) return null;

  // Weak PIN validator
  const isWeakPin = (p: string) => {
    const repeated = /^(\d)\1{3}$/.test(p);
    const sequential = ['0123', '1234', '2345', '3456', '4567', '5678', '6789', '9876', '8765', '7654', '6543', '5432', '4321', '3210'].includes(p);
    return repeated || sequential;
  };

  const MPIN_LENGTH = 6;
  const ATM_PIN_LENGTH = 4;

  const handleKeyPress = (num: string) => {
    setErrorMsg(null);
    if (step === 1) {
      if (authPin.length < MPIN_LENGTH) {
        const next = authPin + num;
        setAuthPin(next);
        if (next.length === MPIN_LENGTH) {
          setTimeout(() => {
            setStep(2);
            setAuthPin('');
          }, 200);
        }
      }
    } else if (step === 2) {
      if (newPin.length < ATM_PIN_LENGTH) {
        const next = newPin + num;
        setNewPin(next);
        if (next.length === ATM_PIN_LENGTH) {
          if (isWeakPin(next)) {
            setErrorMsg('PIN is too weak (avoid 1234, 1111). Choose a stronger combination.');
          } else {
            setTimeout(() => {
              setStep(3);
            }, 200);
          }
        }
      }
    } else if (step === 3) {
      if (confirmPin.length < ATM_PIN_LENGTH) {
        const next = confirmPin + num;
        setConfirmPin(next);
        if (next.length === ATM_PIN_LENGTH) {
          if (next !== newPin) {
            setErrorMsg('PINs do not match. Please re-enter.');
            setConfirmPin('');
          } else {
            setTimeout(() => {
              setStep(4);
            }, 200);
          }
        }
      }
    } else if (step === 4) {
      if (otp.length < 6) {
        const next = otp + num;
        setOtp(next);
        if (next.length === 6) {
          setTimeout(() => {
            const genRef = `PIN-${Math.floor(100000 + Math.random() * 900000)}`;
            setRefNumber(genRef);
            setStep(5);
            onSuccess(newPin);
          }, 400);
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg(null);
    if (step === 1) setAuthPin(prev => prev.slice(0, -1));
    if (step === 2) setNewPin(prev => prev.slice(0, -1));
    if (step === 3) setConfirmPin(prev => prev.slice(0, -1));
    if (step === 4) setOtp(prev => prev.slice(0, -1));
  };

  const handleResetAndClose = () => {
    setStep(1);
    setAuthPin('');
    setNewPin('');
    setConfirmPin('');
    setOtp('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center overflow-hidden"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Change Card PIN</h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  {card.network} •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Step Indicators */}
          {step < 5 && (
            <div className="w-full grid grid-cols-4 gap-1.5 mt-4">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Verify Identity */}
          {step === 1 && (
            <div className="w-full flex flex-col items-center text-center mt-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Enter Current MPIN</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Authenticate with your existing 6-digit mobile banking MPIN.
              </p>

              {/* Pin Dots */}
              <div className="flex items-center gap-2 my-5">
                {Array.from({ length: MPIN_LENGTH }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      i < authPin.length
                        ? 'bg-blue-600 border-blue-600 scale-110'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enter New PIN */}
          {step === 2 && (
            <div className="w-full flex flex-col items-center text-center mt-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Enter 4-Digit New ATM PIN</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Choose a secure 4-digit PIN for ATM withdrawals and POS payments.
              </p>

              {/* Pin Dots */}
              <div className="flex items-center gap-3 my-5">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      i < newPin.length
                        ? 'bg-indigo-600 border-indigo-600 scale-110'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirm New PIN */}
          {step === 3 && (
            <div className="w-full flex flex-col items-center text-center mt-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Confirm 4-Digit New ATM PIN</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Re-enter your new PIN to ensure accuracy.
              </p>

              {/* Pin Dots */}
              <div className="flex items-center gap-3 my-5">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      i < confirmPin.length
                        ? 'bg-purple-600 border-purple-600 scale-110'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: OTP Verification */}
          {step === 4 && (
            <div className="w-full flex flex-col items-center text-center mt-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Bank OTP Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Enter the 6-digit OTP sent to registered mobile <strong className="text-slate-700 dark:text-slate-300">+91 98192 ••••1</strong>
              </p>

              {/* 6 Digit OTP Dots */}
              <div className="flex items-center gap-2.5 my-5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      i < otp.length
                        ? 'bg-emerald-600 border-emerald-600 scale-110'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                Resend OTP in 24s
              </span>
            </div>
          )}

          {/* Step 5: Success Confirmation */}
          {step === 5 && (
            <div className="w-full flex flex-col items-center text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">PIN Changed Successfully</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Your new 4-digit ATM PIN is active immediately for ATM and POS transactions.
                </p>
              </div>

              <div className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Card:</span>
                  <span className="font-mono font-semibold">{card.network} •••• {card.cardNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Back to Card Details
              </button>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Numeric Keypad for Steps 1-4 */}
          {step < 5 && (
            <div className="w-full max-w-[280px] grid grid-cols-3 gap-3 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-lg font-bold text-slate-800 dark:text-white transition-all shadow-2xs flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <div className="flex items-center justify-center">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setStep(prev => prev - 1);
                    }}
                    className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center"
                    title="Previous step"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-lg font-bold text-slate-800 dark:text-white transition-all shadow-2xs flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center"
                title="Delete"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
