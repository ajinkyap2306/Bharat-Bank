import React from 'react';
import { motion } from 'motion/react';

interface ResendOtpButtonProps {
  isResending: boolean;
  disabled: boolean;
  canResend: boolean;
  onResend: () => void;
}

export const ResendOtpButton: React.FC<ResendOtpButtonProps> = ({
  isResending,
  disabled,
  canResend,
  onResend,
}) => {
  if (!canResend && !isResending) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onResend}
      disabled={disabled || isResending || !canResend}
      className="text-[13px] font-semibold text-congress-blue-700 dark:text-blue-400 disabled:opacity-40 min-h-11 px-1 flex items-center gap-2"
    >
      {isResending ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
            className="w-3.5 h-3.5 border-2 border-congress-blue-700/30 border-t-congress-blue-700 rounded-full"
            aria-hidden
          />
          Sending new code...
        </>
      ) : (
        'Resend OTP'
      )}
    </button>
  );
};
