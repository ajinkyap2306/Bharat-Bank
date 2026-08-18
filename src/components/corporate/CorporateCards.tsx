import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sliders, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Globe2, 
  ShoppingBag, 
  Plane, 
  Fuel, 
  Plus
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion } from 'motion/react';

export const CorporateCards: React.FC = () => {
  const { cards, toggleCardFreeze, updateCardLimits, toggleCardFeature, addToast } = useBanking();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [showCardDetails, setShowCardDetails] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Commercial Cards
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Corporate Expense Cards</h2>
            <p className="text-xs text-slate-300">
              Departmental budgets, dynamic spending limits & merchant restrictions
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => setSelectedCardId(card.id)}
            className={`shrink-0 p-3 rounded-2xl border text-left transition-all min-w-[160px] ${
              card.id === selectedCardId
                ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase truncate">
              {card.department || card.cardHolder}
            </p>
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {card.maskedNumber}
            </p>
            <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
              card.isFrozen ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {card.isFrozen ? 'Locked' : 'Active'}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Metallic Card */}
      {selectedCard && (
        <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-2xl bg-gradient-to-tr from-slate-950 via-teal-950 to-slate-900 border border-teal-800/50 aspect-[1.586/1] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-widest text-sm text-teal-300 uppercase">APEX BUSINESS</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/30 text-teal-200 uppercase">
                {selectedCard.tier}
              </span>
            </div>
            <span className="font-bold text-xs text-slate-300">{selectedCard.network}</span>
          </div>

          <div className="my-auto space-y-1">
            <p className="text-[10px] text-slate-400 font-mono">Commercial Master Virtual</p>
            <p className="text-lg sm:text-xl font-mono font-bold tracking-widest text-white">
              {showCardDetails ? selectedCard.cardNumber : selectedCard.maskedNumber}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cardholder / Department</p>
              <p className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                {selectedCard.cardHolder}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">Expires</p>
              <p className="text-xs font-mono font-bold text-slate-100">
                {showCardDetails ? selectedCard.expiry : '••/••'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Freeze */}
      {selectedCard && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Card Security Controls
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant lock and merchant category restrictions
              </p>
            </div>

            <button
              onClick={() => toggleCardFreeze(selectedCard.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                selectedCard.isFrozen
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {selectedCard.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{selectedCard.isFrozen ? 'Unlock Card' : 'Freeze Card'}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Online Transactions */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Online & SaaS Payments</p>
                <p className="text-[10px] text-slate-500">AWS, Google Workspace, Adobe subscriptions</p>
              </div>
              <input
                type="checkbox"
                checked={selectedCard.onlineTxnEnabled}
                onChange={() => toggleCardFeature(selectedCard.id, 'online')}
                className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
              />
            </div>

            {/* International Remittance */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">International Merchant Outflows</p>
                <p className="text-[10px] text-slate-500">Global travel, USD vendor billing</p>
              </div>
              <input
                type="checkbox"
                checked={selectedCard.internationalEnabled}
                onChange={() => toggleCardFeature(selectedCard.id, 'international')}
                className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
              />
            </div>

            {/* ATM Withdrawal */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Corporate ATM Cash Withdrawals</p>
                <p className="text-[10px] text-slate-500">Emergency branch cash limit</p>
              </div>
              <input
                type="checkbox"
                checked={selectedCard.atmEnabled}
                onChange={() => toggleCardFeature(selectedCard.id, 'atm')}
                className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
