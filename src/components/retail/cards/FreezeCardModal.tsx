import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, X, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface FreezeCardModalProps {
  isOpen: boolean;
  card: CreditDebitCard;
  onClose: () => void;
  onConfirm: () => void;
}

export const FreezeCardModal: React.FC<FreezeCardModalProps> = ({
  isOpen,
  card,
  onClose,
  onConfirm,
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (!isOpen) return null;

  const isFreezing = !card.isFrozen;

  const handleStartAuth = () => {
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    onConfirm();
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
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isFreezing
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                {isFreezing ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFreezing ? 'Freeze This Card?' : 'Unfreeze This Card?'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {card.network} •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {isFreezing ? (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Freezing is temporary and reversible anytime:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>ATM cash withdrawals will be blocked immediately</li>
                  <li>Online & in-store POS merchant swipes will be rejected</li>
                  <li>Contactless NFC tap-to-pay will be disabled</li>
                  <li>Net banking and UPI payments linked to your bank account remain active</li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Unfreezing reactivates full transaction functionality:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>Your card channels will be restored instantly across global networks</li>
                  <li>Existing configured limits and controls will apply</li>
                  <li>You can resume online, ATM, and merchant purchases immediately</li>
                </ul>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartAuth}
              className={`py-3 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                isFreezing
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isFreezing ? 'Freeze Card' : 'Unfreeze Card'}</span>
            </button>
          </div>

          {/* MPIN Verification Modal */}
          <SecureAuthModal
            isOpen={isAuthOpen}
            title={isFreezing ? 'Authenticate Card Freeze' : 'Authenticate Card Unfreeze'}
            subtitle="Enter your 4-digit MPIN or use Biometrics to confirm card status update."
            requiredActionDesc={isFreezing ? 'Freezing card transactions' : 'Unfreezing card transactions'}
            onSuccess={handleAuthSuccess}
            onCancel={() => setIsAuthOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
