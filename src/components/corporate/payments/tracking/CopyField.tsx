import React from 'react';
import { Copy } from 'lucide-react';

interface CopyFieldProps {
  label: string;
  value: string;
  onCopy: (value: string) => void;
  mono?: boolean;
}

export const CopyField: React.FC<CopyFieldProps> = ({ label, value, onCopy, mono = true }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-200 dark:border-slate-800 last:border-0">
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={`text-[14px] font-semibold text-slate-900 dark:text-white break-all ${
          mono ? 'font-mono tracking-tight' : ''
        }`}
      >
        {value}
      </p>
    </div>
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
      aria-label={`Copy ${label}`}
    >
      <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
    </button>
  </div>
);
