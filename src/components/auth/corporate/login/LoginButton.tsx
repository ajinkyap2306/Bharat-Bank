import React from 'react';
import { motion } from 'motion/react';

interface LoginButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  isLoading = false,
  disabled = false,
  label = 'Login',
  loadingLabel = 'Signing you in...',
}) => (
  <button
    type="submit"
    disabled={disabled || isLoading}
    className="w-full py-3.5 rounded-2xl bg-congress-blue-700 hover:bg-congress-blue-800 text-white font-semibold text-base disabled:opacity-60 flex items-center justify-center gap-2.5 min-h-12 active:scale-[0.99] transition-all shadow-sm"
  >
    {isLoading ? (
      <>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          aria-hidden
        />
        <span>{loadingLabel}</span>
      </>
    ) : (
      label
    )}
  </button>
);
