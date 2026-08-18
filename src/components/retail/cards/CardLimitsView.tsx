import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  ShoppingBag, 
  Store, 
  Globe, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface CardLimitsViewProps {
  card: CreditDebitCard;
  onBack: () => void;
  onUpdateLimits: (limits: { atm?: number; pos?: number; online?: number; intl?: number; domestic?: number }) => void;
}

export const CardLimitsView: React.FC<CardLimitsViewProps> = ({
  card,
  onBack,
  onUpdateLimits,
}) => {
  const [atmLimit, setAtmLimit] = useState<number>(card.dailyAtmLimit || 50000);
  const [posLimit, setPosLimit] = useState<number>(card.dailyPosLimit || 100000);
  const [onlineLimit, setOnlineLimit] = useState<number>(card.dailyOnlineLimit || 75000);
  const [intlLimit, setIntlLimit] = useState<number>(card.dailyInternationalLimit || 50000);

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const maxAtm = card.maxAtmLimit || 100000;
  const maxPos = card.maxPosLimit || (card.cardType === 'credit' ? 500000 : 200000);
  const maxOnline = card.maxOnlineLimit || (card.cardType === 'credit' ? 500000 : 200000);
  const maxIntl = card.maxInternationalLimit || 150000;

  const handleSave = () => {
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    onUpdateLimits({
      atm: atmLimit,
      pos: posLimit,
      online: onlineLimit,
      intl: intlLimit,
      domestic: Math.max(posLimit, onlineLimit, atmLimit),
    });
    onBack();
  };

  const limitCards = [
    {
      id: 'atm',
      title: 'ATM Cash Withdrawal Limit',
      description: 'Daily cash withdrawal ceiling at ATM terminals.',
      currentValue: atmLimit,
      setter: setAtmLimit,
      max: maxAtm,
      step: 5000,
      icon: CreditCard,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      presets: [10000, 25000, 50000, maxAtm],
    },
    {
      id: 'pos',
      title: 'POS & In-Store Daily Limit',
      description: 'Daily merchant counter and terminal payment cap.',
      currentValue: posLimit,
      setter: setPosLimit,
      max: maxPos,
      step: 10000,
      icon: Store,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      presets: [25000, 50000, 100000, maxPos],
    },
    {
      id: 'online',
      title: 'Online E-Commerce Daily Limit',
      description: 'Daily transaction limit for web and app purchases.',
      currentValue: onlineLimit,
      setter: setOnlineLimit,
      max: maxOnline,
      step: 10000,
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      presets: [25000, 50000, 100000, maxOnline],
    },
    {
      id: 'intl',
      title: 'International Spending Limit',
      description: 'Daily limit for foreign currency & cross-border transactions.',
      currentValue: intlLimit,
      setter: setIntlLimit,
      max: maxIntl,
      step: 10000,
      icon: Globe,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      presets: [25000, 50000, 100000, maxIntl],
    },
  ];

  return (
    <div className="space-y-5 pb-16">
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Transaction Limits</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your daily per-channel spending caps. Setting conservative limits prevents unauthorized usage.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          Limits take effect immediately upon authentication. You can increase or reduce limits at any time up to your card variant's maximum eligibility.
        </div>
      </div>

      {/* Limit Sliders List */}
      <div className="space-y-4">
        {limitCards.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                    ₹{item.currentValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400">Max: ₹{item.max.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={item.max}
                  step={item.step}
                  value={item.currentValue}
                  onChange={(e) => item.setter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹0</span>
                  <span>₹{(item.max / 2).toLocaleString('en-IN')}</span>
                  <span>₹{item.max.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                {item.presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => item.setter(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      item.currentValue === preset
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-4 z-20">
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Save & Authenticate Limits</span>
        </button>
      </div>

      {/* Auth Modal */}
      <SecureAuthModal
        isOpen={isAuthOpen}
        title="Confirm New Limits"
        subtitle="Authenticate with MPIN or Biometrics to apply these transaction limits to the card switch."
        requiredActionDesc="Updating daily limits across card networks"
        onSuccess={handleAuthSuccess}
        onCancel={() => setIsAuthOpen(false)}
      />
    </div>
  );
};
