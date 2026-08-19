import React from 'react';
import { NumericPinInput } from '../../../common/NumericPinInput';
import { ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenHeader } from '../../../common/ScreenHeader';

export const ProfileLayout: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, onBack, children, rightAction, footer }) => (
  <div className="pb-6">
    <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} rightAction={rightAction} />
    <div className="pt-3 space-y-4">{children}</div>
    {footer}
  </div>
);

export const MenuGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
      {title}
    </h3>
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
      {children}
    </div>
  </div>
);

export const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: string;
  badgeTone?: 'success' | 'warning' | 'neutral';
  onClick: () => void;
  danger?: boolean;
}> = ({ icon, label, description, badge, badgeTone = 'neutral', onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/60 transition-colors"
  >
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
        danger
          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
          : 'bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400'
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-semibold truncate ${danger ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
        {label}
      </p>
      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{description}</p>
      )}
    </div>
    {badge && (
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
          badgeTone === 'success'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            : badgeTone === 'warning'
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        {badge}
      </span>
    )}
    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
  </button>
);

export const InfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs ${className}`}
  >
    {children}
  </div>
);

export const InfoRow: React.FC<{
  label: string;
  value: string;
  onEdit?: () => void;
  verified?: boolean;
  masked?: boolean;
}> = ({ label, value, onEdit, verified, masked }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-sm font-semibold text-slate-900 dark:text-white mt-0.5 ${masked ? 'font-mono' : ''}`}>
        {value}
      </p>
      {verified !== undefined && (
        <span
          className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold ${
            verified ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          {verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {verified ? 'Verified' : 'Verification Required'}
        </span>
      )}
    </div>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-bold text-congress-blue-600 dark:text-congress-blue-400 shrink-0"
      >
        Edit
      </button>
    )}
  </div>
);

export const ToggleRow: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  locked?: boolean;
}> = ({ label, description, checked, onChange, disabled, locked }) => (
  <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
      {description && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      {locked && <p className="text-[10px] text-amber-600 font-semibold mt-1">Required for security</p>}
    </div>
    <button
      type="button"
      disabled={disabled || locked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
        checked ? 'bg-congress-blue-600' : 'bg-slate-300 dark:bg-slate-700'
      } ${disabled || locked ? 'opacity-60' : ''}`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const StickyCTA: React.FC<{
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'danger';
  disabled?: boolean;
}> = ({ label, onClick, variant = 'primary', disabled }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-4 pt-2 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 pb-safe">
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-colors ${
        variant === 'danger'
          ? 'bg-rose-600 hover:bg-rose-700 text-white'
          : 'bg-congress-blue-700 hover:bg-congress-blue-800 text-white'
      } disabled:opacity-50`}
    >
      {label}
    </button>
  </div>
);

export const SegmentedControl: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
          value === opt.value
            ? 'bg-white dark:bg-slate-900 text-congress-blue-700 shadow-xs'
            : 'text-slate-500'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const OtpInput: React.FC<{
  length?: number;
  onComplete: (otp: string) => void;
}> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = React.useState('');

  const handleChange = (next: string) => {
    setOtp(next);
    if (next.length === length) {
      onComplete(next);
    }
  };

  return (
    <NumericPinInput
      value={otp}
      onChange={handleChange}
      length={length}
      autoFocus
      ariaLabel="Verification code"
    />
  );
};

export const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score =
    password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
      ? 4
      : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
        ? 3
        : password.length >= 6
          ? 2
          : password.length > 0
            ? 1
            : 0;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>
      {score > 0 && <p className="text-[10px] font-semibold text-slate-500">{labels[score]}</p>}
    </div>
  );
};

export const SuccessState: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, message, actionLabel, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center py-12 px-4"
  >
    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
    </div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-sm text-slate-500 mt-2 max-w-xs">{message}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
      >
        {actionLabel}
      </button>
    )}
  </motion.div>
);

export const Timeline: React.FC<{
  steps: { label: string; completed: boolean; date?: string }[];
}> = ({ steps }) => (
  <div className="space-y-0">
    {steps.map((step, i) => (
      <div key={step.label} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step.completed
                ? 'bg-emerald-500 text-white'
                : i === steps.findIndex((s) => !s.completed)
                  ? 'bg-congress-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            }`}
          >
            {step.completed ? '✓' : i === steps.findIndex((s) => !s.completed) ? '●' : '○'}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-8 ${step.completed ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-slate-700'}`} />
          )}
        </div>
        <div className="pb-6">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.label}</p>
          {step.date && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {step.date}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

export const AccountCard: React.FC<{
  accountType: string;
  maskedNumber: string;
  balance: number;
  nickname?: string;
  status: string;
  isPrimary?: boolean;
  isHidden?: boolean;
  onClick?: () => void;
}> = ({ accountType, maskedNumber, balance, nickname, status, isPrimary, isHidden, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs active:scale-[0.99] transition-transform"
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {nickname || accountType}
        </p>
        <p className="text-xs text-slate-500 font-mono mt-0.5">{maskedNumber}</p>
      </div>
      <div className="flex gap-1.5">
        {isPrimary && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-congress-blue-50 text-congress-blue-700 dark:bg-congress-blue-950/50 dark:text-congress-blue-400">
            Primary
          </span>
        )}
        {isHidden && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Hidden
          </span>
        )}
      </div>
    </div>
    <div className="mt-3 flex items-end justify-between">
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Available Balance</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          ₹{balance.toLocaleString('en-IN')}
        </p>
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          status === 'active'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {status === 'active' ? 'Active' : status}
      </span>
    </div>
  </button>
);
