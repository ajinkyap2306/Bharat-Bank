import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Fingerprint, Keyboard, X, ArrowRight } from 'lucide-react';

interface SecureAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  pinType?: 'mpin' | 'tpin';
}

export const SecureAuthModal: React.FC<SecureAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  pinType = 'tpin',
}) => {
  const pinLabel = pinType === 'tpin' ? 'TPIN' : 'MPIN';
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePinInput = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess();
          setPin('');
        }, 1500);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden relative shadow-2xl"
          >
            <div className="p-6 text-center space-y-6">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10" /> {/* Spacer */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto text-blue-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500">Enter your 6-digit {pinLabel} to authorize</p>
              </div>

              {/* PIN Display */}
              <div className="flex justify-center gap-3 py-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      i < pin.length 
                        ? 'bg-blue-600 border-blue-600 scale-110' 
                        : 'border-slate-200 dark:border-slate-800'
                    } ${isProcessing ? 'animate-pulse' : ''}`}
                  />
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num.toString())}
                    className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xl font-bold text-slate-900 dark:text-white active:bg-blue-600 active:text-white transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button 
                  onClick={() => handlePinInput('0')}
                  className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xl font-bold text-slate-900 dark:text-white active:bg-blue-600 active:text-white transition-colors"
                >
                  0
                </button>
                <button 
                  onClick={handleBackspace}
                  className="h-16 col-span-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 active:bg-slate-200 transition-colors"
                >
                  <Keyboard className="w-6 h-6" />
                </button>
              </div>

              <div className="pt-2">
                <button className="flex items-center gap-2 text-xs font-bold text-blue-600 mx-auto">
                  <Fingerprint className="w-4 h-4" /> Use Biometrics
                </button>
              </div>
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase">Verifying {pinLabel}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
