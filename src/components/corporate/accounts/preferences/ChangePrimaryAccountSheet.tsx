import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface ChangePrimaryAccountSheetProps {
  isOpen: boolean;
  newAccountLabel: string;
  currentPrimaryLabel: string;
  onCancel: () => void;
  onContinue: () => void;
}

export const ChangePrimaryAccountSheet: React.FC<ChangePrimaryAccountSheetProps> = ({
  isOpen,
  newAccountLabel,
  currentPrimaryLabel,
  onCancel,
  onContinue,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onCancel} title="Change Primary Account?">
    <div className="space-y-4 pb-2">
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{currentPrimaryLabel}</span>{' '}
        is currently your primary account. Setting{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{newAccountLabel}</span> as
        primary will replace it.
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
          onClick={onContinue}
          className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
        >
          Continue
        </button>
      </div>
    </div>
  </BottomSheet>
);
