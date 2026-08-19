import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

/** Placeholder route — full device verification flow will be implemented in a later step. */
export const CorporateDeviceVerificationPlaceholder: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#F7F9FC] dark:bg-slate-950 flex flex-col font-['Inter',sans-serif] safe-top safe-bottom max-w-107.5 mx-auto w-full">
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={() => navigate('/corporate/otp')}
          className="flex items-center gap-1 text-sm font-medium text-[#0B5CAB] min-h-11"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to OTP
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-[#0B5CAB]" />
        </div>
        <h1 className="text-xl font-semibold text-[#111827] dark:text-white">
          Device Verification
        </h1>
        <p className="text-[14px] text-[#667085] mt-2 max-w-xs leading-relaxed">
          Device verification for corporate accounts will be available in a future step.
        </p>
      </div>
    </div>
  );
};
