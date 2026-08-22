import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface PrimaryAccountConfirmationProps {
  isOpen: boolean;
  accountType: string;
  maskedNumber: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PrimaryAccountConfirmation: React.FC<PrimaryAccountConfirmationProps> = ({
  isOpen,
  accountType,
  maskedNumber,
  onCancel,
  onConfirm,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onCancel} title="Set as Primary Account?">
    <div className="space-y-4 pb-2">
      <div className="rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4">
        <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{accountType}</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">{maskedNumber}</p>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        This account will become the default account for eligible payments and transfers.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white min-h-12"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
        >
          Set as Primary
        </button>
      </div>
    </div>
  </BottomSheet>
);
