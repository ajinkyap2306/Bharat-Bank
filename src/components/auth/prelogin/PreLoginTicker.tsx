import React, { useMemo } from 'react';
import { Megaphone, Wrench } from 'lucide-react';
import { PRE_LOGIN_FIXED_TICKER_MESSAGES } from '../../../data/preLoginMock';

interface PreLoginTickerProps {
  /** Pin to top of viewport with continuous marquee scroll (login screen). */
  fixed?: boolean;
}

export const PreLoginTicker: React.FC<PreLoginTickerProps> = ({ fixed = false }) => {
  const marqueeText = useMemo(
    () => PRE_LOGIN_FIXED_TICKER_MESSAGES.join('   •   '),
    []
  );

  if (fixed) {
    return (
      <div
        className="fixed top-0 inset-x-0 z-40 bg-[#005DD4] text-white border-b border-blue-700/40 shadow-sm safe-top"
        role="region"
        aria-label="Bank announcements and maintenance alerts"
      >
        <div className="flex items-center gap-2 h-9 px-3 overflow-hidden">
          <Wrench className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
          <div className="relative flex-1 overflow-hidden min-w-0">
            <div className="prelogin-ticker-marquee-track">
              <span className="text-[11px] font-semibold whitespace-nowrap pr-16">
                {marqueeText}
              </span>
              <span className="text-[11px] font-semibold whitespace-nowrap pr-16" aria-hidden>
                {marqueeText}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 mb-4 overflow-hidden"
      aria-live="polite"
      aria-label="Bank announcements"
    >
      <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 leading-snug truncate">
        {PRE_LOGIN_FIXED_TICKER_MESSAGES[0]}
      </p>
    </div>
  );
};
