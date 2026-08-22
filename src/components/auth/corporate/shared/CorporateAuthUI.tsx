import React from 'react';
import { NumericPinInput } from '../../../common/NumericPinInput';
import { ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { BharatBankLogo } from '../../../common/BharatBankLogo';

export const CorpAuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col safe-top safe-bottom">
    {children}
  </div>
);

export const CorpAuthTopBar: React.FC<{ onHelp?: () => void }> = ({ onHelp }) => (
  <div className="flex items-center justify-between px-3 pt-3 pb-2">
    <div className="flex items-center gap-2">
      <BharatBankLogo variant="compact" size="sm" />
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/40">
        <ShieldCheck className="w-3 h-3" /> Secure Login
      </span>
    </div>
    {onHelp && (
      <button
        type="button"
        onClick={onHelp}
        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4 text-slate-500" />
      </button>
    )}
  </div>
);

export const CorpAuthTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="px-3 mb-5">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
    {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

export const CorpField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  rightElement?: React.ReactNode;
}> = ({ label, value, onChange, type = 'text', placeholder, error, rightElement }) => (
  <div>
    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200 block mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-900 border rounded-2xl py-3.5 px-4 text-sm text-slate-900 dark:text-white outline-none transition-colors min-h-11 ${
          error ? 'border-[#DC2626]' : 'border-slate-200/80 dark:border-slate-800 focus:border-congress-blue-700 dark:focus:border-congress-blue-500'
        }`}
      />
      {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
    </div>
    {error && <p className="text-[11px] text-[#DC2626] mt-1.5">{error}</p>}
  </div>
);

export const CorpPrimaryButton: React.FC<{
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}> = ({ label, onClick, type = 'button', disabled, loading, loadingLabel }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className="w-full py-3.5 rounded-2xl bg-congress-blue-700 hover:bg-congress-blue-800 text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 min-h-11 active:scale-[0.99] transition-all"
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        {loadingLabel || label}
      </>
    ) : (
      label
    )}
  </button>
);

export const CorpSecondaryButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-3 text-sm font-semibold text-congress-blue-700 dark:text-congress-blue-400"
  >
    {label}
  </button>
);

export const CorpErrorCard: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="mx-3 mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
    <p className="text-sm font-bold text-[#DC2626]">{title}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message}</p>
  </div>
);

export const CorpSecurityBanner: React.FC = () => (
  <div className="mx-3 mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
    <p className="text-xs font-bold text-slate-900 dark:text-white">Secure Corporate Access</p>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
      Your connection is protected with bank-grade security.
    </p>
  </div>
);

export const CorpOtpInput: React.FC<{
  value: string[];
  onChange: (digits: string[]) => void;
}> = ({ value, onChange }) => (
  <div className="px-3">
    <NumericPinInput
      value={value.join('')}
      onChange={(next) => onChange(Array.from({ length: 6 }, (_, i) => next[i] ?? ''))}
      autoFocus
      ariaLabel="Corporate verification code"
      digitClassName="h-[50px] rounded-[13px] text-lg"
    />
  </div>
);

export const CorpBackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="mx-3 mb-3 text-xs font-semibold text-congress-blue-700 dark:text-congress-blue-400 flex items-center gap-1"
  >
    ← {label || 'Back'}
  </button>
);
