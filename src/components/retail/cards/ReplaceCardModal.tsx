import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  X, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Building2,
  Home,
  Check
} from 'lucide-react';
import { CreditDebitCard, CardReplacementRequest } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface ReplaceCardModalProps {
  isOpen: boolean;
  card: CreditDebitCard;
  onClose: () => void;
  onConfirmReplace: (reason: CardReplacementRequest['reason'], cardType: string, address: string) => void;
}

export const ReplaceCardModal: React.FC<ReplaceCardModalProps> = ({
  isOpen,
  card,
  onClose,
  onConfirmReplace,
}) => {
  const [reason, setReason] = useState<CardReplacementRequest['reason']>('Damaged');
  const [cardVariant, setCardVariant] = useState<string>(`${card.network} ${card.tier}`);
  const [addressType, setAddressType] = useState<'home' | 'office' | 'custom'>('home');
  const [customAddress, setCustomAddress] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRequestId, setGeneratedRequestId] = useState('');

  if (!isOpen) return null;

  const homeAddress = 'Flat 402, Horizon Towers, BKC, Bandra East, Mumbai - 400051';
  const officeAddress = 'Nexus Tech Hub, 12th Floor, Nariman Point, Mumbai - 400021';

  const selectedAddress = addressType === 'home' 
    ? homeAddress 
    : addressType === 'office' 
      ? officeAddress 
      : (customAddress || homeAddress);

  const fee = reason === 'Lost' || reason === 'Stolen' ? 199 : 0;

  const handleStartSubmit = () => {
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    const reqId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRequestId(reqId);
    onConfirmReplace(reason, cardVariant, selectedAddress);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
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
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isSubmitted ? 'Replacement Confirmed' : 'Request Replacement Card'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {card.network} •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <div className="space-y-4">
              {/* 1. Reason for Replacement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  1. Reason for Replacement:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Damaged', 'Expired', 'Lost', 'Stolen', 'Name Change'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        reason === r
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Network / Variant */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. Choose Card Variant:
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: `${card.network} ${card.tier}`, desc: 'Keep existing tier and reward benefits' },
                    { id: 'Visa Platinum Metal', desc: 'Complimentary airport lounge access' },
                    { id: 'RuPay Select Contactless', desc: 'Domestic perks & zero foreign markups' },
                  ].map((v) => (
                    <label
                      key={v.id}
                      onClick={() => setCardVariant(v.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        cardVariant === v.id
                          ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{v.id}</p>
                        <p className="text-[10px] text-slate-500">{v.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="card_variant"
                        checked={cardVariant === v.id}
                        onChange={() => setCardVariant(v.id)}
                        className="accent-purple-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  3. Select Delivery Address:
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setAddressType('home')}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      addressType === 'home'
                        ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Home className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Home Address (Registered)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{homeAddress}</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setAddressType('office')}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      addressType === 'office'
                        ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Office Address</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{officeAddress}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Order Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Replacement Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {fee === 0 ? <span className="text-emerald-600">FREE (Waived)</span> : `₹${fee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Dispatch:</span>
                  <span className="font-semibold">3-5 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Partner:</span>
                  <span>BlueDart Secure Express</span>
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartSubmit}
                  className="py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit & Authenticate</span>
                </button>
              </div>
            </div>
          ) : (
            /* Success confirmation */
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Replacement Order Placed</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your new card is being embossed and will be dispatched within 24 hours.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Request ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{generatedRequestId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Card Variant:</span>
                  <span className="font-medium">{cardVariant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery To:</span>
                  <span className="font-medium line-clamp-1">{selectedAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier:</span>
                  <span className="font-semibold text-purple-600">BlueDart Express Secure</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Track Status on Dashboard
              </button>
            </div>
          )}

          {/* Secure Auth */}
          <SecureAuthModal
            isOpen={isAuthOpen}
            title="Authenticate Card Replacement"
            subtitle="Enter your 4-digit MPIN or use Biometrics to confirm new card dispatch."
            requiredActionDesc={`Dispatching ${cardVariant} to ${addressType} address`}
            onSuccess={handleAuthSuccess}
            onCancel={() => setIsAuthOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
