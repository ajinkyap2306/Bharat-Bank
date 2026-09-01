import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Sliders, 
  KeyRound, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  RefreshCw, 
  History, 
  ChevronRight, 
  Zap, 
  Truck,
  ShieldCheck,
  CreditCard,
  Building2,
  Calendar,
  User,
  Hash,
  AlertCircle
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { CardVisual } from './CardVisual';
import { SecureAuthModal } from './SecureAuthModal';

interface CardDetailsViewProps {
  card: CreditDebitCard;
  onBack: () => void;
  onOpenControls: () => void;
  onOpenLimits: () => void;
  onOpenTransactions: () => void;
  onOpenChangePin: () => void;
  onOpenFreezeModal: () => void;
  onOpenBlockModal: () => void;
  onOpenReplaceModal: () => void;
  onOpenBillPay: () => void;
  onOpenTracker: () => void;
}

export const CardDetailsView: React.FC<CardDetailsViewProps> = ({
  card,
  onBack,
  onOpenControls,
  onOpenLimits,
  onOpenTransactions,
  onOpenChangePin,
  onOpenFreezeModal,
  onOpenBlockModal,
  onOpenReplaceModal,
  onOpenBillPay,
  onOpenTracker,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  // Auto-mask countdown timer after 30 seconds for security
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSensitive) {
      setSecondsRemaining(30);
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setShowSensitive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSensitive]);

  const handleToggleSensitive = () => {
    if (showSensitive) {
      setShowSensitive(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setShowSensitive(true);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Card Vault</span>
        </div>
      </div>

      {/* 3D Visual Card Display */}
      <div className="space-y-3">
        <CardVisual
          card={card}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          showSensitiveDetails={showSensitive}
          onToggleSensitiveDetails={handleToggleSensitive}
        />

        {/* Security Auto-Mask Countdown Banner */}
        {showSensitive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Full card details unmasked. Auto-hiding in:</span>
            </div>
            <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60">
              {secondsRemaining}s
            </span>
          </motion.div>
        )}
      </div>

      {/* Sensitive Card Info Summary Sheet */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Card Information</span>
          </h3>

          <button
            onClick={handleToggleSensitive}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showSensitive ? 'Hide Details' : 'Show CVV & Number'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Card Number */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Card Number</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {showSensitive ? card.cardNumber : card.maskedNumber}
              </p>
            </div>
            {showSensitive && (
              <button
                onClick={() => copyToClipboard(card.cardNumber.replace(/\s+/g, ''), 'number')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                title="Copy Number"
              >
                {copiedField === 'number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Expiry Date & CVV */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Expiry</p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">{card.expiry}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">CVV</p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {showSensitive ? card.cvv : '•••'}
                </p>
              </div>
            </div>
            {showSensitive && (
              <button
                onClick={() => copyToClipboard(card.cvv, 'cvv')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                title="Copy CVV"
              >
                {copiedField === 'cvv' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Cardholder Name</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase mt-0.5">{card.cardHolder}</p>
          </div>

          {/* Network & Tier */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Card Variant</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              {card.network} {card.tier} ({card.cardType.toUpperCase()})
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Action Hub */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          Manage Card & Security
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Card Controls */}
          <button
            onClick={onOpenControls}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Card Controls & Channels</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Toggle Online, NFC, ATM & POS</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Transaction Limits */}
          <button
            onClick={onOpenLimits}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Transaction Limits</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Customize ATM, POS & Online spend caps</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Card Transactions History */}
          <button
            onClick={onOpenTransactions}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Card Transaction Statement</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">View purchases, ATM withdrawals & refunds</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Change ATM PIN */}
          <button
            onClick={onOpenChangePin}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Change 4-Digit PIN</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Set new PIN for ATM and POS terminals</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Freeze / Unfreeze Card */}
          <button
            onClick={onOpenFreezeModal}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                card.isFrozen
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {card.isFrozen ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card Temporarily'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {card.isFrozen ? 'Reactivate all transaction channels' : 'Temporarily pause all card usage'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Replace Card */}
          <button
            onClick={onOpenReplaceModal}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Request Replacement Card</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">For damaged, expired, or misplaced card</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Block Card Permanently */}
          <button
            onClick={onOpenBlockModal}
            disabled={card.isBlocked}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {card.isBlocked ? 'Card Blocked Permanently' : 'Block Card (Permanent)'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {card.isBlocked ? 'Inactive' : 'Lost or stolen card permanent disablement'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Track Active Replacement if any */}
      {card.replacementRequest && (
        <button
          onClick={onOpenTracker}
          className="w-full p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-200">Track Replacement Shipment</p>
              <p className="text-[11px] text-blue-700 dark:text-blue-400">{card.replacementRequest.courierName}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-600" />
        </button>
      )}

      {/* Pay Credit Card Bill CTA if applicable */}
      {card.cardType === 'credit' && (card.outstandingBalance || 0) > 0 && (
        <div className="sticky bottom-4 z-20">
          <button
            onClick={onOpenBillPay}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Pay Bill: ₹{(card.outstandingBalance || 0).toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}

      {/* Authentication Sheet to reveal sensitive details */}
      <SecureAuthModal
        isOpen={isAuthModalOpen}
        title="Reveal Card Details"
        subtitle="Authenticate with your 6-digit MPIN or Biometrics to view full 16-digit card number and CVV."
        requiredActionDesc="Viewing unmasked card credentials"
        onSuccess={handleAuthSuccess}
        onCancel={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
