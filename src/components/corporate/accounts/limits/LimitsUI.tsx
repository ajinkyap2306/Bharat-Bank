import React from 'react';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

export const LimitsCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ children, className = '', ariaLabel }) => (
  <section
    className={`mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </section>
);

export const LimitsRow: React.FC<{
  label: string;
  value: string;
  valueClassName?: string;
}> = ({ label, value, valueClassName = '' }) => (
  <div className="flex items-start justify-between gap-3 py-2">
    <span className="text-[13px] text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
    <span
      className={`text-[13px] font-semibold text-slate-900 dark:text-white text-right tabular-nums ${valueClassName}`}
    >
      {value}
    </span>
  </div>
);

export const maskAmount = (
  amount: number,
  currency: string,
  showBalances: boolean
): string => (showBalances ? formatAccountCurrency(amount, currency) : '••••••');

interface AccessibleProgressBarProps {
  label: string;
  percent: number;
  statusLabel: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

const BAR_COLORS = {
  primary: 'bg-congress-blue-700',
  success: 'bg-emerald-600',
  warning: 'bg-[#F59E0B]',
  error: 'bg-[#DC2626]',
};

export const AccessibleProgressBar: React.FC<AccessibleProgressBarProps> = ({
  label,
  percent,
  statusLabel,
  variant = 'primary',
}) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[12px] text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-[12px] font-semibold text-slate-900 dark:text-white tabular-nums">
          {clamped}% used
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}, ${statusLabel}`}
      >
        <div
          className={`h-full rounded-full transition-all motion-reduce:transition-none ${BAR_COLORS[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="sr-only">{statusLabel}</p>
    </div>
  );
};

export const LimitsSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div
    className={`mx-4 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none ${className}`}
    aria-hidden
  />
);
