import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<CreditDebitCard, 'id'>) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
}) => {
  const [step, setStep] = useState<'form' | 'verifying' | 'otp' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('ARJUN MEHTA');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'debit' | 'credit'>('debit');
  const [tier, setTier] = useState<CreditDebitCard['tier']>('Platinum');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-detect network from first digit
  const detectNetwork = (num: string): 'Visa' | 'Mastercard' | 'RuPay' => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6')) return 'RuPay';
    return 'Visa';
  };

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g);
    return parts ? parts.join(' ') : clean;
  };

  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 16) {
      setErrorMsg('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please enter a valid MM/YY expiry date.');
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg('Please enter a valid 3-digit CVV.');
      return;
    }

    setErrorMsg(null);
    setStep('verifying');

    setTimeout(() => {
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }

    const network = detectNetwork(cardNumber);
    const masked = `•••• •••• •••• ${cardNumber.slice(-4)}`;

    const newCardData: Omit<CreditDebitCard, 'id'> = {
      cardNumber,
      maskedNumber: masked,
      cardHolder: cardHolder.toUpperCase(),
      expiry,
      cvv,
      cardType,
      network,
      tier,
      isFrozen: false,
      dailyDomesticLimit: 100000,
      dailyInternationalLimit: 50000,
      dailyAtmLimit: 50000,
      dailyPosLimit: 100000,
      dailyOnlineLimit: 75000,
      maxAtmLimit: 100000,
      maxPosLimit: 300000,
      maxOnlineLimit: 300000,
      maxInternationalLimit: 150000,
      onlineTxnEnabled: true,
      contactlessEnabled: true,
      internationalEnabled: false,
      atmEnabled: true,
      posTxnEnabled: true,
      rewardsPoints: 500,
      ...(cardType === 'credit'
        ? { totalLimit: 300000, availableLimit: 300000, outstandingBalance: 0, dueDate: '15 Sep 2026' }
        : { linkedAccountId: 'acc_ret_01', linkedAccountMasked: '•••• •••• 0012' }),
    };

    onAddCard(newCardData);
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setCardNumber('');
    setExpiry('');
    setCvv('');
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
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {step === 'success' ? 'Card Linked' : 'Add / Link Card'}
                </h3>
                <p className="text-[11px] text-slate-500">Bharat Bank Multi-Card Suite</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleVerify} className="space-y-3.5">
              {/* Card Type Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setCardType('debit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    cardType === 'debit'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('credit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    cardType === 'credit'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Credit Card
                </button>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">16-Digit Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 font-mono text-sm font-bold text-slate-900 dark:text-white tracking-widest focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  {cardNumber.length >= 1 && (
                    <span className="absolute right-3 top-3 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {detectNetwork(cardNumber)}
                    </span>
                  )}
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name on Card</label>
                <input
                  type="text"
                  required
                  placeholder="ARJUN MEHTA"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wider focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="08/29"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 font-mono text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    required
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 font-mono text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Card Variant / Tier Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Card Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as CreditDebitCard['tier'])}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Platinum">Platinum</option>
                  <option value="Signature">Signature</option>
                  <option value="Select">Select</option>
                  <option value="Infinite">Infinite</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Card & Link</span>
              </button>
            </form>
          )}

          {/* STEP 2: VERIFYING */}
          {step === 'verifying' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Verifying with Network Switch...</p>
              <p className="text-[11px] text-slate-400">Authenticating Bharat Bank core database</p>
            </div>
          )}

          {/* STEP 3: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enter Verification OTP</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  A 6-digit one-time passcode has been sent to your registered mobile number <strong className="text-slate-700 dark:text-slate-300">+91 98192 ••••1</strong>
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-48 h-12 mx-auto rounded-2xl border-2 border-blue-500 bg-slate-50 dark:bg-slate-800 font-mono text-xl font-bold tracking-[0.3em] text-center text-slate-900 dark:text-white focus:outline-hidden"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Confirm & Add Card
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Card Successfully Linked!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your new card is now visible on your dashboard carousel and ready for instant use.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                View in Card Carousel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
