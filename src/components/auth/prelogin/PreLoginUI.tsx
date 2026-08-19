import React from 'react';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export const PreLoginShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col safe-top safe-bottom font-['Plus_Jakarta_Sans',sans-serif]">
    {children}
  </div>
);

export const PreLoginTopBar: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
    <button
      type="button"
      onClick={onBack}
      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
      aria-label="Back"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
    <h1 className="text-sm font-bold flex-1 truncate">{title}</h1>
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80">
      <ShieldCheck className="w-3 h-3" /> Secure
    </span>
  </div>
);

export const PreLoginCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 ${className}`}
  >
    {children}
  </div>
);

export const PreLoginListItem: React.FC<{
  title: string;
  subtitle?: string;
  meta?: string;
  onClick?: () => void;
}> = ({ title, subtitle, meta, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 active:opacity-80"
  >
    <div className="flex justify-between gap-2">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
      {meta && <span className="text-[10px] font-bold text-blue-600 shrink-0">{meta}</span>}
    </div>
    {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
  </button>
);
