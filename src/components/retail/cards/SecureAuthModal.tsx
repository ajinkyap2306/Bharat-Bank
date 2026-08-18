import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Delete, 
  X, 
  Lock, 
  AlertCircle,
  ScanFace
} from 'lucide-react';

interface SecureAuthModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
  requiredActionDesc?: string;
}

export const SecureAuthModal: React.FC<SecureAuthModalProps> = ({
  isOpen,
  title = 'Verify Identity',
  subtitle = 'Enter your 4-digit MPIN or use Biometrics to authenticate this secure card action.',
  onSuccess,
  onCancel,
  requiredActionDesc,
}) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setIsError(false);

      if (nextPin.length === 4) {
        // Verify PIN (Mock MPIN is 1234 or any 4 digit except 0000 for test error)
        setTimeout(() => {
          if (nextPin === '0000') {
            setIsError(true);
            setPin('');
          } else {
            onSuccess();
            setPin('');
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      onSuccess();
    }, 1000);
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
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Bharat Bank 256-Bit SSL</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Context */}
          {requiredActionDesc && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">{requiredActionDesc}</span>
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3 max-w-xs">
            {subtitle}
          </p>

          {/* PIN Indicators */}
          <div className="my-6">
            <div className={`flex items-center gap-4 ${isError ? 'animate-bounce' : ''}`}>
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    i < pin.length
                      ? 'bg-blue-600 border-blue-600 scale-110 shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  } ${isError ? 'border-rose-500 bg-rose-500' : ''}`}
                />
              ))}
            </div>
            {isError && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 text-center mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Incorrect MPIN. Try 1234.
              </p>
            )}
          </div>

          {/* Biometric Scan Trigger / Status */}
          {isBiometricScanning ? (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center"
                >
                  <Fingerprint className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Scanning Biometrics...
              </p>
            </div>
          ) : (
            /* Numeric Keypad */
            <div className="w-full max-w-[280px] grid grid-cols-3 gap-3">
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
              {/* Biometric Action button */}
              <button
                type="button"
                onClick={handleBiometricAuth}
                className="h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 text-blue-600 dark:text-blue-400 transition-all flex items-center justify-center"
                title="Use Biometric Authentication"
              >
                <Fingerprint className="w-5 h-5" />
              </button>
              {/* 0 */}
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-lg font-bold text-slate-800 dark:text-white transition-all shadow-2xs flex items-center justify-center"
              >
                0
              </button>
              {/* Backspace */}
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center"
                title="Delete"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Demo Help */}
          <div className="mt-4 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Demo MPIN: <strong className="text-slate-600 dark:text-slate-300">1234</strong> or tap Fingerprint icon
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
