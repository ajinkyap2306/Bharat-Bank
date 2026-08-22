import React from 'react';
import { BottomSheet } from '../../../../../common/BottomSheet';

interface DiscardPaymentSheetProps {
  isOpen: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export const DiscardPaymentSheet: React.FC<DiscardPaymentSheetProps> = ({
  isOpen,
  onKeepEditing,
  onDiscard,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onKeepEditing} title="Discard Payment?">
    <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
      Your entered payment details will be lost.
    </p>
    <div className="flex flex-col gap-2 pb-2">
      <button
        type="button"
        onClick={onKeepEditing}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11"
      >
        Keep Editing
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-[14px] font-semibold text-[#DC2626] min-h-11"
      >
        Discard
      </button>
    </div>
  </BottomSheet>
);
