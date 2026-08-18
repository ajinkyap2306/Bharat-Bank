import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Globe, 
  Wifi, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Info,
  Store
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';

interface CardControlsViewProps {
  card: CreditDebitCard;
  onBack: () => void;
  onToggleControl: (feature: 'online' | 'contactless' | 'international' | 'atm' | 'pos') => void;
}

export const CardControlsView: React.FC<CardControlsViewProps> = ({
  card,
  onBack,
  onToggleControl,
}) => {
  const controls = [
    {
      id: 'online' as const,
      name: 'Online Transactions (E-Commerce)',
      description: 'Allow digital payments on web platforms, apps, subscriptions, and shopping gateways.',
      enabled: card.onlineTxnEnabled,
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      recommendation: 'Recommended for digital shopping',
    },
    {
      id: 'contactless' as const,
      name: 'Contactless Payments (NFC Tap & Pay)',
      description: 'Tap your card at POS terminals for quick checkout without entering a PIN (up to ₹5,000).',
      enabled: card.contactlessEnabled,
      icon: Wifi,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/30',
      recommendation: 'Fast in-store checkout',
    },
    {
      id: 'pos' as const,
      name: 'POS & In-Store Merchant Terminals',
      description: 'Allow chip-and-PIN payments at retail store checkout counters, restaurants, and hotels.',
      enabled: card.posTxnEnabled ?? true,
      icon: Store,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      recommendation: 'Essential for physical store shopping',
    },
    {
      id: 'atm' as const,
      name: 'ATM Cash Withdrawals',
      description: 'Permit cash withdrawals and balance inquiries at Bharat Bank and partner ATM machines.',
      enabled: card.atmEnabled,
      icon: CreditCard,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      recommendation: 'Keep disabled if using UPI cash withdrawal',
    },
    {
      id: 'international' as const,
      name: 'International Transactions',
      description: 'Enable foreign currency payments on international websites and overseas point-of-sale machines.',
      enabled: card.internationalEnabled,
      icon: Globe,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      recommendation: 'Disable when not traveling abroad for safety',
    },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
          <span>{card.network}</span> • <span>•••• {card.cardNumber.slice(-4)}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Card Controls & Channels</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Toggle transaction channels in real-time. Changes are updated instantly across payment gateways.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200">
          <span className="font-bold">Instant Switch Architecture:</span> You can turn these controls on/off at any time without branch visits or customer care calls.
        </div>
      </div>

      {/* Controls Switch List */}
      <div className="space-y-3">
        {controls.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                    {item.recommendation}
                  </span>
                </div>
              </div>

              {/* Native Mobile Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() => onToggleControl(item.id)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  item.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    item.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
