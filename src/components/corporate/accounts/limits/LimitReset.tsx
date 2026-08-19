import React from 'react';
import { LimitsCard } from './LimitsUI';

interface LimitResetProps {
  dailyReset: string;
  monthlyReset: string;
  timezone: string;
}

export const LimitReset: React.FC<LimitResetProps> = ({
  dailyReset,
  monthlyReset,
  timezone,
}) => (
  <LimitsCard ariaLabel="Limit reset">
    <div className="p-4">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">Limit Reset</h2>
      <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085] bg-[#F7F9FC] dark:bg-slate-800 px-2 py-0.5 rounded-full">
        Demo Configuration
      </span>

      <div className="mt-3 space-y-3">
        <div>
          <p className="text-[12px] text-[#667085]">Daily limits reset</p>
          <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-0.5">
            {dailyReset}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[#667085]">Monthly limits reset</p>
          <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-0.5">
            {monthlyReset}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[#667085]">Timezone</p>
          <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-0.5">
            {timezone}
          </p>
        </div>
      </div>
    </div>
  </LimitsCard>
);
