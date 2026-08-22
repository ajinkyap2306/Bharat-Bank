import React from 'react';
import { XCircle } from 'lucide-react';
import type { ApprovalActionResult } from '../../../../types/corporateApprovalDetails';

interface ApprovalRejectedStateProps {
  result: ApprovalActionResult;
  onViewPayment: () => void;
  onDone: () => void;
}

export const ApprovalRejectedState: React.FC<ApprovalRejectedStateProps> = ({
  result,
  onViewPayment,
  onDone,
}) => (
  <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
    <XCircle className="w-14 h-14 text-[#DC2626] mx-auto" aria-hidden />
    <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white mt-4">
      {result.title}
    </h2>
    {result.reason && (
      <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-left">
        <p className="text-[12px] text-slate-500 dark:text-slate-400">Reason</p>
        <p className="text-[14px] font-medium text-slate-900 dark:text-white mt-1">
          {result.reason}
        </p>
      </div>
    )}
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-4">{result.message}</p>
    <div className="mt-8 space-y-2">
      {result.paymentId && (
        <button
          type="button"
          onClick={onViewPayment}
          className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
        >
          View Payment
        </button>
      )}
      <button
        type="button"
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold min-h-12"
      >
        Back to Approvals
      </button>
    </div>
  </div>
);
