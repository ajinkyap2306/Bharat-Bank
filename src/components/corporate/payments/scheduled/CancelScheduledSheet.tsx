import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

const CANCEL_REASONS = [
  'No longer required',
  'Payment arrangement changed',
  'Duplicate schedule',
  'Other',
];

interface CancelScheduledSheetProps {
  isOpen: boolean;
  title: string;
  beneficiaryName: string;
  amount: string;
  nextPayment: string;
  onClose: () => void;
  onKeep: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export const CancelScheduledSheet: React.FC<CancelScheduledSheetProps> = ({
  isOpen,
  title,
  beneficiaryName,
  amount,
  nextPayment,
  onClose,
  onKeep,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Scheduled Payment?"
      subtitle={title}
    >
      <div className="px-4 pb-6 space-y-4">
        <div className="rounded-xl border border-[#E4E7EC] dark:border-slate-800 p-3 text-sm space-y-1">
          <p className="font-semibold">{beneficiaryName}</p>
          <p className="font-bold">{amount}</p>
          <p className="text-xs text-[#667085]">Next Payment: {nextPayment}</p>
        </div>

        <div>
          <p className="text-xs font-bold mb-2">Reason</p>
          <div className="space-y-2">
            {CANCEL_REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="cancel-reason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#667085]">Cancellation requires Checker approval per corporate policy.</p>

        <button
          type="button"
          onClick={onKeep}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl border font-semibold text-sm min-h-11 disabled:opacity-50"
        >
          Keep Payment
        </button>
        <button
          type="button"
          onClick={() => onConfirm(reason)}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-[#DC2626] text-white font-bold text-sm min-h-11 disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Cancel Schedule'}
        </button>
      </div>
    </BottomSheet>
  );
};
