import React from 'react';
import { Fingerprint } from 'lucide-react';

interface BiometricCardProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const BiometricCard: React.FC<BiometricCardProps> = ({
  enabled,
  onToggle,
  disabled,
}) => (
  <div className="mx-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
          <Fingerprint className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
            Enable biometric login
          </p>
          <p className="text-[13px] text-[#667085] dark:text-slate-400 mt-0.5 leading-relaxed">
            Use fingerprint or face authentication for faster sign-in.
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Enable biometric login"
        disabled={disabled}
        onClick={() => onToggle(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]/30 ${
          enabled ? 'bg-[#0B5CAB]' : 'bg-[#E4E7EC] dark:bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 motion-reduce:transition-none ${
            enabled ? 'left-5.5' : 'left-0.5'
          }`}
          aria-hidden
        />
      </button>
    </div>
  </div>
);
