import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Sliders, 
  ShieldCheck, 
  KeyRound, 
  History, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Eye, 
  Gift, 
  CheckCircle2, 
  Truck,
  Zap,
  ArrowUpRight,
  PhoneCall
} from 'lucide-react';
import { CreditDebitCard, CardTransaction, CardSecurityAlert } from '../../../types/banking';
import { CardVisual } from './CardVisual';

interface CardsOverviewProps {
  cards: CreditDebitCard[];
  selectedCard: CreditDebitCard;
  onSelectCard: (card: CreditDebitCard) => void;
  onOpenDetails: () => void;
  onOpenControls: () => void;
  onOpenLimits: () => void;
  onOpenTransactions: () => void;
  onOpenChangePin: () => void;
  onOpenFreezeModal: () => void;
  onOpenAddCard: () => void;
  onOpenBillPay: () => void;
  onOpenSecurity: () => void;
  onOpenTracker: () => void;
  onSelectTransaction: (txn: CardTransaction) => void;
  cardTransactions: CardTransaction[];
  securityAlerts: CardSecurityAlert[];
}

export const CardsOverview: React.FC<CardsOverviewProps> = ({
  cards,
  selectedCard,
  onSelectCard,
  onOpenDetails,
  onOpenControls,
  onOpenLimits,
  onOpenTransactions,
  onOpenChangePin,
  onOpenFreezeModal,
  onOpenAddCard,
  onOpenBillPay,
  onOpenSecurity,
  onOpenTracker,
  onSelectTransaction,
  cardTransactions,
  securityAlerts,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter transactions for currently selected card
  const activeCardTransactions = cardTransactions.filter(t => t.cardId === selectedCard.id).slice(0, 3);
  const pendingAlert = securityAlerts.find(a => a.status === 'pending_review' && a.cardId === selectedCard.id);

  const currentIndex = cards.findIndex(c => c.id === selectedCard.id);

  return (
    <div className="space-y-5 pb-8">
      {/* Header with Title & Add Card */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Card Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'} linked to Bharat Bank ID
          </p>
        </div>
        <button
          onClick={onOpenAddCard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Security Alert Banner (If Any) */}
      {pendingAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onOpenSecurity}
          className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/70 dark:hover:bg-amber-900/30 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Action Required: Suspicious Activity Flagged
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 line-clamp-1">
                ₹{pendingAlert.amount.toLocaleString('en-IN')} at {pendingAlert.merchant}
              </p>
            </div>
          </div>
          <div className="flex items-center text-amber-700 dark:text-amber-300 text-xs font-semibold gap-1 shrink-0">
            <span>Review</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>
      )}

      {/* Replacement Tracker Pill (If replacement is active) */}
      {selectedCard.replacementRequest && (
        <div
          onClick={onOpenTracker}
          className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between gap-3 cursor-pointer hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950 dark:text-blue-200">
                Replacement Card In Transit
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400">
                ETA: {selectedCard.replacementRequest.expectedDelivery} • {selectedCard.replacementRequest.trackingNumber}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Track</span>
        </div>
      )}

      {/* 3D Visual Card Display with Carousel Navigation */}
      <div className="space-y-3">
        <CardVisual
          card={selectedCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        {/* Carousel Indicators & Switcher */}
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => {
                  setIsFlipped(false);
                  onSelectCard(card);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  card.id === selectedCard.id
                    ? 'w-7 bg-blue-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Switch to ${card.network} card`}
              />
            ))}
          </div>
        )}

        {/* Horizontal Mini-Card Selector if multiple cards */}
        {cards.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {cards.map(c => {
              const isSelected = c.id === selectedCard.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setIsFlipped(false);
                    onSelectCard(c);
                  }}
                  className={`px-3 py-2 rounded-xl border text-left shrink-0 transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-500 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {c.network} {c.tier}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      •••• {c.cardNumber.slice(-4)}
                    </p>
                  </div>
                  {c.isFrozen && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 ml-1" title="Frozen" />
                  )}
                  {c.isBlocked && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ml-1" title="Blocked" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Dynamic Metrics Card (Credit vs Debit) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {selectedCard.cardType === 'credit' ? (
          /* CREDIT CARD METRICS */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Available Credit Limit</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{(selectedCard.availableLimit || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Credit Limit</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  ₹{(selectedCard.totalLimit || 500000).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Credit Utilization Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round(((selectedCard.outstandingBalance || 0) / (selectedCard.totalLimit || 500000)) * 100))}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Used: ₹{(selectedCard.outstandingBalance || 0).toLocaleString('en-IN')}</span>
                <span>
                  {Math.round(((selectedCard.outstandingBalance || 0) / (selectedCard.totalLimit || 500000)) * 100)}% utilized
                </span>
              </div>
            </div>

            {/* Due Date & Pay Bill CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bill Due:</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    ₹{(selectedCard.outstandingBalance || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Payment Due by <strong className="text-slate-700 dark:text-slate-300">{selectedCard.dueDate || '28 Aug 2026'}</strong>
                </p>
              </div>

              <button
                onClick={onOpenBillPay}
                disabled={!selectedCard.outstandingBalance}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Pay Credit Card Bill</span>
              </button>
            </div>
          </div>
        ) : (
          /* DEBIT CARD METRICS */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Linked Bank Account</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Savings Account ({selectedCard.linkedAccountMasked || '•••• 0012'})
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Daily ATM Limit</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ₹{(selectedCard.dailyAtmLimit || 50000).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedCard.rewardsPoints.toLocaleString('en-IN')} Bharat Points
                  </p>
                  <p className="text-[10px] text-slate-500">Worth ₹{(selectedCard.rewardsPoints * 0.25).toFixed(0)} Cashback</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Redeem</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          Quick Card Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* View Details */}
          <button
            onClick={onOpenDetails}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-left flex flex-col justify-between group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Card Details</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">View CVV & Number</p>
            </div>
          </button>

          {/* Card Controls */}
          <button
            onClick={onOpenControls}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-left flex flex-col justify-between group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Card Controls</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Online, NFC & ATM</p>
            </div>
          </button>

          {/* Transaction Limits */}
          <button
            onClick={onOpenLimits}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-left flex flex-col justify-between group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Limits</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">ATM & POS amounts</p>
            </div>
          </button>

          {/* Change PIN */}
          <button
            onClick={onOpenChangePin}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-left flex flex-col justify-between group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Change PIN</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Instant ATM PIN reset</p>
            </div>
          </button>
        </div>
      </div>

      {/* Freeze / Unfreeze Quick Toggle Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            selectedCard.isFrozen
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
          }`}>
            {selectedCard.isFrozen ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {selectedCard.isFrozen ? 'Card is Temporarily Locked' : 'Card is Active & Ready'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedCard.isFrozen ? 'Transactions paused' : 'Full security protections active'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFreezeModal}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
            selectedCard.isFrozen
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60'
          }`}
        >
          {selectedCard.isFrozen ? 'Unfreeze' : 'Freeze Card'}
        </button>
      </div>

      {/* Recent Transactions Snippet */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Card Activity</h3>
          </div>
          <button
            onClick={onOpenTransactions}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeCardTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeCardTransactions.map(txn => (
              <div
                key={txn.id}
                onClick={() => onSelectTransaction(txn)}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {txn.merchant.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {txn.merchant}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {txn.date} • {txn.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-bold font-mono ${
                    txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[9px] uppercase font-semibold text-slate-400">
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No recent card activity recorded.</p>
        )}
      </div>

      {/* Security & Support Center Entry */}
      <div
        onClick={onOpenSecurity}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white cursor-pointer hover:from-slate-800 hover:to-slate-700 transition-all shadow-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold">24x7 Card Fraud Protection</h4>
            <p className="text-[11px] text-slate-300">Hotlist instantly or verify transactions</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
};
