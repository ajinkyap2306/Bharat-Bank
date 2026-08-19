import React from 'react';
import { ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';

export const RegShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col safe-top safe-bottom font-['Plus_Jakarta_Sans',sans-serif]">
    {children}
  </div>
);

export const RegTopBar: React.FC<{ onBack?: () => void; title?: string }> = ({ onBack, title }) => (
  <div className="flex items-center gap-2 px-4 pt-3 pb-2">
    {onBack ? (
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
        aria-label="Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    ) : (
      <div className="w-10" />
    )}
    <div className="flex-1 min-w-0">
      {title && <p className="text-sm font-bold truncate">{title}</p>}
    </div>
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80">
      <ShieldCheck className="w-3 h-3" /> Secure
    </span>
  </div>
);

export const RegTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="px-4 mb-5">
    <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
    {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>}
  </div>
);

export const RegField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  readOnly?: boolean;
  className?: string;
}> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  maxLength,
  inputMode,
  readOnly,
  className = '',
}) => (
  <div className={className}>
    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      readOnly={readOnly}
      className={`w-full bg-white dark:bg-slate-900 border rounded-2xl py-3.5 px-4 text-sm font-medium outline-none min-h-11 transition-colors ${
        error
          ? 'border-red-500'
          : readOnly
            ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600'
            : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
      }`}
    />
    {hint && !error && <p className="text-[11px] text-slate-500 mt-1.5">{hint}</p>}
    {error && <p className="text-[11px] text-red-600 mt-1.5">{error}</p>}
  </div>
);

export const RegPrimaryButton: React.FC<{
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
}> = ({ label, onClick, type = 'button', disabled, loading }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm disabled:opacity-50 min-h-11 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all"
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : label}
  </button>
);

export const RegSecondaryButton: React.FC<{
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ label, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-200 min-h-11 disabled:opacity-50"
  >
    {label}
  </button>
);

export const RegRadioOption: React.FC<{
  selected: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}> = ({ selected, title, description, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all min-h-[4.5rem] ${
      selected
        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
    }`}
  >
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? 'border-blue-600' : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  </button>
);

export const RegCodePairInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <input
      type="text"
      inputMode="numeric"
      maxLength={2}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 2))}
      className="w-14 h-12 text-center text-lg font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none"
      aria-label={`Code ${label}`}
    />
  </div>
);

interface MpinInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: string;
}

export const MpinInput: React.FC<MpinInputProps> = ({ label, value, onChange, length = 6, error }) => {
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  return (
    <div>
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">{label}</label>
      <div className="flex justify-center gap-2 mb-2">
        {digits.map((d, i) => (
          <span
            key={i}
            className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold ${
              error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-900`}
          >
            {d.trim() ? '•' : ''}
          </span>
        ))}
      </div>
      <input
        type="password"
        inputMode="numeric"
        maxLength={length}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        className="sr-only"
        aria-label={label}
        autoComplete="off"
      />
      {error && <p className="text-[11px] text-red-600 text-center">{error}</p>}
    </div>
  );
};

export const RegInfoLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
    {label}
  </button>
);
