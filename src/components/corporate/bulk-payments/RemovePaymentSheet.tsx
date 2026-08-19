import React from 'react';
import { BottomSheet } from '../../common/BottomSheet';

interface RemovePaymentSheetProps {
  isOpen: boolean;
  beneficiary: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemovePaymentSheet: React.FC<RemovePaymentSheetProps> = ({
  isOpen,
  beneficiary,
  onClose,
  onConfirm,
}) => (
  <BottomSheet
    isOpen={isOpen}
    onClose={onClose}
    title="Remove payment from batch?"
    subtitle={beneficiary}
  >
    <div className="px-4 pb-6 space-y-3">
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-semibold min-h-12"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="w-full py-3.5 rounded-2xl border border-rose-200 text-[#DC2626] font-semibold min-h-12"
      >
        Remove
      </button>
    </div>
  </BottomSheet>
);
