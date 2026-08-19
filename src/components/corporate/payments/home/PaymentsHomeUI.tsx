import React from 'react';

export const PayHomeCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ children, className = '', ariaLabel }) => (
  <div
    className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </div>
);

export const PayListDivider: React.FC = () => (
  <div className="mx-3 border-t border-slate-100 dark:border-slate-800" aria-hidden />
);

export const PaySectionHeader: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
}> = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-sm font-extrabold text-[#111827] dark:text-white tracking-tight">{title}</h2>
    {action && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="text-[11px] font-semibold text-[#0B5CAB] dark:text-blue-400"
      >
        {action}
      </button>
    )}
  </div>
);

export const PayHomeSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div
    className={`mx-4 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none ${className}`}
    aria-hidden
  />
);
