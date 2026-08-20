import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Store,
  Globe,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { CreditDebitCard } from '../../../types/banking';
import { SecureAuthModal } from './SecureAuthModal';

interface CardLimitsViewProps {
  card: CreditDebitCard;
  onBack: () => void;
  onUpdateLimits: (limits: { atm?: number; pos?: number; online?: number; intl?: number; domestic?: number }) => void;
}

const LIMIT_ZONE = {
  low: { color: '#22c55e', label: 'Low', text: 'text-emerald-600 dark:text-emerald-400' },
  medium: { color: '#f59e0b', label: 'Medium', text: 'text-amber-600 dark:text-amber-400' },
  high: { color: '#ef4444', label: 'High', text: 'text-red-600 dark:text-red-400' },
} as const;

type LimitZone = keyof typeof LIMIT_ZONE;

function getLimitZone(value: number, max: number): LimitZone {
  const ratio = max > 0 ? value / max : 0;
  if (ratio <= 0.33) return 'low';
  if (ratio <= 0.66) return 'medium';
  return 'high';
}

function getLimitZoneColor(value: number, max: number): string {
  return LIMIT_ZONE[getLimitZone(value, max)].color;
}

function getLimitTrackBackground(value: number, max: number): string {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const unfilled = 'rgba(148, 163, 184, 0.35)';
  return `linear-gradient(to right,
    #22c55e 0%,
    #f59e0b ${Math.max(pct * 0.5, 0)}%,
    #ef4444 ${pct}%,
    ${unfilled} ${pct}%,
    ${unfilled} 100%)`;
}

function getPresetZone(preset: number, max: number): LimitZone {
  return getLimitZone(preset, max);
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
          Limits take effect immediately upon authentication. You can increase or reduce limits at any time up to your card variant&apos;s maximum eligibility.
        </div>
      </div>

      {/* Limit zone legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-semibold">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Low
        </span>
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Medium
        </span>
        <span className="flex items-center gap-1.5 text-red-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          High
        </span>
      </div>

      {/* Limit Sliders List */}
      <div className="space-y-4">
        {limitCards.map((item) => {
          const Icon = item.icon;
          const zone = getLimitZone(item.currentValue, item.max);
          const zoneColor = getLimitZoneColor(item.currentValue, item.max);
          const zoneMeta = LIMIT_ZONE[zone];

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
                  <p className={`text-base font-bold font-mono ${zoneMeta.text}`}>
                    ₹{item.currentValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400">Max: ₹{item.max.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={item.max}
                  step={item.step}
                  value={item.currentValue}
                  onChange={(e) => item.setter(Number(e.target.value))}
                  className="limit-risk-slider"
                  style={
                    {
                      background: getLimitTrackBackground(item.currentValue, item.max),
                      '--thumb-color': zoneColor,
                    } as React.CSSProperties
                  }
                  aria-label={item.title}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-600/80">₹0</span>
                  <span className="text-amber-600/80">₹{(item.max / 2).toLocaleString('en-IN')}</span>
                  <span className="text-red-600/80">₹{item.max.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                {item.presets.map((preset) => {
                  const presetZone = getPresetZone(preset, item.max);
                  const presetColor = LIMIT_ZONE[presetZone].color;
                  const isSelected = item.currentValue === preset;

                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => item.setter(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                        isSelected
                          ? 'text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      style={isSelected ? { backgroundColor: presetColor } : undefined}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  );
                })}
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
