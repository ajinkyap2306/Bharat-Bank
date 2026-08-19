import React from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import type { CorporateOtpStatus } from '../../../../types/corporateOtp';

interface VerificationStatusProps {
  status: CorporateOtpStatus;
  onResend?: () => void;
  onBackToLogin?: () => void;
  onTryAgain?: () => void;
}

const statusConfig: Partial<
  Record<
    CorporateOtpStatus,
    {
      icon: React.ElementType;
      iconClass: string;
      title: string;
      message: string;
      variant: 'error' | 'warning' | 'success' | 'info';
    }
  >
> = {
  incorrect: {
    icon: AlertCircle,
    iconClass: 'text-[#DC2626]',
    title: 'Incorrect verification code',
    message: 'Check the code and try again.',
    variant: 'error',
  },
  expired: {
    icon: Clock,
    iconClass: 'text-[#F59E0B]',
    title: 'Verification code expired',
    message: 'Request a new code to continue.',
    variant: 'warning',
  },
  network_error: {
    icon: WifiOff,
    iconClass: 'text-[#DC2626]',
    title: 'Unable to verify right now',
    message: 'Check your connection and try again.',
    variant: 'error',
  },
  max_attempts: {
    icon: ShieldAlert,
    iconClass: 'text-[#DC2626]',
    title: 'Verification temporarily unavailable',
    message:
      'Too many unsuccessful attempts were made. Please try again later or return to login.',
    variant: 'error',
  },
  session_expired: {
    icon: ShieldAlert,
    iconClass: 'text-[#F59E0B]',
    title: 'Your login session has expired',
    message: 'Sign in again to continue securely.',
    variant: 'warning',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-[#16A34A]',
    title: 'Identity Verified',
    message: 'Secure verification completed successfully.',
    variant: 'success',
  },
};

const variantStyles = {
  error: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40',
  warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40',
  success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40',
  info: 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-800',
};

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  onResend,
  onBackToLogin,
  onTryAgain,
}) => {
  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center px-4 py-8"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center mb-4"
        >
          <ShieldCheck className="w-8 h-8 text-[#16A34A]" />
        </motion.div>
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white">
          {config.title}
        </h2>
        <p className="text-[14px] text-[#667085] mt-1.5">{config.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className={`mx-4 mb-4 p-3.5 rounded-2xl border flex items-start gap-2.5 ${variantStyles[config.variant]}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconClass}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#111827] dark:text-white">
          {config.title}
        </p>
        <p className="text-[12px] text-[#667085] dark:text-slate-400 mt-0.5 leading-relaxed">
          {config.message}
        </p>

        {status === 'expired' && onResend && (
          <button
            type="button"
            onClick={onResend}
            className="mt-2 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
          >
            Resend OTP
          </button>
        )}

        {status === 'network_error' && onTryAgain && (
          <button
            type="button"
            onClick={onTryAgain}
            className="mt-2 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
          >
            Try Again
          </button>
        )}

        {(status === 'max_attempts' || status === 'session_expired') && onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-2 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
          >
            Back to Login
          </button>
        )}
      </div>
    </motion.div>
  );
};
