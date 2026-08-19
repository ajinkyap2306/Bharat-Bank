import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface SkipBiometricSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onEnable: () => void;
}

export const SkipBiometricSheet: React.FC<SkipBiometricSheetProps> = ({
  isOpen,
  onClose,
  onSkip,
  onEnable,
}) => (
  <BottomSheet
    isOpen={isOpen}
    onClose={onClose}
    title="Skip biometric setup?"
    subtitle="You can enable biometric login later from Security Settings."
  >
    <div className="space-y-2 pb-2">
      <button
        type="button"
        onClick={onSkip}
        className="w-full py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 text-sm font-semibold text-[#667085] dark:text-slate-300 min-h-12 active:scale-[0.99] transition-transform"
      >
        Skip for Now
      </button>
      <button
        type="button"
        onClick={onEnable}
        className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12 active:scale-[0.99] transition-transform"
      >
        Enable Biometrics
      </button>
    </div>
  </BottomSheet>
);
