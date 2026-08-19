import React from 'react';
import { formatOtpCountdown } from '../../../../services/corporateOtpService';

interface OtpTimerProps {
  secondsRemaining: number;
}

export const OtpTimer: React.FC<OtpTimerProps> = ({ secondsRemaining }) => (
  <p className="text-[13px] text-[#667085] dark:text-slate-400" aria-live="polite">
    {secondsRemaining > 0 ? (
      <>
        Resend code in{' '}
        <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
          {formatOtpCountdown(secondsRemaining)}
        </span>
      </>
    ) : (
      <span className="text-[#667085]">You can request a new code now</span>
    )}
  </p>
);
