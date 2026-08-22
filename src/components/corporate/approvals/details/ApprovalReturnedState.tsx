import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { ApprovalActionResult } from '../../../../types/corporateApprovalDetails';

interface ApprovalReturnedStateProps {
  result: ApprovalActionResult;
  onDone: () => void;
}

export const ApprovalReturnedState: React.FC<ApprovalReturnedStateProps> = ({
  result,
  onDone,
}) => (
  <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
    <RotateCcw className="w-14 h-14 text-[#F59E0B] mx-auto" aria-hidden />
    <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white mt-4">
      {result.title}
    </h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-3">{result.message}</p>
    {result.comment && (
      <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 text-left">
        <p className="text-[12px] text-slate-500 dark:text-slate-400">Comment</p>
        <p className="text-[14px] font-medium text-slate-900 dark:text-white mt-1">
          &ldquo;{result.comment}&rdquo;
        </p>
      </div>
    )}
    <button
      type="button"
      onClick={onDone}
      className="w-full mt-8 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
    >
      Done
    </button>
  </div>
);
