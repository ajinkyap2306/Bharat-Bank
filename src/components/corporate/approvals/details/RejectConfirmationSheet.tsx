import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface RejectConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export const RejectConfirmationSheet: React.FC<RejectConfirmationSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const canSubmit = reason.trim().length > 0 && !loading;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Reject Payment?">
      <div className="space-y-4">
        <div>
          <label htmlFor="reject-reason" className="text-[13px] font-medium text-[#111827] dark:text-white">
            Reason for rejection <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason"
            rows={4}
            className="mt-2 w-full p-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
            aria-required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl border border-[#E4E7EC] text-[#667085] font-semibold min-h-12"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            disabled={!canSubmit}
            className="flex-1 py-3.5 rounded-2xl bg-[#DC2626] text-white font-semibold min-h-12 disabled:opacity-50"
          >
            {loading ? 'Rejecting...' : 'Reject Payment'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
