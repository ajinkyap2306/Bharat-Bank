import React from 'react';
import { formatOtpCountdown } from '../../../../services/corporateOtpService';

interface OtpValidityTimerProps {
  secondsRemaining: number;
}

export const OtpValidityTimer: React.FC<OtpValidityTimerProps> = ({ secondsRemaining }) => (
  <p className="text-[12px] text-slate-500 dark:text-slate-400" aria-live="polite">
    {secondsRemaining > 0 ? (
      <>
        Code valid for{' '}
        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
          {formatOtpCountdown(secondsRemaining)}
        </span>
      </>
    ) : (
      <span className="font-semibold text-amber-700 dark:text-amber-400">
        Code expired — request a new code to continue
      </span>
    )}
  </p>
);
