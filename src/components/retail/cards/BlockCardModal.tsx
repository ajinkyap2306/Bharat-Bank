import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface BlockCardModalProps {
  isOpen: boolean;
  card: CreditDebitCard;
  onClose: () => void;
  onConfirmBlock: (reason: string) => void;
  onOpenReplaceModal: () => void;
}

export const BlockCardModal: React.FC<BlockCardModalProps> = ({
  isOpen,
  card,
  onClose,
  onConfirmBlock,
  onOpenReplaceModal,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Card Lost');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlockedSuccess, setIsBlockedSuccess] = useState(false);
  const [blockRefNumber, setBlockRefNumber] = useState('');

  if (!isOpen) return null;

  const reasons = [
    { id: 'Card Lost', label: 'Card Lost / Misplaced', desc: 'Card was lost in transit or public place' },
    { id: 'Card Stolen', label: 'Card Stolen / Pickpocketed', desc: 'Physical card stolen by an unauthorized person' },
    { id: 'Suspected Fraud', label: 'Suspected Fraud / Phishing', desc: 'Unrecognized charges or compromised card number' },
    { id: 'Damaged Card', label: 'Card Physically Damaged', desc: 'Chip cracked or magnetic stripe unreadable' },
    { id: 'Other', label: 'Other Security Reasons', desc: 'Precautionary hotlisting requested by user' },
  ];

  const handleStartBlock = () => {
    if (!acknowledged) return;
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    const ref = `BLK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBlockRefNumber(ref);
    onConfirmBlock(selectedReason);
    setIsBlockedSuccess(true);
  };

  const handleCloseAll = () => {
    setIsBlockedSuccess(false);
    setAcknowledged(false);
    onClose();
  };

  const handleProceedToReplace = () => {
    handleCloseAll();
    onOpenReplaceModal();
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
                  {isBlockedSuccess ? 'Card Permanently Blocked' : 'Block Card Permanently'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {card.network} •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseAll}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isBlockedSuccess ? (
            <>
              {/* Permanent Warning Banner */}
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <p className="font-bold">This action is permanent and irreversible.</p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300">
                    Once blocked, this physical card cannot be reactivated under any circumstances. You must order a replacement card.
                  </p>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Reason for Blocking:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {reasons.map((r) => (
                    <label
                      key={r.id}
                      onClick={() => setSelectedReason(r.id)}
                      className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                        selectedReason === r.id
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{r.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{r.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="block_reason"
                        checked={selectedReason === r.id}
                        onChange={() => setSelectedReason(r.id)}
                        className="mt-1 accent-rose-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Explicit Acknowledgment Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  I understand that this card will be destroyed on the central banking switch and cannot be recovered.
                </span>
              </label>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!acknowledged}
                  onClick={handleStartBlock}
                  className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Block Card Now</span>
                </button>
              </div>
            </>
          ) : (
            /* Block Success State */
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Card Successfully Blocked</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your card has been deactivated on Visa/Mastercard/RuPay switch networks. No further transactions can occur.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Block Ref:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{blockRefNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reason:</span>
                  <span className="font-medium text-rose-600">{selectedReason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Permanently Hotlisted</span>
                </div>
              </div>

              {/* Order Replacement CTA */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToReplace}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Request Replacement Card</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
                >
                  Done, Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Secure Auth Modal */}
          <SecureAuthModal
            isOpen={isAuthOpen}
            title="Authenticate Card Blocking"
            subtitle="Enter your 6-digit MPIN or use Biometrics to finalize permanent card blocking."
            requiredActionDesc={`Permanently blocking ${card.network} card (${selectedReason})`}
            onSuccess={handleAuthSuccess}
            onCancel={() => setIsAuthOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
