import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  X, 
  CreditCard, 
  Landmark, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface CardBillPayModalProps {
  isOpen: boolean;
  card: CreditDebitCard;
  onClose: () => void;
  onSuccessPay: (amount: number) => void;
}

export const CardBillPayModal: React.FC<CardBillPayModalProps> = ({
  isOpen,
  card,
  onClose,
  onSuccessPay,
}) => {
  const outstanding = card.outstandingBalance || 0;
  const minDue = Math.round(outstanding * 0.05);

  const [paymentType, setPaymentType] = useState<'total' | 'min' | 'custom'>('total');
  const [customAmount, setCustomAmount] = useState<string>(outstanding.toString());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [paidTxnId, setPaidTxnId] = useState('');

  if (!isOpen) return null;

  const currentPayAmount = paymentType === 'total' 
    ? outstanding 
    : paymentType === 'min' 
      ? minDue 
      : (Number(customAmount) || 0);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPayAmount <= 0) return;
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    const txnId = `CCPAY-${Math.floor(100000 + Math.random() * 900000)}`;
    setPaidTxnId(txnId);
    onSuccessPay(currentPayAmount);
    setIsPaidSuccess(true);
  };

  const handleDone = () => {
    setIsPaidSuccess(false);
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pay Credit Card Bill</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {card.network} •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDone}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isPaidSuccess ? (
            <form onSubmit={handleStartPayment} className="space-y-4">
              {/* Bill Details Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Outstanding:</span>
                  <span className="font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                    ₹{outstanding.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Minimum Amount Due:</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    ₹{minDue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Payment Due Date:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{card.dueDate || '28 Aug 2026'}</span>
                </div>
              </div>

              {/* Payment Option Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Payment Amount:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('total')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentType === 'total'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium'
                    }`}
                  >
                    <p className="text-[10px] uppercase text-slate-400">Total Bill</p>
                    <p className="text-xs mt-0.5">₹{outstanding.toLocaleString('en-IN')}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('min')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentType === 'min'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium'
                    }`}
                  >
                    <p className="text-[10px] uppercase text-slate-400">Min. Due</p>
                    <p className="text-xs mt-0.5">₹{minDue.toLocaleString('en-IN')}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('custom')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentType === 'custom'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium'
                    }`}
                  >
                    <p className="text-[10px] uppercase text-slate-400">Custom</p>
                    <p className="text-xs mt-0.5">Enter Amount</p>
                  </button>
                </div>
              </div>

              {/* Custom Amount Input */}
              {paymentType === 'custom' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Payment Amount (₹)</label>
                  <input
                    type="number"
                    min={1}
                    max={outstanding * 2}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter amount in ₹"
                  />
                </div>
              )}

              {/* Debit Source Account */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Debiting: Bharat Savings A/C</p>
                    <p className="text-[10px] font-mono text-slate-500">•••• •••• 0012 • Avail: ₹2,45,890.00</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>

              {/* Submit CTA */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDone}
                  className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={currentPayAmount <= 0}
                  className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{currentPayAmount.toLocaleString('en-IN')}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="py-2 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Credit Card Bill Paid!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your payment was processed instantly and your credit limit has been replenished.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Txn Reference:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{paidTxnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-600">₹{currentPayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credit Limit Restored:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Instant Replenish</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDone}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Secure MPIN Auth */}
          <SecureAuthModal
            isOpen={isAuthOpen}
            title="Authenticate Card Bill Payment"
            subtitle={`Confirm payment of ₹${currentPayAmount.toLocaleString('en-IN')} to Bharat Credit Card.`}
            requiredActionDesc={`Settling credit card bill of ₹${currentPayAmount.toLocaleString('en-IN')}`}
            onSuccess={handleAuthSuccess}
            onCancel={() => setIsAuthOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
