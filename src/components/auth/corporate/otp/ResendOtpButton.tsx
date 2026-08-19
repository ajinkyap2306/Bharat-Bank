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
      className="text-[13px] font-semibold text-[#0B5CAB] dark:text-blue-400 disabled:opacity-40 min-h-11 px-1 flex items-center gap-2"
    >
      {isResending ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
            className="w-3.5 h-3.5 border-2 border-[#0B5CAB]/30 border-t-[#0B5CAB] rounded-full"
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
