import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { NumericPinInput } from '../../../common/NumericPinInput';

export const RegShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-dvh bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col safe-top safe-bottom font-['Plus_Jakarta_Sans',sans-serif]">
    {children}
  </div>
);

export const RegTopBar: React.FC<{ onBack?: () => void; title?: string }> = ({ onBack, title }) => (
  <div className="flex items-center gap-2 px-4 pt-3 pb-2">
    {onBack ? (
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        aria-label="Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    ) : (
      <div className="w-10" />
    )}
    <div className="flex-1 min-w-0">
      {title && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{title}</p>}
    </div>
    <div className="w-10" />
  </div>
);

export const RegTitle: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({
  title,
  subtitle,
  centered,
}) => (
  <div className={`px-4 mb-5 ${centered ? 'text-center' : ''}`}>
    <h1 className="text-[1.625rem] font-extrabold tracking-tight text-[#0A2540] dark:text-white leading-tight">
      {title}
    </h1>
    {subtitle && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-md">{subtitle}</p>
    )}
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
  autoCapitalize?: string;
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
  autoCapitalize,
}) => (
  <div className={className}>
    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      readOnly={readOnly}
      autoCapitalize={autoCapitalize as React.HTMLAttributes<HTMLInputElement>['autoCapitalize']}
      className={`w-full bg-slate-50 dark:bg-slate-900/60 border rounded-2xl py-3.5 px-4 text-sm font-medium outline-none min-h-11 transition-colors ${
        error
          ? 'border-red-400 bg-red-50/30 dark:bg-red-950/10'
          : readOnly
            ? 'border-slate-200 dark:border-slate-800 text-slate-600'
            : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900'
      }`}
    />
    {hint && !error && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
    {error && <p className="text-[11px] text-red-600 mt-1.5 font-medium">{error}</p>}
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
    className="w-full py-3.5 rounded-2xl bg-[#005DD4] hover:bg-[#0050b8] text-white font-bold text-sm disabled:opacity-40 min-h-[52px] flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
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
    className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-200 min-h-[48px] disabled:opacity-40 active:scale-[0.99] transition-transform"
  >
    {label}
  </button>
);

export const RegTextButton: React.FC<{
  label: string;
  onClick?: () => void;
  className?: string;
}> = ({ label, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-sm font-semibold text-[#005DD4] dark:text-blue-400 active:opacity-70 transition-opacity ${className}`}
  >
    {label}
  </button>
);

export const RegStickyFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-auto px-4 pt-4 pb-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 space-y-2">
    {children}
  </div>
);

export const RegSelectCard: React.FC<{
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}> = ({ selected, icon, title, description, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all min-h-[72px] text-left ${
      selected
        ? 'border-[#005DD4] bg-blue-50/60 dark:bg-blue-950/25'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
    }`}
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
        selected ? 'bg-[#005DD4] text-white' : 'bg-blue-50 dark:bg-blue-950/40 text-[#005DD4]'
      }`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#0A2540] dark:text-white">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
    </div>
    <span
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? 'border-[#005DD4]' : 'border-slate-300 dark:border-slate-600'
      }`}
    >
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#005DD4]" />}
    </span>
  </button>
);

export const RegMethodCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}> = ({ icon, title, description, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 active:scale-[0.99] transition-all min-h-[72px] text-left shadow-sm"
  >
    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 text-[#005DD4]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#0A2540] dark:text-white">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
  </button>
);

export const RegAccountRow: React.FC<{
  selected: boolean;
  title: string;
  maskedAccount: string;
  onSelect: () => void;
}> = ({ selected, title, maskedAccount, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
      selected
        ? 'border-[#005DD4] bg-blue-50/50 dark:bg-blue-950/20'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
    }`}
  >
    <span
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? 'border-[#005DD4]' : 'border-slate-300 dark:border-slate-600'
      }`}
    >
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#005DD4]" />}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#0A2540] dark:text-white">{title}</p>
      <p className="text-sm text-slate-500 font-mono mt-0.5">{maskedAccount}</p>
    </div>
  </button>
);

export const RegChecklist: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-4 space-y-2.5">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

export const RegMaskedValue: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-center">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-lg font-bold tracking-wide text-[#0A2540] dark:text-blue-300">{value}</p>
  </div>
);

export const RegErrorIcon: React.FC = () => (
  <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-500" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

export const RegInfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-bold text-[#0A2540] dark:text-white">{value}</span>
  </div>
);

export const RegLoadingState: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="px-4 py-16 text-center flex flex-col items-center flex-1 justify-center">
    <Loader2 className="w-10 h-10 text-[#005DD4] animate-spin mb-6" />
    <h2 className="text-xl font-extrabold text-[#0A2540] dark:text-white">{title}</h2>
    <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">{subtitle}</p>
  </div>
);

export const RegLegalLink: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 text-sm font-semibold text-[#0A2540] dark:text-white active:opacity-70"
  >
    <span>{label}</span>
    <ChevronRight className="w-4 h-4 text-slate-400" />
  </button>
);

interface MpinInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: string;
}

export const MpinInput: React.FC<MpinInputProps> = ({ label, value, onChange, length = 6, error }) => (
  <div>
    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">{label}</label>
    <NumericPinInput
      value={value}
      onChange={onChange}
      length={length}
      masked
      hasError={Boolean(error)}
      autoComplete="off"
      ariaLabel={label}
      className="mb-2"
    />
    {error && <p className="text-[11px] text-red-600 text-center font-medium">{error}</p>}
  </div>
);

export const RegInfoLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="text-sm font-semibold text-[#005DD4] dark:text-blue-400">
    {label}
  </button>
);
