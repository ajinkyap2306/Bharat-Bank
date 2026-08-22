import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface LimitInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentsLimitInfoSheet: React.FC<LimitInfoSheetProps> = ({ isOpen, onClose }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="About Account Limits">
    <div className="space-y-4 pb-2">
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        Limits are configured according to your corporate banking profile and approval rules.
      </p>
      <ul className="space-y-2 text-[13px] text-slate-900 dark:text-white">
        <li>• Limits depend on corporate profile</li>
        <li>• Different payment types may have different limits</li>
        <li>• Approval thresholds may apply</li>
        <li>• Some limits reset daily or monthly</li>
        <li>• Additional approvals may be required</li>
        <li>• Contact your administrator or RM for changes</li>
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
      >
        Got it
      </button>
    </div>
  </BottomSheet>
);
