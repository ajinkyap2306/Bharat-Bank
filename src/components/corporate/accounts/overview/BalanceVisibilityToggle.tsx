import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BalanceVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
  variant?: 'default' | 'onPrimary';
}

export const BalanceVisibilityToggle: React.FC<BalanceVisibilityToggleProps> = ({
  visible,
  onToggle,
  variant = 'default',
}) => {
  const isPrimary = variant === 'onPrimary';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-0.5 w-11 h-11 rounded-xl shrink-0 ${
        isPrimary
          ? 'bg-white/15 text-blue-100 hover:bg-white/25'
          : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:bg-slate-800'
      }`}
      aria-label={visible ? 'Hide balance' : 'Show balance'}
    >
      {visible ? (
        <EyeOff className={`w-4.5 h-4.5 ${isPrimary ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
      ) : (
        <Eye className={`w-4.5 h-4.5 ${isPrimary ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
      )}
      {!isPrimary && <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Hide</span>}
    </button>
  );
};
