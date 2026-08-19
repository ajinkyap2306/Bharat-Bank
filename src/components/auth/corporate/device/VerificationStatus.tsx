import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

type DeviceVerificationStatusType =
  | 'verifying'
  | 'biometric_success'
  | 'device_verified'
  | 'failed';

interface VerificationStatusProps {
  status: DeviceVerificationStatusType;
  onTryAgain?: () => void;
  onUseOtp?: () => void;
}

const config: Record<
  Exclude<DeviceVerificationStatusType, 'verifying'>,
  { title: string; message: string }
> = {
  biometric_success: {
    title: 'Biometric Verified',
    message: 'Your device is securely verified.',
  },
  device_verified: {
    title: 'Device Verified',
    message: 'Your device is now trusted for Corporate Banking.',
  },
  failed: {
    title: 'Biometric verification failed',
    message: 'Please try again or use another verification method.',
  },
};

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  onTryAgain,
  onUseOtp,
}) => {
  if (status === 'verifying') {
    return (
      <div
        className="flex flex-col items-center text-center px-6 py-10"
        role="status"
        aria-live="polite"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mb-4 motion-reduce:animate-none"
        >
          <ShieldCheck className="w-8 h-8 text-[#0B5CAB]" aria-hidden />
        </motion.div>
        <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
          Verifying...
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    const { title, message } = config.failed;
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        role="alert"
        className="mx-4 mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40"
      >
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111827] dark:text-white">{title}</p>
            <p className="text-[12px] text-[#667085] dark:text-slate-400 mt-0.5">{message}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {onTryAgain && (
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="text-[13px] font-semibold text-[#0B5CAB] min-h-11 px-1"
                >
                  Try Again
                </button>
              )}
              {onUseOtp && (
                <button
                  type="button"
                  onClick={onUseOtp}
                  className="text-[13px] font-semibold text-[#667085] min-h-11 px-1"
                >
                  Use OTP Instead
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const { title, message } = config[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center px-6 py-10"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center mb-4 motion-reduce:transition-none"
      >
        <CheckCircle2 className="w-8 h-8 text-[#16A34A]" aria-hidden />
      </motion.div>
      <h2 className="text-xl font-semibold text-[#111827] dark:text-white">{title}</h2>
      <p className="text-[14px] text-[#667085] mt-1.5">{message}</p>
    </motion.div>
  );
};
