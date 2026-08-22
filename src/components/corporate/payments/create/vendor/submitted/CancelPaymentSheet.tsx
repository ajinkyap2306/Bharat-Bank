import React from 'react';
import { BottomSheet } from '../../../../../common/BottomSheet';

interface CancelPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onKeep: () => void;
  onConfirmCancel: () => void;
  loading?: boolean;
}

export const CancelPaymentSheet: React.FC<CancelPaymentSheetProps> = ({
  isOpen,
  onClose,
  onKeep,
  onConfirmCancel,
  loading = false,
}) => (
  <BottomSheet
    isOpen={isOpen}
    onClose={onClose}
    title="Cancel this payment?"
    subtitle="The payment request is currently pending approval. Cancelling it will stop the approval workflow."
  >
    <div className="px-4 pb-6 space-y-3">
      <button
        type="button"
        onClick={onKeep}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[15px] font-semibold min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
      >
        Keep Payment
      </button>
      <button
        type="button"
        onClick={onConfirmCancel}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#DC2626] text-[15px] font-semibold min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Cancelling...' : 'Cancel Payment'}
      </button>
    </div>
  </BottomSheet>
);
