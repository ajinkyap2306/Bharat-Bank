import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { CheckCircle2 } from 'lucide-react';

interface PrimarySuccessSheetProps {
  isOpen: boolean;
  accountLabel: string;
  onClose: () => void;
}

export const PrimarySuccessSheet: React.FC<PrimarySuccessSheetProps> = ({
  isOpen,
  accountLabel,
  onClose,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Account Set as Primary">
    <div className="flex flex-col items-center text-center pb-4 space-y-3">
      <div className="w-14 h-14 rounded-full bg-emerald-600/10 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" aria-hidden />
      </div>
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{accountLabel}</span> is now
        your primary account.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
      >
        Done
      </button>
    </div>
  </BottomSheet>
);
