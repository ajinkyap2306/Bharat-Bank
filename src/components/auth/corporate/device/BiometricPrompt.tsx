import React from 'react';

interface BiometricPromptProps {
  visible: boolean;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      className="mx-4 mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#E4E7EC] dark:border-slate-700"
      role="region"
      aria-label="Biometric verification prompt"
    >
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white">
        Verify your biometric
      </p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
        Use your device biometric to continue.
      </p>
    </div>
  );
};
