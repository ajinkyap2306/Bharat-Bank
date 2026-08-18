import React from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  CreditCard as CardIcon
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';

interface CardVisualProps {
  card: CreditDebitCard;
  isFlipped: boolean;
  onFlip: () => void;
  showSensitiveDetails?: boolean;
  onToggleSensitiveDetails?: () => void;
  interactive?: boolean;
}

export const CardVisual: React.FC<CardVisualProps> = ({
  card,
  isFlipped,
  onFlip,
  showSensitiveDetails = false,
  onToggleSensitiveDetails,
  interactive = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCardNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.cardNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine gradient background based on card type and tier
  const getCardBackground = () => {
    if (card.cardType === 'corporate') {
      return 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)';
    }
    if (card.cardType === 'credit') {
      if (card.tier === 'Signature') {
        return 'linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #0F172A 100%)';
      }
      return 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #09090B 100%)';
    }
    // Debit Cards
    if (card.network === 'RuPay') {
      return 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #065F46 100%)';
    }
    if (card.tier === 'Platinum') {
      return 'linear-gradient(135deg, #005dd4 0%, #0076ff 50%, #024491 100%)';
    }
    return 'linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #0C4A6E 100%)';
  };

  const getNetworkLogo = () => {
    if (card.network === 'Visa') {
      return (
        <span className="font-black italic text-lg sm:text-xl tracking-tighter text-white drop-shadow-md">
          VISA
        </span>
      );
    }
    if (card.network === 'Mastercard') {
      return (
        <div className="flex items-center -space-x-2">
          <div className="w-5 h-5 rounded-full bg-rose-500/90 shadow-xs" />
          <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-xs" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 font-bold text-xs tracking-wider bg-white/10 px-2 py-0.5 rounded text-white">
        <span className="text-emerald-300">Ru</span><span className="text-amber-300">Pay</span>
        <span className="text-[9px] uppercase text-white/70 font-semibold">{card.tier}</span>
      </div>
    );
  };

  return (
    <div className="w-full select-none" style={{ perspective: '1200px' }}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onClick={interactive ? onFlip : undefined}
        className={`relative w-full aspect-[1.58/1] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden transition-shadow ${
          interactive ? 'cursor-pointer hover:shadow-blue-500/20' : ''
        }`}
        style={{
          background: getCardBackground(),
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic Sheen Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />

        {/* FRONT SIDE */}
        {!isFlipped ? (
          <div className="relative z-10 flex flex-col justify-between h-full text-white">
            {/* Top Bar: Chip + Contactless + Bank Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Gold EMV Chip */}
                <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full border border-amber-900/30 rounded-[5px] grid grid-cols-3 grid-rows-2 gap-0.5 opacity-90 p-0.5">
                    <div className="border-r border-b border-amber-900/30" />
                    <div className="border-b border-amber-900/30" />
                    <div className="border-l border-b border-amber-900/30" />
                    <div className="border-r border-amber-900/30" />
                    <div className="" />
                    <div className="border-l border-amber-900/30" />
                  </div>
                </div>
                {/* Contactless Waves */}
                <Wifi className="w-5 h-5 text-white/80 rotate-90" />
              </div>

              {/* Bank Branding & Tier */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[11px] font-black tracking-widest text-white drop-shadow-xs">
                    BHARAT BANK
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/15 text-white/90">
                    {card.tier} {card.cardType === 'credit' ? 'Credit' : 'Debit'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: 16-Digit Card Number with Copy Action */}
            <div className="my-auto py-2">
              <div className="flex items-center justify-between">
                <p className="text-lg sm:text-xl font-mono font-bold tracking-[0.22em] text-white drop-shadow-md">
                  {showSensitiveDetails ? card.cardNumber : card.maskedNumber}
                </p>
                {showSensitiveDetails && (
                  <button
                    onClick={handleCopyCardNumber}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Copy card number"
                    aria-label="Copy card number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Meta: Cardholder, Valid Thru, Network */}
            <div className="flex items-end justify-between text-white">
              <div>
                <p className="text-[7px] uppercase tracking-wider text-white/60 font-semibold">Cardholder</p>
                <p className="text-xs sm:text-sm font-bold tracking-wider uppercase font-sans">
                  {card.cardHolder}
                </p>
              </div>

              <div className="text-center">
                <p className="text-[7px] uppercase tracking-wider text-white/60 font-semibold">Valid Thru</p>
                <p className="text-xs sm:text-sm font-mono font-bold">
                  {card.expiry}
                </p>
              </div>

              <div className="flex items-center justify-end">
                {getNetworkLogo()}
              </div>
            </div>

            {/* Frozen Overlay */}
            {card.isFrozen && !card.isBlocked && (
              <div className="absolute -inset-6 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <p className="font-extrabold text-sm tracking-wide text-amber-300">CARD TEMPORARILY FROZEN</p>
                <p className="text-[11px] text-slate-300 mt-1 max-w-[240px]">
                  All ATM, POS, and online transactions are paused. Unfreeze anytime.
                </p>
              </div>
            )}

            {/* Blocked Overlay */}
            {card.isBlocked && (
              <div className="absolute -inset-6 bg-rose-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mb-2">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <p className="font-extrabold text-sm tracking-wide text-rose-300">CARD PERMANENTLY BLOCKED</p>
                <p className="text-[11px] text-rose-200 mt-1 max-w-[240px]">
                  {card.blockReason || 'Card reported lost/stolen. Inactive permanently.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* BACK SIDE */
          <div className="relative z-10 flex flex-col justify-between h-full text-white [transform:rotateY(180deg)]">
            {/* Magnetic Stripe */}
            <div className="-mx-6 -mt-1 h-10 bg-gradient-to-r from-slate-900 via-black to-slate-900 shadow-inner" />

            {/* Signature & CVV Panel */}
            <div className="space-y-1 my-auto">
              <div className="flex items-center justify-between text-[8px] text-white/70 uppercase font-semibold px-1">
                <span>Authorized Signature</span>
                <span>Security Code (CVV)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 bg-slate-200/90 rounded text-slate-800 font-serif italic text-xs flex items-center px-3 tracking-widest border border-slate-300 shadow-inner">
                  {card.cardHolder}
                </div>
                <div className="w-14 h-8 bg-white rounded text-slate-900 font-mono font-extrabold text-sm flex items-center justify-center shadow-inner">
                  {showSensitiveDetails ? card.cvv : '•••'}
                </div>
              </div>
            </div>

            {/* Bank Legal & Hotline Notice */}
            <div className="space-y-1 text-[8px] text-white/70 leading-tight">
              <p>
                This card is property of Bharat Co-operative Bank (Mumbai) Ltd. If found, please return to any branch or call 1800-22-6800.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-white/50 text-[7px]">
                <span>ELECTRONIC USE ONLY</span>
                <span>MULTI-STATE SCHEDULED BANK</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Helper Flip / Unmask Bar */}
      {interactive && (
        <div className="flex items-center justify-between mt-2.5 px-1 text-[11px] text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onFlip}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tap to {isFlipped ? 'view front' : 'flip to back & CVV'}</span>
          </button>

          {onToggleSensitiveDetails && (
            <button
              type="button"
              onClick={onToggleSensitiveDetails}
              className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showSensitiveDetails ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide Numbers
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Show Numbers & CVV
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
