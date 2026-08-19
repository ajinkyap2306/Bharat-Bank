import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface LimitInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const INFO_POINTS = [
  'Limits depend on your corporate banking profile and entitlements.',
  'Different payment types may have different daily and single transaction limits.',
  'Approval thresholds may apply for transactions above configured amounts.',
  'Some limits reset daily; others reset monthly.',
  'Additional corporate approvals may be required for high-value transactions.',
  'Contact your bank administrator or relationship manager to request limit changes.',
];

export const LimitInfoSheet: React.FC<LimitInfoSheetProps> = ({ isOpen, onClose }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="About Account Limits">
    <div className="space-y-4 pb-2">
      <p className="text-[13px] text-[#667085]">
        Limits are configured according to your corporate banking profile and approval rules.
      </p>
      <ul className="space-y-2.5">
        {INFO_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2 text-[13px] text-[#111827] dark:text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5CAB] mt-1.5 shrink-0" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
      >
        Got it
      </button>
    </div>
  </BottomSheet>
);
