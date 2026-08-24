import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { NumericPinInput } from '../../../common/NumericPinInput';

export const QrShell: React.FC<{
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  dark?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, onBack, onClose, dark = false, children, footer }) => (
  <div
    className={`min-h-dvh flex flex-col ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white'}`}
  >
    <header className="flex items-center gap-3 px-4 pt-3 pb-2 safe-top z-20">
      <button
        type="button"
        onClick={onBack ?? onClose}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          dark ? 'bg-white/10 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
        }`}
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className={`text-base font-bold flex-1 ${dark ? 'text-white' : ''}`}>{title}</h1>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            dark ? 'bg-white/10 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </header>
    <main className="flex-1 overflow-y-auto">{children}</main>
    {footer}
  </div>
);

export const QrCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs ${className}`}
  >
    {children}
  </div>
);

export const QrDetailRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-xs text-slate-500">{label}</span>
    <span
      className={`text-sm text-right ${bold ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}
    >
      {value}
    </span>
  </div>
);

export const QrStickyCTA: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}> = ({ label, onClick, disabled, secondaryLabel, onSecondary }) => (
  <div className="sticky bottom-0 px-4 pb-4 pt-2 safe-bottom bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 space-y-2">
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm disabled:opacity-50 min-h-11"
    >
      {label}
    </button>
    {secondaryLabel && onSecondary && (
      <button
        type="button"
        onClick={onSecondary}
        className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm min-h-11"
      >
        {secondaryLabel}
      </button>
    )}
  </div>
);

export const VerifiedBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
    ✓ Verified
  </span>
);

export const UpiPinSheet: React.FC<{
  open: boolean;
  merchantName: string;
  amount: number;
  pin: string;
  isPaying: boolean;
  pinLabel?: string;
  confirmLabel?: string;
  pinError?: string;
  onPinChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}> = ({
  open,
  merchantName,
  amount,
  pin,
  isPaying,
  pinLabel = 'Enter TPIN',
  confirmLabel = 'Confirm Payment',
  pinError,
  onPinChange,
  onConfirm,
  onClose,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50"
          aria-label="Close TPIN"
          onClick={isPaying ? undefined : onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-3xl bg-white dark:bg-slate-900 px-5 pt-5 pb-8 safe-bottom shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={pinLabel}
        >
          {isPaying ? (
            <div className="flex flex-col items-center text-center py-10">
              <Loader2 className="w-8 h-8 text-congress-blue-600 animate-spin mb-4" />
              <p className="text-lg font-bold">Paying ₹{amount.toLocaleString('en-IN')}…</p>
              <p className="text-sm text-slate-500 mt-1">{merchantName}</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-5" />
              <p className="text-center text-sm text-slate-500">Pay {merchantName}</p>
              <p className="text-center text-3xl font-extrabold tabular-nums mt-1">
                ₹{amount.toLocaleString('en-IN')}
              </p>
              <p className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 mt-6 mb-3">
                {pinLabel}
              </p>
              <NumericPinInput
                value={pin}
                onChange={onPinChange}
                masked
                autoFocus
                autoComplete="off"
                ariaLabel={pinLabel}
              />
              {pinError && <p className="text-xs text-red-600 mt-2 text-center">{pinError}</p>}
              <button
                type="button"
                disabled={pin.length < 6}
                onClick={onConfirm}
                className="w-full mt-6 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm disabled:opacity-50 min-h-11"
              >
                {confirmLabel}
              </button>
            </>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export const AmountKeypad: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const press = (key: string) => {
    if (key === 'back') {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === '.' && value.includes('.')) return;
    if (value.replace('.', '').length >= 7 && key !== 'back') return;
    onChange(value + key);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => press(key === 'back' ? 'back' : key)}
          className="h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-lg font-bold active:scale-95 transition-transform"
        >
          {key === 'back' ? '⌫' : key}
        </button>
      ))}
    </div>
  );
};
