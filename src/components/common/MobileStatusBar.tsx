import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-5 pt-2.5 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none pointer-events-none z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
      {/* Time */}
      <span className="text-[13px] font-bold tracking-tight">{time || '9:41'}</span>

      {/* Dynamic Island / Speaker Pill indicator on modern phone */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 dark:bg-black/90 text-white shadow-xs">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[9px] font-mono font-extrabold text-blue-400 tracking-wider">APEX SECURE</span>
      </div>

      {/* Right System Icons: Signal, 5G, Wifi, Battery */}
      <div className="flex items-center gap-2">
        {/* Signal Bars */}
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-0.5 h-1 bg-current rounded-xs" />
          <div className="w-0.5 h-1.5 bg-current rounded-xs" />
          <div className="w-0.5 h-2.2 bg-current rounded-xs" />
          <div className="w-0.5 h-3 bg-current rounded-xs" />
        </div>

        <span className="text-[10px] font-extrabold tracking-tighter">5G</span>

        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-2.5 rounded-[3px] border border-current p-0.5 flex items-center">
            <div className="w-3.5 h-1.5 bg-emerald-500 rounded-[1px]" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-[1px]" />
        </div>
      </div>
    </div>
  );
};
