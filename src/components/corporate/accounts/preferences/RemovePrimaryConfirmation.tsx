import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface RemovePrimaryConfirmationProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const RemovePrimaryConfirmation: React.FC<RemovePrimaryConfirmationProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onCancel} title="Remove primary status?">
    <div className="space-y-4 pb-2">
      <p className="text-[13px] text-[#667085]">
        Another eligible account may need to be selected as the primary account. A primary account
        is required for eligible corporate banking actions.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 text-sm font-semibold min-h-12"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl bg-[#DC2626] text-white text-sm font-semibold min-h-12"
        >
          Continue
        </button>
      </div>
    </div>
  </BottomSheet>
);
