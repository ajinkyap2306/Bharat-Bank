import React from 'react';

interface ResultAlreadyProcessedProps {
  currentStatus?: string;
  onRefresh: () => void;
  onBack: () => void;
}

export const ResultAlreadyProcessed: React.FC<ResultAlreadyProcessedProps> = ({
  currentStatus = 'Approved',
  onRefresh,
  onBack,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4">
    <p className="text-[13px] text-[#667085]">
      This request was already approved, rejected or returned by another authorized user.
    </p>
    <div className="mt-3 flex justify-between gap-3 text-[13px]">
      <span className="text-[#667085]">Current Status</span>
      <span className="font-semibold text-[#111827] dark:text-white">{currentStatus}</span>
    </div>
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onRefresh}
        className="flex-1 py-3 rounded-xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11"
      >
        Refresh Status
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex-1 py-3 rounded-xl border border-[#E4E7EC] text-[#667085] text-[14px] font-semibold min-h-11"
      >
        Back to Approvals
      </button>
    </div>
  </section>
);
