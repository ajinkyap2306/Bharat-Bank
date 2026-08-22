import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlreadyProcessedStateProps {
  onRefresh: () => void;
  onBack: () => void;
}

export const AlreadyProcessedState: React.FC<AlreadyProcessedStateProps> = ({
  onRefresh,
  onBack,
}) => (
  <div className="max-w-[430px] mx-auto px-4 py-12 text-center">
    <AlertCircle className="w-12 h-12 text-[#F59E0B] mx-auto" aria-hidden />
    <h2 className="text-[18px] font-semibold text-slate-900 dark:text-white mt-4">
      Approval No Longer Available
    </h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">
      This request has already been processed by another authorized user.
    </p>
    <div className="mt-8 space-y-2">
      <button
        type="button"
        onClick={onRefresh}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
      >
        Refresh
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold min-h-12"
      >
        Back to Approvals
      </button>
    </div>
  </div>
);
