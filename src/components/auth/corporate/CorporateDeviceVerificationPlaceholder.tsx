import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

/** Placeholder route — full device verification flow will be implemented in a later step. */
export const CorporateDeviceVerificationPlaceholder: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex flex-col safe-top safe-bottom max-w-107.5 mx-auto w-full">
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm font-medium text-congress-blue-700 min-h-11"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-congress-blue-700/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-congress-blue-700" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Device Verification
        </h1>
        <p className="text-[14px] text-slate-500 mt-2 max-w-xs leading-relaxed">
          Device verification for corporate accounts will be available in a future step.
        </p>
      </div>
    </div>
  );
};
