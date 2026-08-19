import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LimitsCard } from './LimitsUI';

interface LimitChangeRequestCardProps {
  onRequest: () => void;
}

export const LimitChangeRequestCard: React.FC<LimitChangeRequestCardProps> = ({ onRequest }) => (
  <LimitsCard ariaLabel="Request limit change">
    <button
      type="button"
      onClick={onRequest}
      className="w-full p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40 rounded-2xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
            Request Limit Change
          </h2>
          <p className="text-[13px] text-[#667085] mt-1">
            Submit a request to increase or modify an account limit.
          </p>
          <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold text-[#0B5CAB]">
            Request Change
            <ChevronRight className="w-4 h-4" aria-hidden />
          </span>
        </div>
      </div>
    </button>
  </LimitsCard>
);
