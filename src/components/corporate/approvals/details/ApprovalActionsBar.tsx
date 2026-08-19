import React from 'react';
import { Loader2 } from 'lucide-react';

interface ApprovalActionsBarProps {
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
  approveDisabled?: boolean;
  secondaryDisabled?: boolean;
  loading?: boolean;
}

export const ApprovalActionsBar: React.FC<ApprovalActionsBarProps> = ({
  onApprove,
  onReject,
  onReturn,
  approveDisabled = false,
  secondaryDisabled = false,
  loading = false,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
    <div className="max-w-[430px] mx-auto space-y-2">
      <button
        type="button"
        onClick={onApprove}
        disabled={approveDisabled || loading}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[15px] font-semibold min-h-12 disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
        Approve
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReturn}
          disabled={secondaryDisabled || loading}
          className="flex-1 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#0B5CAB] text-[14px] font-semibold min-h-11 disabled:opacity-50"
        >
          Return for Changes
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={secondaryDisabled || loading}
          className="flex-1 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-[#DC2626] text-[14px] font-semibold min-h-11 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);
