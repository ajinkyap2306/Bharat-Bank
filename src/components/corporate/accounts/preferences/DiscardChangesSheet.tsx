import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface DiscardChangesSheetProps {
  isOpen: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export const DiscardChangesSheet: React.FC<DiscardChangesSheetProps> = ({
  isOpen,
  onKeepEditing,
  onDiscard,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onKeepEditing} title="Discard changes?">
    <div className="space-y-4 pb-2">
      <p className="text-[13px] text-[#667085]">
        You have unsaved changes to your account nickname. Do you want to discard them?
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onKeepEditing}
          className="flex-1 py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
        >
          Keep Editing
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="flex-1 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 text-sm font-semibold text-[#DC2626] min-h-12"
        >
          Discard
        </button>
      </div>
    </div>
  </BottomSheet>
);
