import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { PRE_LOGIN_TICKER_MESSAGES } from '../../../data/preLoginMock';

export const PreLoginTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PRE_LOGIN_TICKER_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 mb-4 overflow-hidden"
      aria-live="polite"
      aria-label="Bank announcements"
    >
      <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 leading-snug truncate">
        {PRE_LOGIN_TICKER_MESSAGES[index]}
      </p>
    </div>
  );
};
