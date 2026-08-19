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
          : 'border border-[#E4E7EC] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-800'
      }`}
      aria-label={visible ? 'Hide balance' : 'Show balance'}
    >
      {visible ? (
        <EyeOff className={`w-4.5 h-4.5 ${isPrimary ? 'text-white' : 'text-[#667085]'}`} />
      ) : (
        <Eye className={`w-4.5 h-4.5 ${isPrimary ? 'text-white' : 'text-[#667085]'}`} />
      )}
      {!isPrimary && <span className="text-[9px] font-medium text-[#667085]">Hide</span>}
    </button>
  );
};
