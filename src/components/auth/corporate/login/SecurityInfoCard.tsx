import React from 'react';
import { Shield } from 'lucide-react';

export const SecurityInfoCard: React.FC = () => (
  <div className="mx-4 mt-5 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-[#E4E7EC]/80 dark:border-slate-800 flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
      <Shield className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
    </div>
    <div className="min-w-0 pt-0.5">
      <p className="text-[13px] font-semibold text-[#111827] dark:text-white">
        Secure Corporate Access
      </p>
      <p className="text-[12px] text-[#667085] dark:text-slate-400 mt-0.5 leading-relaxed">
        Your connection is protected using secure banking authentication.
      </p>
    </div>
  </div>
);
