import React from 'react';
import { Loader2 } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';

export const AddMoneyLayout: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, onBack, children, footer }) => (
  <div className="min-h-full bg-slate-50 dark:bg-slate-950 pb-28">
    <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} />
    <div className="px-3 pt-3 space-y-4">{children}</div>
    {footer}
  </div>
);

export const BalanceHero: React.FC<{ label: string; amount: number; hidden?: boolean }> = ({
  label,
  amount,
  hidden,
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
      {hidden ? '••••••' : `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
    </p>
  </div>
);

export const SourceOptionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}> = ({ icon, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left active:scale-[0.99] transition-transform shadow-xs"
  >
    <span className="w-11 h-11 rounded-2xl bg-congress-blue-50 dark:bg-congress-blue-950/50 text-congress-blue-700 dark:text-congress-blue-400 flex items-center justify-center shrink-0">
      {icon}
    </span>
    <span className="min-w-0">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </span>
  </button>
);

export const RadioSelectCard: React.FC<{
  selected: boolean;
  title: string;
  subtitle: string;
  meta?: string;
  onSelect: () => void;
}> = ({ selected, title, subtitle, meta, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
      selected
        ? 'border-congress-blue-600 bg-congress-blue-50/60 dark:bg-congress-blue-950/30'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
    }`}
  >
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? 'border-congress-blue-600' : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-congress-blue-600" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        {meta && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{meta}</p>}
      </div>
    </div>
  </button>
);

export const ReviewRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-sm text-right ${bold ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
      {value}
    </span>
  </div>
);

export const StickyAddMoneyCTA: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}> = ({ label, onClick, disabled, secondaryLabel, onSecondary }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-4 pt-2 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 safe-bottom space-y-2">
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full py-3.5 rounded-2xl bg-congress-blue-700 hover:bg-congress-blue-600 text-white font-bold text-sm disabled:opacity-50 min-h-11"
    >
      {label}
    </button>
    {secondaryLabel && onSecondary && (
      <button
        type="button"
        onClick={onSecondary}
        className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-200 min-h-11"
      >
        {secondaryLabel}
      </button>
    )}
  </div>
);

export const ProcessingState: React.FC<{ title: string; amount: number; message?: string }> = ({
  title,
  amount,
  message = 'Please wait',
}) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
    <Loader2 className="w-10 h-10 text-congress-blue-600 animate-spin mb-5" />
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
      ₹{amount.toLocaleString('en-IN')}
    </p>
    <p className="text-sm text-slate-500 mt-3">{message}</p>
  </div>
);

export const AmountField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  error?: string;
}> = ({ value, onChange, error }) => (
  <div>
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">Amount</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="5,000"
        className={`w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border text-2xl font-extrabold text-slate-900 dark:text-white outline-none ${
          error ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-congress-blue-500'
        }`}
      />
    </div>
    {error && <p className="text-[11px] text-red-600 mt-1.5">{error}</p>}
  </div>
);

export const QuickAmountChips: React.FC<{
  amounts: number[];
  selected: string;
  onSelect: (amount: number) => void;
}> = ({ amounts, selected, onSelect }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 mb-2">Quick Amount</p>
    <div className="grid grid-cols-4 gap-2">
      {amounts.map((amt) => (
        <button
          key={amt}
          type="button"
          onClick={() => onSelect(amt)}
          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
            selected === String(amt)
              ? 'bg-congress-blue-700 text-white border-congress-blue-700'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
          }`}
        >
          ₹{amt.toLocaleString('en-IN')}
        </button>
      ))}
    </div>
  </div>
);
